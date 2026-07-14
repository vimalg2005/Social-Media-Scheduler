import { Link } from "react-router-dom";
import { ArrowRightIcon, DotIcon } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative overflow-hidden">
            {/* Subtle grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[56px_56px] pointer-events-none" />

            {/* Red soft glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[560px] bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.12)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-12 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-2 rounded-full mb-8 shadow-sm">
                    <span className="size-1.5 bg-red-500 rounded-full animate-pulse" />
                    AI-Powered Social Media Automation
                </div>

                {/* Headline */}
                <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl xl:text-8xl text-white tracking-tight leading-none">
                    Schedule smarter.
                    <br />
                    <span className="text-gradient italic">Grow faster.</span>
                </h1>

                {/* Subheadline */}
                <p className="mt-7 text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">SocialAI lets you create, schedule, and auto-engage across all your social platforms — powered by AI that writes your captions and generates your artwork in real-time.</p>

                {/* CTAs */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/login" className="bg-red-500 text-white rounded-full font-medium hover:bg-red-600 hover:shadow-[0_8px_24px_rgba(239,68,68,0.45)] inline-flex items-center gap-2 text-[15px] px-8 py-3.5 w-full sm:w-auto justify-center transition-all hover:-translate-y-0.5">
                        Start for free <ArrowRightIcon className="size-4" />
                    </Link>
                    <a href="#how-it-works" className="bg-white/5 text-slate-200 border border-white/10 rounded-full font-medium hover:bg-white/10 hover:border-white/20 inline-flex items-center gap-2 text-[15px] px-8 py-3.5 w-full sm:w-auto backdrop-blur-md justify-center transition-all hover:-translate-y-0.5">
                        See how it works
                    </a>
                </div>

                <p className="mt-5 text-xs text-slate-500">No credit card required · Free forever plan available</p>
            </div>

            {/* Dashboard mockup */}
            <div className="relative max-w-5xl mx-auto px-5 sm:px-8 pb-0">
                <div className="rounded-t-2xl overflow-hidden border border-white/10 border-b-0 shadow-2xl shadow-red-500/5">
                    {/* Browser chrome */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-[#0d111c]/90 border-b border-white/5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                        <div className="flex-1 mx-4 rounded-md h-5 max-w-xs bg-white/5 border border-white/10" />
                    </div>

                    {/* Mock content */}
                    <div className="p-6 bg-[#07090e]/95">
                        {/* Stat row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                            {[
                                { val: "12", label: "Scheduled", color: "text-red-400" },
                                { val: "48", label: "Published", color: "text-emerald-400" },
                                { val: "4", label: "Accounts", color: "text-purple-400" },
                                { val: "3", label: "AI Rules", color: "text-blue-400" },
                            ].map((s) => (
                                <div key={s.label} className="glass-panel rounded-xl p-4 transition-all">
                                    <div className={`text-2xl font-bold ${s.color} tabular-nums`}>{s.val}</div>
                                    <div className="text-xs text-slate-400 mt-1">{s.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Activity list */}
                        <div className="glass-panel rounded-xl p-5 space-y-4">
                            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">Recent Activity</div>
                            {[
                                { text: "Post published to LinkedIn & Twitter", time: "2m ago", status: "published" },
                                { text: "AI replied to 3 comments on Instagram", time: "15m ago", status: "published" },
                                { text: "New post scheduled for tomorrow 9am", time: "1h ago", status: "pending" },
                            ].map((item) => (
                                <div key={item.text} className="flex items-center gap-3">
                                    <DotIcon className={`size-6 ${item.status === 'published' ? 'text-emerald-500' : 'text-slate-500 animate-pulse'}`} />
                                    <span className="text-sm text-slate-300 flex-1">{item.text}</span>
                                    <span className="text-xs text-slate-500 shrink-0">{item.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
