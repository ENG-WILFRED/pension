'use server';

import prisma from '@/app/lib/prisma';
import { verifyToken, getTokenFromCookie } from '@/app/lib/auth';
import { cookies } from 'next/headers';

export async function getCurrentUser() {
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

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        createdAt: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    return {
      success: true,
      user,
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return {
      success: false,
      error: 'Failed to fetch user',
    };
  }
}

export async function getUserTransactions() {
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

    const transactions = await prisma.transaction.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        amount: true,
        type: true,
        status: true,
        description: true,
        mpesaRef: true,
        createdAt: true,
      },
    });

    // Calculate balances
    const credits = transactions
      .filter((t: any) => t.type === 'credit' && t.status === 'completed')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const debits = transactions
      .filter((t: any) => t.type === 'debit' && t.status === 'completed')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const balance = credits - debits;

    return {
      success: true,
      transactions,
      balance,
      credits,
      debits,
    };
  } catch (error) {
    console.error('Get user transactions error:', error);
    return {
      success: false,
      error: 'Failed to fetch transactions',
    };
  }
}

export async function getDashboardData() {
  try {
    const userResult = await getCurrentUser();
    if (!userResult.success) {
      return userResult;
    }

    const transactionsResult = await getUserTransactions();
    if (!transactionsResult.success) {
      return transactionsResult;
    }

    return {
      success: true,
      user: userResult.user,
      transactions: transactionsResult.transactions,
      balance: transactionsResult.balance,
      credits: transactionsResult.credits,
      debits: transactionsResult.debits,
    };
  } catch (error) {
    console.error('Get dashboard data error:', error);
    return {
      success: false,
      error: 'Failed to fetch dashboard data',
    };
  }
}
