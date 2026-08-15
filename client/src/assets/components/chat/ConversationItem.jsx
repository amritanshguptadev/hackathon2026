import React from 'react';
import { Package } from 'lucide-react';

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

export default function ConversationItem({ conversation, isSelected, onClick, currentUserId }) {
  // Determine if the current logged-in user is the buyer or seller
  const isBuyer =
    conversation.buyer?._id?.toString() === currentUserId ||
    conversation.buyer?.toString() === currentUserId;

  const otherUser = isBuyer ? conversation.seller : conversation.buyer;
  const unreadCount = isBuyer
    ? conversation.buyerUnreadCount || 0
    : conversation.sellerUnreadCount || 0;

  const otherUserName = otherUser?.name || 'Campus Student';
  const productTitle =
    conversation.product?.title ||
    conversation.product?.description ||
    'Campus Item';

  const productImage =
    conversation.product?.image ||
    conversation.product?.images?.[0] ||
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=400&auto=format&fit=crop';

  const lastMsgTime = formatRelativeTime(
    conversation.lastMessageAt || conversation.updatedAt
  );

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className={`group relative flex cursor-pointer items-center gap-3 border-b border-[var(--cm-border)]/70 p-3.5 transition-all hover:bg-[var(--cm-blue-soft)]/60 ${
        isSelected
          ? 'border-l-4 border-l-[var(--cm-blue)] bg-[var(--cm-blue-soft)] shadow-xs'
          : 'bg-white'
      }`}
    >
      {/* Other User Avatar */}
      <div className="relative shrink-0">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            otherUserName
          )}&background=2563EB&color=fff&rounded=true&size=48`}
          alt={otherUserName}
          className="h-11 w-11 rounded-full border border-[var(--cm-border)] object-cover shadow-2xs"
        />
        {/* Tiny product badge attached to avatar */}
        <div className="absolute -bottom-1 -right-1 h-5 w-5 overflow-hidden rounded-md border border-white bg-white shadow-xs">
          <img
            src={productImage}
            alt=""
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=100&auto=format&fit=crop';
            }}
          />
        </div>
      </div>

      {/* Conversation Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1">
          <h4 className="truncate text-sm font-bold text-[var(--cm-ink)] group-hover:text-[var(--cm-blue)]">
            {otherUserName}
          </h4>
          <span className="shrink-0 text-[11px] font-medium text-[var(--cm-slate)]">
            {lastMsgTime}
          </span>
        </div>

        {/* Product context indicator */}
        <div className="flex items-center gap-1 text-[11px] text-[var(--cm-slate)] font-medium">
          <Package size={11} className="shrink-0 text-[var(--cm-blue)]" />
          <span className="truncate">{productTitle}</span>
        </div>

        {/* Last message preview */}
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <p
            className={`truncate text-xs ${
              unreadCount > 0
                ? 'font-bold text-[var(--cm-ink)]'
                : 'text-[var(--cm-slate)]'
            }`}
          >
            {conversation.lastMessage || 'No messages yet. Start chatting!'}
          </p>

          {unreadCount > 0 && (
            <span className="flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-full bg-[var(--cm-blue)] px-1.5 text-[10px] font-bold text-white shadow-xs">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
