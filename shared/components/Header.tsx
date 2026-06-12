import { Sparkles, Cpu } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white py-5 px-[5%] shrink-0 shadow-sm">
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white p-2 rounded-xl font-bold flex items-center justify-center shadow-md shadow-indigo-150">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight uppercase leading-tight">
                Deco Spacio <span className="text-indigo-600">AI</span>
              </h1>
              <p className="text-xs text-slate-500">
                Generate interior design concepts from simple prompts
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full text-xs font-mono text-slate-500 select-none shadow-sm">
          <span className="flex items-center gap-1.5 font-semibold">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" /> Pollinations Engine
          </span>
          <span className="h-4 w-px bg-slate-250"></span>
          <span className="flex items-center gap-1.5 font-semibold">
            <span
              className={`w-2 h-2 rounded-full animate-pulse 
                bg-green-500
              `}
            ></span>
            Online
          </span>
        </div>
      </div>
    </header>
  );
}
