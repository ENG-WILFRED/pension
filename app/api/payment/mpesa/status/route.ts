import { NextRequest, NextResponse } from 'next/server';
import { queryStkPushStatus } from '@/app/lib/mpesa';
import prisma from '@/app/lib/prisma';
import { verifyToken } from '@/app/lib/auth';

/**
 * Query M-Pesa payment status
 * GET /api/payment/mpesa/status?transactionId=<id>
 */
export async function GET(request: NextRequest) {
  try {
    // Get transaction ID from query params
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transactionId');

    if (!transactionId) {
      return NextResponse.json(
        { error: 'transactionId is required' },
        { status: 400 }
      );
    }

    // Get transaction from database
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      select: {
        id: true,
        userId: true,
        type: true,
        amount: true,
        status: true,
        checkoutRequestId: true,
        mpesaRef: true,
        description: true,
        createdAt: true,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Allow unauthenticated access for pending registration transactions
    // Require authentication for other transactions
    if (transaction.type !== 'registration') {
      const authHeader = request.headers.get('authorization');
      const token = authHeader?.replace('Bearer ', '');

      if (!token) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        );
      }

      // Verify the transaction belongs to the user
      if (transaction.userId !== decoded.userId) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }
    }

    // If status is already completed or failed, return cached status
    if (transaction.status === 'completed' || transaction.status === 'failed') {
      return NextResponse.json({
        success: true,
        transaction,
      });
    }

    // Query M-Pesa for pending transactions
    if (transaction.checkoutRequestId) {
      try {
        const mpesaStatus = await queryStkPushStatus(transaction.checkoutRequestId) as {
          ResultCode?: number;
          CallbackMetadata?: {
            Item?: Array<{ Name: string; Value?: string | number }>;
          };
        };

        console.log('M-Pesa status response:', mpesaStatus);

        // If M-Pesa has a result, update our transaction
        if (mpesaStatus.ResultCode === 0) {
          // Payment went through
          let mpesaRef = '';
          if (mpesaStatus.CallbackMetadata?.Item) {
            mpesaStatus.CallbackMetadata.Item.forEach(
              (item: { Name: string; Value?: string | number }) => {
                if (item.Name === 'MpesaReceiptNumber') {
                  mpesaRef = String(item.Value);
                }
              }
            );
          }

          await prisma.transaction.update({
            where: { id: transactionId },
            data: {
              status: 'completed',
              mpesaRef,
            },
          });

          return NextResponse.json({
            success: true,
            transaction: {
              ...transaction,
              status: 'completed',
              mpesaRef,
            },
          });
        }
      } catch (error) {
        console.error('Error querying M-Pesa status:', error);
        // Continue to return cached status if query fails
      }
    }

    return NextResponse.json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
}
