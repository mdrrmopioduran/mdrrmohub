interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
}

export function LoadingSpinner({ size = "md", message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-8 h-8 border-2",
    md: "w-12 h-12 border-3",
    lg: "w-16 h-16 border-4"
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8" data-testid="loading-spinner">
      <div 
        className={`${sizeClasses[size]} rounded-full animate-spin`}
        style={{
          borderColor: "rgba(121, 101, 193, 0.3)",
          borderTopColor: "#f30059",
          boxShadow: "0 0 20px rgba(243, 0, 89, 0.3)"
        }}
      />
      {message && (
        <p 
          className="text-base font-semibold"
          style={{ color: "#E3D095" }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
