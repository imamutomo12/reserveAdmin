"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabase";
import Sidebar from "../components/dashboard/Sidebar";
import TamanKotaManager from "../components/dashboard/TamanKotaManager";
import ReservasiManager from "../components/dashboard/ReservasiManager";
import EventsManager from "../components/dashboard/EventsManager";
import { LogOut } from "lucide-react";

// Tipe untuk pengguna
type User = {
  email: string;
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("tamanKota");
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (!session || error) {
        router.push("/login");
        return;
      }

      const { data: profil, error: profilError } = await supabase
        .from("PROFIL_USER")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (profilError || profil?.role !== "admin") {
        router.push("/login");
        return;
      }
      setUser({ email: session.user.email as string });
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="text-center p-8">Sedang memeriksa otentikasi...</div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "tamanKota":
        return <TamanKotaManager />;
      case "reservasi":
        return <ReservasiManager />;
      case "events":
        return <EventsManager />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-auto">
        <header className="p-6 bg-white shadow-sm flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            Selamat Datang, Admin!
          </h1>
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">{user.email}</p>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
            >
              <LogOut size={16} />
              <span>Keluar</span>
            </button>
          </div>
        </header>
        <main className="p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;
