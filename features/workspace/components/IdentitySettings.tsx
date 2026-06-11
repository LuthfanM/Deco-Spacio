"use client";

import { useState } from "react";
import { Check, Copy, Key, Sparkles } from "lucide-react";

type UserSession = {
  user_id: string;
  recovery_key: string;
};

type IdentitySettingsProps = {
  session: UserSession | null;
};

export default function IdentitySettings({ session }: IdentitySettingsProps) {
  const [copied, setCopied] = useState(false);

  return (
    <div
      className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-800 shadow-sm"
      id="identity-panel"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-indigo-600">
          <Sparkles className="h-4 w-4 animate-pulse text-indigo-600" />
          Personal Workspace
        </h3>
        {session && (
          <span className="font-mono text-xs text-slate-400">
            ID: {session.user_id.substring(0, 10)}...
          </span>
        )}
      </div>

      {session ? (
        <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Your Recovery Key
            </p>
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 shrink-0 text-indigo-600" />
              <span className="font-mono text-base font-bold tracking-wider text-slate-900">
                {session.recovery_key}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 active:bg-slate-100 sm:w-auto"
            id="copy-key-btn"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-green-600" />
                <span className="text-green-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Key</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <p className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-500">
          No workspace session loaded.
        </p>
      )}
    </div>
  );
}
