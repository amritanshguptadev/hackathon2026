import React from 'react';
import { MessageSquare, ShieldCheck, Zap } from 'lucide-react';

export default function EmptyChatState() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-white/60 backdrop-blur-sm">
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--cm-blue-soft)] text-[var(--cm-blue)] shadow-inner">
          <MessageSquare size={38} className="stroke-[1.75]" />
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--cm-blue)] text-white shadow-md">
          <Zap size={16} />
        </div>
      </div>

      <h3 className="text-xl font-extrabold text-[var(--cm-ink)] sm:text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
        Your Campus Messenger
      </h3>
      
      <p className="mt-2 max-w-sm text-sm text-[var(--cm-slate)] leading-relaxed">
        Select a conversation from the sidebar or chat with any seller directly from a product page.
      </p>

      <div className="mt-8 grid max-w-xs grid-cols-1 gap-3 text-left">
        <div className="flex items-center gap-3 rounded-xl border border-[var(--cm-border)] bg-white p-3 shadow-xs">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--cm-ink)]">Verified Students Only</p>
            <p className="text-[11px] text-[var(--cm-slate)]">Safe campus-to-campus chats</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-[var(--cm-border)] bg-white p-3 shadow-xs">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--cm-blue-soft)] text-[var(--cm-blue)]">
            <Zap size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--cm-ink)]">Real-Time Messaging</p>
            <p className="text-[11px] text-[var(--cm-slate)]">Instant buyer & seller updates</p>
          </div>
        </div>
      </div>
    </div>
  );
}
