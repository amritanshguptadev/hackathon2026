import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeaderMain from '../assets/components/Home/HeaderMain';
import Footer from '../assets/components/Home/Footer';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { resolveImageUrl } from '../config/api';
import { ToastContainer, toast } from 'react-toastify';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  Tag,
  CheckCircle2,
  ChevronRight,
  School,
  ArrowLeft,
  Lock,
  MessageSquare
} from 'lucide-react';

const POPULAR_CAMPUS_LOCATIONS = [
  'Central Library Main Entrance',
  'Boys Hostel Block A / B Gate',
  'Girls Hostel Main Reception',
  'Student Activity Center (SAC)',
  'Main Cafeteria / Food Court',
  'Engineering Department Lobby',
];

const TIME_SLOTS = [
  'Today (1:00 PM - 3:00 PM)',
  'Today (4:00 PM - 6:00 PM)',
  'Today (7:00 PM - 9:00 PM)',
  'Tomorrow (10:00 AM - 12:00 PM)',
  'Tomorrow (3:00 PM - 5:00 PM)',
];

export default function Cart() {
  const {
    cart,
    cartCount,
    cartSubtotal,
    discountAmount,
    cartTotal,
    appliedPromo,
    promoCode,
    setPromoCode,
    meetupLocation,
    setMeetupLocation,
    preferredTime,
    setPreferredTime,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const navigate = useNavigate();
  const [buyerNotes, setBuyerNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash_on_meetup');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderCompleteModal, setOrderCompleteModal] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);

  const handleApplyCoupon = (e) => {
    e?.preventDefault();
    applyPromoCode(promoCode);
  };

  const handleQuickPromo = (code) => {
    setPromoCode(code);
    applyPromoCode(code);
  };

  const handleProceedCheckout = () => {
    if (cart.length === 0) return;
    const token = localStorage.getItem('token');
    if (!token) {
      toast.info('Please log in with your student account to confirm campus orders');
      navigate('/login');
      return;
    }

    setIsCheckingOut(true);
  };

  const { addOrder } = useOrders();

  const handleConfirmOrder = () => {
    const orderId = `BK-${Date.now().toString().slice(-6)}`;
    const studentUser = localStorage.getItem('loggedInUser') || 'Student Buyer';

    const orderData = {
      orderId,
      items: [...cart],
      total: cartTotal,
      subtotal: cartSubtotal,
      discount: discountAmount,
      meetupLocation,
      preferredTime,
      paymentMethod,
      buyerNotes,
      buyerName: studentUser,
      createdAt: new Date().toISOString(),
    };

    addOrder(orderData);
    setPlacedOrderDetails(orderData);
    clearCart();
    setIsCheckingOut(false);
    setOrderCompleteModal(true);
    toast.success('🎉 Campus Order Confirmed! The seller has been notified.');
  };

  return (
    <div className="min-h-screen bg-[var(--cm-bg)] flex flex-col justify-between">
      <HeaderMain showSearchBar={false} />
      <ToastContainer position="top-right" autoClose={3000} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
              <ChevronRight size={14} />
              <span className="text-indigo-600">Campus Cart ({cartCount})</span>
            </div>
            <h1
              className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Your Campus Cart
              {cartCount > 0 && (
                <span className="text-sm font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </span>
              )}
            </h1>
          </div>

          <Link
            to="/all-products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition"
          >
            <ArrowLeft size={16} /> Continue Browsing Marketplace
          </Link>
        </div>

        {/* Empty Cart State */}
        {cart.length === 0 && !orderCompleteModal ? (
          <div className="rounded-3xl bg-white border border-indigo-100 p-10 sm:p-16 text-center max-w-2xl mx-auto shadow-sm my-8">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-6 shadow-inner">
              <ShoppingBag size={44} className="stroke-[1.5]" />
            </div>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Your cart is empty
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto mb-8">
              Explore textbooks, electronics, dorm furniture, and campus essentials listed by students in your college.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/all-products"
                className="w-full sm:w-auto cm-gradient-btn px-8 py-3.5 rounded-full font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                Browse Campus Deals <ArrowRight size={16} />
              </Link>
              <Link
                to="/sell"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 font-bold text-sm transition"
              >
                + Sell an Item
              </Link>
            </div>
          </div>
        ) : (
          /* Active Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8 Cols: Item List & Hand-Off Preferences */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Items Card */}
              <div className="rounded-3xl bg-white border border-indigo-100/90 shadow-sm overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-indigo-50 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <ShoppingBag size={18} className="text-indigo-600" />
                    Items for Peer Hand-off
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-xs font-semibold text-slate-400 hover:text-rose-600 transition"
                  >
                    Clear all items
                  </button>
                </div>

                <div className="divide-y divide-indigo-50">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 transition hover:bg-indigo-50/20"
                    >
                      {/* Product Thumbnail */}
                      <Link
                        to={`/api/product/${item._id}`}
                        className="h-24 w-24 shrink-0 rounded-2xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center overflow-hidden group"
                      >
                        <img
                          src={resolveImageUrl(item.image)}
                          alt={item.title}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/images/products/1.jpg";
                          }}
                          className="h-full w-full object-contain transition group-hover:scale-105"
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {item.category || 'Campus Item'}
                          </span>
                          {item.condition && (
                            <span className="text-[10px] text-slate-500 font-medium">
                              • {item.condition}
                            </span>
                          )}
                        </div>

                        <Link
                          to={`/api/product/${item._id}`}
                          className="block text-base font-bold text-slate-900 hover:text-indigo-600 transition line-clamp-1"
                        >
                          {item.title}
                        </Link>

                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                          <School size={13} className="text-indigo-500" />
                          Seller: <span className="font-semibold text-slate-700">{item.seller?.name || 'Peer Seller'}</span>
                          {item.seller?.college && ` (${item.seller.college})`}
                        </p>

                        <div className="mt-2 flex items-center gap-4 text-xs font-semibold">
                          <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                            Direct Campus Meetup
                          </span>
                        </div>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                        <div className="text-right">
                          <p className="text-xl font-extrabold text-slate-900">
                            ₹{(item.price * (item.quantity || 1)).toLocaleString('en-IN')}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-slate-400">
                              ₹{item.price} each
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Qty Controls */}
                          <div className="flex items-center rounded-xl border border-indigo-200/80 bg-white shadow-2xs">
                            <button
                              onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 transition"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-slate-800">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 transition"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Remove from cart"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Campus Meet-Up Preferences Card */}
              <div className="rounded-3xl bg-white border border-indigo-100/90 p-5 sm:p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <MapPin size={18} className="text-indigo-600" />
                  Campus Hand-Off Meetup Preferences
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Meetup Spot on Campus
                    </label>
                    <select
                      value={meetupLocation}
                      onChange={(e) => setMeetupLocation(e.target.value)}
                      className="w-full rounded-xl border border-indigo-200 bg-indigo-50/30 py-3 px-4 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                    >
                      {POPULAR_CAMPUS_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Preferred Meetup Time
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full rounded-xl border border-indigo-200 bg-indigo-50/30 py-3 px-4 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Safety Promise */}
                <div className="mt-5 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80 p-4 border border-indigo-100 flex items-start gap-3">
                  <ShieldCheck size={22} className="text-indigo-600 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed text-slate-600">
                    <span className="font-bold text-slate-900">100% Safe Campus Hand-Off Guarantee: </span>
                    Inspect the item in person before payment. You can chat with your college seller directly anytime.
                  </div>
                </div>
              </div>

            </div>

            {/* Right 4 Cols: Order Summary & Checkout */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Order Summary Card */}
              <div className="rounded-3xl bg-white border border-indigo-200/80 shadow-sm p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

                <h2
                  className="text-xl font-extrabold text-slate-900 mb-5"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Order Summary
                </h2>

                {/* Pricing Line Items */}
                <div className="space-y-3 text-sm text-slate-600 pb-5 border-b border-indigo-50">
                  <div className="flex justify-between items-center">
                    <span>Items Total ({cartCount})</span>
                    <span className="font-semibold text-slate-900">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      Campus Hand-Off Fee
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">FREE</span>
                    </span>
                    <span className="font-semibold text-emerald-600">₹0</span>
                  </div>

                  {appliedPromo && (
                    <div className="flex justify-between items-center text-emerald-600 font-semibold bg-emerald-50/80 px-2.5 py-1.5 rounded-lg">
                      <span className="flex items-center gap-1.5">
                        <Tag size={14} /> Coupon ({appliedPromo.code})
                      </span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-baseline py-4">
                  <div>
                    <p className="text-base font-bold text-slate-900">Total Amount</p>
                    <p className="text-xs text-slate-400">Pay on meetup or via UPI</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl sm:text-3xl font-extrabold text-indigo-700">
                      ₹{cartTotal.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="mt-2 pt-4 border-t border-indigo-50">
                  {appliedPromo ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-emerald-600" />
                        <div>
                          <p className="text-xs font-bold text-emerald-900">{appliedPromo.code}</p>
                          <p className="text-[11px] text-emerald-700">{appliedPromo.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={removePromoCode}
                        className="text-xs font-bold text-emerald-800 hover:text-rose-600 underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Have a Student Promo Code?
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. CAMPUS2026"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          className="flex-1 rounded-xl border border-indigo-200 bg-indigo-50/20 px-3.5 py-2.5 text-xs font-bold text-slate-800 uppercase outline-none focus:border-indigo-600 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                          type="submit"
                          className="rounded-xl px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white transition cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>

                      {/* Quick Promo Pills */}
                      <div className="pt-2 flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleQuickPromo('CAMPUS2026')}
                          className="text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md px-2 py-1 transition"
                        >
                          🏷️ CAMPUS2026 (-15%)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickPromo('FIRST50')}
                          className="text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md px-2 py-1 transition"
                        >
                          ⚡ FIRST50 (₹50 OFF)
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={handleProceedCheckout}
                  className="w-full mt-6 cm-gradient-btn py-4 rounded-2xl font-extrabold text-base shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <Lock size={18} />
                  Proceed to Campus Hand-Off
                </button>

                <p className="text-center text-[11px] text-slate-400 mt-3 flex items-center justify-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  Zero commission • Directly to student sellers
                </p>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Checkout Modal */}
      {isCheckingOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-indigo-100 p-6 sm:p-8 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

            <h3
              className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Confirm Campus Hand-Off
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Review your meetup preferences before alerting the sellers.
            </p>

            <div className="space-y-4 text-sm">
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold">Meetup Location:</span>
                  <span className="text-xs font-bold text-slate-900">{meetupLocation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold">Preferred Slot:</span>
                  <span className="text-xs font-bold text-slate-900">{preferredTime}</span>
                </div>
                <div className="flex items-center justify-between border-t border-indigo-100 pt-2">
                  <span className="text-xs text-slate-500 font-semibold">Payable Total:</span>
                  <span className="text-base font-extrabold text-indigo-700">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Payment selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Preferred Payment Mode on Meetup
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash_on_meetup')}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      paymentMethod === 'cash_on_meetup'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    💵 Cash on Hand-Off
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi_on_meetup')}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      paymentMethod === 'upi_on_meetup'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    📱 UPI / QR on Hand-Off
                  </button>
                </div>
              </div>

              {/* Note for seller */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Note for Seller (Optional)
                </label>
                <textarea
                  rows={2}
                  value={buyerNotes}
                  onChange={(e) => setBuyerNotes(e.target.value)}
                  placeholder="e.g. Call me when you reach the library steps..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setIsCheckingOut(false)}
                className="flex-1 rounded-xl py-3 border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmOrder}
                className="flex-1 rounded-xl py-3 cm-gradient-btn text-xs font-extrabold shadow-md transition"
              >
                Confirm &amp; Alert Sellers
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Confirmed Receipt Modal */}
      {orderCompleteModal && placedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-indigo-100 p-6 sm:p-8 shadow-2xl text-center">
            <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 size={36} />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              Order ID: #{placedOrderDetails.orderId}
            </span>

            <h3
              className="text-2xl font-extrabold text-slate-900 mt-3 mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Campus Order Placed!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto mb-6">
              Your meetup request has been shared with the seller. Meet them at{' '}
              <strong className="text-slate-900">{placedOrderDetails.meetupLocation}</strong> during{' '}
              <strong className="text-slate-900">{placedOrderDetails.preferredTime}</strong>.
            </p>

            <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100 text-left space-y-2 mb-6 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Items Ordered:</span>
                <span className="font-bold text-slate-900">{placedOrderDetails.items.length} items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Amount:</span>
                <span className="font-extrabold text-indigo-700">₹{placedOrderDetails.total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Mode:</span>
                <span className="font-semibold text-slate-800">
                  {placedOrderDetails.paymentMethod === 'cash_on_meetup' ? 'Cash on Meetup' : 'UPI on Meetup'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => {
                  setOrderCompleteModal(false);
                  navigate('/orders');
                }}
                className="flex-1 cm-gradient-btn py-3 rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Package size={15} /> Track Your Orders
              </button>
              <button
                onClick={() => {
                  setOrderCompleteModal(false);
                  navigate('/messages');
                }}
                className="flex-1 border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageSquare size={15} /> Chat Seller
              </button>
              <button
                onClick={() => {
                  setOrderCompleteModal(false);
                  navigate('/all-products');
                }}
                className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                Marketplace
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
