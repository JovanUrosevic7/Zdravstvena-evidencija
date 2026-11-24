import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { deleteHealthRecord, getUserRecords, updateHealthRecord } from "../services/recordService";
import { toast } from "react-toastify";
import { Calendar, Clock, Pencil, Pill, Plus, Search, Stethoscope, Syringe, Trash2, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";


function Records() {

    const { currentUser } = useAuth();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation()
    const [activeFilter, setActiveFilter] = useState(location.state?.category ||  "all"); // "all" | "pregled" | "vakcina" | "lek"
    const [searchTerm, setSearchTerm] = useState("");
    const [editingRecord, setEditingRecord] = useState(null);

    useEffect(() => {
        async function loadRecords() {
            try {
                const data = await getUserRecords(currentUser.uid);
                setRecords(data);
            } catch (error) {
                console.error(error);
                toast.error("Greška pri učitavanju evidencija.");
            } finally {
                setLoading(false);
            }
        }

        if (currentUser) loadRecords();
    }, [currentUser]);

    useEffect(() => {
        if(location.state?.category){
            setActiveFilter(location.state.category)
        }
    }, [location.state?.category])

    async function handleDelete(id) {
        if (!window.confirm("Da li ste sigurni da želite da obrišete ovu evidenciju?")) return;

        try {
            await deleteHealthRecord(id);
            setRecords((prev) => prev.filter((item) => item.id !== id));
            toast.success("Evidencija je obrisana.");
        } catch (error) {
            console.error(error);
            toast.error("Greška pri brisanju.");
        }
    }

    const filteredRecords = records.filter((rec) => {
        const matchesCategory = activeFilter === "all" || rec.category === activeFilter;
        const matchesSearch =
            rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (rec.notes && rec.notes.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const categoryConfig = {
        pregled: {
            label: "Pregled",
            icon: Stethoscope,
            badge: "bg-sky-50 text-sky-700 border-sky-200",
        },
        vakcina: {
            label: "Vakcina",
            icon: Syringe,
            badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        },
        lek: {
            label: "Lek",
            icon: Pill,
            badge: "bg-amber-50 text-amber-700 border-amber-200",
        },
    };


    async function handleSaveEdit(e) {

        e.preventDefault()
        if (!editingRecord) return

        try {

            const { id, userId, createdAt, ...rest } = editingRecord
            const payload = {
                ...rest,
                title: rest.title.trim(),
                notes: (rest.notes || "").trim()
            }

            await updateHealthRecord(id, payload)

            setRecords((prev) =>
                prev
                    .map((item) => (item.id === id ? { ...item, ...payload } : item))
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
            )

            setEditingRecord(null)
            toast.success("Evidencija je uspešno izmenjena.");
        } catch (error) {
            console.error(error);
            toast.error("Greška pri izmeni evidencije.");
        }

    }

    
    


    return (
        <div className="space-y-6">
            {/* Zaglavlje */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Zdravstvene evidencije</h1>
                    <p className="text-sm text-slate-500">
                        Pregled svih vaših lekarskih pregleda, vakcinacija i terapija
                    </p>
                </div>
                <Link
                    to="/records/new"
                    className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors"
                >
                    <Plus className="w-5 h-5" /> Dodaj evidenciju
                </Link>
            </div>

            {/* Filteri i pretraga */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: "all", label: "Sve" },
                        { id: "pregled", label: "Pregledi" },
                        { id: "vakcina", label: "Vakcine" },
                        { id: "lek", label: "Lekovi" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveFilter(tab.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${activeFilter === tab.id
                                ? "bg-teal-600 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Pretraži po nazivu ili napomeni..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>
            </div>

            {/* Lista evidencija */}
            {loading ? (
                <div className="text-center py-12 text-slate-500">Učitavanje kartona...</div>
            ) : filteredRecords.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
                    <p className="text-slate-500">Nema pronađenih evidencija za izabrani filter.</p>
                    <Link
                        to="/records/new"
                        className="inline-block text-teal-600 font-semibold hover:underline"
                    >
                        + Unesite prvu evidenciju
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredRecords.map((record) => {
                        const config = categoryConfig[record.category] || categoryConfig.pregled;
                        const Icon = config.icon;

                        return (
                            <div
                                key={record.id}
                                className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between gap-4 hover:shadow-sm transition-shadow"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.badge}`}
                                        >
                                            <Icon className="w-3.5 h-3.5" />
                                            {config.label}
                                        </span>

                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => setEditingRecord({ ...record })}
                                                title="Izmeni"
                                                className="text-slate-400 hover:text-teal-600 p-1 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDelete(record.id)}
                                                title="Obriši"
                                                className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{record.title}</h3>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>Datum: {record.date}</span>
                                        </div>
                                    </div>

                                    {/* Specifični detalji po tipu */}
                                    {record.category === "pregled" && (
                                        <div className="text-sm text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl">
                                            {record.doctorName && <p><strong>Lekar:</strong> {record.doctorName}</p>}
                                            {record.clinic && <p><strong>Ustanova:</strong> {record.clinic}</p>}
                                            {record.nextCheckupDate && (
                                                <p className="text-teal-700 font-medium">
                                                    Sledeća kontrola: {record.nextCheckupDate}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {record.category === "vakcina" && (
                                        <div className="text-sm text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl">
                                            <p><strong>Doza:</strong> {record.doseNumber}</p>
                                            {record.nextDoseDate && (
                                                <p className="text-emerald-700 font-medium">
                                                    Sledeća doza: {record.nextDoseDate}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {record.category === "lek" && (
                                        <div className="text-sm text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl">
                                            {record.dosage && <p><strong>Doza:</strong> {record.dosage}</p>}
                                            {record.frequency && <p><strong>Uzimanje:</strong> {record.frequency}</p>}
                                            {record.reminderTime && (
                                                <p className="inline-flex items-center gap-1 text-amber-700 font-medium">
                                                    <Clock className="w-3.5 h-3.5" /> Podsetnik u {record.reminderTime}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {record.notes && (
                                        <p className="text-sm text-slate-600 italic border-l-2 border-slate-200 pl-3">
                                            {record.notes}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {editingRecord && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-xl">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900">Izmena evidencije</h2>
                            <button
                                type="button"
                                onClick={() => setEditingRecord(null)}
                                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Naziv *</label>
                                <input
                                    type="text"
                                    required
                                    value={editingRecord.title || ""}
                                    onChange={(e) => setEditingRecord({ ...editingRecord, title: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Datum *</label>
                                <input
                                    type="date"
                                    required
                                    value={editingRecord.date || ""}
                                    onChange={(e) => setEditingRecord({ ...editingRecord, date: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            {editingRecord.category === "pregled" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Lekar</label>
                                        <input
                                            type="text"
                                            value={editingRecord.doctorName || ""}
                                            onChange={(e) => setEditingRecord({ ...editingRecord, doctorName: e.target.value })}
                                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Ustanova</label>
                                        <input
                                            type="text"
                                            value={editingRecord.clinic || ""}
                                            onChange={(e) => setEditingRecord({ ...editingRecord, clinic: e.target.value })}
                                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Sledeća kontrola</label>
                                        <input
                                            type="date"
                                            value={editingRecord.nextCheckupDate || ""}
                                            onChange={(e) =>
                                                setEditingRecord({ ...editingRecord, nextCheckupDate: e.target.value })
                                            }
                                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                                        />
                                    </div>
                                </div>
                            )}

                            {editingRecord.category === "vakcina" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Doza</label>
                                        <input
                                            type="text"
                                            value={editingRecord.doseNumber || ""}
                                            onChange={(e) => setEditingRecord({ ...editingRecord, doseNumber: e.target.value })}
                                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Sledeća doza</label>
                                        <input
                                            type="date"
                                            value={editingRecord.nextDoseDate || ""}
                                            onChange={(e) => setEditingRecord({ ...editingRecord, nextDoseDate: e.target.value })}
                                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                                        />
                                    </div>
                                </div>
                            )}

                            {editingRecord.category === "lek" && (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Doza</label>
                                        <input
                                            type="text"
                                            value={editingRecord.dosage || ""}
                                            onChange={(e) => setEditingRecord({ ...editingRecord, dosage: e.target.value })}
                                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Uzimanje</label>
                                        <input
                                            type="text"
                                            value={editingRecord.frequency || ""}
                                            onChange={(e) => setEditingRecord({ ...editingRecord, frequency: e.target.value })}
                                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Podsetnik</label>
                                        <input
                                            type="time"
                                            value={editingRecord.reminderTime || ""}
                                            onChange={(e) => setEditingRecord({ ...editingRecord, reminderTime: e.target.value })}
                                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Napomena</label>
                                <textarea
                                    rows={2}
                                    value={editingRecord.notes || ""}
                                    onChange={(e) => setEditingRecord({ ...editingRecord, notes: e.target.value })}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingRecord(null)}
                                    className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer"
                                >
                                    Otkaži
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 cursor-pointer"
                                >
                                    Sačuvaj izmene
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>


    )
}

export default Records