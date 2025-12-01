'use server';

import { hashPassword, comparePasswords, generateToken } from '@/app/lib/auth';
import prisma from '@/app/lib/prisma';
import { initiateStkPush, normalizeMsisdn } from '@/app/lib/mpesa';
import { z } from 'zod';
import { cookies } from 'next/headers';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function registerUser(data: z.infer<typeof registerSchema>) {
  try {
    const validation = registerSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0].message,
      };
    }

    const { email, password, firstName, lastName, phone } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: 'Email already registered',
      };
    }

    if (!phone) {
      return {
        success: false,
        error: 'Phone number is required for registration',
      };
    }

    // Normalize phone number to MSISDN (2547XXXXXXXX)
    let normalizedPhone: string;
    try {
      normalizedPhone = normalizeMsisdn(phone);
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Invalid phone number',
      };
    }

    // Create a pending registration record (not yet a user)
    const pendingReg = await prisma.transaction.create({
      data: {
        // don't set `userId` yet; leaving it undefined avoids foreign key constraint errors
        amount: 1, // 1 KES registration payment
        status: 'pending',
        type: 'registration',
        metadata: {
          email,
          hashedPassword: await hashPassword(password),
          firstName,
          lastName,
          phone: normalizedPhone,
        },
      },
    });

    // Initiate STK push for 1 KES
    try {
      const stkPushResult = await initiateStkPush({
        phoneNumber: normalizedPhone,
        amount: 1, // 1 KES default registration payment
        accountReference: `REG-${pendingReg.id}`, // Use transaction ID as reference
        transactionDescription: 'Registration payment',
      });

      // Update transaction with checkout ID
      await prisma.transaction.update({
        where: { id: pendingReg.id },
        data: {
          checkoutRequestId: stkPushResult?.CheckoutRequestID,
        },
      });

      return {
        success: true,
        stkPushInitiated: true,
        checkoutRequestId: stkPushResult?.CheckoutRequestID,
        transactionId: pendingReg.id,
        message: 'STK push sent. Please complete payment on your phone.',
      };
    } catch (stkError) {
      console.error('STK push initiation error during registration:', stkError);
      // Clean up pending registration if STK push fails
      await prisma.transaction.delete({
        where: { id: pendingReg.id },
      });
      return {
        success: false,
        error: 'Failed to initiate payment. Please try again.',
      };
    }
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: 'Internal server error',
    };
  }
}

/**
 * Complete registration after payment confirmation.
 * Called from the M-Pesa callback after successful payment.
 */
export async function completeRegistrationAfterPayment(transactionId: string) {
  try {
    // Fetch the pending registration transaction
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction || transaction.type !== 'registration' || transaction.status !== 'completed') {
      return {
        success: false,
        error: 'Invalid or incomplete registration transaction',
      };
    }

    const metadata = transaction.metadata as any;
    const { email, hashedPassword, firstName, lastName, phone } = metadata;

    // Create the actual user now
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
      },
    });

    // Update transaction with user ID
    await prisma.transaction.update({
      where: { id: transactionId },
      data: { userId: user.id },
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    // Set auth cookie
    const cookieStore = await cookies();
    cookieStore.set('auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  } catch (error) {
    console.error('Complete registration error:', error);
    return {
      success: false,
      error: 'Failed to complete registration',
    };
  }
}

export async function loginUser(data: z.infer<typeof loginSchema>) {
  try {
    const validation = loginSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0].message,
      };
    }

    const { email, password } = validation.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    // Verify password
    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    // Set auth cookie
    const cookieStore = await cookies();
    cookieStore.set('auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Internal server error',
    };
  }
}

export async function logoutUser() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('auth');
    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: 'Failed to logout',
    };
  }
}
