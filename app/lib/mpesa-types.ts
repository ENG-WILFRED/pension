/**
 * M-Pesa & STK Push Type Definitions
 * Shared types for frontend and backend integration
 */

// ============================================================================
// SMS TYPES
// ============================================================================

export interface MpesaSmsData {
  sender: string; // 'MPESA' or 'M-PESA'
  amount: string; // e.g., "500.00" or "1,234.56"
  phoneNumber: string; // e.g., "+254712345678" or "254712345678"
  transactionRef?: string;
  timestamp?: string;
  rawBody: string;
}

export interface ParsedSmsData {
  valid: boolean;
  amount?: number;
  phone?: string;
  error?: string;
}

// ============================================================================
// STK PUSH TYPES
// ============================================================================

export interface StkPushInitRequest {
  accountId: string;
  amount: number;
  phoneNumber: string;
  description?: string;
}

export interface StkPushInitResponse {
  success: boolean;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  checkoutRequestId?: string;
  statusCheckUrl?: string;
  message?: string;
  error?: string;
}

export interface StkPushPaymentStatus {
  transactionId: string;
  checkoutRequestId?: string;
  status: 'pending' | 'completed' | 'failed' | 'timeout';
  amount?: number;
  phone?: string;
  accountId?: string;
  timestamp?: string;
  errorMessage?: string;
  errorCode?: string;
}

// ============================================================================
// DEPOSIT TYPES
// ============================================================================

export interface DepositRequest {
  amount: number;
  phone: string;
  description?: string;
}

export interface DepositResponse {
  success: boolean;
  status: 'initiated' | 'completed' | 'failed';
  transactionId?: string;
  checkoutRequestId?: string;
  message?: string;
  error?: string;
}

// ============================================================================
// PAYMENT CALLBACK TYPES
// ============================================================================

export interface PaymentCallback {
  transactionId: string;
  checkoutRequestId?: string;
  status: 'completed' | 'failed' | 'pending' | 'timeout';
  amount?: number;
  phone?: string;
  accountId?: string;
  mpesaReceiptNumber?: string;
  timestamp?: string;
  errorCode?: string;
  errorMessage?: string;
  signature?: string;
}

export interface CallbackProcessResult {
  success: boolean;
  message: string;
  processed: boolean;
}

// ============================================================================
// SAFARICOM M-PESA TYPES (From Daraja API)
// ============================================================================

export interface SafaricomStkPushRequest {
  BusinessShortCode: string;
  Password: string;
  Timestamp: string;
  TransactionType: 'CustomerPayBillOnline' | 'CustomerBuyGoodsOnline';
  Amount: number;
  PartyA: string; // Phone: 254712345678
  PartyB: string; // Business Code
  PhoneNumber: string; // 254712345678
  CallBackURL: string;
  AccountReference: string;
  TransactionDesc: string;
}

export interface SafaricomStkPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export interface SafaricomStkCallback {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number; 
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string; // 'Amount', 'MpesaReceiptNumber', 'TransactionDate', 'PhoneNumber'
          Value: string | number;
        }>;
      };
    };
  };
}

// ============================================================================
// TRANSACTION TYPES
// ============================================================================

export interface Transaction {
  transactionId: string;
  accountId: string;
  userId: string;
  amount: number;
  phone: string;
  type: 'deposit' | 'withdrawal';
  status: 'pending' | 'completed' | 'failed' | 'timeout';
  mpesaReceiptNumber?: string;
  description?: string;
  timestamp: string;
  updatedAt: string;
  errorMessage?: string;
  checkoutRequestId?: string;
}

export interface TransactionHistory {
  transactions: Transaction[];
  totalCount: number;
  page: number;
  pageSize: number;
}

// ============================================================================
// ACCOUNT TYPES
// ============================================================================

export interface Account {
  accountNumber: string;
  accountType: {
    name: string;
    code: string;
  };
  totalBalance: number;
  lastDeposit?: {
    amount: number;
    date: string;
  };
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status?: string;
  message?: string;
  transactionId?: string;
  [key: string]: any;
}

// ============================================================================
// USER STORAGE TYPES
// ============================================================================

export interface StoredUser {
  id: string;
  email: string;
  phone: string;
  username: string;
  accountNumber?: string;
  accounts?: Account[];
}

export interface StoredTransaction {
  transactionId: string;
  amount: number;
  phone: string;
  accountId: string;
  userId: string;
  status: 'pending' | 'completed' | 'failed' | 'timeout';
  timestamp: string;
  updatedAt: string;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export class SmsProcessingError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'SmsProcessingError';
  }
}

export class StkPushError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'StkPushError';
  }
}

export class PaymentError extends Error {
  constructor(
    public code: string,
    message: string,
    public transactionId?: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'PaymentError';
  }
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// ============================================================================
// POLLING CONFIGURATION
// ============================================================================

export interface PollingConfig {
  maxRetries: number; // default: 12
  retryInterval: number; // default: 10000ms (10 seconds)
  timeoutMs: number; // default: 120000ms (2 minutes)
  backoffMultiplier?: number; // for exponential backoff
}

// ============================================================================
// STATUS ENUM
// ============================================================================

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  TIMEOUT = 'timeout',
}

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRANSFER = 'transfer',
}

// ============================================================================
// LISTENER TYPES
// ============================================================================

export type PaymentStatusListener = (data: {
  transactionId: string;
  status: PaymentStatus;
  amount?: number;
  error?: string;
}) => void;

export type PaymentCompletionListener = (
  transactionId: string,
  amount: number
) => void;

export type PaymentFailureListener = (
  transactionId: string,
  reason?: string 
) => void;
