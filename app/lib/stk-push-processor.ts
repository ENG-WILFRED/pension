/**
 * STK Push Processor - Handles M-Pesa STK Push Transactions
 * Manages:
 * - STK Push initiation via deposit API
 * - Payment status polling
 * - Transaction tracking
 * - Callback handling
 */

import { apiCall, accountsApi, paymentApi } from './api-client';

export interface StkPushRequest {
  amount: number;
  phoneNumber: string;
  description?: string;
  accountId?: string;
}

export interface StkPushResponse {
  success: boolean;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  checkoutRequestId?: string;
  message?: string;
  error?: string;
}

export interface PaymentStatus {
  transactionId: string;
  status: 'pending' | 'completed' | 'failed' | 'timeout';
  amount?: number;
  phone?: string;
  timestamp?: string;
  errorMessage?: string;
}

class StkPushProcessor {
  private maxRetries = 12; 
  private retryInterval = 10000; 

  /**
   * Initiate STK push for M-Pesa payment
   * Validates phone number format and amount before initiating
   */
  async initiateStkPush(request: StkPushRequest): Promise<StkPushResponse> {
    try {
      // Validate inputs
      if (!request.phoneNumber.match(/^\+254\d{9}$/)) {
        return {
          success: false,
          status: 'failed',
          error: 'Invalid phone number format. Use +254XXXXXXXXX',
        };
      }

      if (request.amount < 1) {
        return {
          success: false,
          status: 'failed',
          error: 'Amount must be at least KES 1',
        };
      }

      // Call payment endpoint which triggers STK push
      const response = await paymentApi.stkPushByPhone({
        amount: request.amount,
        phone: request.phoneNumber,
        description: request.description || 'M-Pesa deposit',
      });

      console.log('STK Push Response:', response);

      // Check for success indicators - the endpoint might return 500 but still process the payment
      const hasCheckoutId = !!(
        response.CheckoutRequestID ||
        response.checkoutRequestId ||
        response.data?.CheckoutRequestID ||
        response.data?.checkoutRequestId
      );

      const hasTransactionId = !!(
        response.transactionId ||
        response.data?.transaction?.id ||
        response.data?.transactionId ||
        response.data?.transaction?.transactionId ||
        response.data?.transaction?._id
      );

      // Treat as success if we have either a checkout ID or explicit success flag
      // The backend sometimes returns 500 but still sends the STK to the phone
      const isSuccess = response.success === true || hasCheckoutId;

      if (isSuccess || hasCheckoutId || hasTransactionId) {
        const transactionId =
          response.transactionId ||
          response.data?.transaction?.id ||
          response.data?.transactionId ||
          response.data?.transaction?.transactionId ||
          response.data?.transaction?._id ||
          response.data?.CheckoutRequestID ||
          response.CheckoutRequestID ||
          `stk-${Date.now()}`;

        const checkoutRequestId =
          response.checkoutRequestId ||
          response.data?.CheckoutRequestID ||
          response.data?.checkoutRequestId ||
          response.CheckoutRequestID;

        // Store transaction details for polling
        this.storeTransactionData({
          transactionId,
          amount: request.amount,
          phone: request.phoneNumber,
          accountId: request.accountId,
          status: 'pending',
          checkoutRequestId,
          timestamp: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        return {
          success: true,
          status: 'pending',
          transactionId,
          checkoutRequestId,
          message: 'STK Push initiated. Check your phone for the prompt.',
        };
      } else {
        return {
          success: false,
          status: 'failed',
          error: response.error || response.message || 'Failed to initiate STK push',
        };
      }
    } catch (error: any) {
      console.error('STK Push error:', error);
      return {
        success: false,
        status: 'failed',
        error: error.message || 'Unexpected error during STK push initiation',
      };
    }
  }

  /**
   * Poll payment status until completion or timeout
   * Used after STK push initiation to verify payment
   */
  async pollPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    let retries = 0;

    while (retries < this.maxRetries) {
      try {
        const response = await paymentApi.getStatus(transactionId);

        if (response.success) {
          const transaction = response.data?.transaction || response.transaction || response.data;
          const status = transaction?.status || response.data?.status || response.status || 'pending';
          const amount = transaction?.amount || response.data?.amount;
          const phone = transaction?.phone || response.data?.phone;

          if (status !== 'pending') {
            // Payment completed or failed
            // Persist status update
            if (transactionId) {
              this.updateTransactionData(transactionId, {
                ...this.getTransactionData(transactionId),
                status,
                amount,
                phone,
                updatedAt: new Date().toISOString(),
              });
            }

            return {
              transactionId,
              status: status as any,
              amount,
              phone,
              timestamp: new Date().toISOString(),
              errorMessage: status === 'failed' ? response.error : undefined,
            };
          }
        }

        // Still pending, wait and retry
        retries++;
        if (retries < this.maxRetries) {
          await this.delay(this.retryInterval);
        }
      } catch (error: any) {
        console.error(`Payment status poll attempt ${retries + 1} failed:`, error);

        if (retries >= this.maxRetries - 1) {
          return {
            transactionId,
            status: 'timeout',
            timestamp: new Date().toISOString(),
            errorMessage: 'Payment status check timed out. Please verify in your transaction history.',
          };
        }

        retries++;
        await this.delay(this.retryInterval);
      }
    }

    return {
      transactionId,
      status: 'timeout',
      timestamp: new Date().toISOString(),
      errorMessage: 'Payment confirmation timed out. Please check your transaction history.',
    };
  }

  /**
   * Complete STK push flow: initiate and poll status
   * Useful for sequential execution in UI flows
   */
  async completeStkPushFlow(request: StkPushRequest, timeoutMs: number = 120000): Promise<{
    initiation: StkPushResponse;
    status?: PaymentStatus;
  }> {
    const initiation = await this.initiateStkPush(request);

    if (!initiation.success || !initiation.transactionId) {
      return { initiation };
    }

    // Poll status with timeout
    const statusPromise = this.pollPaymentStatus(initiation.transactionId);
    const timeoutPromise = new Promise<PaymentStatus>((resolve) =>
      setTimeout(
        () =>
          resolve({
            transactionId: initiation.transactionId!,
            status: 'timeout',
            errorMessage: 'Payment verification timed out',
            timestamp: new Date().toISOString(),
          }),
        timeoutMs
      )
    );

    const status = await Promise.race([statusPromise, timeoutPromise]);

    return { initiation, status };
  }

  /**
   * Handle STK push callback from backend
   * Verify and process payment confirmation
   */
  async handleStkCallback(callbackData: any): Promise<{
    success: boolean;
    message: string;
    transactionId?: string;
  }> {
    try {
      // Validate callback structure
      if (!callbackData.transactionId) {
        return {
          success: false,
          message: 'Invalid callback: missing transactionId',
        };
      }

      // Verify signature if provided (implement based on backend requirements)
      // const isValid = this.verifyCallbackSignature(callbackData);
      // if (!isValid) return { success: false, message: 'Invalid callback signature' };

      // Update transaction status
      const transactionData = this.getTransactionData(callbackData.transactionId);

      if (transactionData) {
        // Update stored transaction with final status
        this.updateTransactionData(callbackData.transactionId, {
          ...transactionData,
          status: callbackData.status,
          updatedAt: new Date().toISOString(),
        });
      }

      return {
        success: true,
        message: `Payment ${callbackData.status}`,
        transactionId: callbackData.transactionId,
      };
    } catch (error: any) {
      console.error('STK callback handling error:', error);
      return {
        success: false,
        message: error?.message || 'Callback processing failed',
      };
    }
  }

  /**
   * Verify M-Pesa SMS before processing
   * Validates amount and sender for deposit via SMS
   */
  verifySmsDeposit(smsData: {
    sender: string;
    amount: string;
    phoneNumber: string;
  }): { valid: boolean; error?: string } {
    // Validate sender is M-Pesa
    if (!smsData.sender.match(/MPESA|M-PESA/i)) {
      return { valid: false, error: 'SMS not from M-Pesa' };
    }

    // Validate amount format
    const amount = parseFloat(smsData.amount);
    if (isNaN(amount) || amount < 1) {
      return { valid: false, error: 'Invalid amount' };
    }

    // Validate phone number
    if (!smsData.phoneNumber.match(/^\+?254\d{9}/)) {
      return { valid: false, error: 'Invalid phone number' };
    }

    return { valid: true };
  }

  /**
   * Store transaction data in localStorage for tracking
   */
  private storeTransactionData(data: any): void {
    if (typeof window === 'undefined') return;

    const existingTransactions = JSON.parse(
      localStorage.getItem('stk_transactions') || '{}'
    );

    localStorage.setItem(
      'stk_transactions',
      JSON.stringify({
        ...existingTransactions,
        [data.transactionId]: data,
      })
    );
  }

  /**
   * Retrieve stored transaction data
   */
  private getTransactionData(transactionId: string): any {
    if (typeof window === 'undefined') return null;

    const transactions = JSON.parse(
      localStorage.getItem('stk_transactions') || '{}'
    );
    return transactions[transactionId] || null;
  }

  /**
   * Update stored transaction data
   */
  private updateTransactionData(transactionId: string, data: any): void {
    if (typeof window === 'undefined') return;

    const transactions = JSON.parse(
      localStorage.getItem('stk_transactions') || '{}'
    );

    localStorage.setItem(
      'stk_transactions',
      JSON.stringify({
        ...transactions,
        [transactionId]: data,
      })
    );
  }

  /**
   * Get all pending transactions
   */
  getPendingTransactions(): any[] {
    if (typeof window === 'undefined') return [];

    const transactions = JSON.parse(
      localStorage.getItem('stk_transactions') || '{}'
    );

    return Object.values(transactions).filter(
      (tx: any) => tx.status === 'pending' || !tx.status
    );
  }

  /**
   * Clear transaction data after completion
   */
  clearTransactionData(transactionId: string): void {
    if (typeof window === 'undefined') return;

    const transactions = JSON.parse(
      localStorage.getItem('stk_transactions') || '{}'
    );

    delete transactions[transactionId];

    localStorage.setItem('stk_transactions', JSON.stringify(transactions));
  }

  /**
   * Helper: delay utility for polling
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const stkPushProcessor = new StkPushProcessor();

// Export class for testing
export default StkPushProcessor;
