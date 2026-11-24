import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { HeartPulse } from "lucide-react"

function Login() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState("")

    const { login } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        try {

            setLoading(true)

            await login(email, password)
            toast.success("Dobrodošli nazad!");
            navigate("/");

        } catch (error) {
            console.error(error);
            toast.error("Pogrešan email ili lozinka.");
        } finally {
            setLoading(false);
        }
    }


    const LOGIN_HERO_IMAGE =
        "https://images.apollo247.in/pd-cms/cms/2025-10/AdobeStock_1579202742.webp";

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50">
            {/* Leva strana: šira hero fotografija (7 od 12 kolona na desktopu) */}
            <div className="relative hidden lg:block lg:col-span-7">
                <img
                    src={LOGIN_HERO_IMAGE}
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
                            Svi vaši pregledi, terapije i rezultati na jednom mestu.
                        </h2>
                        <p className="text-slate-200 text-sm leading-relaxed">
                            Pratite krvni pritisak, zakažite podsetnike za lekove i imajte uvid u kompletnu istoriju zdravlja u svakom trenutku.
                        </p>
                    </div>
                </div>
            </div>

            {/* Desna strana: forma za prijavu sa zelenim (teal) okvirom */}
            <div className="lg:col-span-5 flex items-center justify-center px-6 py-12 bg-slate-50">
                <div className="max-w-md w-full bg-white rounded-2xl border-2 border-teal-200 shadow-sm p-8 space-y-7">
                    <div className="space-y-2">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-600 mb-1">
                            <HeartPulse className="w-7 h-7" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Dobrodošli nazad</h1>
                        <p className="text-sm text-slate-500">
                            Unesite vaše podatke za pristup zdravstvenim evidencijama
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Email adresa
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ime@primer.com"
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Lozinka
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
                        >
                            {loading ? "Prijavljivanje..." : "Prijavi se"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-600">
                        Nemate otvoren nalog?{" "}
                        <Link to="/register" className="text-teal-600 font-semibold hover:underline">
                            Registrujte se
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login