"use client";

import React from 'react';
import { Shield, TrendingUp, BarChart3, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Premium floating gradients */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-40 right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-float-slower" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />

      <main className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* IMAGE PANEL */}
        <section className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex items-center justify-center">
          {/* Animated background pattern */}
          <div className="absolute inset-0">
            <svg className="w-full h-full text-white/5" viewBox="0 0 400 400" fill="none">
              <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="1" className="animate-pulse-slow" />
              <circle cx="200" cy="200" r="140" stroke="currentColor" strokeWidth="1" className="animate-pulse-slower" />
              <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="1" className="animate-pulse-slow" />
            </svg>
          </div>

          {/* Growth chart illustration */}
          <div className="absolute inset-0 flex items-center justify-center p-16 opacity-10">
            <svg className="w-full h-full text-white" viewBox="0 0 400 400" fill="none">
              <path 
                d="M50 300 L100 280 L150 240 L200 200 L250 150 L300 100 L350 80" 
                stroke="currentColor" 
                strokeWidth="3" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="animate-draw"
              />
              <circle cx="100" cy="280" r="6" fill="currentColor" />
              <circle cx="150" cy="240" r="6" fill="currentColor" />
              <circle cx="200" cy="200" r="6" fill="currentColor" />
              <circle cx="250" cy="150" r="6" fill="currentColor" />
              <circle cx="300" cy="100" r="6" fill="currentColor" />
            </svg>
          </div>

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-white text-center px-8 py-12">
            <div className="mb-8 p-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl">
              <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Secure Your<br />Future Today
            </h2>
            <p className="text-xl text-blue-100 max-w-md leading-relaxed">
              Professional retirement planning with confidence and security
            </p>
          </div>

          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
        </section>

        {/* CONTENT PANEL */}
        <section className="relative flex items-center justify-center px-8 lg:px-20 py-16 lg:py-24 min-h-screen bg-slate-950">
          {/* Ambient gradient glow */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-900/20 via-transparent to-transparent pointer-events-none" />

          <div className="relative max-w-2xl w-full space-y-12">
            {/* Header */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight">
                Your All-In-One
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-gradient">
                  Pension Manager
                </span>
              </h1>

              <p className="text-lg lg:text-xl text-slate-400 leading-relaxed max-w-xl">
                Grow your retirement savings — explore pension plans, make
                contributions, and track your long-term performance in a clean
                and secure dashboard built for retirement planning.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/login"
                className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white text-lg font-bold shadow-lg shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative">Sign In</span>
              </a>

              <a
                href="/register"
                className="px-10 py-4 rounded-2xl border-2 border-indigo-500/50 text-white text-lg font-bold bg-slate-900/50 backdrop-blur-sm hover:bg-indigo-500/10 hover:border-indigo-400 hover:scale-105 transition-all duration-300"
              >
                Create Account
              </a>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
              <Feature
                title="Smart Plans"
                icon={<TrendingUp className="text-blue-400 w-7 h-7" />}
              >
                Curated pension plans with intelligent contribution recommendations and one-click investing.
              </Feature>

              <Feature
                title="Secure & Safe"
                icon={<Shield className="text-indigo-400 w-7 h-7" />}
              >
                Bank-level encryption with complete transaction history and smart activity filtering.
              </Feature>

              <Feature
                title="Real-Time Updates"
                icon={<Clock className="text-purple-400 w-7 h-7" />}
              >
                Instant notifications for all transactions with success and failure status tracking.
              </Feature>

              <Feature
                title="Analytics Dashboard"
                icon={<BarChart3 className="text-pink-400 w-7 h-7" />}
              >
                Beautiful charts and insights with smooth navigation and performance tracking.
              </Feature>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 6s ease infinite;
        }

        @keyframes float {
          0%, 100% { 
            transform: translateY(0) scale(1);
            opacity: 0.4;
          }
          50% { 
            transform: translateY(-30px) scale(1.1);
            opacity: 0.6;
          }
        }
        .animate-float-slow {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float 12s ease-in-out infinite;
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slow 6s ease-in-out infinite;
        }

        @keyframes draw {
          from { stroke-dasharray: 0 1000; }
          to { stroke-dasharray: 1000 1000; }
        }
        .animate-draw {
          animation: draw 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

const Feature = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="group relative p-6 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 hover:border-indigo-500/50 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2 transition-all duration-300">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
    
    <div className="relative flex items-start gap-4">
      <div className="p-3 bg-slate-800/80 rounded-xl group-hover:bg-slate-800 transition-colors">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          {children}
        </p>
      </div>
    </div>
  </div>
);