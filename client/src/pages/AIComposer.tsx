import { useEffect, useState } from "react"
import { PLATFORMS } from "../assets/assets";
import { ArrowRightIcon, CalendarIcon, ClockIcon, HistoryIcon, Loader2Icon, TimerIcon, Wand2Icon, XIcon } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";


const AIComposer = () => {

  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Professional");
  const [generateImage, setGenerateImage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [generations, setGenerations] = useState<any[]>([])
  const [generationStep, setGenerationStep] = useState("Ideating concepts...");

   // Scheduling state
   const [activeScheduler, setActiveScheduler] = useState<any>(null);
   const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
   const [scheduledDate, setScheduledDate] = useState("");
   const [scheduledTime, setScheduledTime] = useState("");
   const [scheduling, setScheduling] = useState(false);

   const fetchGenerations = async () => {
    try {
      const { data } = await api.get("api/posts/generations")
      setGenerations(data)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message);
    }
   }

   useEffect(()=>{
    fetchGenerations()
   },[])

   const handleGenerate = async ()=>{
    if(!prompt){
      toast.error("Please enter a prompt");
      return;
    }
    setLoading(true)
    
    const steps = [
      "Ideating creative concepts...",
      "Drafting post copy & hashtags...",
      "Generating AI image prompt...",
      "Synthesizing complimentary artwork...",
      "Finalizing media asset layout..."
    ];
    let stepIdx = 0;
    setGenerationStep(steps[0]);
    const stepInterval = setInterval(() => {
      if (stepIdx < steps.length - 1) {
        stepIdx++;
        setGenerationStep(steps[stepIdx]);
      }
    }, 2800);

    try {
      const { data } = await api.post("/api/posts/generate", {prompt, tone, generateImage});
      setGenerations([data, ...generations]);
      setActiveScheduler(data)
      toast.success("Content generated!")
    } catch (error: any) {
       toast.error(error?.response?.data?.message || error?.message);
    }finally{
      clearInterval(stepInterval);
      setLoading(false)
    }
   }

   const handleSchedule = async ()=>{
    if(!activeScheduler) return;
    if(selectedPlatforms.length === 0){
       toast.error("Select at least one platform");
      return;
    }
    if(!scheduledDate || !scheduledTime){
      toast.error("Select date and time");
      return;
    }
    if(selectedPlatforms.includes('instagram') && !activeScheduler.mediaUrl){
      toast.error("Instagram requires an image or video");
      return;
    }

    const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
    setScheduling(true);
    try {
      await api.post("/api/posts", {
        content: activeScheduler.content,
        mediaUrl: activeScheduler.mediaUrl,
        mediaType: activeScheduler.mediaType,
        platforms: selectedPlatforms,
        scheduledFor,
        status: "scheduled",
      })
        toast.success("AI Post scheduled!");
        setActiveScheduler(null)
        setSelectedPlatforms([]);
        setScheduledDate("");
        setScheduledTime("");
    } catch (error:any) {
      toast.error(error?.response?.data?.message || "Failed to schedule");
    }finally{
      setScheduling(false);
    }
   }

   const tones = ["Professional", "Creative", "Funny", "Minimalist", "Excited"];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 fade-in-slide">
      {/* Input Section */}
      <div className="space-y-6 text-center mt-12 relative p-8 rounded-3xl bg-slate-950/20 border border-white/5 shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-1 bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
        <h1 className="text-2.5xl font-bold text-slate-100 tracking-tight">What should we create today?</h1>
        
        <div className="relative group mt-10">
          <textarea 
          className="w-full px-6 py-6 pb-20 bg-slate-950/40 border border-white/5 rounded-2xl text-slate-100 placeholder-slate-500 outline-none focus:border-red-500/25 focus:shadow-[0_0_25px_-5px_rgba(239,68,68,0.08)] transition resize-none h-44 text-sm leading-relaxed"
          placeholder="Share your idea... (e.g. A post about the launch of our new eco-friendly coffee beans)" value={prompt} onChange={(e)=> setPrompt(e.target.value)}/>
          
          <div className="absolute bottom-4 right-4 flex items-center gap-3 text-xs">
            <button onClick={()=> setGenerateImage(!generateImage)} className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 py-2 px-3.5 rounded-xl transition-all cursor-pointer">
              <span className="text-slate-400 font-semibold">AI Image</span>
              <div className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${generateImage ? "bg-red-500" : "bg-white/10"}`}>
                <span className={`pointer-events-none size-3 transform translate-y-0.5 rounded-full bg-white transition-all ${generateImage ? "translate-x-3.5" : "translate-x-0.5"}`}/>
              </div>
            </button>

            <button onClick={handleGenerate} disabled={loading} className="bg-linear-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition shadow-lg shadow-red-500/10 hover:shadow-red-500/20 cursor-pointer">
              {loading ? (
                <>
                  <Loader2Icon className="size-4 animate-spin"/>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  Generate
                  <ArrowRightIcon className="size-4"/>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tone Picker */}
        <div className="flex flex-wrap justify-center gap-2.5 pt-2">
              {tones.map((t)=>(
                <button key={t} onClick={()=> setTone(t) } className={`px-4.5 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${tone === t ? "bg-red-500 border-red-500 text-white glow-red" : "bg-white/5 border-white/5 text-slate-400 hover:border-white/15 hover:text-slate-200"}`}>
                  {t}
                </button>
              ))}
        </div>

        {/* Loading Progress State */}
        {loading && (
          <div className="mt-8 p-4 rounded-xl bg-red-500/5 border border-red-500/10 max-w-md mx-auto flex items-center gap-4 animate-pulse">
            <Loader2Icon className="size-5 text-red-400 animate-spin shrink-0"/>
            <div className="text-left">
              <p className="text-xs font-bold text-red-400">AI Composer at Work</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{generationStep}</p>
            </div>
          </div>
        )}
      </div>

      {/* AI Generated Posts */}
      <div className="space-y-6 pt-10 border-t border-white/5">
          <div className="flex items-center justify-between text-slate-300">
            <div className="flex items-center gap-2.5">
              <HistoryIcon className="size-4.5 text-slate-400"/>
              <h2 className="text-base font-semibold tracking-wide text-slate-200">Recent Generations</h2>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5">{generations.length} total</span>
          </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generations.map((gen)=>(
                <div key={gen._id} className="group bg-slate-950/20 hover:bg-slate-950/40 rounded-2xl border border-white/5 p-5 hover:border-red-500/20 transition-all duration-300 relative overflow-hidden flex flex-col hover:shadow-xl hover:shadow-black/10">
                  <div className="flex flex-col h-full space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{new Date(gen.createdAt).toLocaleString()}</span>
                      <span className="text-[9px] text-red-400 font-bold bg-red-500/10 border border-red-500/15 px-2 py-0.5 rounded-md">{gen.tone}</span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-4 leading-relaxed flex-1 font-medium">{gen.content}</p>

                    {gen.mediaUrl && (
                      <div className="rounded-xl overflow-hidden border border-white/5 bg-slate-950/40 relative aspect-video shadow-inner">
                        <img src={gen.mediaUrl} alt="Gen" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-103"/>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                      <button 
                      onClick={()=> setActiveScheduler(gen)}
                      className="flex-1 bg-white/5 border border-white/5 hover:bg-red-500 hover:border-red-500 hover:text-white text-slate-300 text-xs font-semibold py-2.5 rounded-xl transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-red-500/15">
                        Schedule Post
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {
                generations.length === 0 && (
                  <div className="col-span-full py-20 text-center space-y-3">
                    <div className="size-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                      <Wand2Icon className="size-5" />
                    </div>
                    <p className="text-slate-400 font-semibold text-sm">No content generated yet</p>
                    <p className="text-slate-500 text-xs max-w-xs mx-auto">Try generating some content using the prompt input above.</p>
                  </div>
                )
              }
          </div>
      </div>

      {/* Scheduler Modal */}
      {activeScheduler && (
        <div className="fixed inset-0 min-h-screen z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0f131f] rounded-2xl shadow-2xl w-full max-w-2xl border border-white/5 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">

            <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-white/[0.01]">
              <h3 className="text-slate-100 font-bold text-sm tracking-wide">Schedule Generation</h3>
              <button onClick={()=>setActiveScheduler(null)} className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer">
                <XIcon className="size-5"/>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-5">
              <div className="bg-slate-950/30 rounded-2xl p-5 border border-white/5 space-y-4 shadow-inner">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Prompt</p>
                <p className="text-slate-300 text-xs leading-relaxed font-semibold">{activeScheduler.prompt}</p>
              </div>

              <div className="bg-slate-950/30 rounded-2xl p-5 border border-white/5 space-y-4 shadow-inner">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Generated Content</p>
                <p className="text-slate-300 text-xs leading-relaxed font-medium whitespace-pre-wrap">{activeScheduler.content}</p>
                {activeScheduler.mediaUrl && <img src={activeScheduler.mediaUrl} alt="preview" className="w-full aspect-video object-cover rounded-xl border border-white/10 shadow-lg"/>}
              </div>
            </div>

            <div className="p-8 bg-slate-950/40 border-t border-white/5 space-y-6">
              {/* Options */}
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3.5">Select Channels</label>
                  <div className="flex flex-wrap gap-2.5">
                    {PLATFORMS.map((p)=>{
                      const active = selectedPlatforms.includes(p.id);
                      return (
                        <button key={p.id} onClick={()=> setSelectedPlatforms((prev)=> (prev.includes(p.id) ? prev.filter((x)=>x !== p.id) : [...prev, p.id]))}
                        className={`p-3 rounded-lg border text-xs transition-all duration-200 cursor-pointer ${active ? "bg-red-500/10 border-red-500/30 text-red-400 glow-red" : "bg-white/5 border-white/5 text-slate-400 hover:border-white/15 hover:text-slate-200"}`}>
                          <p.icon className="size-4.5"/>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <CalendarIcon className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"/>
                    <input type="date" className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/5 rounded-lg text-slate-100 text-xs focus:border-white/15 outline-none transition-all [color-scheme:dark]" value={scheduledDate} onChange={(e)=>setScheduledDate(e.target.value)}/>
                  </div>
                  <div className="relative">
                    <ClockIcon className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input type="time" className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/5 rounded-lg text-slate-100 text-xs focus:border-white/15 outline-none transition-all [color-scheme:dark]" value={scheduledTime} onChange={(e)=>setScheduledTime(e.target.value)}/>
                  </div>
                </div>
              </div>
              
              <button onClick={handleSchedule} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg bg-linear-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-bold text-sm transition shadow-lg shadow-red-500/10 hover:shadow-red-500/25 cursor-pointer">
                {scheduling ? <Loader2Icon className="size-4 animate-spin"/> : <TimerIcon className="size-4"/>}
                 Schedule Post
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default AIComposer