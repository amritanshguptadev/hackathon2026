import React, { useState } from "react";
import { Eye, X, MapPin, Sparkles, Loader2, ShieldCheck, Tag, School, CheckCircle2 } from "lucide-react";
import { formatINR } from "./PriceRangeFilter";

export default function ProductPreview({
  isOpen,
  onClose,
  onPublish,
  isPublishing,
  productData,
  images = [],
  sellerName = "Student Seller",
  sellerCollege = "Campus Community",
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!isOpen) return null;

  const {
    title = "Untitled Listing",
    categoryName = "Hostel Essentials",
    price = 0,
    isFree = false,
    condition = "Good",
    campusLocation = "Main Campus",
    description = "",
  } = productData || {};

  const activeImage = images[activeImageIndex]?.preview || images[0]?.preview || "/images/products/desk-lamp.png";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-[#2563EB]">
              <Eye size={18} />
            </span>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">Listing Preview</h3>
              <p className="text-xs text-slate-500">Live preview of how buyers will see your product</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
            aria-label="Close preview"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Main Cover & Thumbnails Gallery */}
          <div className="space-y-3">
            <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative flex items-center justify-center">
              <img
                src={activeImage}
                alt="Listing preview"
                className="h-full w-full object-cover"
              />
              {/* Status Badge */}
              <span className="absolute top-3 left-3 rounded-full bg-[#16A34A] px-3 py-1 text-xs font-bold text-white shadow-md flex items-center gap-1">
                <CheckCircle2 size={13} /> Available
              </span>
              {/* Category Badge */}
              <span className="absolute top-3 right-3 rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-xs font-bold text-[#0F172A] shadow-md border border-slate-100">
                {categoryName}
              </span>
            </div>

            {/* Thumbnails list */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImageIndex(i)}
                    className={`h-14 w-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      activeImageIndex === i
                        ? "border-[#2563EB] ring-2 ring-[#2563EB]/20 scale-105"
                        : "border-slate-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img.preview} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Price Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                {title || "Untitled Product"}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="rounded-md bg-blue-50 text-[#2563EB] px-2 py-0.5 font-bold">
                  {condition}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-600">
                  <MapPin size={13} className="text-[#2563EB]" /> {campusLocation}
                </span>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <span
                className={`text-2xl sm:text-3xl font-black ${
                  isFree ? "text-[#16A34A]" : "text-[#2563EB]"
                }`}
              >
                {isFree ? "FREE" : formatINR(Number(price) || 0)}
              </span>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                Campus Hand-off
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Item Details &amp; Notes
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
              {description || "No description provided."}
            </p>
          </div>

          {/* Seller Information Card */}
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-black text-base shadow-xs">
                {sellerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-[#0F172A]">{sellerName}</p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <School size={12} className="text-slate-400" />
                  {sellerCollege}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-100 text-[#16A34A] text-[11px] font-bold px-3 py-1 flex items-center gap-1">
              <ShieldCheck size={13} /> Verified Seller
            </span>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="sticky bottom-0 border-t border-slate-100 bg-slate-50 p-4 sm:p-5 flex items-center justify-end gap-3 rounded-b-3xl">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 bg-white px-6 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            ← Edit Form
          </button>
          <button
            type="button"
            disabled={isPublishing}
            onClick={onPublish}
            className="rounded-full bg-[#2563EB] px-8 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#1D4ED8] transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {isPublishing ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Sparkles size={15} />
                Publish Listing
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
