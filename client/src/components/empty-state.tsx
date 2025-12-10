import { LucideIcon, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  icon: Icon = FolderOpen, 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  return (
    <div 
      className="flex flex-col items-center justify-center py-16 px-8 text-center rounded-2xl"
      style={{
        background: "rgba(121, 101, 193, 0.1)",
        border: "1px dashed rgba(121, 101, 193, 0.4)"
      }}
      data-testid="empty-state"
    >
      <div 
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: "rgba(121, 101, 193, 0.2)" }}
      >
        <Icon className="w-10 h-10" style={{ color: "#7965C1" }} />
      </div>
      
      <h3 
        className="text-xl font-bold mb-2"
        style={{ color: "#E3D095" }}
        data-testid="text-empty-title"
      >
        {title}
      </h3>
      
      <p 
        className="text-sm max-w-md mb-6"
        style={{ color: "rgba(227, 208, 149, 0.7)" }}
        data-testid="text-empty-description"
      >
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="rounded-full px-6"
          style={{
            background: "linear-gradient(135deg, #7965C1, #f30059)",
            color: "white"
          }}
          data-testid="button-empty-action"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
