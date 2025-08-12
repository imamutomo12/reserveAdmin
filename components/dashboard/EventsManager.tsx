// --- File: components/dashboard/EventsManager.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase";
import { Database } from "../../types/supabase";

type TamanKota = Database["public"]["Tables"]["TAMAN_KOTA"]["Row"];
type EventPublik = Database["public"]["Tables"]["EVENT_PUBLIK"]["Row"] & {
  TAMAN_KOTA: { nama_taman: string } | null;
};
type EventForm = Omit<
  EventPublik,
  "id_event" | "admin_id" | "id_jenis_acara" | "TAMAN_KOTA" | "deskripsi_event"
> & {
  id_event: number | null;
  deskripsi_event?: string | null;
};

const EventsManager = () => {
  const [eventsList, setEventsList] = useState<EventPublik[]>([]);
  const [tamanKotaOptions, setTamanKotaOptions] = useState<
    { id_taman: number; nama_taman: string }[]
  >([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<EventForm>({
    id_event: null,
    nama_event: "",
    id_taman: tamanKotaOptions[0]?.id_taman || 0,
    tanggal_event: "",
    deskripsi_event: "",
  });

  useEffect(() => {
    fetchEvents();
    fetchTamanKotaOptions();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase.from("EVENT_PUBLIK").select(`
                *,
                TAMAN_KOTA ( nama_taman )
            `);
    if (!error) {
      setEventsList((data as EventPublik[]) || []);
    } else {
      console.error("Error fetching events:", error);
    }
  };

  const fetchTamanKotaOptions = async () => {
    const { data, error } = await supabase
      .from("TAMAN_KOTA")
      .select("id_taman, nama_taman");
    if (!error) {
      setTamanKotaOptions(data || []);
    }
  };

  useEffect(() => {
    if (tamanKotaOptions.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        id_taman:
          prevData.id_taman === 0
            ? tamanKotaOptions[0]?.id_taman
            : prevData.id_taman,
      }));
    }
  }, [tamanKotaOptions]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { id_event, ...rest } = formData;
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session || !session.user) return;

    if (id_event) {
      await supabase
        .from("EVENT_PUBLIK")
        .update(rest as any)
        .eq("id_event", id_event);
    } else {
      await supabase.from("EVENT_PUBLIK").insert({
        ...rest,
        admin_id: session.user.id,
        id_jenis_acara: 2,
      } as any);
    }

    fetchEvents();
    setIsFormOpen(false);
    setFormData({
      id_event: null,
      nama_event: "",
      id_taman: tamanKotaOptions[0]?.id_taman || 0,
      tanggal_event: "",
    });
  };

  const handleEdit = (data: EventPublik) => {
    setFormData({
      ...data,
      id_event: data.id_event,
      id_taman: data.id_taman,
      deskripsi_event: data.deskripsi_event || "",
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus event ini?")) {
      const { error } = await supabase
        .from("EVENT_PUBLIK")
        .delete()
        .eq("id_event", id);
      if (!error) {
        fetchEvents();
      } else {
        console.error("Error deleting event:", error);
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manajemen Event Publik</h2>
        <button
          onClick={() => {
            setFormData({
              id_event: null,
              nama_event: "",
              id_taman: tamanKotaOptions[0]?.id_taman || 0,
              tanggal_event: "",
            });
            setIsFormOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tambah Event
        </button>
      </div>
      {isFormOpen && (
        <div className="mb-6 p-6 border rounded-lg shadow-md bg-white">
          <h3 className="text-xl font-medium mb-4">
            {formData.id_event ? "Edit" : "Tambah"} Event
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <input
              type="text"
              placeholder="Nama Event"
              value={formData.nama_event}
              onChange={(e) =>
                setFormData({ ...formData, nama_event: e.target.value })
              }
              className="w-full border p-2 rounded-md"
              required
            />
            <select
              value={formData.id_taman || ""}
              onChange={(e) =>
                setFormData({ ...formData, id_taman: parseInt(e.target.value) })
              }
              className="w-full border p-2 rounded-md"
              required
            >
              <option value="">Pilih Taman</option>
              {tamanKotaOptions.map((t) => (
                <option key={t.id_taman} value={t.id_taman}>
                  {t.nama_taman}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Deskripsi Event"
              value={formData.deskripsi_event ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, deskripsi_event: e.target.value })
              }
              className="w-full border p-2 rounded-md"
            />
            <input
              type="date"
              value={formData.tanggal_event || ""}
              onChange={(e) =>
                setFormData({ ...formData, tanggal_event: e.target.value })
              }
              className="w-full border p-2 rounded-md"
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Taman
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {eventsList.map((ev) => (
              <tr key={ev.id_event}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {ev.nama_event}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ev.TAMAN_KOTA?.nama_taman || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {ev.tanggal_event}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(ev)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ev.id_event)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsManager;
