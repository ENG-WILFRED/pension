// app/components/ui/Logo.tsx
export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg ${className}`}>
      <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 20h24M20 8v24" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="20" cy="20" r="18" stroke="url(#gradient)" strokeWidth="2" opacity="0.3"/>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333EA" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}