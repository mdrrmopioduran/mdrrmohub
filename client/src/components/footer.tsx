export function Footer() {
  return (
    <footer 
      className="w-full py-3 text-center sticky bottom-0 z-40"
      style={{
        background: "linear-gradient(135deg, #7965C1, #483AA0)",
        borderTop: "1px solid rgba(121, 101, 193, 0.4)",
        backdropFilter: "blur(10px)"
      }}
      data-testid="footer"
    >
      <p 
        className="text-sm font-medium tracking-wide text-white"
        data-testid="text-footer"
      >
        MDRRMO Pio Duran File Inventory and Management System
      </p>
    </footer>
  );
}
