//home/hp/JERE/AutoNest/app/dashboard/customer/pension/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { accountsApi } from "@/app/lib/api-client";
import PensionPlans from '@/app/components/dashboard/PensionPlans';
import QuickActions from '@/app/components/dashboard/QuickActions';

interface Account {
  id: string;
  accountType: {
    id: string;
    name: string;
    description: string;
    interestRate?: number;
  };
  accountStatus: string;
  totalBalance: number;
  employeeBalance: number;
  employerBalance: number;
  earningsBalance: number;
  createdAt: string;
}

export default function CustomerPensionPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [pensionPlans, setPensionPlans] = useState<any[]>([]);
  const [contributionRate, setContributionRate] = useState<number>(2);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await accountsApi.getAll();
        if (response.success && response.accounts) {
          setAccounts(response.accounts);
          const mappedPlans = response.accounts.map((a: any, idx: number) => ({
            id: String(a.id || idx),
            name: a.accountType?.name || a.accountNumber || `Account ${a.id}`,
            provider: 'AutoNest',
            contribution: Number(a.employeeBalance ?? 0) + Number(a.employerBalance ?? 0),
            expectedReturn: a.accountType?.interestRate ?? 8.0,
            riskLevel: 'Medium',
            balance: Number(a.totalBalance ?? 0),
            status: a.accountStatus || 'ACTIVE',
          }));
          setPensionPlans(mappedPlans);
        } else {
          setAccounts([]);
        }
      } catch (err) {
        setAccounts([]);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-3 flex flex-col gap-3">
      {/* Contribution Rate Info */}
      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-4">
        <p className="text-orange-900 dark:text-orange-300 text-sm">
          <strong>Contribution Rate:</strong> {contributionRate}% of every transaction is allocated to your pension account.
        </p>
      </div>

      {/* Pension Plans */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="h-full [&>div]:h-full">
          <PensionPlans plans={pensionPlans} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="h-full [&>div]:h-full">
          <QuickActions userType="customer" />
        </div>
      </div>
    </div>
  );
}