import React, { useState } from 'react';
import { Search, MessagesSquare, Inbox, PlusCircle, X, Tag } from 'lucide-react';
import ConversationItem from './ConversationItem';
import { DEMO_LISTINGS } from '../../../data/images';
import { resolveImageUrl } from '../../../config/api';

export default function ConversationList({
  conversations = [],
  selectedId,
  onSelectConversation,
  onStartNewChat,
  loading = false,
  currentUserId,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [showProductPicker, setShowProductPicker] = useState(false);

  const filteredConversations = conversations.filter((conv) => {
    // Tab filter
    if (activeTab === 'Buying' && conv.type !== 'buying') return false;
    if (activeTab === 'Selling' && conv.type !== 'selling') return false;
    if (activeTab === 'Unread' && (!conv.unreadCount || conv.unreadCount === 0)) return false;

    // Search query
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();

    const otherUser =
      conv.buyer?._id === currentUserId || conv.buyer?.id === currentUserId
        ? conv.seller
        : conv.buyer;

    const userName = (otherUser?.name || '').toLowerCase();
    const userUniv = (otherUser?.university || '').toLowerCase();
    const productTitle = (conv.product?.title || '').toLowerCase();

    return (
      userName.includes(query) ||
      userUniv.includes(query) ||
      productTitle.includes(query)
    );
  });

  return (
    <div className="flex h-full flex-col bg-white border-r border-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <MessagesSquare size={18} />
            </div>
            <div>
              <h2
                className="text-base font-extrabold text-slate-900 leading-none"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Campus Messages
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Peer negotiations &amp; meetups</p>
            </div>
          </div>

          <button
            onClick={() => setShowProductPicker(true)}
            className="p-1.5 rounded-full text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
            title="Start new chat about a product"
          >
            <PlusCircle size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student or item…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/15"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {['All', 'Buying', 'Selling', 'Unread'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {filteredConversations.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center p-6 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Inbox size={24} />
            </div>
            <p className="text-xs font-bold text-slate-900">
              {searchQuery ? 'No matching conversations' : 'No messages in this filter'}
            </p>
            <p className="mt-1 text-[11px] text-slate-500 max-w-[200px]">
              {searchQuery
                ? 'Try searching with a different student name or item keyword.'
                : 'Click "+" above to start a chat with any student seller!'}
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation._id}
              conversation={conversation}
              isSelected={conversation._id === selectedId}
              onSelect={() => onSelectConversation(conversation)}
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>

      {/* Start New Chat Product Picker Modal */}
      {showProductPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-indigo-100 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Tag size={16} className="text-indigo-600" />
                Select Item to Chat With Seller
              </h3>
              <button
                onClick={() => setShowProductPicker(false)}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2.5 divide-y divide-slate-100 pr-1">
              {DEMO_LISTINGS.map((prod) => (
                <div
                  key={prod._id || prod.id}
                  onClick={() => {
                    onStartNewChat?.(prod);
                    setShowProductPicker(false);
                  }}
                  className="pt-2.5 first:pt-0 flex items-center gap-3 p-2 rounded-2xl hover:bg-indigo-50/70 transition cursor-pointer group"
                >
                  <div className="h-12 w-12 shrink-0 bg-slate-50 rounded-xl border border-slate-100 p-1 flex items-center justify-center overflow-hidden">
                    <img
                      src={resolveImageUrl(prod.image)}
                      alt={prod.title}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition truncate">
                      {prod.title}
                    </p>
                    <p className="text-[11px] font-extrabold text-indigo-700">
                      ₹{prod.price?.toLocaleString('en-IN')} • {prod.condition || 'Good'}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    Chat →
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
