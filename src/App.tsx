import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight, Bath, BadgeCheck, BedDouble, Building2, Calendar, Check,
  Loader2, MapPin, Maximize, Menu, Quote, Search, Star, X,
} from "lucide-react";

/* Inline brand icons (newer lucide-react versions no longer ship brand logos) */
type IconProps = { className?: string };
const svgBase = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const Instagram: React.FC<IconProps> = ({ className }) => (
  <svg {...svgBase} className={className}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></svg>
);
const Twitter: React.FC<IconProps> = ({ className }) => (
  <svg {...svgBase} className={className}><path d="M4 4l16 16M20 4L4 20" /></svg>
);
const Linkedin: React.FC<IconProps> = ({ className }) => (
  <svg {...svgBase} className={className}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 11v5M8 8v.01M12 16v-5M12 13a2.5 2.5 0 015 0v3" /></svg>
);
const Facebook: React.FC<IconProps> = ({ className }) => (
  <svg {...svgBase} className={className}><path d="M14 8h2.5V4.5H14a3.5 3.5 0 00-3.5 3.5v2H8v3.5h2.5V20H14v-6.5h2.5L17 10h-3V8z" /></svg>
);

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type PropertyType = "Penthouse" | "Villa" | "Estate";

interface Property {
  id: number;
  title: string;
  location: string;
  type: PropertyType;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
}

interface AmenityTab {
  id: string;
  label: string;
  headline: string;
  description: string;
  features: string[];
  image: string;
  stat: { value: string; label: string };
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  quote: string;
  rating: number;
}

interface NavLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: string[];
}

interface BookingFormState {
  name: string;
  email: string;
  date: string;
}

interface SearchFilters {
  location: string;
  type: PropertyType | "All";
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */
const displayFont: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif" };

const NAV_LINKS: NavLink[] = [
  { label: "Properties", href: "#properties" },
  { label: "Amenities", href: "#amenities" },
  { label: "About", href: "#about" },
];

const PROPERTIES: Property[] = [
  {
    id: 1,
    title: "The Meridian Sky Residence",
    location: "Manhattan, New York",
    type: "Penthouse",
    price: 2450000,
    beds: 4,
    baths: 4.5,
    sqft: 4200,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "Villa Solenne",
    location: "Beverly Hills, California",
    type: "Villa",
    price: 3890000,
    beds: 6,
    baths: 7,
    sqft: 7150,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "Cedar Ridge Estate",
    location: "Aspen, Colorado",
    type: "Estate",
    price: 5275000,
    beds: 8,
    baths: 9,
    sqft: 11400,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  },
];

const AMENITY_TABS: AmenityTab[] = [
  {
    id: "penthouses",
    label: "Penthouses",
    headline: "Living above the skyline",
    description:
      "Full-floor residences with floor-to-ceiling glazing, private elevator landings, and terraces that frame the city as your personal backdrop.",
    features: ["Private elevator access", "Wraparound sky terrace", "Concierge and valet", "Wine cellar and tasting room"],
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    stat: { value: "62", label: "Floors above the street" },
  },
  {
    id: "villas",
    label: "Urban Villas",
    headline: "Privacy in the heart of the city",
    description:
      "Walled courtyards, infinity pools and architect-designed interiors, all minutes from the finest dining and cultural destinations.",
    features: ["Heated infinity pool", "Landscaped courtyard garden", "Home cinema and gym", "Smart-home automation"],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    stat: { value: "12 min", label: "To the city centre" },
  },
  {
    id: "estates",
    label: "Private Estates",
    headline: "Acres of your own horizon",
    description:
      "Gated grounds with guest houses, equestrian facilities and sweeping views, built for families who value space, discretion and legacy.",
    features: ["Gated 20-acre grounds", "Guest house and staff quarters", "Equestrian stables", "Private helipad"],
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    stat: { value: "20 ac", label: "Of private grounds" },
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Alexandra Whitmore",
    role: "Managing Partner, Whitmore Capital",
    location: "Manhattan, NY",
    quote:
      "Aura Luxe found us a residence that was never publicly listed. The process was discreet, precise and entirely on our schedule.",
    rating: 5,
  },
  {
    id: 2,
    name: "Rafael Ibarra",
    role: "Film Producer",
    location: "Beverly Hills, CA",
    quote:
      "Every detail of the villa had been inspected before I arrived. The team handled the negotiation so well that I never felt rushed.",
    rating: 5,
  },
  {
    id: 3,
    name: "Dr. Sofia Lindqvist",
    role: "Cardiac Surgeon",
    location: "Aspen, CO",
    quote:
      "I relocated from abroad and they managed the legal and logistical side end to end. Our estate feels like it was built for us.",
    rating: 5,
  },
];

const FOOTER_COLUMNS: FooterColumn[] = [
  { title: "Properties", links: ["Penthouses", "Urban Villas", "Private Estates", "New Listings"] },
  { title: "Company", links: ["About Aura Luxe", "Our Advisors", "Careers", "Press"] },
  { title: "Support", links: ["Schedule a Tour", "Financing", "Contact", "Privacy Policy"] },
];

const formatPrice = (value: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const scrollToId = (id: string): void => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

/* ------------------------------------------------------------------ */
/*  Shared UI                                                          */
/* ------------------------------------------------------------------ */
const SectionHeading: React.FC<{ eyebrow: string; title: string; text?: string }> = ({ eyebrow, title, text }) => (
  <div className="mx-auto mb-14 max-w-2xl text-center">
    <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[#D4AF37]">{eyebrow}</p>
    <h2 style={displayFont} className="text-4xl font-semibold leading-tight text-white md:text-5xl">{title}</h2>
    {text && <p className="mt-5 leading-relaxed text-slate-400">{text}</p>}
  </div>
);

/* ------------------------------------------------------------------ */
/*  1. Navbar                                                          */
/* ------------------------------------------------------------------ */
const Navbar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    scrollToId(href.replace("#", ""));
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? "border-b border-white/10 bg-[#05070C]/90 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <button onClick={() => scrollToId("top")} className="flex items-center gap-3" aria-label="Aura Luxe home">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D4AF37]/50 bg-[#D4AF37]/10">
            <Building2 className="h-5 w-5 text-[#D4AF37]" />
          </span>
          <span style={displayFont} className="text-2xl font-semibold tracking-[0.2em] text-white">
            AURA <span className="text-[#D4AF37]">LUXE</span>
          </span>
        </button>

        <ul className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <button
                onClick={() => go(link.href)}
                className="text-sm text-slate-300 transition-all duration-300 hover:text-[#D4AF37]"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={() => scrollToId("booking")}
          className="hidden rounded-full border border-[#D4AF37] bg-[#D4AF37] px-6 py-2.5 text-sm font-semibold text-[#05070C] transition-all duration-300 hover:bg-transparent hover:text-[#D4AF37] md:inline-block"
        >
          Schedule Tour
        </button>

        <button
          className="text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <ul className="flex flex-col gap-1 px-6 pb-6">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <button onClick={() => go(link.href)} className="w-full py-3 text-left text-slate-200 hover:text-[#D4AF37]">
                {link.label}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => go("#booking")}
              className="mt-2 w-full rounded-full bg-[#D4AF37] py-3 text-sm font-semibold text-[#05070C]"
            >
              Schedule Tour
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
};

/* ------------------------------------------------------------------ */
/*  2. Hero + Search bar                                               */
/* ------------------------------------------------------------------ */
const SearchBar: React.FC<{ onSearch: (filters: SearchFilters) => void }> = ({ onSearch }) => {
  const [location, setLocation] = useState<string>("");
  const [type, setType] = useState<SearchFilters["type"]>("All");

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch({ location, type });
    scrollToId("properties");
  };

  return (
    <form
      onSubmit={submit}
      className="mx-auto mt-14 grid w-full max-w-4xl gap-2 rounded-3xl border border-white/10 bg-white/[0.04] p-2 shadow-2xl shadow-black/60 backdrop-blur-xl transition-all duration-300 focus-within:border-[#D4AF37]/50 md:grid-cols-[1fr_1fr_auto] md:rounded-full"
    >
      <label className="flex items-center gap-3 rounded-full px-6 py-3 transition-all duration-300 hover:bg-white/5">
        <MapPin className="h-5 w-5 shrink-0 text-[#D4AF37]" />
        <span className="flex w-full flex-col text-left">
          <span className="text-[11px] uppercase tracking-widest text-slate-500">Location</span>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, state or region"
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none"
          />
        </span>
      </label>

      <label className="flex items-center gap-3 rounded-full px-6 py-3 transition-all duration-300 hover:bg-white/5">
        <Building2 className="h-5 w-5 shrink-0 text-[#D4AF37]" />
        <span className="flex w-full flex-col text-left">
          <span className="text-[11px] uppercase tracking-widest text-slate-500">Property Type</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as SearchFilters["type"])}
            className="w-full bg-transparent text-sm text-white outline-none"
          >
            <option className="bg-[#0B0F18]" value="All">All types</option>
            <option className="bg-[#0B0F18]" value="Penthouse">Penthouse</option>
            <option className="bg-[#0B0F18]" value="Villa">Villa</option>
            <option className="bg-[#0B0F18]" value="Estate">Estate</option>
          </select>
        </span>
      </label>

      <button
        type="submit"
        className="group flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-8 py-4 text-sm font-semibold text-[#05070C] transition-all duration-300 hover:scale-[1.03] hover:bg-[#e6c24f] hover:shadow-lg hover:shadow-[#D4AF37]/30 active:scale-95"
      >
        <Search className="h-4 w-4 transition-all duration-300 group-hover:rotate-12" />
        Search
      </button>
    </form>
  );
};

const Hero: React.FC<{ onSearch: (filters: SearchFilters) => void }> = ({ onSearch }) => (
  <section id="top" className="relative overflow-hidden px-6 pb-28 pt-44 text-center">
    <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[#D4AF37]/10 blur-[140px]" />
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage:
          "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
        backgroundSize: "64px 64px",
        maskImage: "radial-gradient(ellipse at center top, black 20%, transparent 70%)",
        WebkitMaskImage: "radial-gradient(ellipse at center top, black 20%, transparent 70%)",
      }}
    />
    <div className="relative mx-auto max-w-4xl">
      <p className="mb-6 text-xs font-medium uppercase tracking-[0.35em] text-[#D4AF37]">REDEFINING LUXURY LIVING</p>
      <h1 style={displayFont} className="text-5xl font-semibold leading-[1.05] text-white sm:text-6xl md:text-8xl">
        Exceptional Properties. Uncompromising Quality.
      </h1>
      <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-400">
        Discover an exclusive collection of high-fidelity luxury residences tailored for those who appreciate
        architectural mastery and refined elegance.
      </p>
      <SearchBar onSearch={onSearch} />
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  3. Featured Estates                                                */
/* ------------------------------------------------------------------ */
const PropertyCard: React.FC<{ property: Property }> = ({ property }) => (
  <article className="group overflow-hidden rounded-3xl border border-white/10 bg-[#0A0E17] transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/40 hover:shadow-2xl hover:shadow-[#D4AF37]/10">
    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#1a2233] to-[#0A0E17]">
      <img
        src={property.image}
        alt={property.title}
        loading="lazy"
        className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-transparent to-transparent" />
      <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur-md">
        <MapPin className="h-3.5 w-3.5 text-[#D4AF37]" />
        {property.location}
      </span>
      <span className="absolute right-4 top-4 rounded-full bg-[#D4AF37] px-3 py-1.5 text-xs font-semibold text-[#05070C]">
        {property.type}
      </span>
    </div>

    <div className="p-6">
      <div className="flex items-start justify-between gap-4">
        <h3 style={displayFont} className="text-2xl font-semibold leading-snug text-white">{property.title}</h3>
        <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-slate-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#D4AF37]" />
      </div>
      <p className="mt-2 text-2xl font-semibold text-[#D4AF37]">{formatPrice(property.price)}</p>

      <dl className="mt-6 grid grid-cols-3 gap-2 border-t border-white/10 pt-5">
        {[
          { icon: BedDouble, value: property.beds, label: "Beds" },
          { icon: Bath, value: property.baths, label: "Baths" },
          { icon: Maximize, value: property.sqft.toLocaleString("en-US"), label: "Sq Ft" },
        ].map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex flex-col items-center gap-1 text-center">
            <Icon className="h-4 w-4 text-slate-500" />
            <dt className="sr-only">{label}</dt>
            <dd className="text-sm font-medium text-white">{value}</dd>
            <span className="text-xs text-slate-500">{label}</span>
          </div>
        ))}
      </dl>
    </div>
  </article>
);

const FeaturedEstates: React.FC<{ filters: SearchFilters; onReset: () => void }> = ({ filters, onReset }) => {
  const results = useMemo<Property[]>(() => {
    const q = filters.location.trim().toLowerCase();
    return PROPERTIES.filter(
      (p) => (filters.type === "All" || p.type === filters.type) && (!q || p.location.toLowerCase().includes(q)),
    );
  }, [filters]);

  return (
    <section id="properties" className="mx-auto max-w-7xl scroll-mt-20 px-6 py-24">
      <SectionHeading
        eyebrow="Featured Estates"
        title="Residences worth the wait"
        text="Each property is personally inspected by our advisors and presented with complete documentation."
      />
      {results.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-[#0A0E17] p-10 text-center">
          <p className="text-white">No estates match that search.</p>
          <p className="mt-2 text-sm text-slate-400">Try a different location or show all property types.</p>
          <button
            onClick={onReset}
            className="mt-6 rounded-full border border-[#D4AF37] px-6 py-2.5 text-sm font-semibold text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37] hover:text-[#05070C]"
          >
            Show all estates
          </button>
        </div>
      )}
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  4. Amenities Showcase (tabbed)                                     */
/* ------------------------------------------------------------------ */
const AmenitiesShowcase: React.FC = () => {
  const [activeId, setActiveId] = useState<string>(AMENITY_TABS[0].id);
  const [visible, setVisible] = useState<boolean>(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const select = (id: string) => {
    if (id === activeId) return;
    setVisible(false); // fade out, swap content, fade back in
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setActiveId(id);
      setVisible(true);
    }, 220);
  };

  const active = AMENITY_TABS.find((t) => t.id === activeId) ?? AMENITY_TABS[0];

  return (
    <section id="amenities" className="scroll-mt-20 border-y border-white/5 bg-[#070A11] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Amenities"
          title="Designed around how you live"
          text="Choose a residence style to explore the features that define it."
        />

        <div role="tablist" aria-label="Residence styles" className="mx-auto mb-12 flex w-full max-w-xl rounded-full border border-white/10 bg-white/[0.03] p-1.5">
          {AMENITY_TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={tab.id === activeId}
              onClick={() => select(tab.id)}
              className={`flex-1 rounded-full px-3 py-3 text-sm font-medium transition-all duration-300 ${
                tab.id === activeId
                  ? "bg-[#D4AF37] text-[#05070C] shadow-lg shadow-[#D4AF37]/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          className={`grid items-center gap-12 transition-all duration-300 lg:grid-cols-2 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a2233] to-[#0A0E17]">
            <img src={active.image} alt={active.label} className="aspect-[4/3] w-full object-cover" />
            <div className="absolute bottom-5 left-5 rounded-2xl border border-white/10 bg-black/60 px-5 py-4 backdrop-blur-md">
              <p style={displayFont} className="text-3xl font-semibold text-[#D4AF37]">{active.stat.value}</p>
              <p className="text-xs text-slate-300">{active.stat.label}</p>
            </div>
          </div>

          <div>
            <h3 style={displayFont} className="text-4xl font-semibold leading-tight text-white">{active.headline}</h3>
            <p className="mt-5 max-w-lg leading-relaxed text-slate-400">{active.description}</p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {active.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-slate-200">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/15">
                    <Check className="h-3 w-3 text-[#D4AF37]" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  5. Testimonials                                                    */
/* ------------------------------------------------------------------ */
const Testimonials: React.FC = () => (
  <section id="about" className="mx-auto max-w-7xl scroll-mt-20 px-6 py-24">
    <SectionHeading
      eyebrow="Client Stories"
      title="Trusted by discerning owners"
      text="Aura Luxe has guided private buyers through more than 400 acquisitions across three continents."
    />
    <div className="grid gap-6 lg:grid-cols-3">
      {TESTIMONIALS.map((t) => (
        <figure
          key={t.id}
          className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#0E1320] to-[#080B12] p-8 transition-all duration-300 hover:border-[#D4AF37]/40"
        >
          <Quote className="absolute right-6 top-6 h-12 w-12 text-[#D4AF37]/10" />
          <div>
            <div className="mb-5 flex gap-1" aria-label={`${t.rating} out of 5 stars`}>
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />
              ))}
            </div>
            <blockquote style={displayFont} className="text-2xl leading-snug text-white">
              “{t.quote}”
            </blockquote>
          </div>
          <figcaption className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-sm font-semibold text-[#D4AF37]">
              {t.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-white">{t.name}</span>
              <span className="block truncate text-xs text-slate-500">{t.role}</span>
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] text-emerald-300">
                <BadgeCheck className="h-3 w-3" />
                Verified owner · {t.location}
              </span>
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  6. Booking form                                                    */
/* ------------------------------------------------------------------ */
const BookingForm: React.FC = () => {
  const [form, setForm] = useState<BookingFormState>({ name: "", email: "", date: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const today = new Date().toISOString().split("T")[0];

  const update = (key: keyof BookingFormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 1600);
  };

  const reset = () => {
    setForm({ name: "", email: "", date: "" });
    setDone(false);
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 hover:border-white/25 focus:border-[#D4AF37] focus:bg-white/[0.06] focus:ring-2 focus:ring-[#D4AF37]/20";

  return (
    <section id="booking" className="scroll-mt-20 px-6 py-24">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0A0E17] lg:grid-cols-5">
        <div className="relative flex flex-col justify-between bg-gradient-to-br from-[#D4AF37]/15 via-transparent to-transparent p-10 lg:col-span-2">
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[#D4AF37]">Private Viewings</p>
            <h2 style={displayFont} className="text-4xl font-semibold leading-tight text-white">Book your private tour</h2>
            <p className="mt-5 leading-relaxed text-slate-400">
              Tell us when you are available and an advisor will confirm your viewing within one business day.
            </p>
          </div>
          <ul className="mt-10 space-y-3 text-sm text-slate-300">
            {["Accompanied by a senior advisor", "Chauffeured transfers available", "No obligation, fully confidential"].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <Check className="h-4 w-4 text-[#D4AF37]" /> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-10 lg:col-span-3">
          {done ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
              <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/15">
                <Check className="h-8 w-8 text-[#D4AF37]" />
              </span>
              <h3 style={displayFont} className="text-3xl font-semibold text-white">Tour request received</h3>
              <p className="mt-3 max-w-sm text-sm text-slate-400">
                Thank you, {form.name.split(" ")[0]}. We will email {form.email} to confirm your viewing on{" "}
                {new Date(form.date + "T00:00:00").toLocaleDateString("en-US", { dateStyle: "long" })}.
              </p>
              <button
                onClick={reset}
                className="mt-8 rounded-full border border-white/20 px-6 py-2.5 text-sm text-white transition-all duration-300 hover:border-[#D4AF37] hover:text-[#D4AF37]"
              >
                Book another tour
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-6">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm text-slate-300">Full name</label>
                <input id="name" required value={form.name} onChange={update("name")} placeholder="Jane Doe" className={inputClass} />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm text-slate-300">Email address</label>
                <input id="email" type="email" required value={form.email} onChange={update("email")} placeholder="jane@example.com" className={inputClass} />
              </div>
              <div>
                <label htmlFor="date" className="mb-2 block text-sm text-slate-300">Preferred date</label>
                <div className="relative">
                  <Calendar className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="date"
                    type="date"
                    required
                    min={today}
                    value={form.date}
                    onChange={update("date")}
                    className={`${inputClass} [color-scheme:dark]`}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] py-4 text-sm font-semibold text-[#05070C] transition-all duration-300 hover:bg-[#e6c24f] hover:shadow-lg hover:shadow-[#D4AF37]/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending request…
                  </>
                ) : (
                  "Request private tour"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  7. Footer                                                          */
/* ------------------------------------------------------------------ */
const Footer: React.FC = () => {
  const socials = [
    { icon: Instagram, label: "Instagram" },
    { icon: Twitter, label: "Twitter" },
    { icon: Linkedin, label: "LinkedIn" },
    { icon: Facebook, label: "Facebook" },
  ];

  return (
    <footer className="border-t border-white/10 bg-[#04060A] px-6 pb-10 pt-20">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D4AF37]/50 bg-[#D4AF37]/10">
              <Building2 className="h-5 w-5 text-[#D4AF37]" />
            </span>
            <span style={displayFont} className="text-2xl font-semibold tracking-[0.2em] text-white">
              AURA <span className="text-[#D4AF37]">LUXE</span>
            </span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
            A private real estate house for architecturally significant homes, represented with discretion and care.
          </p>
          <div className="mt-6 flex gap-3">
            {socials.map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#top"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#05070C]"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="mb-5 text-sm font-semibold text-white">{col.title}</h4>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#top" className="text-sm text-slate-400 transition-all duration-300 hover:text-[#D4AF37]">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-500 md:flex-row">
        <p>© 2026 Aura Luxe. All rights reserved.</p>
        <p>Equal Housing Opportunity · Licensed Real Estate Broker</p>
      </div>
    </footer>
  );
};

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */
const DEFAULT_FILTERS: SearchFilters = { location: "", type: "All" };

export default function App(): React.ReactElement {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);

  return (
    <div className="min-h-screen bg-[#05070C] text-slate-200 antialiased selection:bg-[#D4AF37] selection:text-[#05070C]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600&display=swap'); html{scroll-behavior:smooth} body{font-family:'Inter',system-ui,sans-serif;background:#05070C} @media (prefers-reduced-motion: reduce){*{transition:none!important;animation:none!important}}`}</style>
      <Navbar />
      <main>
        <Hero onSearch={setFilters} />
        <FeaturedEstates filters={filters} onReset={() => setFilters(DEFAULT_FILTERS)} />
        <AmenitiesShowcase />
        <Testimonials />
        <BookingForm />
      </main>
      <Footer />
    </div>
  );
}
