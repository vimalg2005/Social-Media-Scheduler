import { useState } from 'react'
import Sidebar from './Sidebar'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { MenuIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const pageTitles: Record<string, string> = {
    "/dashboard" : "Dashboard",
    "/accounts": "Social Accounts",
    "/schedule": "Post Scheduler",
    "/ai-composer": "AI Composer",
}

const Layout = () => {

    const {isAuthenticated, isLoading} = useAuth()

    const location = useLocation()

    const title = pageTitles[location.pathname] || "SocialAI";

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    if(isLoading){
        return (
            <div className="flex h-screen items-center justify-center bg-[#07090e]">
                <div className='size-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin glow-red'/>
            </div>
        )
    }

    if(!isAuthenticated){
        return <Navigate to="/login" replace/>
    }

  return (
    <div className='flex h-screen bg-[#07090e]/40'>

        {/* Mobile Overlay */}
    {isMobileMenuOpen && <div className='fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-40 md:hidden' onClick={()=> setIsMobileMenuOpen(false)}/>}

        <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen}/>

    <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Top Bar */}
        <header className='h-16 bg-slate-950/20 backdrop-blur-md border-b border-white/5 flex items-center px-4 md:px-8 gap-4 shrink-0'>

            <button className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white transition-colors" onClick={()=>setIsMobileMenuOpen(true)}>
                <MenuIcon className="size-6"/>
            </button>
            <div>
                <h1 className="text-slate-100 text-lg font-medium">{title}</h1>
                <p className="text-xs text-slate-400 hidden sm:block">Manage and automate your social presence</p>
            </div>

        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8 xl:p-12">
            <div className="fade-in-slide h-full">
                <Outlet />
            </div>
        </main>

    </div>

    </div>
  )
}

export default Layout