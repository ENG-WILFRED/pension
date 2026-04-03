//home/hp/JERE/autonest frontend/AutoNest/app/lib/payment-callback-handler.ts

/**
 * Payment Callback Handler
 * Processes M-Pesa and payment system callbacks
 * Handles verification, validation, and state updates
 */

import { stkPushProcessor } from './stk-push-processor';

export interface PaymentCallback {
  transactionId: string;
  checkoutRequestId?: string;
  status: 'completed' | 'failed' | 'pending' | 'timeout';
  amount?: number;
  phone?: string;
  accountId?: string;
  timestamp?: string;
  errorCode?: string;
  errorMessage?: string;
  signature?: string; // Optional signature for verification
}

class PaymentCallbackHandler {
  /**
   * Process incoming payment callback
   * Can be called from webhook or polling
   */
  async processCallback(callbackData: PaymentCallback): Promise<{
    success: boolean;
    message: string;
    processed: boolean;
  }> {
    try {
      // Validate callback data
      const validation = this.validateCallback(callbackData);
      if (!validation.valid) {
        return {
          success: false,
          message: validation.error || 'Invalid callback',
          processed: false,
        };
      }

      // Verify signature if provided
      if (callbackData.signature) {
        const signatureValid = this.verifySignature(callbackData);
        if (!signatureValid) {
          console.warn('Invalid callback signature for transaction:', callbackData.transactionId);
          return {
            success: false,
            message: 'Invalid callback signature',
            processed: false,
          };
        }
      }

      // Process with STK processor
      const result = await stkPushProcessor.handleStkCallback(callbackData);

      // Update transaction status in local storage
      if (callbackData.transactionId) {
        this.updateTransactionStatus(callbackData.transactionId, callbackData.status);
      }

      // Trigger any pending callbacks or listeners
      this.notifyListeners('payment_status_update', {
        transactionId: callbackData.transactionId,
        status: callbackData.status,
        amount: callbackData.amount,
      });

      return {
        success: result.success,
        message: result.message,
        processed: true,
      };
    } catch (error: any) {
      console.error('Payment callback processing error:', error);
      return {
        success: false,
        message: error?.message || 'Callback processing failed',
        processed: false,
      };
    }
  }

  /**
   * Validate callback structure and required fields
   */
  private validateCallback(data: PaymentCallback): {
    valid: boolean;
    error?: string;
  } {
    if (!data.transactionId) {
      return { valid: false, error: 'Missing transactionId' };
    }

    if (!data.status) {
      return { valid: false, error: 'Missing status' };
    }

    const validStatuses = ['completed', 'failed', 'pending', 'timeout'];
    if (!validStatuses.includes(data.status)) {
      return { valid: false, error: `Invalid status: ${data.status}` };
    }

    return { valid: true };
  }

  /**
   * Verify callback signature (implement as needed)
   * This is a placeholder - implement based on your backend's signature algorithm
   */
  private verifySignature(data: PaymentCallback): boolean {
    // TODO: Implement signature verification based on backend requirements
    // Example: using HMAC-SHA256 with shared secret
    // const { transactionId, status, amount } = data;
    // const secret = process.env.NEXT_PUBLIC_PAYMENT_SECRET || 'secret';
    // const expectedSignature = computeSignature(data, secret);
    // return data.signature === expectedSignature;

    // For now, accept all signatures (remove in production)
    return true;
  }

  /**
   * Update transaction status in local storage
   */
  private updateTransactionStatus(transactionId: string, status: string): void {
    if (typeof window === 'undefined') return;

    const transactions = JSON.parse(
      localStorage.getItem('stk_transactions') || '{}'
    );

    if (transactions[transactionId]) {
      transactions[transactionId].status = status;
      transactions[transactionId].updatedAt = new Date().toISOString();

      localStorage.setItem('stk_transactions', JSON.stringify(transactions));
    }
  }

  /**
   * Get transaction status from local storage
   */
  getTransactionStatus(transactionId: string): {
    status?: string;
    amount?: number;
    phone?: string;
    timestamp?: string;
  } {
    if (typeof window === 'undefined') return {};

    const transactions = JSON.parse(
      localStorage.getItem('stk_transactions') || '{}'
    );

    return transactions[transactionId] || {};
  }

  /**
   * Check if transaction is completed
   */
  isTransactionCompleted(transactionId: string): boolean {
    const transaction = this.getTransactionStatus(transactionId);
    return transaction.status === 'completed';
  }

  /**
   * Check if transaction failed
   */
  isTransactionFailed(transactionId: string): boolean {
    const transaction = this.getTransactionStatus(transactionId);
    return transaction.status === 'failed';
  }

  /**
   * Get all transaction status for user
   */
  getAllTransactionStatuses(): Record<string, any> {
    if (typeof window === 'undefined') return {};

    return JSON.parse(localStorage.getItem('stk_transactions') || '{}');
  }

  /**
   * Listener pattern for real-time updates
   */
  private listeners: Map<string, Set<Function>> = new Map();

  /**
   * Subscribe to payment events
   */
  onPaymentStatusUpdate(callback: (data: any) => void): () => void {
    if (!this.listeners.has('payment_status_update')) {
      this.listeners.set('payment_status_update', new Set());
    }

    this.listeners.get('payment_status_update')?.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get('payment_status_update')?.delete(callback);
    };
  }

  /**
   * Subscribe to payment completion
   */
  onPaymentCompleted(callback: (transactionId: string, amount: number) => void): () => void {
    return this.onPaymentStatusUpdate((data) => {
      if (data.status === 'completed') {
        callback(data.transactionId, data.amount);
      }
    });
  }

  /**
   * Subscribe to payment failure
   */
  onPaymentFailed(callback: (transactionId: string, reason?: string) => void): () => void {
    return this.onPaymentStatusUpdate((data) => {
      if (data.status === 'failed') {
        callback(data.transactionId, data.reason);
      }
    });
  }

  /**
   * Notify all listeners of an event
   */
  private notifyListeners(event: string, data: any): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Clear all listeners
   */
  clearListeners(): void {
    this.listeners.clear();
  }

  /**
   * Format callback data for logging/auditing
   */
  formatCallbackForLogging(data: PaymentCallback): string {
    return JSON.stringify({
      transactionId: data.transactionId,
      status: data.status,
      amount: data.amount,
      phone: data.phone ? `${data.phone.substring(0, 5)}...` : undefined,
      timestamp: data.timestamp,
      errorCode: data.errorCode,
    });
  }
}

// Export singleton instance
export const paymentCallbackHandler = new PaymentCallbackHandler();

export default PaymentCallbackHandler;
