// --- File: components/dashboard/TamanKotaManager.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase";
import { Database } from "../../types/supabase";

type TamanKota = Database["public"]["Tables"]["TAMAN_KOTA"]["Row"] & {
  fotoUrls?: string[]; // tambahkan properti opsional fotoUrls
};
type TamanKotaForm = Omit<TamanKota, "id_taman"> & {
  id: number | null;
  fotoFiles: (File | null)[];
  fotoUrls: string[];
};

const TamanKotaManager = () => {
  const [tamanKotaList, setTamanKotaList] = useState<TamanKota[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<TamanKotaForm>({
    id: null,
    nama_taman: "",
    deskripsi: "",
    status_ketersediaan: "Tersedia",
    tingkat_aksesibilitas: "",
    keterangan_status: null,
    fotoFiles: [null],
    fotoUrls: [""],
  });

  useEffect(() => {
    fetchTamanKota();
  }, []);

  const fetchTamanKota = async () => {
    const { data: tamanData, error: tamanError } = await supabase
      .from("TAMAN_KOTA")
      .select("*");

    if (tamanError) {
      console.error("Error fetching taman kota:", tamanError);
      return;
    }

    // Jika ada taman yang ditemukan
    if (tamanData && tamanData.length > 0) {
      // Ambil semua id taman
      const tamanIds = tamanData.map((t) => t.id_taman);

      // Fetch foto dari FOTO_TAMAN yang id_tamannya ada di tamanIds
      const { data: fotoData, error: fotoError } = await supabase
        .from("FOTO_TAMAN")
        .select("id_taman, url_foto")
        .in("id_taman", tamanIds);

      if (fotoError) {
        console.error("Error fetching foto taman:", fotoError);
        return;
      }

      // Gabungkan foto ke taman berdasarkan id_taman
      const tamanWithFotos = tamanData.map((t) => {
        const fotos = fotoData
          ? fotoData
              .filter((f) => f.id_taman === t.id_taman)
              .map((f) => f.url_foto)
          : [];

        return {
          ...t,
          fotoUrls: fotos,
        };
      });

      setTamanKotaList(tamanWithFotos);
    } else {
      setTamanKotaList([]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { id, fotoFiles, fotoUrls, ...rest } = formData;

    let newTamanKotaId = id;

    if (id) {
      const { error: updateError } = await supabase
        .from("TAMAN_KOTA")
        .update(rest)
        .eq("id_taman", id);

      if (updateError) {
        console.error("Error updating taman kota:", updateError);
        return;
      }
    } else {
      const { data: newTamanKota, error: tamanKotaError } = await supabase
        .from("TAMAN_KOTA")
        .insert(rest as any)
        .select()
        .single();

      if (tamanKotaError || !newTamanKota) {
        console.error("Error inserting taman kota:", tamanKotaError);
        return;
      }

      newTamanKotaId = newTamanKota.id_taman;
      console.log("Taman kota baru berhasil dibuat dengan ID:", newTamanKotaId);
    }

    // Upload files and collect URLs
    const uploadedUrls: string[] = [];
    for (let i = 0; i < formData.fotoFiles.length; i++) {
      const file = formData.fotoFiles[i];
      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `taman_${newTamanKotaId}_${Date.now()}_${i}.${fileExt}`;
        const filePath = `taman_kota/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("taman-kota-foto")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Upload gagal untuk file:", file.name, uploadError);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from("taman-kota-foto")
          .getPublicUrl(filePath);

        console.log(`Public URL untuk file ${file.name}:`, urlData?.publicUrl);

        if (urlData?.publicUrl) {
          uploadedUrls.push(urlData.publicUrl);
        }
      }
    }

    console.log("Uploaded URLs:", uploadedUrls);
    console.log("New Taman Kota ID:", newTamanKotaId);

    // Insert FOTO_TAMAN records
    if (uploadedUrls.length > 0 && newTamanKotaId) {
      const fotoData = uploadedUrls.map((url) => ({
        id_taman: newTamanKotaId,
        url_foto: url,
      }));

      console.log("Data yang akan dikirim ke tabel FOTO_TAMAN:", fotoData);

      const { error: fotoInsertError } = await supabase
        .from("FOTO_TAMAN")
        .insert(fotoData);

      if (fotoInsertError) {
        console.error("Gagal insert ke FOTO_TAMAN:", fotoInsertError.message);
      } else {
        console.log("Insert FOTO_TAMAN berhasil!");
      }
    } else {
      console.warn("Tidak ada foto yang diupload atau ID taman tidak valid.");
    }

    fetchTamanKota();
    setIsFormOpen(false);
    setFormData({
      id: null,
      nama_taman: "",
      deskripsi: "",
      status_ketersediaan: "Tersedia",
      tingkat_aksesibilitas: "",
      keterangan_status: null,
      fotoFiles: [null],
      fotoUrls: [""],
    });
  };

  const handleEdit = (data: TamanKota) => {
    setFormData({
      ...data,
      id: data.id_taman,
      fotoFiles: new Array(data.fotoUrls?.length || 1).fill(null),
      fotoUrls: data.fotoUrls || [],
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus taman kota ini?")) {
      const { error } = await supabase
        .from("TAMAN_KOTA")
        .delete()
        .eq("id_taman", id);
      if (!error) {
        fetchTamanKota();
      } else {
        console.error("Error deleting taman kota:", error);
      }
    }
  };

  const handlePhotoChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Unique filename, e.g. using Date.now()
    const fileExt = file.name.split(".").pop();
    const fileName = `taman_${Date.now()}_${index}.${fileExt}`;
    const filePath = `taman_kota/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("taman-kota-foto") // your storage bucket name
      .upload(filePath, file);

    if (error) {
      alert("Upload gagal: " + error.message);
      return;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("taman-kota-foto")
      .getPublicUrl(filePath);

    if (urlData?.publicUrl) {
      const newUrls = [...formData.fotoUrls];
      newUrls[index] = urlData.publicUrl;
      setFormData({ ...formData, fotoUrls: newUrls });
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manajemen Taman Kota</h2>
        <button
          onClick={() => {
            setFormData({
              id: null,
              nama_taman: "",
              deskripsi: "",
              status_ketersediaan: "Tersedia",
              tingkat_aksesibilitas: "",
              keterangan_status: null,
              fotoFiles: [null],
              fotoUrls: [""],
            });
            setIsFormOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tambah Taman Kota
        </button>
      </div>
      {isFormOpen && (
        <div className="mb-6 p-6 border rounded-lg shadow-md bg-white">
          <h3 className="text-xl text-gray-700 font-medium mb-4">
            {formData.id ? "Edit" : "Tambah"} Taman Kota
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <input
              type="text"
              placeholder="Nama Taman"
              value={formData.nama_taman}
              onChange={(e) =>
                setFormData({ ...formData, nama_taman: e.target.value })
              }
              className="w-full text-gray-700 border p-2 rounded-md"
              required
            />
            <textarea
              placeholder="Deskripsi"
              value={formData.deskripsi as string}
              onChange={(e) =>
                setFormData({ ...formData, deskripsi: e.target.value })
              }
              className="w-full text-gray-700 border p-2 rounded-md"
              required
            />

            <label className="block text-gray-700">Status Ketersediaan</label>
            <select
              value={formData.status_ketersediaan}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status_ketersediaan: e.target.value as
                    | "Tersedia"
                    | "Tutup Sementara",
                })
              }
              className="w-full text-gray-700 border p-2 rounded-md"
            >
              <option value="Tersedia">Tersedia</option>
              <option value="Tutup Sementara">Tutup Sementara</option>
            </select>

            <label className="block text-gray-700">Tingkat Aksesibilitas</label>
            <select
              value={formData.tingkat_aksesibilitas as string}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tingkat_aksesibilitas: e.target.value as
                    | "Tinggi"
                    | "Sedang"
                    | "Rendah",
                })
              }
              className="w-full text-gray-700 border p-2 rounded-md"
            >
              <option value="Tinggi">Tinggi</option>
              <option value="Sedang">Sedang</option>
              <option value="Rendah">Rendah</option>
            </select>
            {/* <input
              type="text"
              placeholder="Tingkat Aksesibilitas"
              value={formData.tingkat_aksesibilitas as string}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tingkat_aksesibilitas: e.target.value,
                })
              }
              className="w-full text-gray-700 border p-2 rounded-md"
              required
            /> */}
            {formData.status_ketersediaan === "Tutup Sementara" && (
              <textarea
                placeholder="Keterangan Status"
                value={formData.keterangan_status as string}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    keterangan_status: e.target.value,
                  })
                }
                className="w-full text-gray-700 border p-2 rounded-md"
              />
            )}
            <div className="space-y-2">
              <label className="block text-gray-700">URL Foto</label>

              {formData.fotoUrls.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-2">
                  {formData.fotoUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Foto ${index + 1}`}
                      className="h-16 w-16 object-cover rounded border"
                    />
                  ))}
                </div>
              )}

              {formData.fotoUrls.map((_, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      const newFiles = [...formData.fotoFiles];
                      newFiles[index] = file;
                      setFormData({ ...formData, fotoFiles: newFiles });
                    }}
                    className="w-full text-gray-700 border p-2 rounded-md"
                  />
                </div>
              ))}
            </div>
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
                Nama Taman
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Foto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tamanKotaList.map((t) => (
              <tr key={t.id_taman}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {t.nama_taman}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      t.status_ketersediaan === "Tersedia"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {t.status_ketersediaan}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    {t.fotoUrls && t.fotoUrls.length > 0 ? (
                      t.fotoUrls.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`Foto taman ${t.nama_taman} #${idx + 1}`}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ))
                    ) : (
                      <span className="text-gray-400 italic">
                        Tidak ada foto
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(t)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t.id_taman)}
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

export default TamanKotaManager;
