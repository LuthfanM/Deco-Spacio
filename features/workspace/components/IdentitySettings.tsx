import React, { useState } from "react";
import { Key, Copy, Check, RefreshCw, LogIn, Sparkles } from "lucide-react";
import { UserSession } from "@/types/commons";

interface IdentitySettingsProps {
  session: UserSession | null;
  onRestore: (recoveryKey: string) => Promise<boolean>;
  onResetSession: () => void;
  statusMessage: string | null;
  setStatusMessage: (msg: string | null) => void;
}

export default function IdentitySettings({
  session,
  onRestore,
  onResetSession,
  statusMessage,
  setStatusMessage
}: IdentitySettingsProps) {
  const [copied, setCopied] = useState(false);
  const [typedKey, setTypedKey] = useState("");
  const [restoring, setRestoring] = useState(false);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  const handleCopy = () => {
    if (!session) return;
    navigator.clipboard.writeText(session.recovery_key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRestoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedKey.trim()) return;

    setRestoring(true);
    setErrorLocal(null);
    setStatusMessage(null);

    try {
      const success = await onRestore(typedKey.trim());
      if (success) {
        setStatusMessage("Gallery successfully restored!");
        setTypedKey("");
      } else {
        setErrorLocal("Recovery key invalid or not found.");
      }
    } catch {
      setErrorLocal("An error occurred. Please verify your connection.");
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 text-slate-800" id="identity-panel">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold tracking-wide uppercase text-indigo-600 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" /> Personal Workspace
        </h3>
        <span className="text-xs text-slate-400 font-mono">ID: {session?.user_id?.substring(0, 15)}...</span>
      </div>

      <div className="space-y-4">
        {/* Recovery Key Card */}
        {session && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Your Recovery Key</p>
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="text-base font-mono font-bold tracking-wider text-slate-900">
                  {session.recovery_key}
                </span>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="w-full sm:w-auto px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              id="copy-key-btn"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Key</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Restore Gallery Form */}
        <form onSubmit={handleRestoreSubmit} className="space-y-2 border-t border-slate-100 pt-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Restore Existing Gallery
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="e.g. ROOM-8F3K-92LM"
              value={typedKey}
              onChange={(e) => setTypedKey(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              id="restore-key-input"
            />
            <button
              type="submit"
              disabled={restoring}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-400 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              id="restore-key-submit"
            >
              {restoring ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LogIn className="w-3.5 h-3.5" />
              )}
              <span>Restore</span>
            </button>
          </div>
        </form>

        {/* Status / Error Alerts */}
        {errorLocal && (
          <p className="text-xs text-red-700 font-medium bg-red-50 border border-red-150 rounded-lg p-2.5">
            {errorLocal}
          </p>
        )}
        {statusMessage && (
          <p className="text-xs text-green-700 font-medium bg-green-50 border border-green-150 rounded-lg p-2.5">
            {statusMessage}
          </p>
        )}

        <div className="text-center pt-1">
          <button
            onClick={onResetSession}
            type="button"
            className="text-[10px] text-slate-400 hover:text-indigo-600 hover:underline underline-offset-2 transition-colors cursor-pointer"
            id="reset-workspace-btn"
          >
            Clear and Start New Session
          </button>
        </div>
      </div>
    </div>
  );
}
