import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Loader2,
  ShieldCheck,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingCart,
  Phone,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  MessageCircle,
  X,
  Check,
  CheckCheck,
} from 'lucide-react';
import ProductMiniCard from './ProductMiniCard';
import MessageInput from './MessageInput';
import { useCart } from '../../../context/CartContext';
import { toast } from 'react-toastify';
import { resolveImageUrl } from '../../../config/api';

const QUICK_CAMPUS_REPLIES = [
  'Is this still available for campus meetup?',
  'Can you meet at Central Library ground floor today?',
  'Can you do ₹300 less for immediate hand-off?',
  'Are there any scratches or defects?',
  'Can you hold this for me until 5:00 PM?',
];

export default function ChatWindow({
  conversation,
  messages = [],
  loading = false,
  onSendMessage,
  onBack,
  currentUserId = 'user-me',
  typingUser = null,
}) {
  const messagesEndRef = useRef(null);
  const { addToCart } = useCart();

  const [showMeetupModal, setShowMeetupModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [meetupLocation, setMeetupLocation] = useState('Central Library - Ground Floor Entrance');
  const [meetupTime, setMeetupTime] = useState('Today (4:00 PM – 6:00 PM)');
  const [offerAmount, setOfferAmount] = useState(
    conversation?.product?.price ? Math.max(0, conversation.product.price - 200) : ''
  );

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
    conversation.buyer?.id?.toString() === currentUserId ||
    conversation.type === 'buying';

  const otherUser = isBuyer ? conversation.seller : conversation.buyer;
  const otherUserName = otherUser?.name || 'Campus Student';
  const otherUserUniv = otherUser?.university || 'Campus Member';
  const product = conversation.product || {};

  const handleProposeMeetup = (e) => {
    e.preventDefault();
    onSendMessage(
      `📍 Proposed Campus Meetup at ${meetupLocation} (${meetupTime})`,
      {
        type: 'meetup_proposal',
        location: meetupLocation,
        timeSlot: meetupTime,
        status: 'pending',
      }
    );
    setShowMeetupModal(false);
    toast.success('📍 Meetup proposal sent to seller!');
  };

  const handleSendOffer = (e) => {
    e.preventDefault();
    if (!offerAmount || Number(offerAmount) <= 0) return;

    onSendMessage(
      `💰 Special student counter-offer: ₹${Number(offerAmount).toLocaleString('en-IN')}`,
      {
        type: 'offer',
        offerPrice: Number(offerAmount),
        originalPrice: product.price || 0,
        status: 'pending',
      }
    );
    setShowOfferModal(false);
    toast.success(`💰 Offer of ₹${Number(offerAmount).toLocaleString('en-IN')} sent!`);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1);
      toast.success(`🛒 "${product.title?.slice(0, 20)}..." added to cart!`);
    }
  };

  const handleWhatsAppContact = () => {
    const phone = otherUser?.phone || '+91 98765 43210';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(phone);
      toast.success(`📞 Phone ${phone} copied to clipboard!`);
    } else {
      toast.info(`Seller Phone: ${phone}`);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-[var(--cm-bg)] relative">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-2xs">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 md:hidden"
              aria-label="Back to conversations"
            >
              <ArrowLeft size={18} />
            </button>
          )}

          <div className="relative">
            <img
              src={
                otherUser?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  otherUserName
                )}&background=4F46E5&color=fff&rounded=true&size=48`
              }
              alt={otherUserName}
              className="h-10 w-10 rounded-full border border-slate-200 object-cover shadow-2xs"
            />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                {otherUserName}
              </h3>
              {otherUser?.verified && (
                <ShieldCheck size={14} className="text-emerald-500" />
              )}
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <span>{otherUserUniv}</span>
              <span>•</span>
              <span className="text-emerald-600 font-medium">Online</span>
            </p>
          </div>
        </div>

        {/* Top Header Quick Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleWhatsAppContact}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
            title="Copy Phone Number"
          >
            <Phone size={13} /> Contact
          </button>
          <button
            onClick={handleAddToCart}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full cm-gradient-btn text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <ShoppingCart size={13} /> Buy Now
          </button>
        </div>
      </div>

      {/* Pinned Product Card & Quick Actions Bar */}
      {product?.title && (
        <div className="border-b border-indigo-100 bg-white/90 backdrop-blur-md px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 shrink-0 bg-slate-50 border border-slate-100 rounded-lg p-0.5 overflow-hidden">
              <img
                src={resolveImageUrl(product.image)}
                alt={product.title}
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/images/products/1.jpg';
                }}
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">
                {product.title}
              </p>
              <p className="text-[11px] font-extrabold text-indigo-700">
                ₹{Number(product.price || 0).toLocaleString('en-IN')}
                <span className="ml-2 font-medium text-slate-400">
                  ({product.condition || 'Good'})
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <button
              onClick={() => setShowMeetupModal(true)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition cursor-pointer"
            >
              <MapPin size={12} /> Propose Meetup
            </button>
            <button
              onClick={() => setShowOfferModal(true)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-amber-700 text-xs font-bold transition cursor-pointer"
            >
              <DollarSign size={12} /> Make Offer
            </button>
          </div>
        </div>
      )}

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isOwn = msg.sender === currentUserId;

          // Special card: Meetup Proposal
          if (msg.type === 'meetup_proposal') {
            return (
              <div
                key={msg._id}
                className={`flex w-full ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}
              >
                <div className="w-full max-w-sm rounded-2xl bg-white border border-indigo-200 p-4 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                      <MapPin size={12} /> Campus Meetup Proposal
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="text-slate-800">
                      📍 <strong>Spot:</strong> {msg.location}
                    </p>
                    <p className="text-slate-800">
                      ⏰ <strong>Time:</strong> {msg.timeSlot}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={13} /> {msg.status === 'confirmed' ? 'Meetup Confirmed' : 'Awaiting confirmation'}
                    </span>
                    {!isOwn && msg.status !== 'confirmed' && (
                      <button
                        onClick={() => {
                          toast.success('🎉 Meetup confirmed! See you at the spot.');
                          onSendMessage('Meetup accepted! Looking forward to meeting at the spot.');
                        }}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-2xs"
                      >
                        Accept Spot
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          // Special card: Price Offer
          if (msg.type === 'offer') {
            return (
              <div
                key={msg._id}
                className={`flex w-full ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}
              >
                <div className="w-full max-w-sm rounded-2xl bg-white border border-amber-200 p-4 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                      <DollarSign size={12} /> Price Bargain / Offer
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">
                      ₹{msg.offerPrice?.toLocaleString('en-IN')}
                    </span>
                    {msg.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        ₹{msg.originalPrice?.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-600">
                      {msg.status === 'accepted' ? 'Offer Accepted' : 'Offer Active'}
                    </span>
                    {!isOwn && msg.status !== 'accepted' && (
                      <button
                        onClick={() => {
                          toast.success(`🎉 Offer of ₹${msg.offerPrice} accepted!`);
                          onSendMessage(`I accept your offer of ₹${msg.offerPrice}! Let's schedule a meetup.`);
                        }}
                        className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-2xs"
                      >
                        Accept Offer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          // Regular Text Bubble
          return (
            <div
              key={msg._id}
              className={`flex w-full ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}
            >
              <div
                className={`relative max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-2xs transition-all ${
                  isOwn
                    ? 'rounded-br-xs cm-gradient-btn text-white'
                    : 'rounded-bl-xs border border-slate-200 bg-white text-slate-900'
                }`}
              >
                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {msg.text}
                </p>

                <div
                  className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                    isOwn ? 'text-indigo-100' : 'text-slate-400'
                  }`}
                >
                  <span>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {isOwn && (
                    <span className="inline-flex items-center">
                      <CheckCheck size={13} className="text-white" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {typingUser && (
          <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2">
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce" />
            {typingUser} is typing a response…
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Smart Quick Reply Chips */}
      <div className="px-4 py-2 bg-white/60 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
          Quick:
        </span>
        {QUICK_CAMPUS_REPLIES.map((reply, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(reply)}
            className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 transition cursor-pointer"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <MessageInput onSendMessage={onSendMessage} />

      {/* Propose Meetup Modal */}
      {showMeetupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-indigo-100 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin size={16} className="text-indigo-600" />
                Propose Campus Meetup
              </h3>
              <button
                onClick={() => setShowMeetupModal(false)}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleProposeMeetup} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Campus Safe Meetup Spot
                </label>
                <select
                  value={meetupLocation}
                  onChange={(e) => setMeetupLocation(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500"
                >
                  <option value="Central Library - Ground Floor Entrance">Central Library - Ground Floor Entrance</option>
                  <option value="Hostel Gate 2 / Guard Cabin">Hostel Gate 2 / Guard Cabin</option>
                  <option value="Student Activity Center (SAC) Cafe">Student Activity Center (SAC) Cafe</option>
                  <option value="Main Academic Block Atrium">Main Academic Block Atrium</option>
                  <option value="North Campus Canteen">North Campus Canteen</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Preferred Meeting Time
                </label>
                <select
                  value={meetupTime}
                  onChange={(e) => setMeetupTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500"
                >
                  <option value="Today (4:00 PM – 6:00 PM)">Today (4:00 PM – 6:00 PM)</option>
                  <option value="Today (7:00 PM – 8:30 PM)">Today (7:00 PM – 8:30 PM)</option>
                  <option value="Tomorrow (12:00 PM – 2:00 PM)">Tomorrow (12:00 PM – 2:00 PM)</option>
                  <option value="Tomorrow (5:00 PM – 7:00 PM)">Tomorrow (5:00 PM – 7:00 PM)</option>
                  <option value="This Weekend (Anytime)">This Weekend (Anytime)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMeetupModal(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cm-gradient-btn px-5 py-2 rounded-full text-white font-bold shadow-md"
                >
                  Send Meetup Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Make Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-amber-100 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <DollarSign size={16} className="text-amber-600" />
                Make a Bargain / Offer
              </h3>
              <button
                onClick={() => setShowOfferModal(false)}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendOffer} className="space-y-4 text-xs">
              <div>
                <p className="text-slate-500 mb-1">
                  Original Price: <strong>₹{product.price?.toLocaleString('en-IN')}</strong>
                </p>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Offered Price (₹)
                </label>
                <input
                  type="number"
                  required
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm font-bold text-slate-900 outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md"
                >
                  Submit Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
