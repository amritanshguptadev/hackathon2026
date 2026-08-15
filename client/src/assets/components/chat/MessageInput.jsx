import React, { useState, useRef, useEffect } from 'react';
import { Send, AlertCircle } from 'lucide-react';

const MAX_MESSAGE_LENGTH = 2000;

export default function MessageInput({ onSendMessage, disabled = false, onTyping }) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const typingTimeoutRef = useRef(null);
  const textareaRef = useRef(null);

  const isValid = text.trim().length > 0 && text.length <= MAX_MESSAGE_LENGTH;

  const handleChange = (e) => {
    const val = e.target.value;
    if (val.length <= MAX_MESSAGE_LENGTH + 50) {
      setText(val);
    }

    if (onTyping) {
      onTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 1500);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || sending || disabled) return;

    try {
      setSending(true);
      if (onTyping) onTyping(false);
      await onSendMessage(text.trim());
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (err) {
      console.error('Send error in MessageInput:', err);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-[var(--cm-border)] bg-white p-3 sm:p-4 shadow-sm"
    >
      {text.length > MAX_MESSAGE_LENGTH && (
        <div className="mb-2 flex items-center gap-1.5 text-xs text-rose-500 font-medium">
          <AlertCircle size={14} />
          <span>Message exceeds {MAX_MESSAGE_LENGTH} characters limit ({text.length}/{MAX_MESSAGE_LENGTH})</span>
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled || sending}
            placeholder="Type your message… (Press Enter to send)"
            className="w-full resize-none rounded-2xl border border-[var(--cm-border)] bg-[var(--cm-bg)] px-4 py-2.5 text-sm text-[var(--cm-ink)] placeholder-[var(--cm-slate)] outline-none transition focus:border-[var(--cm-blue)] focus:bg-white focus:ring-2 focus:ring-[var(--cm-blue)]/20 disabled:cursor-not-allowed disabled:opacity-60 max-h-32"
          />
        </div>

        <button
          type="submit"
          disabled={!isValid || sending || disabled}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--cm-blue)] text-white shadow-xs transition hover:bg-[var(--cm-blue-dark)] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-70 active:scale-95"
          aria-label="Send message"
        >
          <Send size={18} className={sending ? 'animate-pulse' : ''} />
        </button>
      </div>

      <div className="mt-1.5 flex justify-between px-1 text-[11px] text-[var(--cm-slate)]">
        <span>Press <kbd className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[10px]">Enter</kbd> to send</span>
        <span>{text.length}/{MAX_MESSAGE_LENGTH}</span>
      </div>
    </form>
  );
}
