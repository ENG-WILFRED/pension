import Link from 'next/link';
import { CreditCard, FileText, Target } from 'lucide-react';

interface QuickActionsProps {
  userType?: 'customer' | 'admin';
}

export default function QuickActions({ userType = 'customer' }: QuickActionsProps) {
  const customerActions = [
    {
      href: '/dashboard/pensionplan',
      icon: CreditCard,
      title: 'Add Pension Plan',
      description: 'Explore and invest in additional pension plans.'
    },
    {
      href: '/dashboard/download',
      icon: FileText,
      title: 'Download Statement',
      description: 'Get your pension statement for record keeping.'
    },
    {
      href: '/dashboard/retirement-goals',
      icon: Target,
      title: 'Retirement Goals',
      description: 'Plan and track your retirement objectives.'
    }
  ];

  const adminActions = [
    {
      href: '/dashboard/admin/manage',
      icon: CreditCard,
      title: 'Manage Users',
      description: 'View and manage all member accounts.'
    },
    {
      href: '/dashboard/admin/reports',
      icon: FileText,
      title: 'Reports',
      description: 'Generate and export financial reports.'
    },
    {
      href: '/dashboard/admin/settings',
      icon: Target,
      title: 'System Settings',
      description: 'Configure system and member settings.'
    }
  ];

  const actions = userType === 'admin' ? adminActions : customerActions;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {actions.map((action, idx) => {
        const Icon = action.icon;
        return (
          <Link
            key={idx}
            href={action.href}
            className="group bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-lg p-6 flex flex-col items-start hover:shadow-2xl hover:-translate-y-1 transition-all"
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white mb-4 shadow">
              <Icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{action.title}</h3>
            <p className="text-gray-600 mt-2 text-sm">
              {action.description}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
