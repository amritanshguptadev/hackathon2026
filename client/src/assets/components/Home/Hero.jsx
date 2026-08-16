import {
  Search,
  ShieldCheck,
  Zap,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CAMPUS_SLIDES = [
  {
    id: 1,
    image: "/images/c1.jpg",
    alt: "Dev Sanskriti Vishwavidyalaya Campus 1",
  },
  {
    id: 2,
    image: "/images/c2.jpg",
    alt: "Dev Sanskriti Vishwavidyalaya Campus 2",
  },
  {
    id: 3,
    image: "/images/c3.jpg",
    alt: "Dev Sanskriti Vishwavidyalaya Campus 3",
  },
  {
    id: 4,
    image: "/images/c4.jpg",
    alt: "Dev Sanskriti Vishwavidyalaya Campus 4",
  },
  {
    id: 5,
    image: "/images/c9.jpg",
    alt: "Dev Sanskriti Vishwavidyalaya Campus 5",
  },
];

export default function Hero() {
  const [query, setQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  // Auto-play slideshow timer (every 3.5 seconds)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAMPUS_SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % CAMPUS_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? CAMPUS_SLIDES.length - 1 : prev - 1
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/all-products?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate("/all-products");
    }
  };

  const handleQuickTag = (tag) => {
    navigate(`/all-products?category=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
      {/* ── SPLIT HERO SHOWCASE WITH CLEAN CAMPUS SLIDESHOW ── */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white shadow-xl border border-indigo-900/60 p-6 sm:p-10 lg:p-12">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-600/25 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-purple-600/25 blur-[100px]" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* ── LEFT: Typography, Search & Badges (7 Cols) ── */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-indigo-300 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Dev Sanskriti Vishwavidyalaya Marketplace</span>
            </div>

            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              The smartest way to{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                buy &amp; sell
              </span>{" "}
              on campus.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Join students across <strong className="text-white">Dev Sanskriti Vishwavidyalaya</strong> trading second-hand textbooks, electronics, cycles, and hostel gear with zero shipping fees &amp; instant physical hand-offs.
            </p>

            {/* Global Quick Search Form */}
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 rounded-full bg-white/95 p-1.5 sm:p-2 shadow-2xl backdrop-blur-md ring-2 ring-white/20 transition-all focus-within:ring-indigo-400 max-w-xl mx-auto lg:mx-0"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search laptops, cycles, books, lab gear…"
                className="min-w-0 flex-1 rounded-full bg-transparent px-4 py-2.5 text-xs sm:text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full cm-gradient-btn text-white transition hover:scale-105 active:scale-95 shadow-md cursor-pointer"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
            </form>

            {/* Quick Keyword Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 pt-1 text-xs">
              <span className="text-slate-400 font-semibold mr-1">Popular:</span>
              {["Electronics", "Cycles", "Books & Notes", "Furniture", "Calculators"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleQuickTag(tag)}
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition text-[11px] font-medium cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10 max-w-xl mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-none">100% Verified</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">DSVV Students</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300">
                  <Zap size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-none">Zero Fees</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Free Hand-off</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-none">Campus Spots</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Hostels &amp; Library</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Clean Real Campus Image Slideshow (5 Cols) ── */}
          <div
            className="lg:col-span-5 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Slideshow Container Frame */}
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 group bg-slate-950">
              {CAMPUS_SLIDES.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    idx === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="w-full h-full object-cover transform transition-transform duration-1000 scale-100 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80";
                    }}
                  />
                </div>
              ))}

              {/* Minimal Left / Right Arrows on Hover */}
              <button
                onClick={handlePrevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-all opacity-80 hover:opacity-100 hover:scale-110 cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={handleNextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-all opacity-80 hover:opacity-100 hover:scale-110 cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight size={20} />
              </button>

              {/* Clean Dot Indicators at Bottom */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                {CAMPUS_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === currentSlide
                        ? "w-6 bg-white shadow-xs"
                        : "w-2 bg-white/50 hover:bg-white/80"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
