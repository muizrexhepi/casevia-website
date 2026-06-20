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
        role: "Full-Stack Developer",
        period: "2022 — 2023",
        status: "Major client platform",
        clientType: "Large transport operator",
        industry: "Transport / Ticketing",
        featured: true,
        homepageFeatured: true,
        showInHeroStrip: true,

        headline:
            "Digital ticketing and operations platform for a major Balkan bus operator.",
        subheadline:
            "A multi-platform transport system spanning mobile apps, web booking flows, internal dashboards, and operator workflows.",
        impact: "100+ buses · 100k+ visitors · Thousands of bookings",
        featuredReason:
            "Hakbus is the strongest operational client project in the portfolio because it shows scale, reliability, booking flows, mobile work, and internal business tooling.",

        summary:
            "Complete digital ticketing system for a large Balkan bus operator, including mobile apps, web booking, dashboards, and operational workflows.",
        description:
            "Hakbus is a transport operator with 100+ buses operating across the Balkans and Europe. I worked across their digital system, including customer-facing mobile apps, web booking flows, internal dashboards, and operational tools.",

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

        galleryImages: [
            {
                src: "/work/hakbus/booking-flow.png",
                alt: "Hakbus route search and booking flow",
                label: "Booking flow",
                description:
                    "A clearer passenger flow for searching routes, choosing trip details, and moving toward ticket booking.",
                type: "flow",
            },
            {
                src: "/work/hakbus/dashboard.png",
                alt: "Hakbus internal dashboard and operator tools",
                label: "Internal dashboard",
                description:
                    "Operational views for managing bookings, routes, passengers, and transport workflows.",
                type: "dashboard",
            },
            {
                src: "/work/hakbus/mobile-app.webp",
                alt: "Hakbus mobile app screens",
                label: "Mobile app",
                description:
                    "Mobile booking and passenger-facing screens designed for route discovery and ticket access.",
                type: "mobile",
            },
        ],

        services: [
            "Product Engineering",
            "Frontend Development",
            "Mobile App Development",
            "Dashboard Development",
            "Booking UX",
            "Operational Tooling",
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
                description: "Large regional operator",
            },
            {
                value: "100k+",
                label: "Visitors",
                description: "Public traffic scale",
            },
            {
                value: "Multi",
                label: "Platform",
                description: "Mobile, web, dashboard",
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
            "Mobile apps",
            "Web booking flows",
            "Admin dashboards",
            "Passenger booking UX",
            "Operator workflows",
            "Analytics views",
            "Responsive frontend",
        ],

        challenge:
            "A large transport operator needed reliable digital systems across passenger booking, mobile access, web flows, and internal operations.",
        solution:
            "We worked across customer-facing apps, web booking flows, dashboards, and operator workflows to support a real transport business operating across the Balkans and Europe.",

        caseStudy: [
            {
                eyebrow: "Starting point",
                title: "A real operator needed more than a public website.",
                body:
                    "Hakbus was not a simple brochure project. The business needed digital systems that could support passengers, booking flows, route visibility, and internal transport operations across multiple touchpoints.",
            },
            {
                eyebrow: "Product system",
                title: "Mobile, web, and dashboards working together.",
                body:
                    "The work covered customer-facing mobile experiences, web booking flows, and internal dashboards. The goal was to make the digital system useful for passengers while also supporting the operational needs behind the business.",
            },
            {
                eyebrow: "Execution",
                title: "Built around booking, operations, and reliability.",
                body:
                    "The project required practical product decisions: clear route flows, responsive interfaces, operational views, and components that could be used in production rather than just looking good in static mockups.",
            },
            {
                eyebrow: "Result",
                title: "A serious proof point for transport software.",
                body:
                    "Hakbus shows the ability to build for a real operational business with scale, not just for a small landing page. It demonstrates mobile development, web product work, dashboards, and transport-specific workflows.",
            },
        ],

        highlights: [
            "Built customer-facing booking experiences across mobile and web.",
            "Worked on dashboards and internal tools for transport operations.",
            "Delivered production UI for a real operator with large regional activity.",
            "Handled multi-platform product work across mobile, web, and business workflows.",
        ],
        outcome: [
            "Delivered digital systems for a real transport operator.",
            "Improved the operator’s ability to present routes, manage bookings, and support passengers digitally.",
            "Strong proof of production work across mobile apps, web apps, dashboards, and transport operations.",
        ],

        seoTitle: "Hakbus Case Study | Transport Booking Platform",
        seoDescription:
            "Case study for Hakbus, a digital ticketing and operations platform for a major Balkan bus operator.",
    },
    {
        slug: "doros-premium",
        name: "Doros Premium",
        role: "Design & Development",
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
            "A polished retail experience built around trust, product presentation, responsive shopping, and market expansion.",
        impact: "Swiss client · Premium retail · Macedonian expansion",
        featuredReason:
            "Doros Premium gives the portfolio a serious client-commerce proof point with a polished visual direction and a real business behind it.",

        summary:
            "Premium e-commerce website for a Swiss client expanding into the Macedonian market.",
        description:
            "Doros Premium is a capsule and coffee e-commerce website built for a Swiss client expanding into Macedonia. The website focuses on premium presentation, clear product browsing, responsive layouts, and mobile-first shopping.",

        liveUrl: "https://dorospremium.com.mk",
        liveLabel: "Open Doros Premium",

        initials: "DP",
        icon: "/doros.svg",
        logoImage: "/logos/doros.svg",
        logoAlt: "Doros Premium logo",
        logoImageClassName: "h-8 max-h-8",

        visualTheme: "doros",

        coverImage: "/work/doros-premium.webp",
        coverAlt: "Doros Premium e-commerce website preview",
        heroImage: "/work/doros-premium.webp",
        heroAlt: "Doros Premium e-commerce website preview",

        galleryImages: [],

        services: [
            "Interface Design",
            "Frontend Development",
            "E-commerce UI",
            "Responsive Design",
            "Product Presentation",
            "Launch Support",
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
                description: "Positioned for trust",
            },
            {
                value: "Mobile",
                label: "Optimized",
                description: "Responsive shopping flow",
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
            "The client needed a digital presence that made the brand feel premium and credible while supporting market expansion into Macedonia.",
        solution:
            "We created a clean e-commerce experience with strong product presentation, responsive pages, clear browsing, and a polished visual direction aligned with a premium retail brand.",

        caseStudy: [
            {
                eyebrow: "Starting point",
                title: "A premium product needed a premium digital presence.",
                body:
                    "Doros Premium needed to feel credible from the first impression. The website had to support a Swiss coffee brand entering the Macedonian market while keeping the product presentation clear, polished, and easy to browse.",
            },
            {
                eyebrow: "Visual direction",
                title: "A clean retail experience built around trust.",
                body:
                    "The interface focused on strong spacing, simple navigation, clear product sections, and a refined visual tone. The goal was to avoid a cheap local-shop feeling and position the brand as serious and premium.",
            },
            {
                eyebrow: "Shopping flow",
                title: "Product browsing that works on mobile.",
                body:
                    "The website was structured for responsive shopping, making it easy for users to understand the products, browse the catalogue, and move through the site on mobile devices.",
            },
            {
                eyebrow: "Result",
                title: "A commercial website ready for expansion.",
                body:
                    "Doros Premium is a strong client-facing proof point because it shows e-commerce execution, responsive frontend quality, and the ability to translate a real business expansion into a polished digital experience.",
            },
        ],

        highlights: [
            "Built a polished e-commerce website for coffee capsules and related products.",
            "Focused on making the brand feel premium, trustworthy, and clear for the Macedonian market.",
            "Designed responsive product browsing and clean conversion-focused pages.",
            "Delivered a client-facing commercial website with strong visual execution.",
        ],
        outcome: [
            "Delivered a premium client-facing e-commerce website.",
            "Created a stronger digital presence for a Swiss client entering the Macedonian market.",
            "Strong proof of e-commerce UI, responsive design, and client delivery.",
        ],

        seoTitle: "Doros Premium Case Study | Premium E-commerce Website",
        seoDescription:
            "Case study for Doros Premium, a premium coffee e-commerce website built for a Swiss client expanding into Macedonia.",
    },
    {
        slug: "logly",
        name: "Logly",
        role: "Founder & Lead Developer",
        period: "2026 — Present",
        status: "Live iOS app",
        clientType: "Owned SaaS/mobile product",
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
            "Logly proves product ownership, mobile engineering, AI workflows, subscriptions, analytics, and real shipping experience.",

        summary:
            "AI nutrition tracker for iOS with natural-language meal logging, macros, Health sync, subscriptions, and weekly insights.",
        description:
            "Logly is a production iOS nutrition tracker built around fast natural-language food logging. Users write what they ate, and the app estimates calories, macros, nutrition details, and progress insights.",

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

        galleryImages: [],

        services: [
            "Product Strategy",
            "Mobile App Development",
            "AI Integration",
            "Subscription Architecture",
            "Analytics",
            "App Store Launch",
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
                description: "Published product",
            },
            {
                value: "200+",
                label: "Users",
                description: "Registered accounts",
            },
            {
                value: "AI",
                label: "Nutrition",
                description: "Natural-language logging",
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
            "Calorie tracking is slow and repetitive, especially for users eating meals that do not fit well into generic food databases.",
        solution:
            "We built an AI-first mobile app where users can write meals naturally, estimate nutrition, track progress, sync Apple Health data, and unlock Pro features through subscriptions.",

        caseStudy: [
            {
                eyebrow: "Product problem",
                title: "Food logging needed to feel less painful.",
                body:
                    "Traditional calorie tracking asks users to search databases, weigh food, and repeat the same manual steps every day. Logly was built around a faster interaction: write what you ate, then let AI estimate the nutrition.",
            },
            {
                eyebrow: "Core workflow",
                title: "Natural-language meals into structured nutrition.",
                body:
                    "The main product flow turns plain meal descriptions into calories, macros, and nutrition details. The experience is designed to feel fast enough that users can log food without breaking their routine.",
            },
            {
                eyebrow: "Product system",
                title: "Subscriptions, insights, analytics, and Health sync.",
                body:
                    "Beyond the AI logging flow, Logly includes onboarding, goals, Apple Health context, RevenueCat subscriptions, PostHog analytics, Pro gating, and weekly insights.",
            },
            {
                eyebrow: "Result",
                title: "A shipped mobile product with real users.",
                body:
                    "Logly is important because it proves end-to-end product execution: mobile UX, AI infrastructure, subscriptions, analytics, App Store release, and continued iteration based on real usage.",
            },
        ],

        highlights: [
            "Built and launched a production iOS app with onboarding, authentication, subscriptions, and analytics.",
            "Implemented AI-powered meal parsing for calories, macros, and nutrition estimates.",
            "Integrated RevenueCat, Convex, Apple HealthKit, and PostHog across the mobile app.",
            "Designed Pro gating, weekly insights, nutrition targets, and App Store release workflows.",
        ],
        outcome: [
            "Published a real iOS product with real users.",
            "Built the product end-to-end from product direction to release.",
            "Strong proof of mobile, AI, subscriptions, analytics, and product execution.",
        ],

        seoTitle: "Logly Case Study | AI Nutrition Tracker iOS App",
        seoDescription:
            "Case study for Logly, a live AI nutrition tracker for iOS with food logging, subscriptions, Apple Health sync, and weekly insights.",
    },
    {
        slug: "gobusly",
        name: "GoBusly",
        role: "Product Engineer / Co-founder",
        period: "2025 — Present",
        status: "Live platform",
        clientType: "Owned transport platform",
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
            "GoBusly shows marketplace thinking, SEO structure, booking flows, payments, and transport product strategy.",

        summary:
            "Bus booking platform for Balkan and European routes with route pages, booking flows, payments, and operator workflows.",
        description:
            "GoBusly is a public transport booking platform focused on routes between the Balkans and Europe. The product includes customer-facing pages, booking flows, route SEO, payment flows, email notifications, and operator-facing workflows.",

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

        galleryImages: [],

        services: [
            "Product Strategy",
            "Frontend Development",
            "Booking UX",
            "Payments",
            "Operator Workflows",
            "SEO Structure",
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
            "We built a modern booking experience with route discovery, destination pages, booking flows, operator workflows, payments, emails, and a production-ready foundation for expansion.",

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
                    "Instead of only building a booking form, the product includes destination and route pages that can capture people searching for specific travel routes between the Balkans and Europe.",
            },
            {
                eyebrow: "Result",
                title: "A real transport product, not a generic marketplace demo.",
                body:
                    "GoBusly demonstrates product thinking across booking UX, operator operations, SEO, payments, and launch strategy in a niche market.",
            },
        ],

        highlights: [
            "Built customer-facing route pages and booking experiences for international bus routes.",
            "Worked on SEO-focused pages for destinations across the Balkans and Europe.",
            "Supported production workflows for operators, bookings, and customer communication.",
            "Worked across product, frontend, backend integrations, and launch strategy.",
        ],
        outcome: [
            "Live booking platform with real operators.",
            "Strong proof of product thinking, SEO, payments, and booking workflows.",
            "Production web product experience in a real transport market.",
        ],

        seoTitle: "GoBusly Case Study | Bus Booking Platform",
        seoDescription:
            "Case study for GoBusly, a bus booking platform for Balkan and European travel routes.",
    },
    {
        slug: "nextloop",
        name: "Nextloop",
        role: "Design & Development",
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
            "Nextloop shows premium marketplace UI, product browsing, auction UX, and high-end client positioning.",

        icon: "/nextloop.svg",
        logoImage: "/logos/nextloop.svg",
        logoAlt: "Nextloop logo",
        logoImageClassName: "h-6 max-h-6",

        summary:
            "Luxury goods marketplace for a Swiss client with premium browsing, auctions, and bidding workflows.",
        description:
            "Nextloop is a luxury goods marketplace built for a Swiss client, focused on high-end product presentation, live auctioning, bidding flows, and a polished marketplace experience.",

        liveUrl: "https://nextloop.ch",
        liveLabel: "Open Nextloop",

        initials: "NL",
        visualTheme: "nextloop",

        coverImage: "/work/nextloop.webp",
        coverAlt: "Nextloop luxury marketplace preview",
        heroImage: "/work/nextloop.webp",
        heroAlt: "Nextloop luxury marketplace preview",

        galleryImages: [],

        services: [
            "Marketplace UX",
            "Interface Design",
            "Frontend Development",
            "Auction UX",
            "Responsive Design",
            "Launch Support",
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
            "We built a refined marketplace experience with luxury visual direction, clean product presentation, responsive layouts, and bidding-focused UX patterns.",

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
                    "Nextloop shows that Casevia can work beyond basic websites and handle commercial product experiences with more complex interaction patterns.",
            },
        ],

        highlights: [
            "Designed and built a polished marketplace experience for luxury goods.",
            "Worked on auction and bidding-oriented product flows.",
            "Focused on premium visuals, trust, responsive polish, and clear product browsing.",
            "Created a clean structure that supports marketplace expansion and future product categories.",
        ],
        outcome: [
            "Delivered a premium marketplace experience for a Swiss client.",
            "Created proof of complex commercial UX beyond a standard business website.",
            "Strengthened the portfolio with luxury marketplace and auction workflow experience.",
        ],

        seoTitle: "Nextloop Case Study | Luxury Marketplace Website",
        seoDescription:
            "Case study for Nextloop, a Swiss luxury goods marketplace with auction and bidding workflows.",
    },
    {
        slug: "speaksure",
        name: "SpeakSure",
        role: "Founder & Lead Developer",
        period: "2026 — Present",
        status: "Live iOS app",
        clientType: "Owned SaaS/mobile product",
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
            "AI speaking coach for interviews, leadership updates, negotiations, and difficult conversations.",
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

        galleryImages: [],

        services: [
            "Product Strategy",
            "Mobile App Development",
            "AI Integration",
            "Voice UX",
            "Subscription Architecture",
            "App Store Launch",
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
                description: "Published product",
            },
            {
                value: "Voice",
                label: "AI feedback",
                description: "Speech + scoring",
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
            "People struggle to practice important conversations because feedback is usually delayed, vague, or unavailable.",
        solution:
            "We built a mobile AI speaking coach with recording, transcription, scoring, rewritten answers, scenario-based drills, and subscription-aware practice flows.",

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
                    "SpeakSure strengthens the portfolio by showing AI voice workflows, mobile UX, transcription, feedback systems, and subscription product thinking.",
            },
        ],

        highlights: [
            "Built mobile voice-recording flows with AI transcription and structured feedback.",
            "Integrated Deepgram, OpenAI, Convex, RevenueCat, and PostHog.",
            "Created scenario-based drills for interviews, leadership, negotiation, and difficult conversations.",
            "Implemented answer scoring, rewritten answers, drill history, and subscription-aware access.",
        ],
        outcome: [
            "Published a production AI mobile app.",
            "Built voice, transcription, feedback, and subscription workflows end-to-end.",
            "Strong proof of AI audio, mobile UX, and subscription product experience.",
        ],

        seoTitle: "SpeakSure Case Study | AI Speaking Coach iOS App",
        seoDescription:
            "Case study for SpeakSure, a live AI speaking coach app with voice recording, transcription, feedback, and subscriptions.",
    },
    {
        slug: "am-gebaeudereinigung",
        name: "AM Gebäudereinigung",
        role: "Design & Development",
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
            "Business website with CMS for a cleaning company in Hamburg, built for credibility, services, and lead generation.",
        description:
            "AM Gebäudereinigung is a business website for a Hamburg-based cleaning company, built with a clean service structure, responsive pages, and CMS-backed content management.",

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

        galleryImages: [],

        services: [
            "Interface Design",
            "Frontend Development",
            "CMS Integration",
            "SEO Foundations",
            "Responsive Design",
            "Client Delivery",
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
                description: "Editable content",
            },
            {
                value: "Lead",
                label: "Focused",
                description: "Service-driven structure",
            },
            {
                value: "EU",
                label: "Client",
                description: "Hamburg business",
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
            "The client needed a professional web presence that clearly presented services, improved credibility, and allowed easier content updates.",
        solution:
            "We created a responsive business website with service pages, SEO foundations, and CMS-backed content management for practical day-to-day use.",

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
            "Built a clean business website for a real client in Hamburg.",
            "Implemented CMS-backed content updates for easier maintenance.",
            "Focused on services, trust, responsive layouts, and lead-generation structure.",
        ],
        outcome: [
            "Delivered a practical client website for a European service business.",
            "Improved service presentation and content maintainability.",
            "Useful proof of CMS-backed business website development.",
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
    // "CMS",
    // "Client Work",
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
                Boolean(project?.showInHeroStrip && project.logoImage)
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
                currentProject.categories.includes(category)
            )
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