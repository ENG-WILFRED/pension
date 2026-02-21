//home/hp/JERE/AutoNest/app/dashboard/customer/pension/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await accountsApi.getAll();
        if (response.success && response.accounts) {
          setAccounts(response.accounts);
          // Map accounts to PensionPlans format for compatibility
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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
      INACTIVE: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400',
      SUSPENDED: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
    };
    return colors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-2 sm:px-8 lg:px-24 py-12 flex flex-col gap-10 items-stretch">
      <div className="flex-1 flex flex-col justify-center">
        <PensionPlans plans={pensionPlans} />
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <QuickActions userType="customer" />
      </div>
    </div>
  );
}