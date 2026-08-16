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
      {/* ── LOGO BRAND THEME HERO SHOWCASE (Blue & Purple Harmony) ── */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#f0f6ff] via-[#f8f9ff] to-[#f3f0ff] text-slate-900 shadow-md border border-indigo-100/90 p-6 sm:p-10 lg:p-12">
        {/* Soft Ambient Brand Glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-400/15 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-purple-400/15 blur-[90px]" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* ── LEFT: Typography, Search & Badges (7 Cols) ── */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-slate-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              The smartest way to{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                buy &amp; sell
              </span>{" "}
              on campus.
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Join students across <strong className="text-indigo-900 font-bold">Dev Sanskriti Vishwavidyalaya</strong> trading second-hand textbooks, electronics, cycles, and hostel gear with zero shipping fees &amp; instant physical hand-offs.
            </p>

            {/* Global Quick Search Form */}
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 rounded-full bg-white p-1.5 sm:p-2 shadow-[0_12px_36px_rgba(79,70,229,0.12)] ring-1 ring-indigo-200/80 transition-all focus-within:ring-2 focus-within:ring-indigo-500/40 max-w-xl mx-auto lg:mx-0"
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
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-indigo-50 text-slate-700 border border-indigo-100/80 shadow-2xs transition text-[11px] font-semibold cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-indigo-100/90 max-w-xl mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-2xs">
                  <ShieldCheck size={17} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-none">100% Verified</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-medium">DSVV Students</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-2xs">
                  <Zap size={17} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-none">Zero Fees</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Free Hand-off</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 shadow-2xs">
                  <MapPin size={17} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-none">Campus Spots</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Hostels &amp; Library</p>
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
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full rounded-3xl overflow-hidden shadow-lg border-2 border-indigo-100/90 group bg-slate-100">
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
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md flex items-center justify-center backdrop-blur-md transition-all opacity-80 hover:opacity-100 hover:scale-110 cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={handleNextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md flex items-center justify-center backdrop-blur-md transition-all opacity-80 hover:opacity-100 hover:scale-110 cursor-pointer"
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
