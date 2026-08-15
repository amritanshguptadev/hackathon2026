import React, { useState } from 'react';
import { Search, MessagesSquare, Inbox } from 'lucide-react';
import ConversationItem from './ConversationItem';

export default function ConversationList({
  conversations = [],
  selectedId,
  onSelectConversation,
  loading = false,
  currentUserId,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();

    const isBuyer =
      conv.buyer?._id?.toString() === currentUserId ||
      conv.buyer?.toString() === currentUserId;

    const otherUser = isBuyer ? conv.seller : conv.buyer;
    const userName = (otherUser?.name || '').toLowerCase();
    const productTitle = (
      conv.product?.title ||
      conv.product?.description ||
      ''
    ).toLowerCase();

    return userName.includes(query) || productTitle.includes(query);
  });

  return (
    <div className="flex h-full flex-col bg-white border-r border-[var(--cm-border)]">
      {/* Header */}
      <div className="p-4 border-b border-[var(--cm-border)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessagesSquare className="text-[var(--cm-blue)]" size={22} />
            <h2
              className="text-lg font-extrabold text-[var(--cm-ink)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Messages
            </h2>
          </div>
          <span className="rounded-full bg-[var(--cm-blue-soft)] px-2.5 py-0.5 text-xs font-bold text-[var(--cm-blue)]">
            {conversations.length} {conversations.length === 1 ? 'chat' : 'chats'}
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cm-slate)]"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats or items…"
            className="w-full rounded-xl border border-[var(--cm-border)] bg-[var(--cm-bg)] py-2 pl-9 pr-3 text-xs text-[var(--cm-ink)] placeholder-[var(--cm-slate)] outline-none transition focus:border-[var(--cm-blue)] focus:bg-white focus:ring-2 focus:ring-[var(--cm-blue)]/15"
          />
        </div>
      </div>

      {/* List / Loading / Empty */}
      <div className="flex-1 overflow-y-auto divide-y divide-[var(--cm-border)]/50">
        {loading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="flex items-center gap-3 animate-pulse">
                <div className="h-11 w-11 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-1/3 bg-gray-200 rounded" />
                  <div className="h-3 w-2/3 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center p-6 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--cm-blue-soft)] text-[var(--cm-blue)]">
              <Inbox size={24} />
            </div>
            <p className="text-sm font-bold text-[var(--cm-ink)]">
              {searchQuery ? 'No matching chats found' : 'No conversations yet'}
            </p>
            <p className="mt-1 text-xs text-[var(--cm-slate)]">
              {searchQuery
                ? 'Try a different search term'
                : 'Contact a seller on any product listing to begin chatting.'}
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation._id}
              conversation={conversation}
              isSelected={conversation._id === selectedId}
              onClick={() => onSelectConversation(conversation._id)}
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>
    </div>
  );
}
