import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BackgroundPattern } from "@/components/background-pattern";
import { LoadingSpinner } from "@/components/loading-spinner";
import { 
  Map as MapIcon, 
  Layers, 
  MapPin, 
  AlertTriangle, 
  Mountain,
  Landmark,
  Navigation,
  Building,
  Camera,
  Compass,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import type { MapLayer, HazardZone, MapAsset } from "@shared/schema";

const MAP_LAYERS: MapLayer[] = [
  { id: "interactive", name: "Interactive Map", type: "interactive", active: true },
  { id: "administrative", name: "Administrative Map", type: "administrative", active: false },
  { id: "topographic", name: "Topographic Map", type: "topographic", active: false },
  { id: "land-use", name: "Land Use Map", type: "land-use", active: false },
  { id: "hazards", name: "Hazards Maps", type: "hazards", active: false },
  { id: "touristic", name: "Touristic Map", type: "touristic", active: false },
  { id: "street", name: "Street Map", type: "street", active: false },
];

const layerIcons: Record<string, any> = {
  interactive: Compass,
  administrative: Building,
  topographic: Mountain,
  "land-use": Landmark,
  hazards: AlertTriangle,
  touristic: Camera,
  street: Navigation,
};

export default function Maps() {
  const [layers, setLayers] = useState<MapLayer[]>(MAP_LAYERS);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hazardOpacity, setHazardOpacity] = useState(0.6);
  const [selectedAsset, setSelectedAsset] = useState<MapAsset | null>(null);
  const [selectedZone, setSelectedZone] = useState<HazardZone | null>(null);

  const { data: hazardZones = [], isLoading: zonesLoading } = useQuery<HazardZone[]>({
    queryKey: ["/api/maps/hazards"],
  });

  const { data: assets = [], isLoading: assetsLoading } = useQuery<MapAsset[]>({
    queryKey: ["/api/maps/assets"],
  });

  const activeLayer = useMemo(() => layers.find(l => l.active), [layers]);

  const toggleLayer = useCallback((layerId: string) => {
    setLayers(prev => prev.map(l => ({
      ...l,
      active: l.id === layerId
    })));
  }, []);

  const getAssetStatusColor = (status: MapAsset["status"]) => {
    switch (status) {
      case "available": return "#28A745";
      case "low": return "#FFC107";
      case "deployed": return "#007BFF";
      case "unavailable": return "#DC3545";
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#1A1E32" }}>
      <BackgroundPattern />
      <Header title="MAPS & GIS" showBack />

      <main className="flex-1 relative z-10 flex overflow-hidden">
        <div 
          className={`absolute lg:relative z-20 h-full transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:-translate-x-full'}`}
          style={{ width: sidebarOpen ? "280px" : "0" }}
        >
          <div 
            className="h-full p-4 overflow-y-auto"
            style={{
              background: "rgba(14, 33, 72, 0.95)",
              backdropFilter: "blur(25px)",
              borderRight: "1px solid rgba(121, 101, 193, 0.4)"
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold flex items-center gap-2" style={{ color: "#E3D095" }}>
                <Layers className="w-5 h-5" style={{ color: "#F74B8A" }} />
                Map Layers
              </h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10"
                style={{ color: "#E3D095" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {layers.map(layer => {
                const Icon = layerIcons[layer.type] || MapIcon;
                return (
                  <button
                    key={layer.id}
                    onClick={() => toggleLayer(layer.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      layer.active ? 'scale-[1.02]' : 'hover:bg-white/10'
                    }`}
                    style={{
                      background: layer.active ? "linear-gradient(135deg, #F74B8A, #F74B8ACC)" : "rgba(255, 255, 255, 0.05)",
                      color: layer.active ? "white" : "#E3D095",
                      boxShadow: layer.active ? "0 8px 24px rgba(247, 75, 138, 0.4)" : "none"
                    }}
                    data-testid={`layer-${layer.id}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{layer.name}</span>
                  </button>
                );
              })}
            </div>

            {activeLayer?.type === "hazards" && (
              <div className="mt-6 p-4 rounded-xl" style={{ background: "rgba(255, 255, 255, 0.05)" }}>
                <h4 className="text-sm font-semibold mb-3" style={{ color: "#E3D095" }}>
                  Hazard Layers
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm" style={{ color: "rgba(227, 208, 149, 0.8)" }}>
                    <input type="checkbox" defaultChecked className="accent-[#DC3545]" />
                    Flood-Prone Areas
                  </label>
                  <label className="flex items-center gap-2 text-sm" style={{ color: "rgba(227, 208, 149, 0.8)" }}>
                    <input type="checkbox" defaultChecked className="accent-[#FFC107]" />
                    Landslide Zones
                  </label>
                  <label className="flex items-center gap-2 text-sm" style={{ color: "rgba(227, 208, 149, 0.8)" }}>
                    <input type="checkbox" className="accent-[#007BFF]" />
                    Storm Surge Areas
                  </label>
                </div>

                <div className="mt-4">
                  <label className="text-xs font-medium block mb-2" style={{ color: "rgba(227, 208, 149, 0.7)" }}>
                    Opacity: {Math.round(hazardOpacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={hazardOpacity}
                    onChange={(e) => setHazardOpacity(parseFloat(e.target.value))}
                    className="w-full accent-[#F74B8A]"
                    data-testid="slider-opacity"
                  />
                </div>
              </div>
            )}

            <div className="mt-6 p-4 rounded-xl" style={{ background: "rgba(255, 255, 255, 0.05)" }}>
              <h4 className="text-sm font-semibold mb-3" style={{ color: "#E3D095" }}>
                Asset Status Legend
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(227, 208, 149, 0.8)" }}>
                  <span className="w-3 h-3 rounded-full bg-[#28A745]" /> Available
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(227, 208, 149, 0.8)" }}>
                  <span className="w-3 h-3 rounded-full bg-[#FFC107]" /> Low/Maintenance
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(227, 208, 149, 0.8)" }}>
                  <span className="w-3 h-3 rounded-full bg-[#007BFF]" /> Deployed
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(227, 208, 149, 0.8)" }}>
                  <span className="w-3 h-3 rounded-full bg-[#DC3545]" /> Unavailable
                </div>
              </div>
            </div>
          </div>
        </div>

        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute left-0 top-4 z-20 p-3 rounded-r-xl"
            style={{
              background: "rgba(14, 33, 72, 0.95)",
              color: "#E3D095",
              borderRight: "1px solid rgba(121, 101, 193, 0.4)",
              borderTop: "1px solid rgba(121, 101, 193, 0.4)",
              borderBottom: "1px solid rgba(121, 101, 193, 0.4)"
            }}
            data-testid="button-open-sidebar"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        <div className="flex-1 relative">
          {zonesLoading || assetsLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingSpinner message="Loading map data..." />
            </div>
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{ 
                background: "linear-gradient(135deg, #1A1E32 0%, #0E2148 50%, #1A1E32 100%)",
                minHeight: "calc(100vh - 140px)"
              }}
            >
              <div 
                className="rounded-2xl p-8 text-center max-w-lg mx-4"
                style={{
                  background: "rgba(14, 33, 72, 0.9)",
                  border: "1px solid rgba(121, 101, 193, 0.4)"
                }}
              >
                <div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ background: "linear-gradient(135deg, #F74B8A, #F74B8ACC)" }}
                >
                  <MapIcon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: "#E3D095" }}>
                  Interactive Map View
                </h3>
                <p className="text-sm mb-6" style={{ color: "rgba(227, 208, 149, 0.7)" }}>
                  The map displays the current active layer: <strong>{activeLayer?.name}</strong>. 
                  Use the sidebar to switch between different map layers including hazard zones, 
                  administrative boundaries, and asset locations.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div 
                    className="p-4 rounded-xl text-center"
                    style={{ background: "rgba(247, 75, 138, 0.2)" }}
                  >
                    <div className="text-2xl font-bold" style={{ color: "#F74B8A" }}>
                      {hazardZones.length}
                    </div>
                    <div className="text-xs" style={{ color: "rgba(227, 208, 149, 0.7)" }}>
                      Hazard Zones
                    </div>
                  </div>
                  <div 
                    className="p-4 rounded-xl text-center"
                    style={{ background: "rgba(0, 163, 141, 0.2)" }}
                  >
                    <div className="text-2xl font-bold" style={{ color: "#00A38D" }}>
                      {assets.length}
                    </div>
                    <div className="text-xs" style={{ color: "rgba(227, 208, 149, 0.7)" }}>
                      MDRRMO Assets
                    </div>
                  </div>
                </div>

                <p className="text-xs mt-6" style={{ color: "rgba(227, 208, 149, 0.5)" }}>
                  Google Maps integration with API Key configured for full interactive experience.
                </p>
              </div>
            </div>
          )}
        </div>

        {selectedAsset && (
          <div 
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 p-4 rounded-xl max-w-sm"
            style={{
              background: "rgba(14, 33, 72, 0.95)",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(121, 101, 193, 0.4)"
            }}
          >
            <div className="flex items-start gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: getAssetStatusColor(selectedAsset.status) }}
              >
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold" style={{ color: "#E3D095" }}>{selectedAsset.name}</h4>
                <p className="text-xs" style={{ color: "rgba(227, 208, 149, 0.7)" }}>
                  {selectedAsset.description}
                </p>
                {selectedAsset.capacity && (
                  <p className="text-xs mt-1" style={{ color: "rgba(227, 208, 149, 0.6)" }}>
                    Capacity: {selectedAsset.capacity}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="p-1 rounded hover:bg-white/10"
                style={{ color: "#E3D095" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
