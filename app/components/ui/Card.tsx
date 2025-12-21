interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 ${className}`}>
      {children}
    </div>
  );
}