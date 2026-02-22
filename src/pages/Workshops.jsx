import "./Workshops.css";
import { useEffect, useState } from "react";
import axios from "../api/axios";

function formatDate(s) {
  try {
    return new Date(s).toLocaleString();
  } catch {
    return s;
  }
}

export default function Workshops() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openWorkshop, setOpenWorkshop] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [createForm, setCreateForm] = useState({
    workshop_name: "",
    workshop_date: "", // ISO string gönderilecek
    time_slots: []
  });

  const [slotForm, setSlotForm] = useState({
    faciliator_id: "",
    slot_start: "",
    slot_end: ""
  });

  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/workshops"); // GetAllWorkshops
      const w = Array.isArray(res.data)
        ? res.data
        : res.data.workshops || res.data;
      setWorkshops(w);
    } catch {
      alert("Workshoplar alınamadı");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const toggleOpen = (id) =>
    setOpenWorkshop(openWorkshop === id ? null : id);

  const handleDeleteWorkshop = async (w) => {
    if (!window.confirm(`"${w.workshop_name}" silinecek. Devam?`)) return;
    await axios.delete(`/admin/workshop/${w.workshop_id}`); // ✔ doğru route
    fetchWorkshops();
  };

  const handleDelay = async (w) => {
    const val = prompt("Dakika (+ ileri / - geri)", "10");
    if (val === null) return;
    const minutes = parseInt(val);
    if (isNaN(minutes)) return alert("Geçerli sayı gir");

    await axios.put(`/admin/workshop/${w.workshop_id}/delay`, {
      delay_minutes: minutes
    });

    fetchWorkshops();
  };

  const addSlot = async (id) => {
    if (!slotForm.faciliator_id || !slotForm.slot_start || !slotForm.slot_end)
      return alert("Slot alanları boş");

    await axios.post(`/admin/workshops/${id}/slots`, {
      time_slots: [
        {
          faciliator_id: Number(slotForm.faciliator_id), // ❗ backend ile birebir
          slot_start: new Date(slotForm.slot_start).toISOString(),
          slot_end: new Date(slotForm.slot_end).toISOString()
        }
      ]
    });

    setSlotForm({ faciliator_id: "", slot_start: "", slot_end: "" });
    fetchWorkshops();
  };

  const deleteSlot = async (id) => {
    if (!window.confirm("Slot silinsin mi?")) return;
    await axios.delete(`/admin/slots/${id}`);
    fetchWorkshops();
  };

  const updateSlotPartial = async (id, data) => {
    await axios.put(`/admin/slots/${id}`, data);
    fetchWorkshops();
  };

  const submitCreateWorkshop = async () => {
    if (!createForm.workshop_name || !createForm.workshop_date)
      return alert("Ad ve tarih zorunlu");

    await axios.post("/admin/workshops/create", {
      ...createForm,
      workshop_date: new Date(createForm.workshop_date).toISOString(),
      time_slots: createForm.time_slots.map((s) => ({
        faciliator_id: Number(s.faciliator_id),
        slot_start: new Date(s.slot_start).toISOString(),
        slot_end: new Date(s.slot_end).toISOString()
      }))
    });

    setShowCreateModal(false);
    fetchWorkshops();
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Workshops</h1>
          <p className="text-sm text-gray-500">Workshop ve slot yönetimi</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            + Yeni Workshop
          </button>
          <button
            onClick={fetchWorkshops}
            className="bg-gray-200 px-4 py-2 rounded-lg"
          >
            Yenile
          </button>
        </div>
      </div>

      {loading && <div>Yükleniyor...</div>}

      {/* WORKSHOPS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workshops.map((w) => (
          <div
            key={w.workshop_id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="p-4 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">{w.workshop_name}</h3>
                <p className="text-sm text-gray-500">
                  {formatDate(w.workshop_date)}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => toggleOpen(w.workshop_id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Slotlar
                </button>
                <button
                  onClick={() => handleDelay(w)}
                  className="bg-yellow-500 px-3 py-1 rounded"
                >
                  Delay
                </button>
                <button
                  onClick={() => handleDeleteWorkshop(w)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Sil
                </button>
              </div>
            </div>

            {openWorkshop === w.workshop_id && (
              <div className="border-t p-4 space-y-3">
                {(w.time_slots || []).map((s) => (
                  <div
                    key={s.slot_id}
                    className="border rounded-lg p-3 flex justify-between"
                  >
                    <div>
                      <div className="font-medium">
                        {s.faciliator?.name || "—"}
                      </div>
                      <div className="text-xs text-gray-600">
                        {formatDate(s.slot_start)} → {formatDate(s.slot_end)}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const id = prompt("Facilitator ID", s.faciliator_id);
                          if (id)
                            updateSlotPartial(s.slot_id, {
                              faciliator_id: Number(id)
                            });
                        }}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Fac
                      </button>
                      <button
                        onClick={() => deleteSlot(s.slot_id)}
                        className="bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                ))}

                {/* ADD SLOT */}
                <div className="border-t pt-3">
                  <h4 className="font-semibold mb-2">Yeni Slot</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                      placeholder="Facilitator ID"
                      value={slotForm.faciliator_id}
                      onChange={(e) =>
                        setSlotForm({
                          ...slotForm,
                          faciliator_id: e.target.value
                        })
                      }
                      className="p-2 border rounded"
                    />
                    <input
                      type="datetime-local"
                      placeholder="Start"
                      value={slotForm.slot_start}
                      onChange={(e) =>
                        setSlotForm({ ...slotForm, slot_start: e.target.value })
                      }
                      className="p-2 border rounded"
                    />
                    <input
                      type="datetime-local"
                      placeholder="End"
                      value={slotForm.slot_end}
                      onChange={(e) =>
                        setSlotForm({ ...slotForm, slot_end: e.target.value })
                      }
                      className="p-2 border rounded"
                    />
                  </div>
                  <button
                    onClick={() => addSlot(w.workshop_id)}
                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Slot Ekle
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-xl p-6">
            <h3 className="text-xl font-bold mb-4">Yeni Workshop</h3>

            <input
              placeholder="Workshop adı"
              className="w-full p-2 border rounded mb-3"
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  workshop_name: e.target.value
                })
              }
            />
            <input
              type="datetime-local"
              placeholder="Workshop tarihi"
              className="w-full p-2 border rounded mb-4"
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  workshop_date: e.target.value
                })
              }
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                İptal
              </button>
              <button
                onClick={submitCreateWorkshop}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Oluştur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}