import { useState, useMemo, type FormEvent } from "react";
import {
  Menu, X, Plane, Moon, Building2, Star, FileCheck2, Bus, Clock, Search,
  ShieldCheck, MapPin, Headset, Phone, Mail, CheckCircle2, ChevronDown,
  Quote, Send, Users, CalendarDays,
} from "lucide-react";

/* ───────────────────────── Types & data ───────────────────────── */

type ServiceType = "Umrah Package" | "Hajj" | "International Flight";
type PackageCategory = "umrah" | "hajj";

interface HotelRating { city: "Makkah" | "Madinah"; stars: number; note: string }
interface TravelPackage {
  id: string;
  category: PackageCategory;
  name: string;
  tagline: string;
  durationDays: number;
  hotels: HotelRating[];
  inclusions: string[];
  priceETB: number;
  badge?: string;
  featured?: boolean;
}
interface Testimonial { id: string; name: string; area: string; trip: string; quote: string }
interface Pillar { icon: typeof ShieldCheck; title: string; body: string }
interface InquiryForm { fullName: string; phone: string; interest: string; message: string }

const PACKAGES: TravelPackage[] = [
  {
    id: "eco-umrah", category: "umrah", name: "Economy Umrah",
    tagline: "A dependable, well-organized Umrah at an honest price.",
    durationDays: 14,
    hotels: [
      { city: "Makkah", stars: 3, note: "≈ 600 m from Haram" },
      { city: "Madinah", stars: 3, note: "≈ 400 m from Masjid an-Nabawi" },
    ],
    inclusions: ["Umrah visa processing", "Addis Ababa return flights", "Private transport & transfers", "Daily breakfast"],
    priceETB: 189000,
  },
  {
    id: "vip-ramadan", category: "umrah", name: "5-Star VIP Ramadan Umrah",
    tagline: "Premium rooms with Haram views for the last ten nights.",
    durationDays: 15,
    hotels: [
      { city: "Makkah", stars: 5, note: "Haram-facing, walkable" },
      { city: "Madinah", stars: 5, note: "Steps from Masjid an-Nabawi" },
    ],
    inclusions: ["Priority visa processing", "Direct flights, extra baggage", "Private GMC transport", "Suhoor & iftar included", "Dedicated scholar guide"],
    priceETB: 425000, badge: "Most requested", featured: true,
  },
  {
    id: "full-hajj", category: "hajj", name: "Full Hajj Package",
    tagline: "Complete Hajj logistics, from Mina tents to Jamarat.",
    durationDays: 35,
    hotels: [
      { city: "Makkah", stars: 4, note: "Short shuttle to Haram" },
      { city: "Madinah", stars: 4, note: "≈ 200 m from Masjid an-Nabawi" },
    ],
    inclusions: ["Official Hajj visa handling", "Return flights & transfers", "Premium Mina & Arafat camps", "Pre-Hajj training sessions", "Full-board meals"],
    priceETB: 890000,
  },
];

const TESTIMONIALS: Testimonial[] = [
  { id: "t1", name: "Hussein M.", area: "Bole, Addis Ababa", trip: "Economy Umrah",
    quote: "Every step was explained before we left. Our visa arrived early and the guide knew exactly where to take my parents." },
  { id: "t2", name: "Fatuma A.", area: "Piassa, Addis Ababa", trip: "VIP Ramadan Umrah",
    quote: "The hotel was close enough to walk to every prayer. I could focus on worship instead of logistics." },
  { id: "t3", name: "Abdulkadir T.", area: "Kolfe, Addis Ababa", trip: "Full Hajj Package",
    quote: "Preparation sessions and clear communication made Hajj calm. Our group never felt lost, even in Mina." },
];

const PILLARS: Pillar[] = [
  { icon: ShieldCheck, title: "100% Visa & Flight Guarantee", body: "Your visa and confirmed seats are secured before you pay the final balance, in writing." },
  { icon: MapPin, title: "Hotels Steps Away from Haram", body: "We choose properties by walking distance, so prayers are never a long trip from your room." },
  { icon: Headset, title: "24/7 Experienced Ethiopian Guides", body: "Amharic, Afaan Oromo and Arabic-speaking guides stay with your group from takeoff to return." },
];

const NAV = [
  { label: "Umrah Packages", href: "#packages" },
  { label: "Hajj", href: "#packages" },
  { label: "Flight Booking", href: "#inquiry" },
  { label: "About Us", href: "#why" },
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const fmt = (n: number) => new Intl.NumberFormat("en-US").format(n);
const focusRing = "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2";

/* ───────────────────────── Sub-components ───────────────────────── */

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className={`flex items-center gap-2 rounded ${focusRing}`}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-900 text-amber-500">
            <Moon className="h-5 w-5" aria-hidden />
          </span>
          <span className="font-serif text-lg font-bold text-emerald-900">Al-Faruq Travel</span>
        </a>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {NAV.map((l) => (
            <a key={l.label} href={l.href} className={`rounded text-sm font-medium text-slate-700 transition-colors duration-200 hover:text-emerald-900 ${focusRing}`}>{l.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href="#inquiry" className={`hidden rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-amber-700 sm:inline-block ${focusRing}`}>Book Consultation</a>
          <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu"
            className={`rounded-lg p-2 text-slate-900 transition-colors hover:bg-slate-100 lg:hidden ${focusRing}`}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      <div className={`grid overflow-hidden border-slate-200 bg-white transition-all duration-300 lg:hidden ${open ? "grid-rows-[1fr] border-t" : "grid-rows-[0fr]"}`}>
        <div className="min-h-0">
          <nav className="flex flex-col gap-1 px-4 py-3" aria-label="Mobile">
            {NAV.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-base font-medium text-slate-800 transition-colors hover:bg-emerald-50">{l.label}</a>
            ))}
            <a href="#inquiry" onClick={() => setOpen(false)} className="mt-2 rounded-lg bg-amber-600 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-amber-700">Book Consultation</a>
          </nav>
        </div>
      </div>
    </header>
  );
}

function SelectField({ id, label, icon: Icon, value, onChange, children }: {
  id: string; label: string; icon: typeof Plane; value: string;
  onChange: (v: string) => void; children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
        <Icon className="h-3.5 w-3.5 text-emerald-800" aria-hidden /> {label}
      </label>
      <div className="relative">
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none rounded-lg border border-slate-300 bg-white py-3 pl-3 pr-9 text-sm text-slate-900 transition-colors hover:border-emerald-700 ${focusRing}`}>
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
      </div>
    </div>
  );
}

interface SearchState { service: ServiceType; month: string; travelers: string }

function Hero({ onSearch }: { onSearch: (s: SearchState) => void }) {
  const [s, setS] = useState<SearchState>({ service: "Umrah Package", month: "", travelers: "2" });
  const [loading, setLoading] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onSearch(s); }, 600);
  };

  return (
    <section id="top" className="relative bg-[#F8FAFC]">
      {/* Decorative geometric pattern: pure CSS, sits behind dark text only */}
      <div aria-hidden className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "radial-gradient(#064E3B 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pt-24">
        <div className="max-w-3xl">
          <p className="text-xs font-bold tracking-[0.18em] text-amber-700 sm:text-sm">TRUSTED PILGRIMAGE &amp; GLOBAL TRAVEL</p>
          <h1 className="mt-4 font-serif text-4xl font-bold leading-[1.1] text-slate-900 sm:text-5xl lg:text-6xl">
            Your Sacred Journey, Planned with Excellence and Peace of Mind.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg">
            Experience seamless Hajj, Umrah, and international flight services from Addis Ababa with 5-star accommodations near the Haramain.
          </p>
        </div>

        <form onSubmit={submit} className="mt-12 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-emerald-900/10 sm:p-6 lg:-mb-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_0.8fr_auto] lg:items-end">
            <SelectField id="service" label="Service Type" icon={Plane} value={s.service} onChange={(v) => setS({ ...s, service: v as ServiceType })}>
              <option>Umrah Package</option><option>Hajj</option><option>International Flight</option>
            </SelectField>
            <SelectField id="month" label="Departure Month" icon={CalendarDays} value={s.month} onChange={(v) => setS({ ...s, month: v })}>
              <option value="">Any month</option>
              {MONTHS.map((m) => <option key={m}>{m}</option>)}
            </SelectField>
            <SelectField id="travelers" label="Travelers" icon={Users} value={s.travelers} onChange={(v) => setS({ ...s, travelers: v })}>
              {[1,2,3,4,5,6,7,8].map((n) => <option key={n} value={n}>{n} {n === 1 ? "traveler" : "travelers"}</option>)}
            </SelectField>
            <button type="submit" disabled={loading}
              className={`inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-amber-700 active:scale-[0.98] disabled:opacity-70 sm:col-span-2 lg:col-span-1 ${focusRing}`}>
              {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden /> : <Search className="h-4 w-4" aria-hidden />}
              {loading ? "Searching…" : "Search Packages"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <span className="inline-flex" aria-label={`${count} stars`}>
      {Array.from({ length: count }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" aria-hidden />)}
    </span>
  );
}

function PackageCard({ pkg, onDetails }: { pkg: TravelPackage; onDetails: (p: TravelPackage) => void }) {
  return (
    <article className={`flex h-full flex-col rounded-2xl border bg-white p-6 transition-shadow duration-300 hover:shadow-xl hover:shadow-emerald-900/10 ${pkg.featured ? "border-amber-500 ring-1 ring-amber-500" : "border-slate-200"}`}>
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900">
          <Clock className="h-3.5 w-3.5" aria-hidden /> {pkg.durationDays} Days
        </span>
        {pkg.badge && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">{pkg.badge}</span>}
      </div>
      <h3 className="mt-4 font-serif text-2xl font-bold text-slate-900">{pkg.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{pkg.tagline}</p>

      <dl className="mt-5 space-y-3 border-t border-slate-100 pt-5">
        {pkg.hotels.map((h) => (
          <div key={h.city} className="flex items-start gap-3">
            <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800" aria-hidden />
            <div className="min-w-0">
              <dt className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-900">{h.city} <Stars count={h.stars} /></dt>
              <dd className="text-xs text-slate-600">{h.note}</dd>
            </div>
          </div>
        ))}
      </dl>

      <ul className="mt-5 space-y-2 border-t border-slate-100 pt-5">
        {pkg.inclusions.map((item, i) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
            {i === 0 ? <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden />
              : i === 2 ? <Bus className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden />
              : <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden />}
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <p className="text-xs text-slate-500">Starting from (per person)</p>
        <p className="text-3xl font-bold text-emerald-900">ETB {fmt(pkg.priceETB)}</p>
        <button onClick={() => onDetails(pkg)}
          className={`mt-4 w-full rounded-lg px-5 py-3 text-sm font-semibold transition-colors duration-200 ${pkg.featured ? "bg-amber-600 text-white hover:bg-amber-700" : "bg-emerald-900 text-white hover:bg-emerald-800"} ${focusRing}`}>
          View Details
        </button>
      </div>
    </article>
  );
}

type Filter = "all" | PackageCategory;

function Packages({ filter, setFilter, notice, onDetails }: {
  filter: Filter; setFilter: (f: Filter) => void; notice: string; onDetails: (p: TravelPackage) => void;
}) {
  const list = useMemo(() => PACKAGES.filter((p) => filter === "all" || p.category === filter), [filter]);
  const tabs: { id: Filter; label: string }[] = [
    { id: "all", label: "All" }, { id: "umrah", label: "Umrah" }, { id: "hajj", label: "Hajj" },
  ];
  return (
    <section id="packages" className="scroll-mt-16 bg-white px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl">Featured Umrah &amp; Hajj Packages</h2>
            <p className="mt-3 text-slate-600">All-inclusive itineraries with visas, flights and ground services handled by one team.</p>
          </div>
          <div role="tablist" aria-label="Package type" className="inline-flex self-start rounded-xl bg-slate-100 p-1">
            {tabs.map((t) => (
              <button key={t.id} role="tab" aria-selected={filter === t.id} onClick={() => setFilter(t.id)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${filter === t.id ? "bg-white text-emerald-900 shadow-sm" : "text-slate-600 hover:text-slate-900"} ${focusRing}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        {notice && (
          <p role="status" className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">{notice}</p>
        )}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => <PackageCard key={p.id} pkg={p} onDetails={onDetails} />)}
        </div>
        <p className="mt-6 text-xs text-slate-500">Sample portfolio pricing. Final prices depend on departure date and room type.</p>
      </div>
    </section>
  );
}

function WhyChoose() {
  return (
    <section id="why" className="scroll-mt-16 bg-emerald-900 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="max-w-2xl font-serif text-3xl font-bold text-white sm:text-4xl">Why Choose Al-Faruq</h2>
        <p className="mt-3 max-w-2xl text-emerald-100">Three commitments we keep on every journey.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl bg-white p-7 transition-shadow duration-300 hover:shadow-2xl">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><Icon className="h-6 w-6" aria-hidden /></span>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="bg-[#F8FAFC] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl">Pilgrim Testimonials</h2>
        <p className="mt-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">Sample reviews for portfolio purposes only</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.id} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7">
              <Quote className="h-7 w-7 text-amber-500" aria-hidden />
              <blockquote className="mt-4 flex-1 leading-relaxed text-slate-800">“{t.quote}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-900 text-sm font-bold text-white">{t.name[0]}</span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-slate-900">{t.name}</span>
                  <span className="block text-xs text-slate-600">{t.area} · {t.trip}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function InquirySection({ interest, setInterest }: { interest: string; setInterest: (v: string) => void }) {
  const [form, setForm] = useState<Omit<InquiryForm, "interest">>({ fullName: "", phone: "+251", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\+251\s?\d{9}$/.test(form.phone.replace(/[\s-]/g, "").replace(/^(\+251)(\d+)$/, "$1 $2"))) {
      setError("Enter a valid Ethiopian number, e.g. +251 911 234 567.");
      return;
    }
    setError("");
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 900);
  };
  const reset = () => { setForm({ fullName: "", phone: "+251", message: "" }); setStatus("idle"); };

  const field = `w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors hover:border-emerald-700 ${focusRing}`;

  return (
    <section id="inquiry" className="scroll-mt-16 bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-start">
        <div>
          <h2 className="font-serif text-3xl font-bold text-slate-900 sm:text-4xl">Book a free consultation</h2>
          <p className="mt-4 max-w-md leading-relaxed text-slate-600">Tell us what you are planning. A travel advisor will call you within one business day with options and a clear quote.</p>
          <ul className="mt-8 space-y-4 text-sm text-slate-700">
            <li className="flex items-center gap-3"><Phone className="h-5 w-5 text-emerald-800" aria-hidden /> +251 11 000 0000 (placeholder)</li>
            <li className="flex items-center gap-3"><Mail className="h-5 w-5 text-emerald-800" aria-hidden /> hello@alfaruqtravel.example</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 sm:p-8">
          {status === "sent" ? (
            <div className="py-8 text-center" role="status">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-800"><CheckCircle2 className="h-8 w-8" aria-hidden /></span>
              <h3 className="mt-5 font-serif text-2xl font-bold text-slate-900">Request received</h3>
              <p className="mx-auto mt-2 max-w-sm text-slate-600">Thank you, {form.fullName.split(" ")[0] || "friend"}. We will call {form.phone} about “{interest}” within one business day.</p>
              <button onClick={reset} className={`mt-6 rounded-lg border border-emerald-900 px-5 py-2.5 text-sm font-semibold text-emerald-900 transition-colors hover:bg-emerald-900 hover:text-white ${focusRing}`}>Send another request</button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="fullName" className="mb-1.5 block text-sm font-semibold text-slate-800">Full Name</label>
                <input id="fullName" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="e.g. Hussein Mohammed" className={field} />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-slate-800">Phone Number</label>
                <input id="phone" type="tel" required inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+251 911 234 567" aria-invalid={!!error} className={field} />
                {error && <p className="mt-1.5 text-sm font-medium text-red-700">{error}</p>}
              </div>
              <div>
                <label htmlFor="interest" className="mb-1.5 block text-sm font-semibold text-slate-800">Package Interest</label>
                <div className="relative">
                  <select id="interest" value={interest} onChange={(e) => setInterest(e.target.value)} className={`${field} appearance-none pr-10`}>
                    {[...PACKAGES.map((p) => p.name), "International Flight Booking", "Not sure yet"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-slate-800">Message</label>
                <textarea id="message" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Preferred dates, group size, special needs…" className={`${field} resize-none`} />
              </div>
              <button type="submit" disabled={status === "sending"}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-amber-700 disabled:opacity-70 ${focusRing}`}>
                {status === "sending" ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
                {status === "sending" ? "Sending…" : "Request Consultation"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const link = "rounded text-sm text-emerald-100 transition-colors hover:text-amber-400";
  return (
    <footer className="bg-slate-900 px-4 pb-8 pt-14 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-xl font-bold">Al-Faruq Travel</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-300">Hajj, Umrah and international flight services from Addis Ababa.</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-amber-400">Quick Links</h3>
          <ul className="mt-4 space-y-2.5">
            {NAV.map((l) => <li key={l.label}><a href={l.href} className={link}>{l.label}</a></li>)}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-amber-400">Office</h3>
          <address className="mt-4 text-sm not-italic leading-relaxed text-slate-300">[Street / Building placeholder]<br />Bole Sub-city, Addis Ababa<br />Ethiopia</address>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-amber-400">Contact</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" aria-hidden /> +251 11 000 0000</li>
            <li className="flex items-center gap-2 break-all"><Mail className="h-4 w-4 shrink-0" aria-hidden /> hello@alfaruqtravel.example</li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-7xl border-t border-slate-700 pt-6 text-xs text-slate-400">© 2026 Al-Faruq Travel Agency. All rights reserved. Portfolio demo: contact details and reviews are placeholders.</p>
    </footer>
  );
}

/* ───────────────────────── Page ───────────────────────── */

export default function App() {
  const [filter, setFilter] = useState<Filter>("all");
  const [notice, setNotice] = useState("");
  const [interest, setInterest] = useState(PACKAGES[0].name);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const handleSearch = ({ service, month, travelers }: SearchState) => {
    const when = month ? ` departing ${month}` : "";
    if (service === "International Flight") {
      setInterest("International Flight Booking");
      setTimeout(() => go("inquiry"), 50);
      return;
    }
    setFilter(service === "Hajj" ? "hajj" : "umrah");
    setNotice(`Showing ${service === "Hajj" ? "Hajj" : "Umrah"} packages${when} for ${travelers} ${travelers === "1" ? "traveler" : "travelers"}.`);
    setTimeout(() => go("packages"), 50);
  };

  const handleDetails = (p: TravelPackage) => { setInterest(p.name); go("inquiry"); };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white font-sans text-slate-900 antialiased">
      <Navbar />
      <main>
        <Hero onSearch={handleSearch} />
        <Packages filter={filter} setFilter={(f) => { setFilter(f); setNotice(""); }} notice={notice} onDetails={handleDetails} />
        <WhyChoose />
        <Testimonials />
        <InquirySection interest={interest} setInterest={setInterest} />
      </main>
      <Footer />
    </div>
  );
}