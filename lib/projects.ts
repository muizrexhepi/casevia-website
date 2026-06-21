export type ProjectCategory =
  | "AI"
  | "Mobile App"
  | "Booking"
  | "Transport"
  | "Travel"
  | "Operations"
  | "Marketplace"
  | "E-commerce"
  | "Business Website"
  | "CMS"
  | "Client Work";

export type ProjectMetric = {
  label: string;
  value: string;
  description?: string;
};

export type ProjectImage = {
  src: string;
  alt: string;
  label?: string;
  description?: string;
  type?: "desktop" | "mobile" | "dashboard" | "flow" | "brand" | "detail";
};

export type ProjectCaseSection = {
  eyebrow?: string;
  title: string;
  body: string;
  image?: string;
  imageAlt?: string;
  quote?: {
    text: string;
    author?: string;
    role?: string;
  };
};

export type ProjectVisualTheme =
  | "agimtours"
  | "logly"
  | "speaksure"
  | "hakbus"
  | "gobusly"
  | "nextloop"
  | "doros"
  | "am";

export type Project = {
  slug: string;
  name: string;
  role: string;
  period: string;
  status: string;
  clientType: string;
  industry: string;
  summary: string;
  description: string;
  headline: string;
  subheadline: string;
  featured?: boolean;
  homepageFeatured?: boolean;
  showInHeroStrip?: boolean;
  liveUrl?: string;
  liveLabel?: string;
  logoImage?: string;
  logoAlt?: string;
  logoImageClassName?: string;
  initials: string;
  visualTheme: ProjectVisualTheme;
  coverImage?: string;
  coverAlt?: string;
  coverImageClassName?: string;
  heroImage?: string;
  heroAlt?: string;
  galleryImages: ProjectImage[];
  caseStudy: ProjectCaseSection[];
  services: string[];
  deliverables: string[];
  categories: ProjectCategory[];
  proof: string[];
  metrics: ProjectMetric[];
  stack: string[];
  challenge: string;
  solution: string;
  seoTitle?: string;
  seoDescription?: string;
};

export const projects: Project[] = [
  {
    slug: "agim-tours",
    name: "Agim Tours",
    role: "Brand, web experience, and operations platform",
    period: "Ongoing partnership",
    status: "Live business platform",
    clientType: "Travel agency",
    industry: "Travel / Hospitality",
    featured: true,
    homepageFeatured: true,
    showInHeroStrip: true,
    headline: "A connected digital operation for a leading travel agency.",
    subheadline:
      "From the public brand and booking experience to the internal system used to coordinate agencies, reservations, hotels, and tours.",
    summary:
      "A complete digital ecosystem for travel discovery, bookings, and multi-agency operations.",
    description:
      "Agim Tours needed more than a new website. The engagement connected its customer-facing brand with a fully operational agency management system, giving teams one clearer way to manage travel products, bookings, and day-to-day coordination.",
    liveUrl: "https://agimtours.com",
    liveLabel: "Visit Agim Tours",
    logoImage: "/logos/agimtours.webp",
    logoAlt: "Agim Tours logo",
    logoImageClassName: "h-6 max-h-6 sm:h-7 sm:max-h-7",
    initials: "AT",
    visualTheme: "agimtours",
    coverImage: "/work/agimtours.webp",
    coverAlt: "Agim Tours travel agency website",
    heroImage: "/work/agimtours.webp",
    heroAlt: "Agim Tours website and travel experience",
    galleryImages: [],
    services: [
      "Digital strategy",
      "Brand direction",
      "UX and interface design",
      "Web development",
      "Operations system design",
      "Product engineering",
    ],
    deliverables: [
      "Travel agency website",
      "Brand experience",
      "Agency management system",
      "Booking operations",
      "Multi-agency workflows",
      "Responsive platform",
    ],
    categories: ["Travel", "Booking", "Operations", "Business Website", "Client Work"],
    proof: ["Travel platform", "Multi-agency system", "Live operations"],
    metrics: [
      {
        value: "Multi",
        label: "Agency operations",
        description: "Shared workflows across locations and teams",
      },
      {
        value: "End-to-end",
        label: "Booking workflow",
        description: "From travel discovery to operational management",
      },
      {
        value: "Live",
        label: "Business system",
        description: "Used in the agency’s daily operation",
      },
    ],
    stack: [
      "Product strategy",
      "Brand design",
      "UX/UI design",
      "Web engineering",
      "Booking workflows",
      "Operations architecture",
    ],
    challenge:
      "The agency’s public experience and internal operation needed to work as one connected system rather than a collection of disconnected tools and manual processes.",
    solution:
      "Casevia created a unified digital foundation spanning brand, website, booking journeys, travel inventory, and the operational workflows used by multiple agencies.",
    caseStudy: [
      {
        eyebrow: "The brief",
        title: "Turn a complex travel business into one coherent experience.",
        body:
          "Agim Tours manages far more than destination pages. Its teams coordinate hotels, tours, bookings, customers, and agency-level operations. The challenge was to make the public brand feel clear while giving the business a serious operational backbone.",
      },
      {
        eyebrow: "Customer experience",
        title: "A travel website built to create confidence before the journey begins.",
        body:
          "The public experience organizes destinations, accommodation, tours, and agency information around the questions travelers actually have. The visual direction gives the established company a more consistent and credible digital presence.",
      },
      {
        eyebrow: "Operations",
        title: "One management system across agencies and bookings.",
        body:
          "Behind the website, the operational platform supports the workflows that keep the business moving: managing travel products, coordinating bookings, and maintaining visibility across multiple agencies and teams.",
      },
      {
        eyebrow: "Outcome",
        title: "A digital platform that serves both customers and the business behind them.",
        body:
          "The result is not a standalone marketing site. It is a connected business platform that improves how Agim Tours presents its offer, handles demand, and manages day-to-day travel operations.",
      },
    ],
    seoTitle: "Agim Tours Case Study | Travel Agency Platform",
    seoDescription:
      "Case study for Agim Tours: brand, travel website, booking experience, and multi-agency operations platform.",
  },
  {
    slug: "hakbus",
    name: "Hakbus",
    role: "Product engineering and platform development",
    period: "2022 — 2023",
    status: "Operational transport platform",
    clientType: "Transport operator",
    industry: "Transport / Ticketing",
    featured: true,
    homepageFeatured: true,
    showInHeroStrip: true,
    headline: "Passenger booking and operations, connected across every platform.",
    subheadline:
      "A multi-platform ticketing system supporting route discovery, passenger bookings, mobile access, dashboards, and operator workflows.",
    summary:
      "A digital ticketing and operations platform for a major Balkan transport operator.",
    description:
      "Hakbus needed customer-facing booking tools and internal operational interfaces to work together reliably. Casevia helped shape a connected product system spanning web, mobile, and dashboards for a transport business operating at meaningful scale.",
    liveUrl: "https://hakbus.org",
    liveLabel: "Visit Hakbus",
    logoImage: "/logos/hakbus.png",
    logoAlt: "Hakbus logo",
    logoImageClassName: "h-7 max-h-7",
    initials: "HB",
    visualTheme: "hakbus",
    coverImage: "/work/hakbus.webp",
    coverAlt: "Hakbus transport booking platform",
    heroImage: "/work/hakbus.webp",
    heroAlt: "Hakbus digital ticketing platform",
    galleryImages: [
      {
        src: "/work/hakbus/booking-flow.png",
        alt: "Hakbus route search and booking flow",
        type: "flow",
      },
      {
        src: "/work/hakbus/dashboard.png",
        alt: "Hakbus internal operator dashboard",
        type: "dashboard",
      },
    ],
    services: [
      "Product engineering",
      "Booking experience",
      "Mobile development",
      "Dashboard development",
      "Operational tooling",
    ],
    deliverables: [
      "Web booking experience",
      "Mobile app flows",
      "Internal dashboards",
      "Operator workflows",
      "Responsive interface system",
    ],
    categories: ["Booking", "Transport", "Mobile App", "Operations", "Client Work"],
    proof: ["100+ buses", "100k+ visitors", "Thousands of bookings"],
    metrics: [
      { value: "100+", label: "Buses", description: "Regional transport fleet" },
      { value: "100k+", label: "Visitors", description: "Public platform traffic" },
      { value: "Multi", label: "Platform", description: "Web, mobile, and operations" },
    ],
    stack: ["React Native", "Expo", "Next.js", "TypeScript", "Analytics", "Booking systems"],
    challenge:
      "A high-volume transport operator needed reliable customer booking experiences and internal tools across several operational touchpoints.",
    solution:
      "Casevia connected passenger-facing mobile and web journeys with dashboards designed around the realities of transport operations.",
    caseStudy: [
      {
        eyebrow: "The brief",
        title: "A transport operator needed a product system, not a brochure site.",
        body:
          "The platform had to support route discovery and passenger booking while giving internal teams practical views into the operation behind every journey.",
      },
      {
        eyebrow: "Product architecture",
        title: "Web, mobile, and dashboards designed as one service.",
        body:
          "Customer journeys and operational workflows were treated as parts of the same product. Shared patterns helped keep booking clear for passengers and information useful for operators.",
      },
      {
        eyebrow: "Execution",
        title: "Interfaces built around real transport constraints.",
        body:
          "The work focused on route clarity, responsive booking flows, operational visibility, and maintainable components capable of supporting real traffic and day-to-day use.",
      },
      {
        eyebrow: "Outcome",
        title: "A stronger digital foundation for passengers and operators.",
        body:
          "Hakbus demonstrates how product design and engineering can improve both sides of an operational business: the customer experience and the system that delivers it.",
      },
    ],
    seoTitle: "Hakbus Case Study | Transport Booking Platform",
    seoDescription:
      "Case study for Hakbus, a multi-platform ticketing and transport operations system.",
  },
  {
    slug: "doros-premium",
    name: "Doros Premium",
    role: "E-commerce design and frontend development",
    period: "2025",
    status: "Live e-commerce website",
    clientType: "Swiss retail brand",
    industry: "Coffee / Retail",
    featured: true,
    homepageFeatured: true,
    showInHeroStrip: true,
    headline: "A premium storefront for a coffee brand entering a new market.",
    subheadline:
      "A responsive e-commerce experience shaped around product discovery, brand trust, and commercial expansion into Macedonia.",
    summary:
      "A refined e-commerce website for a Swiss coffee brand expanding into Macedonia.",
    description:
      "Doros Premium needed a storefront that could translate established product quality into a credible new-market experience. Casevia created a cleaner retail system with focused product presentation and responsive browsing.",
    liveUrl: "https://dorospremium.com.mk",
    liveLabel: "Visit Doros Premium",
    logoImage: "/logos/doros.svg",
    logoAlt: "Doros Premium logo",
    logoImageClassName: "h-6 max-h-6",
    initials: "DP",
    visualTheme: "doros",
    coverImage: "/work/doros-premium.webp",
    coverAlt: "Doros Premium e-commerce website",
    heroImage: "/work/doros-premium.webp",
    heroAlt: "Doros Premium online storefront",
    galleryImages: [],
    services: ["Digital direction", "E-commerce UX", "Interface design", "Frontend development", "Launch support"],
    deliverables: ["Online storefront", "Product browsing", "Responsive pages", "SEO foundations", "Visual system"],
    categories: ["E-commerce", "Business Website", "Client Work"],
    proof: ["Swiss client", "New-market launch", "E-commerce platform"],
    metrics: [
      { value: "Swiss", label: "Brand", description: "Adapted for a new regional market" },
      { value: "Mobile", label: "Commerce", description: "Responsive product discovery" },
      { value: "Live", label: "Storefront", description: "Public commercial platform" },
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "E-commerce UX", "Responsive design", "SEO"],
    challenge:
      "The brand needed to establish trust in a new market without losing the premium positioning of its product range.",
    solution:
      "Casevia translated the brand into a focused storefront with clear product hierarchy, strong mobile behavior, and a more credible path to purchase.",
    caseStudy: [
      {
        eyebrow: "The brief",
        title: "Make an established product feel credible in a new market.",
        body:
          "The website had to introduce the brand, explain the range, and create enough trust for customers encountering Doros Premium for the first time.",
      },
      {
        eyebrow: "Visual direction",
        title: "Let the product carry the experience.",
        body:
          "A restrained layout, deliberate spacing, and clear product hierarchy gave the brand room to feel premium without adding unnecessary visual noise.",
      },
      {
        eyebrow: "Commerce",
        title: "Product discovery designed for smaller screens first.",
        body:
          "The browsing structure makes categories and product details easier to understand across devices, keeping the commercial journey direct and comfortable.",
      },
      {
        eyebrow: "Outcome",
        title: "A storefront ready to support market expansion.",
        body:
          "The final platform gives Doros Premium a consistent retail presence and a stronger foundation for product discovery and customer trust.",
      },
    ],
    seoTitle: "Doros Premium Case Study | E-commerce Website",
    seoDescription:
      "Case study for Doros Premium, a responsive coffee e-commerce website created for market expansion.",
  },
  {
    slug: "logly",
    name: "Logly",
    role: "Product strategy and mobile engineering",
    period: "2026 — Present",
    status: "Live iOS product",
    clientType: "Casevia venture",
    industry: "Health / AI / Nutrition",
    featured: true,
    showInHeroStrip: true,
    headline: "Nutrition tracking without the repetitive data entry.",
    subheadline:
      "A production iOS app that turns natural-language meal descriptions into structured nutrition data, goals, and useful weekly insights.",
    summary:
      "An AI nutrition tracker with natural-language logging, subscriptions, Health sync, and analytics.",
    description:
      "Logly explores a faster model for everyday food tracking. Users describe a meal naturally; the product structures the information into calories and macros while maintaining the goals, insights, and account systems expected from a production health app.",
    liveUrl: "https://uselogly.app",
    liveLabel: "Visit Logly",
    logoImage: "/logos/logly.svg",
    logoAlt: "Logly logo",
    logoImageClassName: "h-7 max-h-7",
    initials: "L",
    visualTheme: "logly",
    coverImage: "/work/logly.webp",
    coverAlt: "Logly AI nutrition tracker",
    heroImage: "/work/logly.webp",
    heroAlt: "Logly iOS nutrition app",
    galleryImages: [],
    services: ["Product strategy", "Mobile UX", "iOS development", "AI integration", "Subscription architecture", "Analytics"],
    deliverables: ["iOS app", "AI meal logging", "Onboarding", "Subscriptions", "Apple Health sync", "Weekly insights"],
    categories: ["AI", "Mobile App"],
    proof: ["Live iOS app", "200+ users", "AI and Health sync"],
    metrics: [
      { value: "200+", label: "Users", description: "Registered accounts" },
      { value: "Live", label: "iOS app", description: "Published production product" },
      { value: "AI", label: "Meal logging", description: "Natural language to nutrition data" },
    ],
    stack: ["React Native", "Expo", "TypeScript", "Convex", "RevenueCat", "Apple Health", "PostHog", "OpenAI"],
    challenge:
      "Traditional calorie tracking is too slow and repetitive for many users to maintain consistently.",
    solution:
      "Casevia designed and built an AI-first mobile workflow that turns plain-language meals into trackable nutrition data and connects it to a complete subscription product.",
    caseStudy: [
      {
        eyebrow: "Product problem",
        title: "Food logging asks too much effort for a daily habit.",
        body:
          "Database search, weighing, and repeated manual input create friction exactly where a tracking product needs consistency. Logly starts with the way people already describe food.",
      },
      {
        eyebrow: "Core interaction",
        title: "Natural language in. Structured nutrition out.",
        body:
          "The central flow converts a meal description into estimated calories, macros, and nutritional context, then lets the user review and continue without breaking momentum.",
      },
      {
        eyebrow: "Product system",
        title: "A complete mobile product around the AI interaction.",
        body:
          "Onboarding, goals, Apple Health context, subscriptions, analytics, Pro access, and weekly insights turn the core idea into a product that can operate and improve over time.",
      },
      {
        eyebrow: "Outcome",
        title: "An iOS product shipped to real users.",
        body:
          "Logly brings product strategy, mobile engineering, AI infrastructure, subscriptions, and analytics together in one continuously evolving product.",
      },
    ],
    seoTitle: "Logly Case Study | AI Nutrition Tracker",
    seoDescription:
      "Case study for Logly, an AI nutrition tracker with natural-language logging and Apple Health sync.",
  },
  {
    slug: "gobusly",
    name: "GoBusly",
    role: "Product strategy and platform development",
    period: "2025 — Present",
    status: "Live booking platform",
    clientType: "Casevia venture",
    industry: "Transport / Booking",
    featured: true,
    showInHeroStrip: true,
    headline: "A clearer way to find and book routes between the Balkans and Europe.",
    subheadline:
      "A transport marketplace combining route discovery, operator workflows, payments, communication, and search-led destination content.",
    summary:
      "A live bus-booking platform connecting travelers with Balkan and European routes.",
    description:
      "GoBusly addresses a fragmented travel market with one focused booking experience. Route pages, payments, operator workflows, and transactional communication work together as a platform rather than separate features.",
    liveUrl: "https://gobusly.com",
    liveLabel: "Visit GoBusly",
    logoImage: "/logos/gobusly.svg",
    logoAlt: "GoBusly logo",
    logoImageClassName: "h-7 max-h-7",
    initials: "GB",
    visualTheme: "gobusly",
    coverImage: "/work/gobusly.webp",
    coverAlt: "GoBusly booking platform",
    heroImage: "/work/gobusly.webp",
    heroAlt: "GoBusly route booking experience",
    galleryImages: [],
    services: ["Product strategy", "Booking UX", "Platform development", "Payments", "Operator workflows", "SEO architecture"],
    deliverables: ["Booking platform", "Route pages", "Destination pages", "Payment flow", "Operator tools", "Email notifications"],
    categories: ["Booking", "Transport", "Operations"],
    proof: ["20k+ visitors", "Live operators", "Balkan–EU routes"],
    metrics: [
      { value: "20k+", label: "Visitors", description: "Public platform traffic" },
      { value: "Live", label: "Operators", description: "Real booking workflows" },
      { value: "Balkan–EU", label: "Routes", description: "Cross-border travel focus" },
    ],
    stack: ["Next.js", "TypeScript", "Node.js", "MongoDB", "Stripe", "Resend", "SEO architecture"],
    challenge:
      "International bus booking in the region is fragmented across offline counters, phone calls, and inconsistent operator experiences.",
    solution:
      "Casevia built a destination-led booking platform that brings discovery, reservations, payments, operators, and customer communication into one system.",
    caseStudy: [
      {
        eyebrow: "Market problem",
        title: "Cross-border bus travel lacked a dependable digital journey.",
        body:
          "Travelers often move between operator websites, phone calls, and offline counters. GoBusly was shaped around making route discovery and booking feel more transparent.",
      },
      {
        eyebrow: "Platform",
        title: "Route discovery and operations designed together.",
        body:
          "The customer journey connects destination content, route selection, booking, payment, and transactional email while operator workflows support the supply behind it.",
      },
      {
        eyebrow: "Growth",
        title: "Search architecture built around real travel intent.",
        body:
          "Route and destination pages answer specific travel searches, allowing useful content and the booking product to reinforce one another.",
      },
      {
        eyebrow: "Outcome",
        title: "A live marketplace for a specific transport region.",
        body:
          "GoBusly combines product strategy, booking infrastructure, operator workflows, payments, and acquisition into one production platform.",
      },
    ],
    seoTitle: "GoBusly Case Study | Bus Booking Platform",
    seoDescription:
      "Case study for GoBusly, a booking platform for Balkan and European bus routes.",
  },
  {
    slug: "nextloop",
    name: "Nextloop",
    role: "Marketplace design and frontend development",
    period: "2025",
    status: "Luxury marketplace",
    clientType: "Swiss marketplace client",
    industry: "Luxury / Marketplace",
    featured: true,
    showInHeroStrip: true,
    headline: "Luxury commerce designed around discovery, trust, and live bidding.",
    subheadline:
      "A Swiss marketplace experience balancing high-end product presentation with the functional demands of auctions and bidding.",
    summary:
      "A luxury goods marketplace with premium browsing, auction, and bidding experiences.",
    description:
      "Nextloop needed the confidence of a luxury storefront and the clarity of a transactional marketplace. Casevia designed a responsive experience where product storytelling and auction interactions support one another.",
    liveUrl: "https://nextloop.ch",
    liveLabel: "Visit Nextloop",
    logoImage: "/logos/nextloop.svg",
    logoAlt: "Nextloop logo",
    logoImageClassName: "h-8 max-h-8",
    initials: "NL",
    visualTheme: "nextloop",
    coverImage: "/work/nextloop.webp",
    coverAlt: "Nextloop luxury marketplace",
    heroImage: "/work/nextloop.webp",
    heroAlt: "Nextloop auction and marketplace experience",
    galleryImages: [],
    services: ["Marketplace UX", "Interface design", "Frontend development", "Auction UX", "Responsive design"],
    deliverables: ["Marketplace website", "Product browsing", "Auction flows", "Bidding experience", "Responsive frontend"],
    categories: ["Marketplace", "E-commerce", "Client Work"],
    proof: ["Swiss client", "Luxury marketplace", "Live auction flows"],
    metrics: [
      { value: "Swiss", label: "Market", description: "High-trust commercial context" },
      { value: "Live", label: "Auctions", description: "Bidding-oriented interactions" },
      { value: "Luxury", label: "Commerce", description: "Editorial product presentation" },
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Marketplace UX", "Auction flows", "Responsive design"],
    challenge:
      "The platform had to feel premium and trustworthy while still making complex auction actions easy to understand.",
    solution:
      "Casevia balanced editorial product presentation with clear marketplace patterns for browsing, evaluation, bidding, and responsive use.",
    caseStudy: [
      {
        eyebrow: "The brief",
        title: "Luxury goods cannot be presented like generic inventory.",
        body:
          "The marketplace needed enough restraint to let each item feel considered while preserving the information and actions buyers need to make a decision.",
      },
      {
        eyebrow: "Experience",
        title: "Editorial product presentation with commercial clarity.",
        body:
          "Layouts use hierarchy and space to support high-end imagery, while consistent interaction patterns keep browsing and evaluation straightforward.",
      },
      {
        eyebrow: "Interaction",
        title: "Auction behavior made legible across the journey.",
        body:
          "Bidding requires clear status, timing, price, and action feedback. Those signals were treated as core product information rather than secondary interface details.",
      },
      {
        eyebrow: "Outcome",
        title: "A marketplace that carries both brand and transaction.",
        body:
          "Nextloop shows how a strong visual system can support complex commerce without compromising clarity or credibility.",
      },
    ],
    seoTitle: "Nextloop Case Study | Luxury Marketplace",
    seoDescription:
      "Case study for Nextloop, a Swiss luxury marketplace with auctions and bidding workflows.",
  },
  {
    slug: "speaksure",
    name: "SpeakSure",
    role: "Product strategy and mobile engineering",
    period: "2026 — Present",
    status: "Live iOS product",
    clientType: "Casevia venture",
    industry: "AI / Communication",
    featured: true,
    showInHeroStrip: true,
    headline: "Practice difficult conversations with feedback that helps.",
    subheadline:
      "An AI speaking coach combining voice recording, transcription, structured feedback, scoring, and repeatable practice scenarios.",
    summary:
      "An AI speaking coach for interviews, leadership updates, negotiations, and difficult conversations.",
    description:
      "SpeakSure gives users a private practice loop before high-pressure conversations. The product records and transcribes an answer, then returns structured feedback and a clearer rewritten response.",
    liveUrl: "https://speaksure.app",
    liveLabel: "Visit SpeakSure",
    logoImage: "/logos/speaksure.svg",
    logoAlt: "SpeakSure logo",
    logoImageClassName: "h-7 max-h-7",
    initials: "S",
    visualTheme: "speaksure",
    coverImage: "/work/speaksure.webp",
    coverAlt: "SpeakSure AI communication coach",
    heroImage: "/work/speaksure.webp",
    heroAlt: "SpeakSure iOS practice experience",
    galleryImages: [],
    services: ["Product strategy", "Mobile UX", "iOS development", "AI audio workflows", "Subscription architecture"],
    deliverables: ["iOS app", "Voice recording", "Transcription", "AI feedback", "Scenario library", "Drill history"],
    categories: ["AI", "Mobile App"],
    proof: ["Live iOS app", "AI voice feedback", "Subscription-ready"],
    metrics: [
      { value: "Voice", label: "Input", description: "Practice through natural speech" },
      { value: "AI", label: "Feedback", description: "Structured coaching and rewrites" },
      { value: "Live", label: "iOS app", description: "Production mobile product" },
    ],
    stack: ["React Native", "Expo", "TypeScript", "Convex", "RevenueCat", "PostHog", "Deepgram", "OpenAI"],
    challenge:
      "People rarely receive useful feedback before the interviews, negotiations, and leadership conversations where communication matters most.",
    solution:
      "Casevia built a repeatable mobile practice loop combining voice capture, transcription, scoring, AI coaching, and subscription-aware access.",
    caseStudy: [
      {
        eyebrow: "Product problem",
        title: "Important conversations are usually practiced without feedback.",
        body:
          "Interviews, negotiations, and leadership updates carry real consequences, but most preparation happens alone. SpeakSure turns that rehearsal into a structured practice session.",
      },
      {
        eyebrow: "Core interaction",
        title: "Record, understand, improve, and try again.",
        body:
          "A voice answer becomes a transcript, scores, specific feedback, and a stronger rewritten response. The loop is designed to make improvement concrete rather than abstract.",
      },
      {
        eyebrow: "Product system",
        title: "Scenario-based coaching inside a production mobile product.",
        body:
          "Onboarding, drill history, analytics, Pro-aware access, and a growing scenario library support repeated use beyond a single AI interaction.",
      },
      {
        eyebrow: "Outcome",
        title: "A focused AI product built around behavior change.",
        body:
          "SpeakSure brings audio processing, AI feedback, mobile UX, and subscription infrastructure together around a clear user outcome: communicating with more confidence.",
      },
    ],
    seoTitle: "SpeakSure Case Study | AI Speaking Coach",
    seoDescription:
      "Case study for SpeakSure, an AI speaking coach with voice recording, transcription, and feedback.",
  },
  {
    slug: "am-gebaeudereinigung",
    name: "AM Gebäudereinigung",
    role: "Business website and CMS development",
    period: "2022",
    status: "Live client website",
    clientType: "German service business",
    industry: "Cleaning services",
    featured: true,
    showInHeroStrip: true,
    headline: "A clearer digital presence for a Hamburg service business.",
    subheadline:
      "A responsive, CMS-backed website designed to improve service clarity, credibility, and lead generation.",
    summary:
      "A business website and content system for a commercial cleaning company in Hamburg.",
    description:
      "AM Gebäudereinigung needed to explain its services more clearly and maintain content without depending on development work. Casevia delivered a focused service website with an editable content foundation.",
    liveUrl: "https://www.amgebaeudereinigung.hamburg/",
    liveLabel: "Visit website",
    logoImage: "/logos/am.svg",
    logoAlt: "AM Gebäudereinigung logo",
    logoImageClassName: "h-8 max-h-8",
    initials: "AM",
    visualTheme: "am",
    coverImage: "/work/am.webp",
    coverAlt: "AM Gebäudereinigung website",
    heroImage: "/work/am.webp",
    heroAlt: "AM Gebäudereinigung headless CMS website",
    galleryImages: [],
    services: ["Content strategy", "Interface design", "Frontend development", "Headless CMS", "SEO foundations"],
    deliverables: ["Business website", "Service pages", "Headless CMS", "Responsive frontend", "Lead-generation flow"],
    categories: ["Business Website", "CMS", "Client Work"],
    proof: ["Hamburg client", "Headless CMS", "Lead-generation website"],
    metrics: [
      { value: "Headless", label: "CMS", description: "Editable service information" },
      { value: "Lead", label: "Focused", description: "Clearer inquiry paths" },
      { value: "Live", label: "Website", description: "Operational client platform" },
    ],
    stack: ["Next.js", "Tailwind CSS", "Headless CMS", "SEO", "Responsive design"],
    challenge:
      "The business needed a more credible web presence and a practical way to keep service content current.",
    solution:
      "Casevia organized the offer around customer intent, built a responsive frontend, and connected it to a manageable content system.",
    caseStudy: [
      {
        eyebrow: "The brief",
        title: "Make a service business easier to understand and trust.",
        body:
          "The existing digital presence did not communicate the range or quality of the company’s services clearly enough for prospective customers.",
      },
      {
        eyebrow: "Structure",
        title: "Service content organized around customer intent.",
        body:
          "Pages were structured around the work customers search for, with direct information and clearer paths to inquiry across screen sizes.",
      },
      {
        eyebrow: "Operations",
        title: "A CMS that keeps routine updates practical.",
        body:
          "The content system allows the business to maintain key service information without turning every change into a development task.",
      },
    ],
    seoTitle: "AM Gebäudereinigung Case Study | Business Website",
    seoDescription:
      "Case study for a CMS-backed service website created for AM Gebäudereinigung in Hamburg.",
  },
];

const homepageProjectSlugs = ["hakbus", "doros-premium", "logly"];

const heroStripProjectSlugs = [
  "agim-tours",
  "hakbus",
  "doros-premium",
  "logly",
  "speaksure",
  "gobusly",
  "nextloop",
  "am-gebaeudereinigung",
];

export const projectCategories: ProjectCategory[] = [
  "Travel",
  "Operations",
  "Booking",
  "Transport",
  "E-commerce",
  "Marketplace",
  "AI",
  "Mobile App",
  "Business Website",
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getFeaturedProjects() {
  return projects.filter((project) => project.featured);
}

export function getHomepageProjects() {
  return homepageProjectSlugs
    .map((slug) => getProject(slug))
    .filter((project): project is Project => Boolean(project));
}

export function getHeroStripProjects() {
  return heroStripProjectSlugs
    .map((slug) => getProject(slug))
    .filter(
      (project): project is Project =>
        Boolean(project?.showInHeroStrip && project.logoImage),
    );
}

export function getProjectsByCategory(category: ProjectCategory) {
  return projects.filter((project) => project.categories.includes(category));
}

export function getRelatedProjects(slug: string, limit = 2) {
  const currentProject = getProject(slug);

  if (!currentProject) return [];

  return projects
    .filter((project) => project.slug !== slug)
    .filter((project) =>
      project.categories.some((category) =>
        currentProject.categories.includes(category),
      ),
    )
    .slice(0, limit);
}

export function getNextProject(slug: string) {
  const featuredProjects = getFeaturedProjects();
  const currentIndex = featuredProjects.findIndex(
    (project) => project.slug === slug,
  );

  if (currentIndex === -1 || featuredProjects.length < 2) return null;

  return featuredProjects[(currentIndex + 1) % featuredProjects.length];
}
