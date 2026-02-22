import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function Facilitators() {
  const [list, setList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const emptyForm = {
    name: "",
    title: "",
    topic: "",
    topic_details: "",
    photograph: ""
  };

  const [form, setForm] = useState(emptyForm);

  const fetchData = async () => {
    const res = await axios.get("/faciliator");
    setList(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openNewModal = () => {
    setEditItem(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setForm({ ...item }); // clone
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const deleteItem = async (id) => {
    await axios.delete(`/admin/faciliator/${id}`, {
      withCredentials: true
    });
    fetchData();
  };

  const saveItem = async () => {
    if (editItem) {
      await axios.put(
        `/admin/faciliator/${editItem.faciliator_id}`,
        form,
        { withCredentials: true }
      );
    } else {
      await axios.post(
        "/admin/create/faciliator",
        form,
        { withCredentials: true }
      );
    }

    closeModal();
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Facilitators</h1>
          <p className="text-sm text-gray-500 mt-1">
            Konuşmacı ve atölye yöneticilerini buradan yönet
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md transition"
        >
          + Yeni Facilitator
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {list.map((f) => (
          <div
            key={f.faciliator_id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
          >
            <div className="h-44 bg-gray-100">
              <img
                src={f.photograph}
                alt={f.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-800">{f.name}</h2>
              <p className="text-sm text-gray-500">{f.title}</p>

              <p className="text-sm mt-2 text-gray-700 line-clamp-2">
                <strong>Topic:</strong> {f.topic}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => openEditModal(f)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-md"
                >
                  Düzenle
                </button>

                <button
                  onClick={() => deleteItem(f.faciliator_id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-bold">
                {editItem ? "Facilitator Düzenle" : "Yeni Facilitator"}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <input
                placeholder="Ad Soyad"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
              <input
                placeholder="Unvan"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
              <input
                placeholder="Konu"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
              <textarea
                placeholder="Konu Detayları"
                value={form.topic_details}
                onChange={(e) =>
                  setForm({ ...form, topic_details: e.target.value })
                }
                className="w-full p-3 border rounded-lg"
              />
              <input
                placeholder="Fotoğraf Yolu (/public/faciliators/xxx.png)"
                value={form.photograph}
                onChange={(e) =>
                  setForm({ ...form, photograph: e.target.value })
                }
                className="w-full p-3 border rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded">
                Vazgeç
              </button>
              <button onClick={saveItem} className="px-4 py-2 bg-blue-600 text-white rounded">
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}