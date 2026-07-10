import { useEffect, useState } from "react"
import { PLATFORMS } from "../assets/assets";
import { ArrowRightIcon, CalendarIcon, ClockIcon, XIcon } from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";


const Scheduler = () => {

  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'scheduled' | 'published' | 'failed'>('scheduled');

  const fetchPosts = async () => {
    try {
      const {data} = await api.get("/api/posts")
      setPosts(data)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
  }

  useEffect(()=>{
    (async ()=> await fetchPosts())();
    const interval = setInterval(async ()=> await fetchPosts(), 10000);
    return ()=> clearInterval(interval)
  },[])

  const scheduled = posts.filter((p)=> p.status === "scheduled")
  const published = posts.filter((p)=> p.status === "published")
  const failed = posts.filter((p)=> p.status === "failed")

  const togglePlatform = (id: string)=> setSelectedPlatforms((prev)=> (prev.includes(id) ? prev.filter((p)=> p !== id) : [...prev, id])) 

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    if(selectedPlatforms.length === 0){
      toast.error("Select at least one platform");
      return;
    }
    if(!scheduledDate || !scheduledTime){
      toast.error("Select date and time");
      return;
    }
    if(selectedPlatforms.includes('instagram') && !mediaFile){
      toast.error("Instagram requires an image or video");
      return;
    }

    const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
    const formData = new FormData();
    formData.append("content", content);
    formData.append("scheduledFor", scheduledFor);
    formData.append("status", "scheduled");
    formData.append("platforms", JSON.stringify(selectedPlatforms));
    if(mediaFile) formData.append("media", mediaFile);

    setLoading(true)
    try {
      await api.post("/api/posts", formData, {headers: {"Content-Type": "multipart/form-data"}})
      toast.success("Post scheduled!");
      setContent("");
      setScheduledDate("");
      setScheduledTime("");
      setSelectedPlatforms([]);
      setMediaFile(null);
      fetchPosts();
    } catch (error:any) {
      toast.error(error?.response?.data?.message || error.message);
    }finally{
      setLoading(false);
    }
  }

  const getActiveList = () => {
    switch(activeTab) {
      case 'scheduled': return scheduled;
      case 'published': return published;
      case 'failed': return failed;
    }
  }

  const activeList = getActiveList();

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto items-start">
      {/* ── Compose panel ── */}
      <div className="w-full lg:w-[460px] shrink-0">
        <div className="glass-panel rounded-2xl border border-white/5 p-6 shadow-xl shadow-black/25">
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-base font-semibold text-slate-100 tracking-wide">Compose Post</h2>
            </div>

            <form className="space-y-5" onSubmit={handleSchedule}>
              {/* Platforms */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Platforms</label>
                <div className="flex flex-wrap gap-2.5">
                  {PLATFORMS.map((p)=>{
                    const active = selectedPlatforms.includes(p.id);
                    return (
                      <button key={p.id} type="button" onClick={()=> togglePlatform(p.id)}
                      className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 cursor-pointer ${active ? "bg-red-500/10 border-red-500/30 text-red-400 glow-red scale-103" : "bg-white/5 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200"}`}>
                        <p.icon className="size-4.5" />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Content</label>
                <textarea required rows={5} placeholder="What do you want to share today?" className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-slate-100 text-sm placeholder-slate-500 focus:border-white/15 outline-none resize-none transition-all" value={content} onChange={(e)=>setContent(e.target.value)}/>
                  <div className={`text-right text-[10px] mt-1 font-semibold tracking-wider ${content.length > 270 ? "text-red-400" : "text-slate-500"}`}>
                    {content.length}/280
                  </div>
              </div>

              {/* Media upload */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Media (optional)</label>
                {mediaFile ? (
                  <div className="relative rounded-xl overflow-hidden border border-white/10 bg-white/5">
                    {mediaFile.type.startsWith("image/") 
                    ? 
                    <img src={URL.createObjectURL(mediaFile)} alt="preview" className="w-full h-40 object-cover"/> 
                    : 
                    <video src={URL.createObjectURL(mediaFile)} className="w-full h-40 object-cover" controls/>}

                    <button type="button" onClick={()=> setMediaFile(null)} className="absolute top-2 right-2 size-7 bg-slate-950/70 hover:bg-slate-950/90 text-white rounded-full flex items-center justify-center transition-colors">
                      <XIcon className="size-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 p-5 py-8 border border-dashed border-white/5 hover:border-red-500/25 bg-white/5 rounded-xl cursor-pointer hover:bg-red-500/5 transition-all group">
                    <span className="text-xs text-slate-400 group-hover:text-red-400 transition-colors duration-200">Click to upload image or video</span>
                    <input type="file" accept="image/*,video/*" className="hidden" onChange={(e)=>e.target.files?.[0] && setMediaFile(e.target.files[0])}/>
                  </label>
                )}
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Date</label>
                  <div className="relative">
                    <CalendarIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"/>
                    <input type="date" required className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/5 rounded-lg text-slate-100 text-xs focus:border-white/15 outline-none transition-all [color-scheme:dark]" value={scheduledDate} onChange={(e)=>setScheduledDate(e.target.value)}/>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Time</label>
                  <div className="relative">
                    <ClockIcon className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"/>

                    <input type="time" required className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/5 rounded-lg text-slate-100 text-xs focus:border-white/15 outline-none transition-all [color-scheme:dark]" value={scheduledTime} onChange={(e)=>setScheduledTime(e.target.value)}/>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3.5 bg-linear-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 transition-all text-white font-medium text-sm rounded-lg shadow-lg shadow-red-500/20 hover:shadow-red-500/30">
                {loading ? (
                  <>
                    <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Scheduling…
                  </>
                ) : (
                  <>
                    Schedule Post
                    <ArrowRightIcon className="size-4"/>
                  </>
                )}
              </button>
            </form>
        </div>
      </div>

      {/* ── Queue panel ── */}
      <div className="flex-1 min-w-0 w-full">
        <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden shadow-xl shadow-black/25">
          {/* Header & Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-white/5 bg-white/[0.01]">
            <h3 className="text-slate-100 font-semibold text-sm tracking-wide">Post Queue</h3>
            
            {/* Tabs Selector */}
            <div className="flex bg-slate-950/45 p-1 rounded-xl border border-white/5 max-w-sm">
              <button onClick={() => setActiveTab('scheduled')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${activeTab === 'scheduled' ? 'bg-red-500 text-white glow-red' : 'text-slate-400 hover:text-slate-200'}`}>
                Upcoming
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${activeTab === 'scheduled' ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400'}`}>{scheduled.length}</span>
              </button>
              <button onClick={() => setActiveTab('published')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${activeTab === 'published' ? 'bg-emerald-500 text-white glow-emerald' : 'text-slate-400 hover:text-slate-200'}`}>
                Published
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${activeTab === 'published' ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400'}`}>{published.length}</span>
              </button>
              <button onClick={() => setActiveTab('failed')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${activeTab === 'failed' ? 'bg-rose-600 text-white glow-red' : 'text-slate-400 hover:text-slate-200'}`}>
                Failed
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${activeTab === 'failed' ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400'}`}>{failed.length}</span>
              </button>
            </div>
          </div>

          {/* Queue Content */}
          <div className="max-h-[500px] overflow-y-auto divide-y divide-white/5 p-2 bg-slate-950/10">
            {activeList.length === 0 ? (
              <div className="py-20 text-center text-slate-500 text-sm font-medium">
                {activeTab === 'scheduled' && "No upcoming scheduled posts"}
                {activeTab === 'published' && "No published posts yet"}
                {activeTab === 'failed' && "No failed posts yet"}
              </div>
            ) : (
              activeList.map((post)=>(
                <div key={post._id} className="p-4.5 hover:bg-white/[0.02] border border-transparent hover:border-white/5 hover:shadow-lg rounded-xl transition-all duration-200 my-1">
                  <div className="flex items-center justify-between mb-3">
                      <div className="flex gap-2 items-center">
                        {post.platforms.map((pl: string)=>{
                          const meta = PLATFORMS.find((p)=> p.id === pl);
                          return meta ? (
                            <div key={pl} className="size-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                              <meta.icon className="size-3.5" />
                            </div>
                          ) : null
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        {post.mediaType && (
                          <span className="text-[10px] bg-white/5 text-slate-300 border border-white/5 px-2 py-0.5 rounded-md font-bold capitalize">
                            {post.mediaType}
                          </span>
                        )}

                        <span className="text-[10px] text-slate-400 font-semibold">{new Date(post.scheduledFor).toLocaleString()}</span>
                        
                        {post.status === 'published' && (
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                            Published
                          </span>
                        )}
                        {post.status === 'failed' && (
                          <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-bold">
                            Failed
                          </span>
                        )}
                      </div>
                  </div>
                  
                  <div className="flex gap-4">
                    {post.mediaUrl && (
                      <div className="size-16 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-white/5">
                        <img src={post.mediaUrl} alt="media" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <p className="text-xs text-slate-300 leading-relaxed font-medium line-clamp-3">{post.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Scheduler