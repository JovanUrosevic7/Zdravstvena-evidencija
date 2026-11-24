import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { HeartPulse } from "lucide-react"



function Register() {

    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState("")

    const { signup } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        if (password !== confirmPassword) {
            return toast.error("Lozinke se ne podudaraju!");
        }

        if (password.length < 6) {
            return toast.error("Lozinka mora imati najmanje 6 karaktera.");
        }

        try {
            setLoading(true)
            await signup(email, password, fullName)
            toast.success("Uspešno ste kreirali nalog!")
            navigate("/")
        } catch (error) {
            console.error(error);
            if (error.code === "auth/email-already-in-use") {
                toast.error("Ovaj email je već registrovan.");
            } else {
                toast.error("Greška prilikom registracije. Pokušajte ponovo.");
            }
        } finally {
            setLoading(false);
        }
    }

    const REGISTER_HERO_IMAGE =
        "https://images.apollo247.in/pd-cms/cms/2025-10/AdobeStock_1579202742.webp";

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50">
            {/* Leva strana: šira hero fotografija (7 od 12 kolona na desktopu) */}
            <div className="relative hidden lg:block lg:col-span-7">
                <img
                    src={REGISTER_HERO_IMAGE}
                    alt="Medicinski tim koristi digitalni tablet i ekran za analizu zdravstvenih podataka"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/25 to-teal-950/35" />

                <div className="relative h-full flex flex-col justify-between p-12 text-white">
                    <div className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight">
                        <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shadow-sm">
                            <HeartPulse className="w-6 h-6 text-white" />
                        </div>
                        <span>Moj Zdravstveni Karton</span>
                    </div>

                    <div className="max-w-lg space-y-3">
                        <h2 className="text-3xl font-bold leading-tight">
                            Započnite digitalno praćenje vašeg zdravlja.
                        </h2>
                        <p className="text-slate-200 text-sm leading-relaxed">
                            Otvorite besplatan nalog za par sekundi i organizujte preglede, vakcine, terapiju i ključne zdravstvene parametre.
                        </p>
                    </div>
                </div>
            </div>

            {/* Desna strana: forma za registraciju sa zelenim (teal) okvirom */}
            <div className="lg:col-span-5 flex items-center justify-center px-6 py-10 bg-slate-50">
                <div className="max-w-md w-full bg-white rounded-2xl border-2 border-teal-200 shadow-sm p-8 space-y-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-600 mb-1">
                            <HeartPulse className="w-7 h-7" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Kreirajte nalog</h1>
                        <p className="text-sm text-slate-500">
                            Započnite sigurno vođenje vaših zdravstvenih evidencija
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Ime i prezime
                            </label>
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Petar Petrović"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Email adresa
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ime@primer.com"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Lozinka
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Minimum 6 karaktera"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Potvrdite lozinku
                            </label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Ponovite lozinku"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
                        >
                            {loading ? "Kreiranje naloga..." : "Registruj se"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-600">
                        Već imate nalog?{" "}
                        <Link to="/login" className="text-teal-600 font-semibold hover:underline">
                            Prijavite se
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register