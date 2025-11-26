'use server';

import prisma from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/auth';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { initiateStkPush as mpesaStkPush } from '@/app/lib/mpesa';

const stkPushSchema = z.object({
  phoneNumber: z.string().regex(/^\+?[0-9]{10,}$/, 'Invalid phone number'),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().optional(),
});

export async function initiateStkPush(data: z.infer<typeof stkPushSchema>) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth')?.value;

    if (!token) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return {
        success: false,
        error: 'Invalid or expired token',
      };
    }

    const validation = stkPushSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0].message,
      };
    }

    const { phoneNumber, amount, description } = validation.data;

    // Normalize phone number to M-Pesa MSISDN format: 2547XXXXXXXX (no plus)
    // Accepts: +2547..., 07..., 7..., 2547...
    const normalizeToMsisdn = (input: string) => {
      let s = input.trim();
      if (s.startsWith('+')) s = s.slice(1);
      if (s.startsWith('0')) s = '254' + s.slice(1);
      if (/^7[0-9]{8,}$/.test(s)) s = '254' + s; // starts with 7 (no leading zero)
      return s;
    };

    const msisdn = normalizeToMsisdn(phoneNumber);

    // For display/store keep original E.164-like format with plus
    const displayPhone = msisdn.startsWith('254') ? '+' + msisdn : phoneNumber;

    try {
      // Call real M-Pesa API
      const mpesaResponse = await mpesaStkPush({
        phoneNumber: msisdn,
        amount: Math.floor(amount), // M-Pesa requires whole numbers
        accountReference: `TXN-${Date.now()}`,
        transactionDescription: description || 'Payment for services',
      });

      // Create transaction record with M-Pesa response
      const transaction = await prisma.transaction.create({
        data: {
          userId: decoded.userId,
          amount,
          type: 'credit',
          status: mpesaResponse.ResponseCode === '0' ? 'pending' : 'failed',
          description: description || `M-Pesa payment from ${phoneNumber}`,
          // save customer-facing phone
          mpesaRef: mpesaResponse.MerchantRequestID,
          mpesaCheckoutId: mpesaResponse.CheckoutRequestID,
          // store display phone for records
          // Note: the `description` already includes original phone if provided
        },
      });

      if (mpesaResponse.ResponseCode !== '0') {
        return {
          success: false,
          error: mpesaResponse.ResponseDescription || 'M-Pesa request failed',
          transaction: {
            id: transaction.id,
            status: transaction.status,
          },
        };
      }

      return {
        success: true,
        message: mpesaResponse.CustomerMessage || 'STK push sent to your phone',
        transaction: {
          id: transaction.id,
          checkoutId: mpesaResponse.CheckoutRequestID,
          amount,
          status: transaction.status,
          customerMessage: mpesaResponse.CustomerMessage,
        },
      };
    } catch (mpesaError) {
      console.error('M-Pesa API error:', mpesaError);

      // Create failed transaction record
      const transaction = await prisma.transaction.create({
        data: {
          userId: decoded.userId,
          amount,
          type: 'credit',
          status: 'failed',
          description: description || `Failed M-Pesa payment from ${phoneNumber}`,
        },
      });

      return {
        success: false,
        error: mpesaError instanceof Error 
          ? mpesaError.message 
          : 'Failed to initiate M-Pesa payment. Please check your credentials.',
        transaction: {
          id: transaction.id,
          status: transaction.status,
        },
      };
    }
  } catch (error) {
    console.error('STK push error:', error);
    return {
      success: false,
      error: 'Failed to initiate payment',
    };
  }
}

export async function updateTransactionStatus(
  transactionId: string,
  status: 'pending' | 'completed' | 'failed',
  mpesaRef?: string
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth')?.value;

    if (!token) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return {
        success: false,
        error: 'Invalid or expired token',
      };
    }

    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status,
        mpesaRef: mpesaRef || undefined,
      },
    });

    return {
      success: true,
      transaction,
    };
  } catch (error) {
    console.error('Update transaction error:', error);
    return {
      success: false,
      error: 'Failed to update transaction',
    };
  }
}

export async function getTransactionStatus(transactionId: string) {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      select: {
        id: true,
        amount: true,
        status: true,
        mpesaRef: true,
        createdAt: true,
      },
    });

    if (!transaction) {
      return {
        success: false,
        error: 'Transaction not found',
      };
    }

    return {
      success: true,
      transaction,
    };
  } catch (error) {
    console.error('Get transaction status error:', error);
    return {
      success: false,
      error: 'Failed to fetch transaction status',
    };
  }
}
