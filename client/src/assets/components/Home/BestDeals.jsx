import { React, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { API_URL, resolveImageUrl } from "../../../config/api";

export default function BestDeals() {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/deals`)
      .then((res) => res.json())
      .then((data) => {
        setDeals(data);
      })
      .catch((err) => {
        console.error("Error fetching deals:", err);
        setDeals([]);
      });
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-1">
            Top Savings
          </div>
          <h2 className="text-xl md:text-3xl font-extrabold text-slate-900" style={{ fontFamily: "var(--font-display)" }}>
            Best Campus Deals
          </h2>
        </div>
        <Link to="/all-products" className="flex items-center gap-1 text-sm md:text-base font-semibold text-indigo-600 hover:text-indigo-700 transition">
          Browse all deals <ArrowRight size={16} />
        </Link>
      </div>

      <div className="rounded-3xl bg-white border border-indigo-100 p-5 sm:p-6 shadow-sm">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {deals.map((deal) => (
            <Link
              to={`/api/product/${deal._id}`}
              key={deal._id}
              className="group block"
            >
              <div className="h-full p-4 rounded-2xl bg-[var(--cm-bg)] border border-slate-100 group-hover:border-indigo-200 group-hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                <div className="w-full h-40 bg-white rounded-xl overflow-hidden p-2 flex items-center justify-center mb-3">
                  <img
                    src={resolveImageUrl(deal.image)}
                    alt={deal.title}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-base font-bold text-slate-900 line-clamp-1">{deal.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 flex-grow">
                  {deal.description}
                </p>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200/60">
                  <p className="text-lg text-emerald-600 font-extrabold">₹{deal.price}</p>
                  <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    Deal
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
