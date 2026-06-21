export type ProjectCategory =
    | "AI"
    | "Mobile App"
    | "Booking"
    | "Transport"
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
    impact: string;
    featuredReason: string;

    featured?: boolean;
    homepageFeatured?: boolean;
    showInHeroStrip?: boolean;

    liveUrl?: string;
    liveLabel?: string;

    icon?: string;
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
    scope: string[];
    highlights: string[];
    outcome: string[];

    challenge: string;
    solution: string;

    seoTitle?: string;
    seoDescription?: string;
};

export const projects: Project[] = [
    {
        slug: "hakbus",
        name: "Hakbus",
        role: "Product engineering and platform development",
        period: "2022 — 2023",
        status: "Major client platform",
        clientType: "Transport operator",
        industry: "Transport / Ticketing",
        featured: true,
        homepageFeatured: true,
        showInHeroStrip: true,

        headline:
            "Digital ticketing and operations platform for a major Balkan bus operator.",
        subheadline:
            "A multi-platform transport system covering passenger booking, mobile experiences, internal dashboards, and operator workflows.",
        impact: "100+ buses · 100k+ visitors · Thousands of bookings",
        featuredReason:
            "Hakbus is one of the strongest operational projects in the Casevia portfolio. It demonstrates transport-specific software, booking flows, mobile product work, and internal business tooling at real scale.",

        summary:
            "A complete digital ticketing system for a Balkan transport operator, covering mobile apps, web booking, dashboards, and operational workflows.",
        description:
            "Hakbus needed a digital system that could support passengers, bookings, route visibility, and internal transport operations across multiple touchpoints. Casevia contributed to the product experience across mobile, web, and dashboard interfaces.",

        liveUrl: "https://hakbus.org",
        liveLabel: "Open Hakbus",

        icon: "/hakbus.webp",
        logoImage: "/logos/hakbus.png",
        logoAlt: "Hakbus logo",
        logoImageClassName: "h-7 max-h-7",

        initials: "HB",
        visualTheme: "hakbus",

        coverImage: "/work/hakbus.webp",
        coverAlt: "Hakbus transport booking platform preview",
        heroImage: "/work/hakbus.webp",
        heroAlt: "Hakbus digital ticketing platform preview",
        coverImageClassName: "",

        galleryImages: [
            {
                src: "/work/hakbus/booking-flow.png",
                alt: "Hakbus route search and booking flow",
                label: "Booking flow",
                description:
                    "Passenger-facing route search and booking flow designed around clarity, speed, and route availability.",
                type: "flow",
            },
            {
                src: "/work/hakbus/dashboard.png",
                alt: "Hakbus internal dashboard and operator tools",
                label: "Internal dashboard",
                description:
                    "Operational dashboard views for managing transport workflows, bookings, and route activity.",
                type: "dashboard",
            },
            {
                src: "/work/hakbus/mobile-app.webp",
                alt: "Hakbus mobile app screens",
                label: "Mobile app",
                description:
                    "Mobile passenger screens for route discovery, ticket access, and booking-related actions.",
                type: "mobile",
            },
        ],

        services: [
            "Product engineering",
            "Frontend development",
            "Mobile app development",
            "Dashboard development",
            "Booking UX",
            "Operational tooling",
        ],
        deliverables: [
            "Mobile app flows",
            "Web booking experience",
            "Internal dashboards",
            "Operator workflows",
            "Responsive UI",
        ],

        categories: ["Booking", "Transport", "Mobile App", "Client Work"],
        proof: ["100+ buses", "100k+ visitors", "Thousands of bookings"],
        metrics: [
            {
                value: "100+",
                label: "Buses",
                description: "Large regional transport operation",
            },
            {
                value: "100k+",
                label: "Visitors",
                description: "Public traffic across the platform",
            },
            {
                value: "Multi",
                label: "Platform",
                description: "Mobile, web, and dashboard interfaces",
            },
        ],

        stack: [
            "React Native",
            "Expo",
            "Next.js",
            "TypeScript",
            "Dashboards",
            "Analytics",
            "Booking flows",
        ],

        scope: [
            "Mobile app interfaces",
            "Web booking flows",
            "Admin dashboards",
            "Passenger booking UX",
            "Operator workflows",
            "Analytics views",
            "Responsive frontend",
        ],

        challenge:
            "A transport operator with real operational volume needed reliable digital systems across passenger booking, mobile access, web flows, and internal operations.",
        solution:
            "Casevia contributed to a multi-platform product system connecting customer-facing booking experiences with operational dashboards and transport-specific workflows.",

        caseStudy: [
            {
                eyebrow: "Starting point",
                title: "A real operator needed more than a public website.",
                body:
                    "Hakbus was not a brochure project. The business needed digital systems that could support route discovery, passenger booking, mobile access, and internal transport operations across multiple touchpoints.",
            },
            {
                eyebrow: "Product system",
                title: "Mobile, web, and dashboards working together.",
                body:
                    "The platform connected customer-facing mobile and web booking experiences with internal dashboard views. The goal was to make the system useful for passengers while supporting the operational workflows behind the business.",
            },
            {
                eyebrow: "Execution",
                title: "Built around booking, operations, and reliability.",
                body:
                    "Transport software needs practical product decisions. The work focused on clear route flows, responsive interfaces, operational views, and production-ready components that could support real business use.",
            },
            {
                eyebrow: "Result",
                title: "A serious proof point for transport software.",
                body:
                    "Hakbus demonstrates Casevia’s ability to support operational businesses, not just static marketing websites. It shows experience across mobile products, booking systems, dashboards, and real-world transport workflows.",
            },
        ],

        highlights: [
            "Customer-facing booking experiences across mobile and web.",
            "Dashboard and internal tool interfaces for transport operations.",
            "Production UI for a real operator with meaningful regional activity.",
            "Multi-platform product work across mobile, web, and business workflows.",
        ],
        outcome: [
            "A stronger digital foundation for route visibility, passenger booking, and transport operations.",
            "A serious portfolio proof point across mobile apps, web apps, dashboards, and transport workflows.",
            "A more credible digital product experience for a real operational business.",
        ],

        seoTitle: "Hakbus Case Study | Transport Booking Platform",
        seoDescription:
            "Case study for Hakbus, a digital ticketing and operations platform for a Balkan bus operator.",
    },

    {
        slug: "doros-premium",
        name: "Doros Premium",
        role: "E-commerce design and frontend development",
        period: "2025",
        status: "E-commerce website",
        clientType: "Swiss e-commerce client",
        industry: "Coffee / Retail",
        featured: true,
        homepageFeatured: true,
        showInHeroStrip: true,

        headline:
            "Premium e-commerce website for a Swiss coffee brand entering Macedonia.",
        subheadline:
            "A polished retail experience built around product presentation, trust, responsive shopping, and market expansion.",
        impact: "Swiss client · Premium retail · Macedonian expansion",
        featuredReason:
            "Doros Premium adds a strong client-commerce case study to the Casevia portfolio. It shows premium visual direction, responsive e-commerce execution, and commercial website delivery for a real business.",

        summary:
            "A premium e-commerce website for a Swiss coffee brand expanding into the Macedonian market.",
        description:
            "Doros Premium needed a digital storefront that made the brand feel credible, polished, and ready for a new market. Casevia shaped the website around premium product presentation, responsive browsing, and a cleaner retail experience.",

        liveUrl: "https://dorospremium.com.mk",
        liveLabel: "Open Doros Premium",

        initials: "DP",
        icon: "/doros.svg",
        logoImage: "/logos/doros.svg",
        logoAlt: "Doros Premium logo",
        logoImageClassName: "h-6 max-h-6",

        visualTheme: "doros",

        coverImage: "/work/doros-premium.webp",
        coverAlt: "Doros Premium e-commerce website preview",
        heroImage: "/work/doros-premium.webp",
        heroAlt: "Doros Premium e-commerce website preview",
        coverImageClassName: "",

        galleryImages: [],

        services: [
            "Interface design",
            "Frontend development",
            "E-commerce UI",
            "Responsive design",
            "Product presentation",
            "Launch support",
        ],
        deliverables: [
            "E-commerce website",
            "Product browsing",
            "Responsive pages",
            "Premium visual direction",
            "SEO foundations",
        ],

        categories: ["E-commerce", "Business Website", "Client Work"],
        proof: ["Swiss client", "E-commerce launch", "Macedonian expansion"],
        metrics: [
            {
                value: "Premium",
                label: "Brand feel",
                description: "Positioned for trust and credibility",
            },
            {
                value: "Mobile",
                label: "Optimized",
                description: "Responsive shopping experience",
            },
            {
                value: "Launch",
                label: "Ready",
                description: "Public commercial website",
            },
        ],

        stack: [
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "E-commerce UI",
            "Responsive design",
            "SEO",
        ],

        scope: [
            "E-commerce website",
            "Product pages",
            "Premium visual direction",
            "Mobile optimization",
            "Content structure",
            "Launch support",
        ],

        challenge:
            "The brand needed a polished online presence that could communicate quality, support product discovery, and feel credible in a new market.",
        solution:
            "Casevia developed a clean e-commerce experience with strong product presentation, responsive pages, clear browsing, and a premium visual direction aligned with the brand’s market positioning.",

        caseStudy: [
            {
                eyebrow: "Starting point",
                title: "A premium product needed a premium digital presence.",
                body:
                    "Doros Premium needed to avoid the feeling of a generic local shop. The website had to communicate quality, trust, and retail clarity for a Swiss brand entering the Macedonian market.",
            },
            {
                eyebrow: "Visual direction",
                title: "A clean retail experience built around trust.",
                body:
                    "The interface focused on spacing, simple navigation, clear product sections, and a refined visual tone. The goal was to make the brand feel serious while keeping browsing simple.",
            },
            {
                eyebrow: "Shopping flow",
                title: "Product browsing that works on mobile.",
                body:
                    "The website was structured for responsive shopping, helping users understand the products, browse the catalogue, and move through the site comfortably on mobile devices.",
            },
            {
                eyebrow: "Result",
                title: "A commercial website ready for expansion.",
                body:
                    "Doros Premium demonstrates Casevia’s ability to translate a real business expansion into a polished digital storefront with strong visual execution and practical e-commerce structure.",
            },
        ],

        highlights: [
            "Premium e-commerce website for coffee capsules and related products.",
            "Responsive product browsing and clean conversion-focused pages.",
            "Visual direction shaped around trust, clarity, and premium positioning.",
            "Commercial website delivery for a Swiss client expanding into Macedonia.",
        ],
        outcome: [
            "A stronger digital presence for a real e-commerce business.",
            "A polished storefront that supports brand trust and product discovery.",
            "A strong case study for premium e-commerce and client delivery.",
        ],

        seoTitle: "Doros Premium Case Study | Premium E-commerce Website",
        seoDescription:
            "Case study for Doros Premium, a premium coffee e-commerce website built for a Swiss client expanding into Macedonia.",
    },

    {
        slug: "logly",
        name: "Logly",
        role: "Product strategy and mobile engineering",
        period: "2026 — Present",
        status: "Live iOS app",
        clientType: "Casevia-owned product",
        industry: "Health / AI / Nutrition",
        featured: true,
        homepageFeatured: true,
        showInHeroStrip: true,

        headline:
            "AI nutrition tracking app with real users, subscriptions, and Health sync.",
        subheadline:
            "A production iOS app with natural-language food logging, macro estimates, Apple Health integration, analytics, onboarding, and Pro subscriptions.",
        impact: "Live iOS app · 200+ users · AI + subscriptions",
        featuredReason:
            "Logly proves end-to-end product ownership inside Casevia: product strategy, mobile engineering, AI workflows, subscriptions, analytics, and real shipping experience.",

        summary:
            "An AI nutrition tracker for iOS with natural-language meal logging, macros, Health sync, subscriptions, and weekly insights.",
        description:
            "Logly is a production iOS nutrition tracker built around faster food logging. Users write what they ate, and the app estimates calories, macros, nutrition details, and progress insights.",

        liveUrl: "https://uselogly.app",
        liveLabel: "Open Logly",

        icon: "/logly.png",
        logoImage: "/logos/logly.svg",
        logoAlt: "Logly logo",
        logoImageClassName: "h-7 max-h-7",

        initials: "L",
        visualTheme: "logly",

        coverImage: "/work/logly.webp",
        coverAlt: "Logly AI nutrition tracker app preview",
        heroImage: "/work/logly.webp",
        heroAlt: "Logly AI nutrition tracker app preview",
        coverImageClassName: "",

        galleryImages: [],

        services: [
            "Product strategy",
            "Mobile app development",
            "AI integration",
            "Subscription architecture",
            "Analytics",
            "App Store launch",
        ],
        deliverables: [
            "iOS app",
            "AI food logging",
            "Onboarding flow",
            "RevenueCat subscriptions",
            "Apple Health sync",
            "Weekly insights",
        ],

        categories: ["AI", "Mobile App"],
        proof: ["Live on App Store", "200+ registered users", "AI + Health sync"],
        metrics: [
            {
                value: "Live",
                label: "iOS app",
                description: "Published mobile product",
            },
            {
                value: "200+",
                label: "Users",
                description: "Registered accounts",
            },
            {
                value: "AI",
                label: "Nutrition",
                description: "Natural-language meal logging",
            },
        ],

        stack: [
            "React Native",
            "Expo",
            "TypeScript",
            "Convex",
            "RevenueCat",
            "Apple Health",
            "PostHog",
            "OpenAI",
        ],

        scope: [
            "iOS app",
            "AI food logging",
            "Subscriptions",
            "Apple Health sync",
            "Analytics",
            "Onboarding",
            "Paywall",
            "App Store release",
        ],

        challenge:
            "Calorie tracking is slow and repetitive, especially for users eating meals that do not fit neatly into generic food databases.",
        solution:
            "Casevia built an AI-first mobile product where users can describe meals naturally, estimate nutrition, track progress, sync Apple Health data, and unlock Pro features through subscriptions.",

        caseStudy: [
            {
                eyebrow: "Product problem",
                title: "Food logging needed to feel less painful.",
                body:
                    "Traditional calorie tracking asks users to search databases, weigh food, and repeat manual steps every day. Logly was designed around a faster interaction: write what you ate, then let AI structure the nutrition data.",
            },
            {
                eyebrow: "Core workflow",
                title: "Natural-language meals into structured nutrition.",
                body:
                    "The main product flow turns plain meal descriptions into calories, macros, and nutrition details. The experience is designed to feel fast enough for everyday use.",
            },
            {
                eyebrow: "Product system",
                title: "Subscriptions, insights, analytics, and Health sync.",
                body:
                    "Beyond AI logging, the product includes onboarding, goals, Apple Health context, RevenueCat subscriptions, PostHog analytics, Pro gating, and weekly insights.",
            },
            {
                eyebrow: "Result",
                title: "A shipped mobile product with real users.",
                body:
                    "Logly demonstrates end-to-end product execution: mobile UX, AI infrastructure, subscriptions, analytics, App Store release, and continued iteration based on real usage.",
            },
        ],

        highlights: [
            "Production iOS app with onboarding, authentication, subscriptions, and analytics.",
            "AI-powered meal parsing for calories, macros, and nutrition estimates.",
            "RevenueCat, Convex, Apple HealthKit, and PostHog integrated across the mobile product.",
            "Pro gating, weekly insights, nutrition targets, and App Store release workflows.",
        ],
        outcome: [
            "A published iOS product with real users.",
            "A strong proof point for mobile, AI, subscriptions, analytics, and product execution.",
            "A Casevia-owned product that shows shipping discipline beyond client websites.",
        ],

        seoTitle: "Logly Case Study | AI Nutrition Tracker iOS App",
        seoDescription:
            "Case study for Logly, a live AI nutrition tracker for iOS with food logging, subscriptions, Apple Health sync, and weekly insights.",
    },

    {
        slug: "gobusly",
        name: "GoBusly",
        role: "Product strategy and platform development",
        period: "2025 — Present",
        status: "Live platform",
        clientType: "Casevia-owned transport product",
        industry: "Transport / Booking",
        featured: true,
        homepageFeatured: false,
        showInHeroStrip: true,

        headline:
            "Bus booking platform for Balkan and European travel routes.",
        subheadline:
            "A transport booking platform with route pages, booking flows, operator workflows, payments, email notifications, and SEO-focused destination pages.",
        impact: "20k+ visitors · Live operators · Balkan ↔ EU routes",
        featuredReason:
            "GoBusly shows booking-platform thinking, SEO structure, transport workflows, payments, route pages, and marketplace-style product strategy.",

        summary:
            "A bus booking platform for Balkan and European routes with route pages, booking flows, payments, and operator workflows.",
        description:
            "GoBusly is a public transport booking platform focused on routes between the Balkans and Europe. The product includes customer-facing route pages, booking flows, payment handling, email notifications, and operator-facing workflows.",

        liveUrl: "https://gobusly.com",
        liveLabel: "Open GoBusly",

        icon: "/gobusly.webp",
        logoImage: "/logos/gobusly.svg",
        logoAlt: "GoBusly logo",
        logoImageClassName: "h-7 max-h-7",

        initials: "GB",
        visualTheme: "gobusly",

        coverImage: "/work/gobusly.webp",
        coverAlt: "GoBusly online bus booking platform preview",
        heroImage: "/work/gobusly.webp",
        heroAlt: "GoBusly bus booking platform preview",
        coverImageClassName: "",

        galleryImages: [],

        services: [
            "Product strategy",
            "Frontend development",
            "Booking UX",
            "Payments",
            "Operator workflows",
            "SEO structure",
        ],
        deliverables: [
            "Booking platform",
            "Route pages",
            "Destination pages",
            "Operator workflows",
            "Payment flow",
            "Email notifications",
        ],

        categories: ["Booking", "Transport"],
        proof: ["20k+ visitors", "Live operators", "Balkan ↔ EU routes"],
        metrics: [
            {
                value: "20k+",
                label: "Visitors",
                description: "Public platform traffic",
            },
            {
                value: "Live",
                label: "Operators",
                description: "Real transport workflows",
            },
            {
                value: "SEO",
                label: "Route pages",
                description: "Destination-driven pages",
            },
        ],

        stack: [
            "Next.js",
            "TypeScript",
            "Node.js",
            "MongoDB",
            "Stripe",
            "Resend",
            "SEO",
        ],

        scope: [
            "Booking flows",
            "Route pages",
            "SEO pages",
            "Operator workflows",
            "Payments",
            "Email notifications",
            "Production deployment",
        ],

        challenge:
            "Bus booking in the Balkan market is fragmented, trust-sensitive, and often handled through outdated flows, manual communication, or offline operator processes.",
        solution:
            "Casevia built a modern booking experience with route discovery, destination pages, booking flows, operator workflows, payments, emails, and a production-ready foundation for expansion.",

        caseStudy: [
            {
                eyebrow: "Market problem",
                title: "International bus booking needed better digital trust.",
                body:
                    "Balkan-to-Europe transport is often fragmented across operators, offline counters, phone calls, and weak digital experiences. GoBusly was built to make route discovery and booking feel clearer.",
            },
            {
                eyebrow: "Product direction",
                title: "Route pages, search flows, and booking structure.",
                body:
                    "The platform focuses on destination-led route pages, clear booking flows, operator workflows, payment handling, and transactional communication through email notifications.",
            },
            {
                eyebrow: "Growth layer",
                title: "SEO pages built around real travel intent.",
                body:
                    "Instead of only building a booking form, the product includes destination and route pages that can capture people searching for specific travel paths between the Balkans and Europe.",
            },
            {
                eyebrow: "Result",
                title: "A real transport product, not a generic marketplace demo.",
                body:
                    "GoBusly demonstrates product thinking across booking UX, operator operations, SEO, payments, and launch strategy in a specific travel market.",
            },
        ],

        highlights: [
            "Customer-facing route pages and booking experiences for international bus routes.",
            "SEO-focused destination and route pages for Balkan and European travel intent.",
            "Production workflows for operators, bookings, payments, and customer communication.",
            "Product, frontend, backend integration, and launch strategy across one focused platform.",
        ],
        outcome: [
            "A live booking platform with real operators.",
            "A strong proof point for product thinking, SEO, payments, and booking workflows.",
            "A production web product in a real transport market.",
        ],

        seoTitle: "GoBusly Case Study | Bus Booking Platform",
        seoDescription:
            "Case study for GoBusly, a bus booking platform for Balkan and European travel routes.",
    },

    {
        slug: "nextloop",
        name: "Nextloop",
        role: "Marketplace design and frontend development",
        period: "2025",
        status: "Swiss marketplace",
        clientType: "Swiss marketplace client",
        industry: "Luxury / Marketplace",
        featured: true,
        homepageFeatured: false,
        showInHeroStrip: true,

        headline:
            "Luxury goods marketplace for a Swiss client with auction and bidding workflows.",
        subheadline:
            "A polished marketplace experience for high-end product browsing, live auctioning, bidding flows, and premium product presentation.",
        impact: "Swiss client · Luxury marketplace · Auction workflows",
        featuredReason:
            "Nextloop shows premium marketplace UI, luxury product presentation, auction UX, and high-end client positioning.",

        summary:
            "A luxury goods marketplace for a Swiss client with premium browsing, auctions, and bidding workflows.",
        description:
            "Nextloop is a luxury goods marketplace built for a Swiss client, focused on high-end product presentation, live auctioning, bidding flows, and a polished marketplace experience.",

        liveUrl: "https://nextloop.ch",
        liveLabel: "Open Nextloop",

        icon: "/nextloop.svg",
        logoImage: "/logos/nextloop.svg",
        logoAlt: "Nextloop logo",
        logoImageClassName: "h-8 max-h-8",

        initials: "NL",
        visualTheme: "nextloop",

        coverImage: "/work/nextloop.webp",
        coverAlt: "Nextloop luxury marketplace preview",
        heroImage: "/work/nextloop.webp",
        heroAlt: "Nextloop luxury marketplace preview",
        coverImageClassName: "",

        galleryImages: [],

        services: [
            "Marketplace UX",
            "Interface design",
            "Frontend development",
            "Auction UX",
            "Responsive design",
            "Launch support",
        ],
        deliverables: [
            "Marketplace website",
            "Product browsing",
            "Auction flows",
            "Bidding UX",
            "Responsive frontend",
        ],

        categories: ["Marketplace", "E-commerce", "Client Work"],
        proof: ["Swiss client", "Luxury marketplace", "Live auction bidding"],
        metrics: [
            {
                value: "Luxury",
                label: "Marketplace",
                description: "Premium product experience",
            },
            {
                value: "Live",
                label: "Auction flows",
                description: "Bidding-oriented UX",
            },
            {
                value: "Swiss",
                label: "Client",
                description: "High-end market positioning",
            },
        ],

        stack: [
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "Marketplace UI",
            "Auction flows",
            "Responsive design",
            "SEO",
        ],

        scope: [
            "Marketplace experience",
            "Luxury product UI",
            "Auction flows",
            "Bidding UX",
            "Responsive design",
            "Frontend architecture",
            "Launch support",
        ],

        challenge:
            "The marketplace needed to feel premium and trustworthy while supporting browsing, product discovery, and auction-oriented interactions.",
        solution:
            "Casevia developed a refined marketplace experience with luxury visual direction, clean product presentation, responsive layouts, and bidding-focused UX patterns.",

        caseStudy: [
            {
                eyebrow: "Starting point",
                title: "A marketplace for high-end goods cannot feel generic.",
                body:
                    "Nextloop needed to present luxury products in a way that felt credible and refined while still supporting marketplace features such as browsing, product discovery, auctions, and bidding.",
            },
            {
                eyebrow: "Experience",
                title: "Premium presentation with functional commerce flows.",
                body:
                    "The interface balances clean product presentation with practical marketplace interaction. The goal was to keep the product experience premium without hiding the actions users need to take.",
            },
            {
                eyebrow: "Interaction",
                title: "Auction and bidding flows shaped the product UX.",
                body:
                    "The marketplace required flows that could support auction-oriented behavior, giving users enough context to browse, evaluate, and act with confidence.",
            },
            {
                eyebrow: "Result",
                title: "A stronger proof point for marketplace work.",
                body:
                    "Nextloop shows that Casevia can work beyond basic websites and support commercial product experiences with more complex interaction patterns.",
            },
        ],

        highlights: [
            "Polished marketplace experience for luxury goods.",
            "Auction and bidding-oriented product flows.",
            "Premium visuals, responsive polish, and clear product browsing.",
            "Marketplace structure that can support future product categories.",
        ],
        outcome: [
            "A premium marketplace experience for a Swiss client.",
            "Proof of commercial UX beyond standard business websites.",
            "A strong case study for marketplace, auction, and frontend execution.",
        ],

        seoTitle: "Nextloop Case Study | Luxury Marketplace Website",
        seoDescription:
            "Case study for Nextloop, a Swiss luxury goods marketplace with auction and bidding workflows.",
    },

    {
        slug: "speaksure",
        name: "SpeakSure",
        role: "Product strategy and mobile engineering",
        period: "2026 — Present",
        status: "Live iOS app",
        clientType: "Casevia-owned product",
        industry: "AI / Communication",
        featured: true,
        homepageFeatured: false,
        showInHeroStrip: true,

        headline:
            "AI speaking coach for interviews, leadership, and difficult conversations.",
        subheadline:
            "A production iOS app with voice recording, transcription, AI feedback, scoring, rewritten answers, drill history, and subscription-aware access.",
        impact: "Live iOS app · AI voice feedback · Subscription-ready",
        featuredReason:
            "SpeakSure shows AI audio workflows, mobile UX, voice recording, transcription, scoring systems, and subscription product experience.",

        summary:
            "An AI speaking coach for interviews, leadership updates, negotiations, and difficult conversations.",
        description:
            "SpeakSure helps users practice high-pressure communication scenarios by recording answers, transcribing speech, and receiving structured AI feedback.",

        liveUrl: "https://speaksure.app",
        liveLabel: "Open SpeakSure",

        icon: "/speaksure.png",
        logoImage: "/logos/speaksure.svg",
        logoAlt: "SpeakSure logo",
        logoImageClassName: "h-7 max-h-7",

        initials: "S",
        visualTheme: "speaksure",

        coverImage: "/work/speaksure.webp",
        coverAlt: "SpeakSure AI speaking coach app preview",
        heroImage: "/work/speaksure.webp",
        heroAlt: "SpeakSure AI speaking coach app preview",
        coverImageClassName: "",

        galleryImages: [],

        services: [
            "Product strategy",
            "Mobile app development",
            "AI integration",
            "Voice UX",
            "Subscription architecture",
            "App Store launch",
        ],
        deliverables: [
            "iOS app",
            "Voice recording",
            "AI transcription",
            "Feedback engine",
            "Drill history",
            "Subscription-ready access",
        ],

        categories: ["AI", "Mobile App"],
        proof: ["Live on App Store", "AI voice feedback", "Subscription-ready"],
        metrics: [
            {
                value: "Live",
                label: "iOS app",
                description: "Published mobile product",
            },
            {
                value: "Voice",
                label: "AI feedback",
                description: "Speech, transcription, and scoring",
            },
            {
                value: "Pro",
                label: "Ready",
                description: "Subscription-aware access",
            },
        ],

        stack: [
            "React Native",
            "Expo",
            "TypeScript",
            "Convex",
            "Deepgram",
            "OpenAI",
            "RevenueCat",
            "PostHog",
        ],

        scope: [
            "Voice recording",
            "AI transcription",
            "Feedback engine",
            "Drill history",
            "Subscriptions",
            "Onboarding",
            "Paywall",
            "App Store release",
        ],

        challenge:
            "People often practice important conversations without structured feedback, making it difficult to improve before interviews, leadership updates, negotiations, or difficult discussions.",
        solution:
            "Casevia built a mobile AI speaking coach with recording, transcription, scoring, rewritten answers, scenario-based drills, and subscription-aware practice flows.",

        caseStudy: [
            {
                eyebrow: "Problem",
                title: "People rarely get useful feedback before important conversations.",
                body:
                    "Whether it is an interview, leadership update, negotiation, or difficult conversation, most people practice alone without structured feedback. SpeakSure was built to make that practice more useful.",
            },
            {
                eyebrow: "Core experience",
                title: "Record, transcribe, score, and improve.",
                body:
                    "The product combines voice recording, transcription, AI feedback, scoring, rewritten answers, and drill history into a mobile practice loop.",
            },
            {
                eyebrow: "Product system",
                title: "Built as a real subscription-ready mobile product.",
                body:
                    "SpeakSure includes onboarding, scenario drills, Pro-aware access, analytics, and the infrastructure needed to support a production iOS app.",
            },
            {
                eyebrow: "Result",
                title: "Proof of AI audio and mobile product execution.",
                body:
                    "SpeakSure strengthens the Casevia portfolio by showing AI voice workflows, mobile UX, transcription, feedback systems, and subscription product thinking.",
            },
        ],

        highlights: [
            "Mobile voice-recording flows with AI transcription and structured feedback.",
            "Deepgram, OpenAI, Convex, RevenueCat, and PostHog integrations.",
            "Scenario-based drills for interviews, leadership, negotiation, and difficult conversations.",
            "Answer scoring, rewritten answers, drill history, and subscription-aware access.",
        ],
        outcome: [
            "A production AI mobile app.",
            "End-to-end voice, transcription, feedback, and subscription workflows.",
            "A strong proof point for AI audio, mobile UX, and subscription product experience.",
        ],

        seoTitle: "SpeakSure Case Study | AI Speaking Coach iOS App",
        seoDescription:
            "Case study for SpeakSure, a live AI speaking coach app with voice recording, transcription, feedback, and subscriptions.",
    },

    {
        slug: "am-gebaeudereinigung",
        name: "AM Gebäudereinigung",
        role: "Business website and CMS development",
        period: "2022",
        status: "Client website + CMS",
        clientType: "German service business",
        industry: "Cleaning Services",
        featured: false,
        homepageFeatured: false,
        showInHeroStrip: false,

        headline:
            "Business website and CMS for a cleaning company in Hamburg.",
        subheadline:
            "A practical service website built around credibility, service clarity, responsive pages, SEO foundations, and editable content.",
        impact: "Hamburg client · CMS-powered · Lead-generation website",
        featuredReason:
            "AM Gebäudereinigung shows practical client delivery for a real European service business with CMS-backed content.",

        summary:
            "A business website with CMS for a cleaning company in Hamburg, built for credibility, service clarity, and lead generation.",
        description:
            "AM Gebäudereinigung needed a professional web presence that could present services clearly, improve trust, and make website content easier to maintain. Casevia delivered a responsive business website with CMS-backed content structure.",

        liveUrl: "https://amgebaeudereinigung.hamburg",
        liveLabel: "Open website",

        initials: "AM",
        icon: "/am.svg",
        logoImage: "/logos/am-gebaeudereinigung.svg",
        logoAlt: "AM Gebäudereinigung logo",
        logoImageClassName: "h-7 max-h-7",

        visualTheme: "am",

        coverImage: "/work/am-gebaeudereinigung.webp",
        coverAlt: "AM Gebäudereinigung business website preview",
        heroImage: "/work/am-gebaeudereinigung.webp",
        heroAlt: "AM Gebäudereinigung business website preview",
        coverImageClassName: "",

        galleryImages: [],

        services: [
            "Interface design",
            "Frontend development",
            "CMS integration",
            "SEO foundations",
            "Responsive design",
            "Client delivery",
        ],
        deliverables: [
            "Business website",
            "CMS-backed content",
            "Service pages",
            "Responsive frontend",
            "SEO foundations",
        ],

        categories: ["Business Website", "CMS", "Client Work"],
        proof: ["Hamburg client", "CMS-powered", "Lead-gen website"],
        metrics: [
            {
                value: "CMS",
                label: "Powered",
                description: "Editable content structure",
            },
            {
                value: "Lead",
                label: "Focused",
                description: "Service-driven website",
            },
            {
                value: "EU",
                label: "Client",
                description: "Hamburg-based business",
            },
        ],

        stack: [
            "Next.js",
            "Tailwind CSS",
            "CMS",
            "SEO",
            "Responsive design",
            "Client website",
        ],

        scope: [
            "Business website",
            "CMS integration",
            "Service pages",
            "Responsive frontend",
            "SEO foundations",
            "Client delivery",
        ],

        challenge:
            "The business needed a professional web presence that clearly presented services, improved credibility, and allowed easier content updates.",
        solution:
            "Casevia delivered a responsive business website with service pages, SEO foundations, and CMS-backed content management for practical long-term use.",

        caseStudy: [
            {
                eyebrow: "Starting point",
                title: "A service business needed a clearer digital presence.",
                body:
                    "AM Gebäudereinigung needed a website that could present services clearly, improve credibility, and give the business a more professional online presence.",
            },
            {
                eyebrow: "Structure",
                title: "Service pages built for clarity.",
                body:
                    "The website was structured around the services people actually search for, with responsive pages and a cleaner content system.",
            },
            {
                eyebrow: "Management",
                title: "CMS-backed content for practical updates.",
                body:
                    "The project included CMS-backed content management so the website could be updated more easily after delivery.",
            },
        ],

        highlights: [
            "Clean business website for a real client in Hamburg.",
            "CMS-backed content updates for easier maintenance.",
            "Service structure shaped around clarity, trust, and lead generation.",
        ],
        outcome: [
            "A practical client website for a European service business.",
            "Improved service presentation and content maintainability.",
            "A useful proof point for CMS-backed business website development.",
        ],

        seoTitle: "AM Gebäudereinigung Case Study | Business Website + CMS",
        seoDescription:
            "Case study for AM Gebäudereinigung, a business website and CMS for a cleaning company in Hamburg.",
    },
];

const homepageProjectSlugs = ["hakbus", "doros-premium", "logly"];

const heroStripProjectSlugs = [
    "hakbus",
    "doros-premium",
    "logly",
    "speaksure",
    "gobusly",
    "nextloop",
];

export const projectCategories: ProjectCategory[] = [
    "AI",
    "Mobile App",
    "Booking",
    "Transport",
    "Marketplace",
    "E-commerce",
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

    if (!currentProject) {
        return [];
    }

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
    const currentIndex = projects.findIndex((project) => project.slug === slug);

    if (currentIndex === -1) {
        return null;
    }

    return projects[(currentIndex + 1) % projects.length];
}