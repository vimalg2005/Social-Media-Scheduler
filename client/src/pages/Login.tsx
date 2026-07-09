import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MailIcon, LockIcon, ArrowRightIcon, User2Icon, Wand2Icon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Login() {
    const [loginState, setLoginState] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {login, user} = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
       try {
            const { data } = await api.post(`/api/auth/${loginState ? "login" : "register"}`, { name, email, password })

            login(data, data.token)
            navigate("/dashboard")
       } catch (error: any) {
            toast.error(error.response?.data?.message || error?.message)
       }finally{
        setLoading(false)
       }
    };

    useEffect(()=>{
        if(user) navigate('/dashboard')
    },[user])

    return (
        <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute -left-20 -top-20 size-80 rounded-full bg-red-500/5 filter blur-3xl" />
            <div className="absolute -right-20 -bottom-20 size-80 rounded-full bg-violet-500/5 filter blur-3xl" />

            <div className="relative w-full max-w-md fade-in-slide">
                <div className="glass-panel rounded-3xl shadow-2xl shadow-black/45 p-8 border border-white/5">
                    
                    {/* Header */}
                    <div className="flex flex-col items-center mb-8 text-center">
                        <Link to="/" className="flex items-center gap-2 mb-2 group">
                            <div className="size-8 rounded-lg bg-linear-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg shadow-red-500/25">
                                <Wand2Icon className="size-4.5 text-white animate-pulse" />
                            </div>
                            <span className="text-gradient font-bold text-2.5xl tracking-tight">SocialAI</span>
                        </Link>
                        <p className="text-slate-400 text-xs font-medium mt-1">
                            {loginState ? "Sign in to your Dashboard" : "Create a new developer profile"}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5 text-xs font-medium">
                        {!loginState && (
                            <div>
                                <label className="block mb-2 text-slate-300 font-semibold uppercase tracking-wider text-[10px]">Name</label>
                                <div className="relative">
                                    <User2Icon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input type="text" required placeholder="Enter your name" className="w-full pl-10 pr-4 py-3 bg-slate-950/40 border border-white/5 rounded-xl text-white placeholder-slate-600 focus:border-red-500/25 focus:shadow-[0_0_20px_rgba(239,68,68,0.05)] outline-none transition-all" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="block mb-2 text-slate-300 font-semibold uppercase tracking-wider text-[10px]">Email Address</label>
                            <div className="relative">
                                <MailIcon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input type="email" required placeholder="you@company.com" className="w-full pl-10 pr-4 py-3 bg-slate-950/40 border border-white/5 rounded-xl text-white placeholder-slate-600 focus:border-red-500/25 focus:shadow-[0_0_20px_rgba(239,68,68,0.05)] outline-none transition-all" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label className="block mb-2 text-slate-300 font-semibold uppercase tracking-wider text-[10px]">Password</label>
                            <div className="relative">
                                <LockIcon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input type="password" required placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-slate-950/40 border border-white/5 rounded-xl text-white placeholder-slate-600 focus:border-red-500/25 focus:shadow-[0_0_20px_rgba(239,68,68,0.05)] outline-none transition-all" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-3.5 px-4 bg-linear-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-red-500/15 hover:shadow-red-500/25 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer mt-6">
                            {loading ? (
                                "Signing in..."
                            ) : (
                                <>
                                    {loginState ? "Sign In" : "Sign Up"} <ArrowRightIcon className="size-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center text-xs text-slate-400 font-semibold">
                        {loginState ? (
                            <>
                                Don't have an account?{" "}
                                <button onClick={() => setLoginState(false)} className="text-red-400 hover:text-red-300 transition-colors font-bold cursor-pointer">
                                    Create one free
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <button onClick={() => setLoginState(true)} className="text-red-400 hover:text-red-300 transition-colors font-bold cursor-pointer">
                                    Sign In
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
