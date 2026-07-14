import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
    const { user } = useAuth();

    return (
        <nav className="sticky top-0 z-50 bg-[#0d111c]/60 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <Link to="/" onClick={() => scrollTo(0, 0)} className="flex items-center gap-2">
                    <img src="/logo.svg" alt="logo" className="size-7" />
                    <span className="text-xl lg:text-2xl font-semibold font-sans text-white tracking-tight">SocialAI</span>
                </Link>
                <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
                    <a href="#features" className="hover:text-white transition-colors duration-150">
                        Features
                    </a>
                    <a href="#how-it-works" className="hover:text-white transition-colors duration-150">
                        How it works
                    </a>
                    <a href="#pricing" className="hover:text-white transition-colors duration-150">
                        Pricing
                    </a>
                </div>

                {user ? (
                    <Link to="/dashboard" className="flex items-center gap-1.5 text-sm font-medium bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-full shadow-lg shadow-red-500/20 transition-all hover:-translate-y-0.5">
                        Go to Dashboard <ArrowRightIcon className="size-3.5" />
                    </Link>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm text-slate-300 hover:text-white transition-colors duration-150 hidden sm:block">
                            Sign In
                        </Link>
                        <Link to="/login" className="flex items-center gap-1.5 text-sm bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-full shadow-lg shadow-red-500/20 transition-all hover:-translate-y-0.5">
                            Get Started <ArrowRightIcon className="size-3.5" />
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
