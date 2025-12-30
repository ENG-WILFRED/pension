///home/hp/JERE/AutoNest/app/components/dashboard/QuickActions.tsx
import { CreditCard, Download, Target, TrendingUp, Users, FileText, Settings, AlertCircle } from 'lucide-react';

interface QuickActionsProps {
  userType?: 'customer' | 'admin';
}

export default function QuickActions({ userType = 'customer' }: QuickActionsProps) {
  const customerActions = [
    {
      action: 'contribute',
      icon: CreditCard,
      title: 'Make Contribution',
      description: 'Add funds to your pension account.',
      color: 'from-green-500 to-emerald-600',
      onClick: () => alert('Opening contribution form...')
    },
    {
      action: 'download',
      icon: Download,
      title: 'Download Statement',
      description: 'Get your pension statement PDF.',
      color: 'from-blue-500 to-indigo-600',
      onClick: () => alert('Preparing statement download...')
    },
    {
      action: 'goals',
      icon: Target,
      title: 'Update Goals',
      description: 'Adjust your retirement targets.',
      color: 'from-purple-500 to-pink-600',
      onClick: () => alert('Opening goals calculator...')
    },
    {
      action: 'calculator',
      icon: TrendingUp,
      title: 'Retirement Calculator',
      description: 'Project your retirement savings.',
      color: 'from-orange-500 to-red-600',
      onClick: () => alert('Opening retirement calculator...')
    }
  ];

  const adminActions = [
    {
      action: 'approve',
      icon: Users,
      title: 'Approve Requests',
      description: 'Review pending member requests.',
      color: 'from-green-500 to-emerald-600',
      onClick: () => alert('Opening approval queue...')
    },
    {
      action: 'generate-report',
      icon: FileText,
      title: 'Generate Report',
      description: 'Create financial or member report.',
      color: 'from-blue-500 to-indigo-600',
      onClick: () => alert('Opening report generator...')
    },
    {
      action: 'system-check',
      icon: Settings,
      title: 'System Health',
      description: 'Run system diagnostics.',
      color: 'from-purple-500 to-pink-600',
      onClick: () => alert('Running system check...')
    },
    {
      action: 'alerts',
      icon: AlertCircle,
      title: 'View Alerts',
      description: 'Check system notifications.',
      color: 'from-orange-500 to-red-600',
      onClick: () => alert('Opening alerts panel...')
    }
  ];

  const actions = userType === 'admin' ? adminActions : customerActions;

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
        <p className="text-sm text-gray-500">Perform common tasks</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button
              key={idx}
              onClick={action.onClick}
              className="group bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-5 flex flex-col items-start hover:shadow-lg hover:scale-105 transition-all text-left"
            >
              <div className={`p-3 rounded-lg bg-gradient-to-br ${action.color} text-white mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
              </div>
              <h4 className="text-sm font-bold text-gray-900 mb-1">{action.title}</h4>
              <p className="text-xs text-gray-600">
                {action.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}