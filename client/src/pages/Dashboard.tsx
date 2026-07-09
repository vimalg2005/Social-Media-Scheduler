import { ActivityIcon, CheckCircleIcon, ClockIcon, SendIcon, Share2Icon, TrendingUpIcon, XIcon } from "lucide-react"
import { useEffect, useState } from "react"
import api from "../api/axios"



const Dashboard = () => {

  const [stats, setStats] = useState({scheduled: 0, published: 0, connectedAccounts: 0})
  const [activities, setActivities] = useState<any[]>([])

  useEffect(()=>{
    const fetchDashboardData = async () => {
      try {
        const [postsRes, accountsRes, activityRes] = await Promise.all([api.get("/api/posts"), api.get("/api/accounts"), api.get("/api/activity")])

        const posts = postsRes.data;
        setStats({
          scheduled: posts.filter((p: any) => p.status === 'scheduled').length,
          published: posts.filter((p: any) => p.status === 'published').length,
          connectedAccounts: accountsRes.data.filter((a: any) => a.status === 'connected').length,
        })
        setActivities(activityRes.data)
      } catch (error: any) {
        console.error("Error fetching dashboard data", error)
      }
    };
    fetchDashboardData();
  },[])

  const statCards = [
    {
      label: "Scheduled Posts",
      value: stats.scheduled,
      icon: ClockIcon,
      color: "from-red-500 to-rose-500",
      glow: "glow-red",
      borderColor: "border-red-500/10",
      textColor: "text-red-400",
      bgColor: "bg-red-500/5",
    },
    {
      label: "Published Posts",
      value: stats.published,
      icon: CheckCircleIcon,
      color: "from-emerald-500 to-teal-500",
      glow: "glow-emerald",
      borderColor: "border-emerald-500/10",
      textColor: "text-emerald-400",
      bgColor: "bg-emerald-500/5",
    },
    {
      label: "Connected Accounts",
      value: stats.connectedAccounts,
      icon: Share2Icon,
      color: "from-purple-500 to-indigo-500",
      glow: "glow-purple",
      borderColor: "border-purple-500/10",
      textColor: "text-purple-400",
      bgColor: "bg-purple-500/5",
    },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Good morning! 👋</h2>
          <p className="text-slate-400 text-xs mt-1">Here's what's happening with your social accounts today.</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card)=>(
          <div key={card.label} className={`glass-panel glass-panel-hover relative overflow-hidden rounded-2xl p-6 border ${card.borderColor} group`}>
            {/* Ambient Background Glow */}
            <div className={`absolute -right-10 -bottom-10 size-32 rounded-full filter blur-3xl opacity-10 group-hover:opacity-20 transition-opacity bg-linear-to-br ${card.color}`} />
            
            <div className="flex items-center justify-between mb-4">
              <div className="size-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-slate-300 group-hover:text-white transition-colors duration-200">
                <card.icon className="size-5" />
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wider ${card.textColor} ${card.bgColor} px-2 py-0.5 rounded-full border border-current/15`}>
                Active
              </span>
            </div>
            
            <div className="space-y-1">
              <div className="text-3.5xl font-bold text-white tracking-tight select-all tabular-nums">{card.value}</div>
              <p className="text-xs text-slate-400 font-medium">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden shadow-xl shadow-black/20">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/[0.02]">
            <h2 className="text-slate-100 font-semibold text-sm tracking-wide">Recent Activity</h2>
            <span className="text-[10px] text-slate-400 font-bold bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5">{activities.length} events</span>
        </div>

        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="size-14 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/10 shadow-lg shadow-black/10">
              <ActivityIcon className="size-6 text-slate-400"/>
            </div>
            <p className="text-slate-300 font-semibold text-sm">No activity yet</p>
            <p className="text-slate-500 text-xs mt-1 text-center max-w-xs">Connect accounts and schedule posts to see events here.</p>
          </div>
        ) : (
          <div className="px-6 py-6 space-y-6 relative before:absolute before:left-10.5 before:top-8 before:bottom-8 before:w-0.5 before:bg-white/5">
            {activities.map((activity)=>{
              const isFailed = activity.actionType === "POST_FAILED";
              return (
                <div key={activity._id} className="flex items-start gap-5 relative group transition-all duration-200">
                  {/* Timeline point */}
                  <div className={`size-9 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 z-10 ${isFailed ? "bg-red-500/10 border-red-500/30 text-red-400 glow-red" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 glow-emerald"}`}>
                    {isFailed ? <XIcon className="size-4" /> : <SendIcon className="size-4" />}
                  </div>
                  <div className="flex-1 min-w-0 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 rounded-xl p-4 transition-all duration-200">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${isFailed ? "bg-red-500/10 border-red-500/25 text-red-400" : "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"}`}>
                        {isFailed ? "Failed" : "Published"}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">{new Date(activity.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">{activity.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  )
}

export default Dashboard