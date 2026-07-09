import { CalendarDaysIcon, LayoutDashboardIcon, LogOutIcon, UsersIcon, Wand2Icon, CreditCardIcon } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = ({isOpen, setIsOpen} : {isOpen: boolean, setIsOpen: (val: boolean) => void}) => {

    const {logout, user} = useAuth()

    const location = useLocation()

    const navItems = [
        {name: "Dashboard", icon: LayoutDashboardIcon, path: "/dashboard"},
        { name: "Accounts", icon: UsersIcon, path: "/accounts" },
        { name: "Scheduler", icon: CalendarDaysIcon, path: "/schedule" },
        { name: "AI Composer", icon: Wand2Icon, path: "/ai-composer" },
        { name: "Billing", icon: CreditCardIcon, path: "/billing" },
    ]

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0d111c]/80 backdrop-blur-xl border-r border-white/5 flex flex-col h-full transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>

     {/* Logo */}
     <div className="p-6 pb-4">
        <div className='text-lg font-bold tracking-tight text-white flex items-center gap-2'>
            <div className="size-7 rounded-lg bg-linear-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg shadow-red-500/20">
                <Wand2Icon className="size-4.5 text-white animate-pulse" />
            </div>
            <span className="text-gradient">SocialAI</span>
        </div>
     </div>

      {/* Nav section label */}
      <div className='px-6 py-2'>
        <span className='text-[10px] text-slate-500 uppercase tracking-widest font-semibold'>Menu</span>
      </div>

       {/* Nav links */}
       <nav className='flex-1 px-3 space-y-1.5'>
            {navItems.map((item)=>{
                const isActive = location.pathname === item.path;

                return (
                    <NavLink key={item.name}
                    to={item.path}
                    end={item.path === "/dashboard"}
                    onClick={()=>setIsOpen(false)} 
                    
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${isActive ? "bg-red-500/10 text-red-400 border-red-500/20 active-nav-glow shadow-inner" : "text-slate-400 hover:bg-white/5 border-transparent hover:text-slate-200"}`}>

                        <item.icon className={`size-4.5 shrink-0 ${isActive ? "text-red-400 glow-red" : "text-slate-400"}`} />
                        {item.name}
                        {isActive && <span className='ml-auto size-1.5 rounded-full bg-red-400 shadow-lg shadow-red-500/80 animate-ping'/>}
                    </NavLink>
                )
            })}
       </nav>

       {/* User footer */}
       <div className="p-4 border-t border-white/5 bg-slate-950/20">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors duration-200 border border-transparent hover:border-white/5">
            <div className='size-8.5 rounded-full bg-linear-to-br from-red-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-lg shadow-red-500/15'>
                {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-1.5 min-w-0'>
                    <div className='text-xs font-semibold text-slate-200 truncate'>{user?.name}</div>
                    {user?.tier === 'premium' && (
                        <span className="text-[8px] bg-red-500/20 text-red-400 font-bold px-1.5 py-0.2 rounded-md border border-red-500/25 shrink-0 glow-red">
                            PRO
                        </span>
                    )}
                </div>
                <div className='text-[10px] text-slate-500 truncate'>{user?.email}</div>
            </div>
        </div>

        <button onClick={logout} className="mt-2 flex items-center justify-center gap-2 px-3 py-2 w-full rounded-lg text-xs font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/15 transition-all duration-200">
           <LogOutIcon className="size-3.5" />
           Sign Out
        </button>

       </div>

    </div>
  )
}

export default Sidebar