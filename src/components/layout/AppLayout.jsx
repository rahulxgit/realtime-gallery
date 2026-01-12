import {
  LayoutDashboard,
  GalleryVertical,
  Activity,
  Menu,
  X,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import GalleryGrid from "../gallery/GalleryGrid";
import ActivityFeed from "../feed/ActivityFeed";
import UserProfile from "../ui/UserProfile";
import { useUserStore } from "../../store/useUserStore";

const tabs = [
  { id: "gallery", label: "Gallery", icon: GalleryVertical },
  { id: "feed", label: "Live Feed", icon: Activity },
];

export default function AppLayout({
  activeTab,
  setActiveTab,
  isMobile,
  sidebarOpen,
  setSidebarOpen,
}) {
  const { user } = useUserStore();
  const activeTabData = tabs.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Toasts */}
      <Toaster position={isMobile ? "top-center" : "top-right"} />

      {/* ================= MOBILE HEADER ================= */}
      {isMobile && (
        <header className="sticky top-0 z-50 bg-white border-b px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-blue-500" />
            <span className="font-bold text-lg">ImageSync</span>
          </div>

          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: user.color }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
        </header>
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r z-40
          ${isMobile ? "w-72" : "w-64"}
          ${isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"}
          transition-transform duration-300
        `}
        onClick={(e) => e.stopPropagation()}  
      >
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center gap-2 mb-6">
            <LayoutDashboard className="w-6 h-6 text-blue-500" />
            <h1 className="font-bold text-xl">ImageSync</h1>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (isMobile) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="mt-8 pt-6 border-t">
            <UserProfile />
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main
        className={`
          transition-all
          ${!isMobile ? "ml-64" : ""}
          p-4 lg:p-8
          ${isMobile ? "pb-20" : ""}
        `}
      >
      

        {activeTab === "gallery" && <GalleryGrid />}
        {activeTab === "feed" && <ActivityFeed />}
      </main>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-sm">
          <div className="flex justify-around items-center py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`flex flex-col items-center px-4 py-1 rounded-lg transition
                    ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-gray-800"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{tab.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 mt-1 bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* ================= MOBILE OVERLAY ================= */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
