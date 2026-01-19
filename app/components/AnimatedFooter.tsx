"use client";

import { TrendingUp, DollarSign, PieChart, Wallet, Zap } from "lucide-react";

export default function AnimatedFooter() {
  const items = [
    { icon: Wallet, label: "Secure Pension Management" },
    { icon: TrendingUp, label: "Investment Growth" },
    { icon: DollarSign, label: "Retirement Planning" },
    { icon: PieChart, label: "Portfolio Diversification" },
    { icon: Zap, label: "Fast & Reliable" },
  ];

  return (
    <footer className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 dark:from-orange-600 dark:via-orange-700 dark:to-orange-600 text-white py-4 mt-auto border-t border-white/20 dark:border-white/10 transition-colors duration-300">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-6 sm:gap-8 lg:gap-12 overflow-x-auto pb-2">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-2 whitespace-nowrap animate-pulse hover:animate-none transition-all hover:scale-110"
                style={{
                  animation: `slideIn 0.6s ease-out ${idx * 0.1}s both`,
                }}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </footer>
  );
}