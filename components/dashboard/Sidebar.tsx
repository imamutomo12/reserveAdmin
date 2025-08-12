// --- File: components/dashboard/Sidebar.tsx
import React from "react";
import { LayoutDashboard, TreesIcon, CalendarClock, Globe } from "lucide-react";

// Tipe props untuk Sidebar
type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-64 bg-white shadow-md p-6">
      <div className="flex items-center space-x-2 text-xl font-bold text-gray-800 mb-8">
        <LayoutDashboard size={24} />
        <span>Admin Dashboard</span>
      </div>
      <nav className="space-y-2">
        <button
          onClick={() => setActiveTab("tamanKota")}
          className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
            activeTab === "tamanKota"
              ? "bg-blue-100 text-blue-600 font-semibold"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <TreesIcon size={20} />
          <span>Taman Kota</span>
        </button>
        <button
          onClick={() => setActiveTab("reservasi")}
          className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
            activeTab === "reservasi"
              ? "bg-blue-100 text-blue-600 font-semibold"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <CalendarClock size={20} />
          <span>Reservasi</span>
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
            activeTab === "events"
              ? "bg-blue-100 text-blue-600 font-semibold"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Globe size={20} />
          <span>Event Publik</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
