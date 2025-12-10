interface StatusPillProps {
  status: "In Stock" | "Low Stock" | "Out of Stock" | "Upcoming" | "Overdue" | "Complete" | "High" | "Medium" | "Low";
}

const statusColors: Record<string, { bg: string; text: string }> = {
  "In Stock": { bg: "#28A745", text: "white" },
  "Low Stock": { bg: "#FFC107", text: "#1A1E32" },
  "Out of Stock": { bg: "#DC3545", text: "white" },
  "Upcoming": { bg: "#007BFF", text: "white" },
  "Overdue": { bg: "#DC3545", text: "white" },
  "Complete": { bg: "#28A745", text: "white" },
  "High": { bg: "#DC3545", text: "white" },
  "Medium": { bg: "#FFC107", text: "#1A1E32" },
  "Low": { bg: "#007BFF", text: "white" },
};

export function StatusPill({ status }: StatusPillProps) {
  const colors = statusColors[status] || { bg: "#6c757d", text: "white" };

  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{
        background: colors.bg,
        color: colors.text
      }}
      data-testid={`status-pill-${status.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {status}
    </span>
  );
}
