import "./Sponsors.css";
import { useEffect, useState } from "react";
import axios from "../api/axios";

const emptyForm = {
  sponsor_name: "",
  sponsor_tier: "",
  logo: "",
  advertise_video: "",
  website: ""
};

export default function Sponsors() {
  const [list, setList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState(emptyForm);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/sponsors");
      setList(res.data?.data || res.data || []);
    } catch {
      setError("Sponsorlar alınamadı");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openNewModal = () => {
    setEditItem(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setForm({ ...item });
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu sponsor silinecek, emin misiniz?")) return;
    try {
      await axios.delete(`/admin/sponsor/${id}`, {
        withCredentials: true
      });
      fetchData();
    } catch {
      setError("Sponsor silinemedi");
    }
  };

  const handleSave = async () => {
    if (!form.sponsor_name || !form.sponsor_tier || !form.logo) {
      setError("Sponsor adı, seviye ve logo zorunludur");
      return;
    }

    try {
      if (editItem) {
        await axios.put(
          `/admin/sponsor/${editItem.sponsor_id}`,
          form,
          { withCredentials: true }
        );
      } else {
        await axios.post(
          "/admin/create/sponsor",
          form,
          { withCredentials: true }
        );
      }

      closeModal();
      fetchData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Kayıt sırasında hata oluştu"
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Sponsors</h1>
          <p className="text-sm text-gray-500 mt-1">
            Sponsorları ve reklam içeriklerini yönetin
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow"
        >
          + Yeni Sponsor
        </button>
      </div>

      {loading && <div className="text-gray-500">Yükleniyor...</div>}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {list.map((s) => (
          <div key={s.sponsor_id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="flex items-center gap-4 p-4">
              <img
                src={s.logo}
                alt={s.sponsor_name}
                className="w-20 h-20 object-contain bg-gray-100 rounded-lg"
                onError={(e) => (e.target.src = "/placeholder-logo.png")}
              />

              <div className="flex-1">
                <h2 className="font-bold">{s.sponsor_name}</h2>
                <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                  {s.sponsor_tier}
                </span>
                {s.website && (
                  <a
                    href={s.website}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-xs text-blue-600 mt-2"
                  >
                    Website →
                  </a>
                )}
              </div>
            </div>

            {s.advertise_video && (
              <video controls className="w-full h-40 object-cover px-4 pb-4">
                <source src={s.advertise_video} type="video/mp4" />
              </video>
            )}

            <div className="flex gap-2 px-4 pb-4">
              <button
                onClick={() => openEditModal(s)}
                className="flex-1 bg-yellow-500 text-white py-2 rounded-md"
              >
                Düzenle
              </button>
              <button
                onClick={() => handleDelete(s.sponsor_id)}
                className="flex-1 bg-red-600 text-white py-2 rounded-md"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl">
            {/* modal içeriği seninkiyle aynı */}
          </div>
        </div>
      )}
    </div>
  );
}