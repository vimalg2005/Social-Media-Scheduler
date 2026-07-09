import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import { CheckIcon, CreditCardIcon, Loader2Icon, ShieldCheckIcon, SparklesIcon, XIcon } from "lucide-react";

const Billing = () => {
  const { user, updateUser } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");

  const handleUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.length < 16 || expiry.length < 5 || cvc.length < 3) {
      toast.error("Please enter valid card details");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.put("/api/auth/upgrade");
      // Update local storage and auth context with updated user tier
      const updatedUser = { ...user, tier: data.tier } as any;
      updateUser(updatedUser);
      
      toast.success("Successfully upgraded to PREMIUM!");
      setShowCheckout(false);
      // Reset form
      setCardNumber("");
      setExpiry("");
      setCvc("");
      setCardName("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to upgrade");
    } finally {
      setLoading(false);
    }
  };

  const handleDowngrade = async () => {
    const confirm = window.confirm("Are you sure you want to downgrade to the Free plan?");
    if (!confirm) return;

    try {
      const { data } = await api.put("/api/auth/downgrade");
      const updatedUser = { ...user, tier: data.tier } as any;
      updateUser(updatedUser);
      toast.success("Downgraded to FREE plan successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to downgrade");
    }
  };

  const freeFeatures = [
    "Connect up to 2 social accounts",
    "Schedule up to 10 posts per month",
    "Basic AI text content generator",
    "Community email support",
  ];

  const premiumFeatures = [
    "Connect unlimited social accounts (Facebook, LinkedIn, Instagram)",
    "Unlimited scheduled post queuing",
    "Free Pollinations.ai image generator fallback",
    "Advanced step-by-step AI composer visualizer",
    "Zernio API execution prioritizer",
    "24/7 dedicated engineer support",
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 fade-in-slide mt-6">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-slate-950/20 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500/20 via-pink-500/20 to-transparent" />
        <div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Plans & Subscription</h2>
          <p className="text-slate-400 text-xs mt-1">Upgrade your tier to bypass platform limits and connect Facebook & premium channels.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Current Account Tier</span>
          <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${user?.tier === "premium" ? "bg-red-500/20 border-red-500/30 text-red-400 glow-red" : "bg-white/5 border-white/10 text-slate-300"}`}>
            {user?.tier === "premium" ? "PREMIUM PRO" : "FREE DEVELOPER"}
          </span>
        </div>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        {/* Free Plan */}
        <div className="glass-panel rounded-3xl border border-white/5 p-8 flex flex-col justify-between relative overflow-hidden shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Free Tier</h3>
                <p className="text-slate-500 text-xs mt-1">For social media experimenting</p>
              </div>
            </div>

            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-extrabold text-white">$0</span>
              <span className="text-slate-400 text-xs">/ month</span>
            </div>

            <div className="space-y-4 border-t border-white/5 pt-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">What's included</p>
              {freeFeatures.map((f, i) => (
                <div key={i} className="flex items-start gap-3 text-xs text-slate-300 font-medium">
                  <CheckIcon className="size-4 text-slate-500 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/5">
            {user?.tier === "premium" ? (
              <button onClick={handleDowngrade} className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold rounded-xl border border-white/10 transition-colors duration-200 cursor-pointer">
                Downgrade to Free
              </button>
            ) : (
              <button disabled className="w-full py-3 bg-white/5 text-slate-400 text-xs font-semibold rounded-xl border border-white/5">
                Active Free Plan
              </button>
            )}
          </div>
        </div>

        {/* Premium Plan */}
        <div className="glass-panel rounded-3xl border border-red-500/10 p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-red-500/5 group">
          {/* Neon Accent */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full filter blur-2xl group-hover:bg-red-500/15 transition-all" />
          
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-100">Premium Pro</h3>
                  <span className="text-[8px] bg-red-500/20 text-red-400 font-extrabold px-1.5 py-0.5 rounded border border-red-500/35 glow-red uppercase tracking-wider flex items-center gap-0.5">
                    <SparklesIcon className="size-2" /> Recommended
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-1">Unlock all channels & scheduling workflows</p>
              </div>
            </div>

            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-extrabold text-white text-gradient">$29</span>
              <span className="text-slate-400 text-xs">/ month</span>
            </div>

            <div className="space-y-4 border-t border-white/5 pt-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">What's included</p>
              {premiumFeatures.map((f, i) => (
                <div key={i} className="flex items-start gap-3 text-xs text-slate-300 font-medium">
                  <CheckIcon className="size-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/5">
            {user?.tier === "premium" ? (
              <button disabled className="w-full py-3 bg-red-500/10 text-red-400 text-xs font-semibold rounded-xl border border-red-500/20 glow-red">
                Active Premium Plan
              </button>
            ) : (
              <button onClick={() => setShowCheckout(true)} className="w-full py-3.5 bg-linear-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-red-500/10 hover:shadow-red-500/25 cursor-pointer">
                Upgrade to Premium
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 min-h-screen z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0f131f] rounded-2xl shadow-2xl w-full max-w-md border border-white/5 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/5 bg-white/[0.01]">
              <h3 className="text-slate-100 font-bold text-sm tracking-wide flex items-center gap-2">
                <CreditCardIcon className="size-4 text-slate-400" /> Secure Checkout
              </h3>
              <button onClick={() => setShowCheckout(false)} className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer">
                <XIcon className="size-5" />
              </button>
            </div>

            <form onSubmit={handleUpgrade} className="p-6 space-y-5">
              <div className="bg-slate-950/40 rounded-xl p-4 border border-white/5 flex items-center justify-between shadow-inner">
                <span className="text-slate-400 text-xs font-medium">Premium Pro Subscription</span>
                <span className="text-slate-200 font-bold text-sm">$29.00/mo</span>
              </div>

              {/* Card Name */}
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Cardholder Name</label>
                <input type="text" required placeholder="John Doe" className="w-full px-4 py-2.5 bg-white/5 border border-white/5 rounded-lg text-slate-100 text-xs focus:border-white/15 outline-none transition-all" value={cardName} onChange={(e) => setCardName(e.target.value)} />
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Card Number</label>
                <input type="text" maxLength={16} required placeholder="4111 2222 3333 4444" className="w-full px-4 py-2.5 bg-white/5 border border-white/5 rounded-lg text-slate-100 text-xs focus:border-white/15 outline-none transition-all" value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))} />
              </div>

              {/* Expiry & CVC */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Expiry Date</label>
                  <input type="text" maxLength={5} required placeholder="MM/YY" className="w-full px-4 py-2.5 bg-white/5 border border-white/5 rounded-lg text-slate-100 text-xs focus:border-white/15 outline-none transition-all" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">CVC / CVV</label>
                  <input type="text" maxLength={3} required placeholder="123" className="w-full px-4 py-2.5 bg-white/5 border border-white/5 rounded-lg text-slate-100 text-xs focus:border-white/15 outline-none transition-all" value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))} />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 text-[10px] text-slate-500 font-semibold">
                <ShieldCheckIcon className="size-4 text-emerald-500" />
                <span>Your payment credentials are encrypted and stored securely.</span>
              </div>

              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 bg-linear-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-bold text-xs rounded-lg shadow-lg shadow-red-500/10 hover:shadow-red-500/25 cursor-pointer mt-4">
                {loading ? <Loader2Icon className="size-4 animate-spin" /> : null}
                Pay & Subscribe ($29.00)
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
