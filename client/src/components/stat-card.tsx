import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
  color?: string;
  loading?: boolean;
}

export function StatCard({ icon: Icon, value, label, color = "#f30059", loading = false }: StatCardProps) {
  return (
    <div
      className="rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "rgba(121, 101, 193, 0.15)",
        backdropFilter: "blur(15px)",
        border: "1px solid rgba(121, 101, 193, 0.4)",
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)"
      }}
      data-testid={`stat-card-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div 
        className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center mb-3"
        style={{ background: `${color}20` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      
      {loading ? (
        <div className="h-8 w-16 mx-auto mb-2 rounded bg-white/10 animate-pulse" />
      ) : (
        <div 
          className="text-3xl font-extrabold mb-1"
          style={{ 
            color: "#E3D095",
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)"
          }}
          data-testid={`text-stat-value-${label.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {value}
        </div>
      )}
      
      <div 
        className="text-sm font-semibold"
        style={{ color: "rgba(227, 208, 149, 0.85)" }}
      >
        {label}
      </div>
    </div>
  );
}
