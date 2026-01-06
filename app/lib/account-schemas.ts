import { z } from 'zod';

// Account Type schema
export const accountTypeSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  interestRate: z.number().optional(),
  category: z.string().optional(),
  minBalance: z.number().optional(),
  maxBalance: z.number().optional(),
  lockInPeriodMonths: z.number().optional(),
  allowWithdrawals: z.boolean().optional(),
  allowLoans: z.boolean().optional(),
  active: z.boolean().optional(),
  metadata: z.any().optional(),
});

export type AccountType = z.infer<typeof accountTypeSchema>;

// Account schema with safe defaults
export const accountSchema = z.object({
  id: z.string(),
  accountNumber: z.string().optional(),
  accountType: accountTypeSchema,
  totalBalance: z.number().default(0).catch(0), // ✅ Always defaults to 0, even on error
  accountStatus: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  userId: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Account = z.infer<typeof accountSchema>;

// Contribution schema
export const contributionSchema = z.object({
  employeeAmount: z.number().min(0, 'Employee amount must be positive').optional(),
  employerAmount: z.number().min(0, 'Employer amount must be positive').optional(),
  description: z.string().optional(),
});

export type ContributionData = z.infer<typeof contributionSchema>;

// Deposit schema
export const depositSchema = z.object({
  amount: z.number().min(1, 'Amount must be at least 1'),
  phone: z.string().regex(/^\+254\d{9}$/, 'Phone must be in format +254XXXXXXXXX'),
  description: z.string().optional(),
});

export type DepositData = z.infer<typeof depositSchema>;

// Withdrawal schema
export const withdrawalSchema = z.object({
  amount: z.number().min(1, 'Amount must be at least 1'),
  withdrawalType: z.string().min(1, 'Withdrawal type is required'),
  description: z.string().optional(),
});

export type WithdrawalData = z.infer<typeof withdrawalSchema>;

// Earnings schema
export const earningsSchema = z.object({
  type: z.enum(['interest', 'investment', 'dividend']),
  amount: z.number().min(0, 'Amount must be positive'),
  description: z.string().optional(),
});

export type EarningsData = z.infer<typeof earningsSchema>;

// Account creation schema
export const createAccountSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  accountTypeId: z.string().min(1, 'Account type is required'),
  initialBalance: z.number().min(0).default(0),
  accountStatus: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).default('ACTIVE'),
});

export type CreateAccountData = z.infer<typeof createAccountSchema>;

// Account update schema
export const updateAccountSchema = z.object({
  accountTypeId: z.string().optional(),
  accountStatus: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
});

export type UpdateAccountData = z.infer<typeof updateAccountSchema>;

// Helper function to safely parse account data
export function parseAccount(data: any): Account {
  try {
    // Normalize common type mismatches from the API:
    const normalized: any = {
      ...data,
      // ensure id is a string
      id: data.id !== undefined && data.id !== null ? String(data.id) : undefined,
      // accountNumber may come as a number
      accountNumber: data.accountNumber != null ? String(data.accountNumber) : undefined,
      // normalize totalBalance to a number (fallback to 0)
      totalBalance: (() => {
        const v = data.totalBalance ?? data.balance ?? 0;
        const n = typeof v === 'string' ? Number(v) : v;
        return Number.isFinite(n) ? n : 0;
      })(),
      // normalize accountType: sometimes the API returns an id string/number instead of an object
      accountType: (() => {
        const at = data.accountType ?? data.account_type ?? data.accountTypeId;
        if (!at) return { name: 'Unknown' };
        if (typeof at === 'object') return at;
        // primitive -> convert to object with id
        return { id: String(at), name: (data.accountTypeName || data.account_type_name) ?? 'Unknown' };
      })(),
    };

    return accountSchema.parse(normalized);
  } catch (error) {
    console.error('Error parsing account:', error);
    // Return a safe default account
    return {
      id: data.id || 'unknown',
      accountType: { name: data.accountType?.name || 'Unknown' },
      totalBalance: 0,
    };
  }
}

// Helper function to safely parse multiple accounts
export function parseAccounts(data: any[]): Account[] {
  return data.map(parseAccount);
}