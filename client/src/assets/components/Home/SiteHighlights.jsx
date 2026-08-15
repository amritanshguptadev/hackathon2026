import {
  Package,
  ShieldCheck,
  Headset,
  BadgePercent,
  Sparkles
} from 'lucide-react';

export default function SiteHighlights() {
  const highlights = [
    {
      icon: Package,
      title: "100% Peer Verified",
      desc: "Student ID authenticated listings",
    },
    {
      icon: ShieldCheck,
      title: "Direct Campus Hand-Off",
      desc: "Meet on campus safely with zero delivery wait",
    },
    {
      icon: BadgePercent,
      title: "0% Commission",
      desc: "Free student-to-student exchange",
    },
    {
      icon: Headset,
      title: "Instant In-App Chat",
      desc: "Direct messaging with student sellers",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-white border border-indigo-100 p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-indigo-50">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`flex items-center gap-4 ${
                  idx > 0 ? "pt-4 lg:pt-0 lg:pl-6" : ""
                }`}
              >
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/80 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
