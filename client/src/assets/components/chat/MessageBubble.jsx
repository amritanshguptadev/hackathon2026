import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

function formatMessageTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MessageBubble({ message, isOwn }) {
  const timeFormatted = formatMessageTime(message.createdAt);

  return (
    <div className={`flex w-full ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`relative max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-xs transition-all ${
          isOwn
            ? 'rounded-br-xs bg-[var(--cm-blue)] text-white'
            : 'rounded-bl-xs border border-[var(--cm-border)] bg-white text-[var(--cm-ink)]'
        }`}
      >
        <p className="text-sm sm:text-[14.5px] leading-relaxed whitespace-pre-wrap break-words">
          {message.text}
        </p>

        <div
          className={`mt-1 flex items-center justify-end gap-1 text-[10.5px] ${
            isOwn ? 'text-blue-100' : 'text-[var(--cm-slate)]'
          }`}
        >
          <span>{timeFormatted}</span>

          {isOwn && (
            <span className="inline-flex items-center">
              {message.read ? (
                <CheckCheck size={14} className="text-sky-200" title="Read" />
              ) : (
                <Check size={14} className="text-blue-200" title="Sent" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
