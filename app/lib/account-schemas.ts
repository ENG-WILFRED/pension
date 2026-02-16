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
  // Balances broken down for display in the portfolio
  employeeBalance: z.number().default(0).catch(0),
  employerBalance: z.number().default(0).catch(0),
  earningsBalance: z.number().default(0).catch(0),
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
        // Prefer a friendly name: accountType object -> use it; otherwise try name fields; fall back to accountNumber or generic label
        if (!at) {
          const fallbackName = data.accountNumber ? `Account ${data.accountNumber}` : 'Pension Account';
          return { name: fallbackName };
        }
        if (typeof at === 'object') {
          // ensure object has a name; if not, fallback to accountNumber or generic
          const name = at.name || data.accountTypeName || data.account_type_name || data.accountNumber || 'Pension Account';
          return { ...at, name };
        }
        // primitive -> convert to object with id and attempt to find a name
        const name = (data.accountTypeName || data.account_type_name || data.accountNumber) ?? 'Pension Account';
        return { id: String(at), name };
      })(),
      // normalize contribution/balance breakdowns which may come with different keys
      employeeBalance: (() => {
        const v = data.employeeBalance ?? data.employee_balance ?? data.employee_amount ?? data.employee_contribution ?? 0;
        const n = typeof v === 'string' ? Number(v) : v;
        return Number.isFinite(n) ? n : 0;
      })(),
      employerBalance: (() => {
        const v = data.employerBalance ?? data.employer_balance ?? data.employer_amount ?? data.employer_contribution ?? 0;
        const n = typeof v === 'string' ? Number(v) : v;
        return Number.isFinite(n) ? n : 0;
      })(),
      earningsBalance: (() => {
        const v = data.earningsBalance ?? data.earnings_balance ?? data.earnings ?? data.interest ?? 0;
        const n = typeof v === 'string' ? Number(v) : v;
        return Number.isFinite(n) ? n : 0;
      })(),
    };

    return accountSchema.parse(normalized);
  } catch (error) {
    console.error('Error parsing account:', error);
    // Return a safe default account
    return {
      id: data.id !== undefined && data.id !== null ? String(data.id) : 'unknown',
      accountNumber: data.accountNumber != null ? String(data.accountNumber) : undefined,
      accountType: { name: (data?.accountType?.name) || data?.accountTypeName || data?.account_type_name || 'Unknown' },
      totalBalance: 0,
      employeeBalance: 0,
      employerBalance: 0,
      earningsBalance: 0,
      accountStatus: undefined,
      userId: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    };
  }
}

// Helper function to safely parse multiple accounts
export function parseAccounts(data: any[]): Account[] {
  return data.map(parseAccount);
}