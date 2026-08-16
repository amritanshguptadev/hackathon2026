import React, { useRef } from "react";
import { Upload, X, Image as ImageIcon, AlertCircle, Star, ArrowLeftRight } from "lucide-react";
import { toast } from "react-toastify";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ImageUploader({
  images = [],
  setImages,
  error,
  setError,
  maxImages = 5,
}) {
  const fileInputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const replaceIndexRef = useRef(null);

  const processFiles = (filesList) => {
    const files = Array.from(filesList || []);
    if (!files.length) return;

    if (images.length + files.length > maxImages) {
      toast.error(`You can upload a maximum of ${maxImages} product photos.`);
      return;
    }

    const validFiles = [];
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`"${file.name}" is not a supported format. Please use JPG, PNG, or WEBP.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`"${file.name}" exceeds the 5MB file limit.`);
        continue;
      }

      const preview = URL.createObjectURL(file);
      validFiles.push({ file, preview, name: file.name, size: file.size });
    }

    if (validFiles.length > 0) {
      setImages((prev) => [...prev, ...validFiles]);
      if (setError) setError(null);
    }
  };

  const handleFileChange = (e) => {
    processFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index) => {
    setImages((prev) => {
      const target = prev[index];
      if (target?.preview) {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const handleSetCover = (index) => {
    if (index === 0) return;
    setImages((prev) => {
      const next = [...prev];
      const [selected] = next.splice(index, 1);
      next.unshift(selected);
      return next;
    });
    toast.info("Cover photo updated!");
  };

  const triggerReplace = (index) => {
    replaceIndexRef.current = index;
    if (replaceInputRef.current) {
      replaceInputRef.current.value = "";
      replaceInputRef.current.click();
    }
  };

  const handleReplaceChange = (e) => {
    const file = e.target.files?.[0];
    const index = replaceIndexRef.current;
    if (!file || index === null || index === undefined) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Unsupported file type. Use JPG, PNG, or WEBP.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File exceeds 5MB size limit.");
      return;
    }

    const preview = URL.createObjectURL(file);
    setImages((prev) => {
      const next = [...prev];
      if (next[index]?.preview) {
        URL.revokeObjectURL(next[index].preview);
      }
      next[index] = { file, preview, name: file.name, size: file.size };
      return next;
    });
    toast.success("Image replaced successfully.");
  };

  return (
    <div className="space-y-4">
      {/* Hidden input for replacing a specific image */}
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/jpeg, image/png, image/jpg, image/webp"
        onChange={handleReplaceChange}
        className="hidden"
      />

      <div className="flex items-center justify-between">
        <label className="text-base font-bold text-[#0F172A] flex items-center gap-2">
          <ImageIcon size={18} className="text-[#2563EB]" />
          Product Photos
          <span className="text-xs font-normal text-slate-500">(1–{maxImages} Photos)</span>
        </label>
        <span
          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
            images.length === 0
              ? "bg-rose-50 text-rose-600 border border-rose-200"
              : "bg-blue-50 text-[#2563EB] border border-blue-100"
          }`}
        >
          {images.length} / {maxImages} uploaded
        </span>
      </div>

      <p className="text-xs text-slate-500">
        Upload 1 to 5 crisp photos. The first image is your <strong>Primary Cover Photo</strong>.
        You can drag, reorder, or replace photos at any time.
      </p>

      {/* Grid of photos & upload zone */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5"
      >
        {/* Uploaded Images */}
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`group relative aspect-square rounded-2xl overflow-hidden border-2 bg-slate-50 shadow-xs transition-all ${
              idx === 0
                ? "border-[#2563EB] ring-2 ring-[#2563EB]/20"
                : "border-slate-200 hover:border-slate-400"
            }`}
          >
            <img
              src={img.preview}
              alt={`Photo ${idx + 1}`}
              className="h-full w-full object-cover"
            />

            {/* Primary Cover Badge */}
            {idx === 0 ? (
              <div className="absolute top-2 left-2 rounded-full bg-[#2563EB] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md flex items-center gap-1">
                <Star size={10} className="fill-white" />
                Cover
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleSetCover(idx)}
                className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 rounded-md bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold text-white transition-opacity hover:bg-slate-900 shadow-sm"
              >
                Set Cover
              </button>
            )}

            {/* Actions: Replace and Remove */}
            <div className="absolute top-2 right-2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => triggerReplace(idx)}
                className="opacity-0 group-hover:opacity-100 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/80 text-white shadow-sm transition hover:bg-slate-900"
                title="Replace photo"
              >
                <ArrowLeftRight size={11} />
              </button>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white shadow-md transition hover:bg-rose-700 active:scale-95"
                title="Remove photo"
                aria-label="Remove image"
              >
                <X size={13} strokeWidth={2.5} />
              </button>
            </div>

            {/* Bottom info strip */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-1.5 text-[10px] text-white/90 text-center opacity-0 group-hover:opacity-100 transition-opacity truncate">
              {img.name || `Photo #${idx + 1}`}
            </div>
          </div>
        ))}

        {/* Dropzone / Add Button (if under limit) */}
        {images.length < maxImages && (
          <label className="relative aspect-square flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-3 text-center cursor-pointer hover:border-[#2563EB] hover:bg-blue-50/50 transition group">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg, image/png, image/jpg, image/webp"
              onChange={handleFileChange}
              className="sr-only"
            />
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#2563EB] shadow-xs group-hover:scale-110 group-hover:bg-[#2563EB] group-hover:text-white transition-all">
              <Upload size={18} />
            </div>
            <span className="mt-2 text-xs font-bold text-[#0F172A] group-hover:text-[#2563EB]">
              + Add Photo
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WEBP</span>
          </label>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs font-semibold text-rose-600 flex items-center gap-1.5 bg-rose-50 border border-rose-100 p-2.5 rounded-xl">
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
