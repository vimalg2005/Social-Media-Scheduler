import { CheckCircleIcon, ExternalLinkIcon, XIcon } from "lucide-react";
import { PLATFORMS } from "../assets/assets";


interface PlatformPickerModalProps{
    connectedIds: string[];
    connecting: string | null;
    onClose: () => void;
    onConnect: (platformId: string) => void;
}

const PlatformPickerModal = ({connectedIds, connecting, onClose, onConnect} : PlatformPickerModalProps) => {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300">
        <div className="bg-[#0f131f] rounded-2xl shadow-2xl w-full max-w-md border border-white/5 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/5 bg-white/[0.01]">
                <h3 className="text-slate-100 font-bold text-sm tracking-wide">Choose a Platform</h3>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer">
                    <XIcon className="size-4.5" />
                </button>
            </div>

            {/* Platform list */}
            <div className="p-6 flex flex-col gap-2.5 bg-slate-950/15">
                {PLATFORMS.map((p)=>{
                    const isConnected = connectedIds.includes(p.id);
                    const isConnecting = connecting === p.id;
                    return (
                        <button key={p.id}
                        disabled={isConnected || isConnecting}
                        onClick={()=>onConnect(p.id)}
                        className={`flex items-center gap-3.5 p-4 rounded-xl border text-left transition-all duration-200 ${isConnected ? "border-red-500/10 bg-red-500/5 cursor-default text-red-400" : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 text-slate-300 cursor-pointer"} ${isConnecting && "opacity-60"}`}>

                            {/* Icon */}
                            <div className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-300 shrink-0">
                                <p.icon className="size-4.5"/>
                            </div>

                            {/* Label */}
                            <div className="flex-1 min-w-0">
                                <div className={`text-xs font-bold ${isConnected ? "text-red-400" : "text-slate-200"}`}>
                                    {p.name}
                                </div>
                                <div className="text-[10px] text-slate-500 font-semibold truncate mt-0.5">
                                    {isConnected ? "Already connected" : p.description}
                                </div>
                            </div>

                            
                              {/* Status */}
                            {isConnected && <CheckCircleIcon className="size-4.5 text-red-400 shrink-0 glow-red"/>}
                            {isConnecting && <div className="size-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin shrink-0"/>}
                            {!isConnected && !isConnecting && <ExternalLinkIcon className="size-3.5 text-slate-500 shrink-0 group-hover:text-slate-200"/>}
                        </button>
                    )
                })}

            </div>

        </div>
    </div>
  )
}

export default PlatformPickerModal