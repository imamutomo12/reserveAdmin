// --- File: app/login/page.tsx (Tidak berubah)
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabase";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`Gagal login: ${error.message}`);
    } else if (data.user) {
      const { data: profil, error: profilError } = await supabase
        .from("PROFIL_USER")
        .select("role")
        .eq("user_id", data.user.id)
        .single();

      if (profilError || profil?.role !== "admin") {
        setMessage("Akses ditolak: Anda bukan admin.");
        await supabase.auth.signOut();
      } else {
        setMessage("Login berhasil!");
        router.push("/");
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Login Admin</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Kata Sandi</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Memuat..." : "Masuk"}
          </button>
        </form>
        {message && (
          <div className="p-3 text-center text-red-800 bg-red-100 rounded-md">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
