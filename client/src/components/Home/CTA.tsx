import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";

export default function CTA() {
    return (
        <section className="py-20 bg-transparent">
            <div className="max-w-6xl mx-auto px-5 sm:px-8">
                <div
                    className="relative rounded-3xl overflow-hidden p-14 sm:p-20 text-center glass-panel"
                    style={{
                        background: "linear-gradient(145deg, rgba(13, 17, 28, 0.6) 0%, rgba(7, 9, 14, 0.4) 100%)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                    }}
                >
                    {/* Glow blobs */}
                    <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)" }} />
                    <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)" }} />

                    <div className="relative">
                        <div className="mb-6 inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/15 text-red-500 text-[11px] font-medium tracking-[0.06em] uppercase px-3.5 py-1.5 rounded-full">Ready to grow?</div>
                        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-tight font-medium text-white">
                            Automate your social
                            <br />
                            <span className="text-gradient italic">media today</span>
                        </h2>
                        <p className="mt-6 text-slate-400 max-w-lg mx-auto text-sm sm:text-lg">Join thousands of creators and marketers who trust SocialAI to grow their audience on autopilot.</p>

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/login" className="bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 hover:shadow-[0_8px_24px_rgba(239,68,68,0.45)] inline-flex items-center gap-2 text-[15px] px-10 py-4 w-full sm:w-auto justify-center transition-all duration-200 hover:-translate-y-0.5">
                                Get Started Free <ArrowRightIcon className="size-4" />
                            </Link>
                            <a href="#pricing" className="bg-white/5 text-slate-200 border border-white/10 rounded-full font-medium hover:bg-white/10 hover:border-white/20 inline-flex items-center gap-2 text-[15px] px-10 py-4 w-full sm:w-auto justify-center transition-all duration-200 hover:-translate-y-0.5">
                                View Pricing
                            </a>
                        </div>

                        <p className="mt-6 text-xs text-slate-500">No credit card required · Cancel anytime</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
