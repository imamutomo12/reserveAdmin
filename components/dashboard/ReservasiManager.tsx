// --- File: components/dashboard/ReservasiManager.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase";
import { Database } from "../../types/supabase";

type Reservasi = Database["public"]["Tables"]["RESERVASI"]["Row"] & {
  PROFIL_USER: { nama: string } | null;
  TAMAN_KOTA: { nama_taman: string } | null;
};

const ReservasiManager = () => {
  const [reservasiList, setReservasiList] = useState<Reservasi[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReservasi();
  }, []);

  const fetchReservasi = async () => {
    const { data, error } = await supabase
      .from("RESERVASI")
      .select(
        `
                *,
                PROFIL_USER!RESERVASI_user_id_fkey ( nama ),
                TAMAN_KOTA ( nama_taman, FOTO_TAMAN(url_foto) )
            `
      )
      .order("tanggal_pengajuan", { ascending: false });

    if (!error) {
      setReservasiList((data as Reservasi[]) || []);
    } else {
      console.error("Error fetching reservasi:", error);
    }
    setIsLoading(false);
  };

  const handleStatusChange = async (
    reservasiId: number,
    newStatus: "Diterima" | "Ditolak"
  ) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const adminId = session?.user?.id;

    if (!adminId) return;

    const { error } = await supabase
      .from("RESERVASI")
      .update({
        status_reservasi: newStatus,
        admin_id_keputusan: adminId,
        tanggal_keputusan_admin: new Date().toISOString(),
      })
      .eq("id_reservasi", reservasiId);

    if (!error) {
      fetchReservasi();
    } else {
      console.error("Error updating reservasi status:", error);
    }
  };

  if (isLoading) return <div className="text-center p-8">Memuat data...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6 text-black">Manajemen Reservasi</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Taman
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservasiList.map((r) => (
              <tr key={r.id_reservasi}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {r.PROFIL_USER?.nama || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {r.TAMAN_KOTA?.nama_taman || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {r.tanggal_reservasi}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      r.status_reservasi === "Menunggu"
                        ? "bg-yellow-100 text-yellow-800"
                        : r.status_reservasi === "Diterima"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {r.status_reservasi}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {r.status_reservasi === "Menunggu" && (
                    <>
                      <button
                        onClick={() =>
                          handleStatusChange(r.id_reservasi, "Diterima")
                        }
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        Terima
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(r.id_reservasi, "Ditolak")
                        }
                        className="text-red-600 hover:text-red-900"
                      >
                        Tolak
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservasiManager;
