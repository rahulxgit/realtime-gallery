import { useState } from "react";
import AppLayout from "./components/layout/AppLayout";
import { useIsMobile } from "./hooks/useIsMobile";

export default function App() {
  const isMobile = useIsMobile(); 
  const [activeTab, setActiveTab] = useState("gallery");
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  return (
    <AppLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isMobile={isMobile}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    />
  );
}
