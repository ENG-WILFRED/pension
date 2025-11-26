import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

/**
 * M-Pesa Callback Handler
 * This endpoint receives payment confirmations from M-Pesa
 * Safaricom sends callbacks to the URL configured in initiateStkPush
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('M-Pesa Callback received:', body);

    // Parse M-Pesa callback body
    const {
      Body: { stkCallback },
    } = body;

    if (!stkCallback) {
      return NextResponse.json(
        { error: 'Invalid callback format' },
        { status: 400 }
      );
    }

    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = stkCallback;

    // Find transaction by checkout request ID
    const transaction = await prisma.transaction.findFirst({
      where: {
        mpesaCheckoutId: CheckoutRequestID,
      },
    });

    if (!transaction) {
      console.warn(`Transaction not found for CheckoutRequestID: ${CheckoutRequestID}`);
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Update transaction based on M-Pesa result
    if (ResultCode === 0) {
      // Payment successful - extract M-Pesa reference from metadata
      let mpesaRef = '';
      let amountPaid = 0;

      if (CallbackMetadata && CallbackMetadata.Item) {
        CallbackMetadata.Item.forEach(
          (item: { Name: string; Value?: string | number }) => {
            if (item.Name === 'MpesaReceiptNumber') {
              mpesaRef = String(item.Value);
            }
            if (item.Name === 'Amount') {
              amountPaid = Number(item.Value);
            }
          }
        );
      }

      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'completed',
          mpesaRef,
          description: `Payment completed - M-Pesa Ref: ${mpesaRef}`,
        },
      });

      console.log(`✅ Payment successful for transaction ${transaction.id}`);
    } else {
      // Payment failed or cancelled
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: 'failed',
          description: `Payment failed - ${ResultDesc || 'Unknown error'}`,
        },
      });

      console.log(
        `❌ Payment failed for transaction ${transaction.id}: ${ResultDesc}`
      );
    }

    // Respond with success - M-Pesa requires 200 OK response
    return NextResponse.json(
      {
        ResultCode: 0,
        ResultDesc: 'Callback received successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.json(
      { error: 'Failed to process callback' },
      { status: 500 }
    );
  }
}
