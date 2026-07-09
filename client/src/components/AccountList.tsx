import { AlertCircleIcon, CheckCircleIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { PLATFORMS } from "../assets/assets";

interface AccountListProps {
    accounts: any[];
    onDisconnect: (accountId: string)=> Promise<void>
}

const AccountList = ({accounts, onDisconnect}: AccountListProps ) => {

    const handleDisconnect = async (accountId: string) => {
        const confirm = window.confirm("Are you sure you want to disconnect this account?");
        if(!confirm) return;
        await onDisconnect(accountId)
    }

    if(accounts.length === 0){
        return (
            <div className="glass-panel border border-dashed border-white/5 flex flex-col items-center justify-center py-20 px-6 rounded-3xl">
                <div className="size-14 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/10 shadow-lg shadow-black/10">
                    <PlusIcon className="size-6 text-slate-400 opacity-60"/>
                </div>
                <p className="text-slate-300 font-semibold text-sm">No accounts connected</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs text-center font-medium">Connect your first social platform to start scheduling and automating your content.</p>
            </div>
        )
    }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {accounts.map((account, index)=>{
            const meta = PLATFORMS.find((p)=> p.id === account.platform);
            if(!meta) return null;

            return (
                <div key={index} className="glass-panel rounded-2xl p-5 flex items-center gap-4 border border-white/5 hover:border-white/10 hover:shadow-lg hover:shadow-black/10 transition-all duration-200">

                    <div className="size-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shrink-0 text-slate-300">
                        <meta.icon className="size-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="text-slate-200 font-bold text-sm truncate">{account.handle}</div>
                        <div className="text-[10px] text-slate-500 font-semibold mt-0.5 tracking-wide uppercase">{meta.name}</div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                        {account.status === 'connected' ? (
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 px-2.5 py-0.5 rounded-full font-bold">
                                Connected
                            </span>
                        ): (
                            <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/15 px-2.5 py-0.5 rounded-full font-bold">
                                Disconnected
                            </span>
                        )}

                    </div>

                    <button 
                    onClick={()=> handleDisconnect(account._id)}
                    title="Disconnect account"
                    className="ml-2 p-2 bg-red-500/10 hover:bg-red-500 border border-red-500/10 hover:border-red-500 text-red-400 hover:text-white rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow-red-500/15">
                        <Trash2Icon className="size-4"/>
                    </button>

                </div>
            )
        })}
    </div>
  )
}

export default AccountList