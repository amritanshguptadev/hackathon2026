import React from 'react';
import { Package, ShieldCheck } from 'lucide-react';
import { resolveImageUrl } from '../../../config/api';

function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;

  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function ConversationItem({
  conversation,
  isSelected,
  onSelect,
  currentUserId,
}) {
  const isBuyer =
    conversation.buyer?._id?.toString() === currentUserId ||
    conversation.buyer?.id?.toString() === currentUserId ||
    conversation.type === 'buying';

  const otherUser = isBuyer ? conversation.seller : conversation.buyer;
  const unreadCount = conversation.unreadCount || 0;
  const otherUserName = otherUser?.name || 'Campus Student';
  const otherUserUniv = otherUser?.university || 'Campus Member';

  const product = conversation.product || {};
  const productTitle = product.title || 'Campus Item';
  const productImage = resolveImageUrl(product.image);

  const lastMsg = conversation.lastMessage?.text || 'Started discussion...';
  const lastMsgTime = formatRelativeTime(
    conversation.lastMessage?.createdAt || conversation.updatedAt
  );

  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      className={`group relative flex cursor-pointer items-start gap-3 p-3.5 transition-all border-l-4 ${
        isSelected
          ? 'border-l-indigo-600 bg-indigo-50/70 shadow-2xs'
          : 'border-l-transparent bg-white hover:bg-slate-50'
      }`}
    >
      {/* Other User Avatar with Online Dot */}
      <div className="relative shrink-0 mt-0.5">
        <img
          src={
            otherUser?.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              otherUserName
            )}&background=4F46E5&color=fff&rounded=true&size=48`
          }
          alt={otherUserName}
          className="h-11 w-11 rounded-full border border-slate-200 object-cover shadow-2xs"
        />
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
      </div>

      {/* Conversation Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <h4 className="truncate text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition flex items-center gap-1">
            {otherUserName}
            {otherUser?.verified && (
              <ShieldCheck size={13} className="text-emerald-500 shrink-0" />
            )}
          </h4>
          <span className="shrink-0 text-[10.5px] font-semibold text-slate-400">
            {lastMsgTime}
          </span>
        </div>

        <p className="text-[11px] text-slate-500 truncate mb-1">
          {otherUserUniv}
        </p>

        {/* Product mini pill context */}
        {productTitle && (
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-50 border border-slate-100 mb-1 max-w-full">
            <div className="h-4 w-4 shrink-0 overflow-hidden rounded bg-white">
              <img
                src={productImage}
                alt=""
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/products/1.jpg';
                }}
              />
            </div>
            <span className="truncate text-[10.5px] font-semibold text-slate-700">
              {productTitle}
            </span>
            {product.price && (
              <span className="shrink-0 text-[10px] font-extrabold text-indigo-700 ml-auto">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
            )}
          </div>
        )}

        {/* Last message preview */}
        <div className="flex items-center justify-between gap-2">
          <p
            className={`truncate text-xs ${
              unreadCount > 0
                ? 'font-bold text-slate-900'
                : 'text-slate-500'
            }`}
          >
            {lastMsg}
          </p>

          {unreadCount > 0 && (
            <span className="flex h-4 min-w-[16px] shrink-0 items-center justify-center rounded-full bg-indigo-600 px-1 text-[9.5px] font-bold text-white shadow-xs">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
