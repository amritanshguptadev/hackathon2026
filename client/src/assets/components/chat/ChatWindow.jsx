import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Loader2, ShieldCheck, UserCheck } from 'lucide-react';
import ProductMiniCard from './ProductMiniCard';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

function formatDateDivider(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  return date.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export default function ChatWindow({
  conversation,
  messages = [],
  loading = false,
  onSendMessage,
  onBack,
  currentUserId,
  typingUser = null,
  onTyping,
}) {
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  useEffect(() => {
    scrollToBottom(false);
  }, [conversation?._id]);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, typingUser]);

  if (!conversation) return null;

  const isBuyer =
    conversation.buyer?._id?.toString() === currentUserId ||
    conversation.buyer?.toString() === currentUserId;

  const otherUser = isBuyer ? conversation.seller : conversation.buyer;
  const otherUserName = otherUser?.name || 'Campus Student';
  const otherUserUniversity = otherUser?.university || 'University Campus';

  return (
    <div className="flex h-full w-full flex-col bg-[var(--cm-bg)]">
      {/* Chat Top Header */}
      <div className="flex items-center justify-between border-b border-[var(--cm-border)] bg-white px-4 py-3 shadow-2xs">
        <div className="flex items-center gap-3">
          {/* Mobile Back Button */}
          {onBack && (
            <button
              onClick={onBack}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--cm-slate)] transition hover:bg-[var(--cm-blue-soft)] hover:text-[var(--cm-blue)] md:hidden"
              aria-label="Back to conversations"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          {/* User Avatar */}
          <div className="relative">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                otherUserName
              )}&background=2563EB&color=fff&rounded=true&size=40`}
              alt={otherUserName}
              className="h-10 w-10 rounded-full border border-[var(--cm-border)] object-cover shadow-2xs"
            />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>

          {/* User & Campus Info */}
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-[var(--cm-ink)] sm:text-base">
                {otherUserName}
              </h3>
              <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                {isBuyer ? 'Seller' : 'Buyer'}
              </span>
            </div>
            <p className="text-xs text-[var(--cm-slate)]">{otherUserUniversity}</p>
          </div>
        </div>

        {/* Safety Badge */}
        <div className="hidden sm:flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <ShieldCheck size={14} />
          <span className="font-semibold">Student Verified</span>
        </div>
      </div>

      {/* Pinned Product Mini Card */}
      {conversation.product && (
        <ProductMiniCard product={conversation.product} />
      )}

      {/* Messages Feed */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2"
      >
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="animate-spin text-[var(--cm-blue)]" size={32} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center p-6">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--cm-blue-soft)] text-[var(--cm-blue)]">
              <UserCheck size={20} />
            </div>
            <p className="text-sm font-bold text-[var(--cm-ink)]">
              Start the conversation
            </p>
            <p className="text-xs text-[var(--cm-slate)] mt-1 max-w-xs">
              Say hello or ask about item availability, price negotiation, or meetup locations on campus.
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwn =
              msg.sender?._id?.toString() === currentUserId ||
              msg.sender?.toString() === currentUserId;

            const prevMsg = index > 0 ? messages[index - 1] : null;
            const showDateDivider =
              !prevMsg ||
              new Date(msg.createdAt).toDateString() !==
                new Date(prevMsg.createdAt).toDateString();

            return (
              <React.Fragment key={msg._id || index}>
                {showDateDivider && (
                  <div className="my-4 flex items-center justify-center">
                    <span className="rounded-full bg-white/80 border border-[var(--cm-border)] px-3 py-1 text-[10px] font-bold text-[var(--cm-slate)] shadow-2xs backdrop-blur-xs">
                      {formatDateDivider(msg.createdAt)}
                    </span>
                  </div>
                )}
                <MessageBubble message={msg} isOwn={isOwn} />
              </React.Fragment>
            );
          })
        )}

        {/* Typing indicator */}
        {typingUser && (
          <div className="flex items-center gap-2 text-xs text-[var(--cm-slate)] italic px-2 py-1">
            <div className="flex gap-1 items-center">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--cm-blue)] animate-bounce" />
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--cm-blue)] animate-bounce [animation-delay:0.2s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--cm-blue)] animate-bounce [animation-delay:0.4s]" />
            </div>
            <span>{typingUser} is typing…</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bar */}
      <MessageInput onSendMessage={onSendMessage} onTyping={onTyping} />
    </div>
  );
}
