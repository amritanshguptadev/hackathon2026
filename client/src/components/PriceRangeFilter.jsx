import React, { useId } from "react";
import { RotateCcw } from "lucide-react";

/**
 * Format an integer or float into Indian Rupee currency format (e.g., ₹500, ₹2,500, ₹1,20,000).
 */
export function formatINR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Parse any price string (e.g. "45,000", "₹2,500", "28999") or number into a clean numeric value.
 */
export function parsePrice(price) {
  if (price === undefined || price === null) return null;
  if (typeof price === "number") return price;
  if (typeof price === "string") {
    const cleaned = price.replace(/[^\d.]/g, "");
    if (!cleaned) return null;
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  }
  return null;
}

/**
 * PriceRangeFilter Component
 * 
 * Props:
 * - min: Minimum allowable price (default: 0)
 * - max: Maximum allowable price (default: 50000)
 * - minValue: Current selected minimum price
 * - maxValue: Current selected maximum price
 * - onChange: Callback ({ min: number, max: number }) => void
 * - onReset: Callback () => void
 * - step: Slider increment step (default: 100)
 * - className: Optional custom container styling classes
 */
export default function PriceRangeFilter({
  min = 0,
  max = 50000,
  minValue = 0,
  maxValue = 50000,
  onChange,
  onReset,
  step = 100,
  className = "",
}) {
  const minInputId = useId();
  const maxInputId = useId();

  // Clamp current values within [min, max]
  const safeMin = Math.max(min, Math.min(minValue, maxValue));
  const safeMax = Math.min(max, Math.max(minValue, maxValue));

  const totalRange = max - min > 0 ? max - min : 1;
  const minPercent = Math.min(100, Math.max(0, ((safeMin - min) / totalRange) * 100));
  const maxPercent = Math.min(100, Math.max(0, ((safeMax - min) / totalRange) * 100));

  const isFilterActive = safeMin > min || safeMax < max;

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), safeMax - step);
    if (onChange) {
      onChange({ min: Math.max(min, value), max: safeMax });
    }
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), safeMin + step);
    if (onChange) {
      onChange({ min: safeMin, max: Math.min(max, value) });
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    if (onReset) {
      onReset();
    } else if (onChange) {
      onChange({ min, max });
    }
  };

  return (
    <div className={`space-y-3.5 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-[var(--cm-ink)] flex items-center gap-1.5">
          <span>Price Range</span>
        </label>
        {isFilterActive && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-xs font-semibold text-[var(--cm-blue)] hover:text-[var(--cm-blue-dark)] transition-colors cursor-pointer"
            title="Reset price range"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Dual Slider Track */}
      <div className="relative pt-2 pb-1 px-1">
        {/* Background Track */}
        <div className="relative h-2 w-full rounded-full bg-slate-200" />

        {/* Highlighted Active Range Bar */}
        <div
          className="absolute top-2 h-2 rounded-full bg-[var(--cm-blue)] pointer-events-none transition-all duration-75"
          style={{
            left: `${minPercent}%`,
            width: `${Math.max(0, maxPercent - minPercent)}%`,
          }}
        />

        {/* Min Range Input */}
        <input
          id={minInputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={safeMin}
          onChange={handleMinChange}
          aria-label="Minimum Price"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={safeMin}
          className={`pointer-events-none absolute top-0 left-0 h-6 w-full appearance-none bg-transparent cursor-pointer
            ${safeMin > max - 1000 ? "z-[5]" : "z-[3]"}
            [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-[3px]
            [&::-webkit-slider-thumb]:border-[var(--cm-blue)]
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:cursor-grab
            active:[&::-webkit-slider-thumb]:cursor-grabbing
            active:[&::-webkit-slider-thumb]:scale-110
            hover:[&::-webkit-slider-thumb]:scale-110
            focus:[&::-webkit-slider-thumb]:ring-4
            focus:[&::-webkit-slider-thumb]:ring-[var(--cm-blue)]/20
            [&::-moz-range-thumb]:pointer-events-auto
            [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-[3px]
            [&::-moz-range-thumb]:border-[var(--cm-blue)]
            [&::-moz-range-thumb]:shadow-md
            [&::-moz-range-thumb]:cursor-grab
            active:[&::-moz-range-thumb]:cursor-grabbing
            hover:[&::-moz-range-thumb]:scale-110`}
        />

        {/* Max Range Input */}
        <input
          id={maxInputId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={safeMax}
          onChange={handleMaxChange}
          aria-label="Maximum Price"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={safeMax}
          className={`pointer-events-none absolute top-0 left-0 h-6 w-full appearance-none bg-transparent cursor-pointer z-[4]
            [&::-webkit-slider-thumb]:pointer-events-auto
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-[3px]
            [&::-webkit-slider-thumb]:border-[var(--cm-blue)]
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:cursor-grab
            active:[&::-webkit-slider-thumb]:cursor-grabbing
            active:[&::-webkit-slider-thumb]:scale-110
            hover:[&::-webkit-slider-thumb]:scale-110
            focus:[&::-webkit-slider-thumb]:ring-4
            focus:[&::-webkit-slider-thumb]:ring-[var(--cm-blue)]/20
            [&::-moz-range-thumb]:pointer-events-auto
            [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-[3px]
            [&::-moz-range-thumb]:border-[var(--cm-blue)]
            [&::-moz-range-thumb]:shadow-md
            [&::-moz-range-thumb]:cursor-grab
            active:[&::-moz-range-thumb]:cursor-grabbing
            hover:[&::-moz-range-thumb]:scale-110`}
        />
      </div>

      {/* Min/Max Bound Labels */}
      <div className="flex items-center justify-between text-[11px] font-medium text-[var(--cm-slate)] px-0.5">
        <span>{formatINR(min)}</span>
        <span>{formatINR(max)}</span>
      </div>

      {/* Selected Price Display Badge / Pill */}
      <div className="rounded-xl bg-[var(--cm-blue-soft)]/70 border border-[var(--cm-blue)]/15 p-2.5">
        <div className="text-[11px] font-medium text-[var(--cm-slate)] mb-1">
          Selected Range
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 rounded-lg bg-white px-2.5 py-1 text-center shadow-xs border border-[var(--cm-border)]">
            <span className="text-[10px] block text-[var(--cm-slate)] uppercase tracking-wider font-semibold">Min</span>
            <span className="text-xs font-bold text-[var(--cm-ink)]">{formatINR(safeMin)}</span>
          </div>
          <span className="text-xs font-bold text-[var(--cm-slate)]">–</span>
          <div className="flex-1 rounded-lg bg-white px-2.5 py-1 text-center shadow-xs border border-[var(--cm-border)]">
            <span className="text-[10px] block text-[var(--cm-slate)] uppercase tracking-wider font-semibold">Max</span>
            <span className="text-xs font-bold text-[var(--cm-ink)]">{formatINR(safeMax)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
