import { Link } from "wouter";
import { BackgroundPattern } from "@/components/background-pattern";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AlertTriangle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#1A1E32" }}>
      <BackgroundPattern />
      <Header showBack />
      
      <main className="flex-1 relative z-10 flex items-center justify-center px-4">
        <div 
          className="rounded-3xl p-8 md:p-12 text-center max-w-lg"
          style={{
            background: "rgba(14, 33, 72, 0.85)",
            backdropFilter: "blur(25px)",
            border: "1px solid rgba(121, 101, 193, 0.4)",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)"
          }}
        >
          <div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ 
              background: "linear-gradient(135deg, #f30059, #d4004d)",
              boxShadow: "0 8px 24px rgba(243, 0, 89, 0.4)"
            }}
          >
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          
          <h1 
            className="text-4xl font-extrabold mb-4"
            style={{ 
              color: "#E3D095",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)"
            }}
            data-testid="text-404-title"
          >
            404
          </h1>
          
          <p 
            className="text-lg mb-2 font-semibold"
            style={{ color: "#E3D095" }}
          >
            Page Not Found
          </p>
          
          <p 
            className="text-sm mb-8"
            style={{ color: "rgba(227, 208, 149, 0.7)" }}
          >
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <Link href="/">
            <Button
              className="rounded-full px-6 gap-2"
              style={{
                background: "linear-gradient(135deg, #7965C1, #f30059)",
                color: "white"
              }}
              data-testid="button-go-home"
            >
              <Home className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
