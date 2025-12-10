import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BackgroundPattern } from "@/components/background-pattern";
import { DashboardCard } from "@/components/dashboard-card";
import type { DashboardModule } from "@shared/schema";

const modules: DashboardModule[] = [
  {
    id: "supply-inventory",
    title: "Supply Inventory",
    description: "Track emergency equipment, relief supplies, and monitor stock levels in real-time for efficient disaster response.",
    icon: "package",
    color: "#00A38D",
    route: "/inventory"
  },
  {
    id: "calendar",
    title: "Calendar of Activities",
    description: "Schedule drills, meetings, and emergency response training. Stay organized with event management.",
    icon: "calendar",
    color: "#72E01F",
    route: "/calendar"
  },
  {
    id: "contacts",
    title: "Contact List",
    description: "Access emergency responder contacts, agency directories, and key personnel information instantly.",
    icon: "users",
    color: "#6F42C1",
    route: "/contacts"
  },
  {
    id: "documents",
    title: "Document",
    description: "Manage official documents, bulletins, resolutions, and BDRRMP files in an organized file system.",
    icon: "file-text",
    color: "#E69500",
    route: "/documents"
  },
  {
    id: "gallery",
    title: "Photo Gallery",
    description: "Browse documentation photos from emergency responses, drills, and community activities.",
    icon: "image",
    color: "#C82A52",
    route: "/gallery"
  },
  {
    id: "maps",
    title: "Maps",
    description: "View interactive hazard maps, evacuation routes, and asset locations for disaster preparedness.",
    icon: "map",
    color: "#F74B8A",
    route: "/maps"
  }
];

export default function Dashboard() {
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ background: "#1A1E32" }}
    >
      <BackgroundPattern />
      <Header />
      
      <main className="flex-1 relative z-10 px-4 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 
              className="text-3xl md:text-4xl font-extrabold mb-3 tracking-wide"
              style={{ 
                color: "#E3D095",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)"
              }}
              data-testid="text-dashboard-title"
            >
              Dashboard
            </h1>
            <p 
              className="text-base"
              style={{ color: "rgba(227, 208, 149, 0.7)" }}
              data-testid="text-dashboard-subtitle"
            >
              Select a module to manage your MDRRMO operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {modules.map((module, index) => (
              <DashboardCard 
                key={module.id} 
                module={module} 
                index={index}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
