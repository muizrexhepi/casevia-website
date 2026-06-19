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
    summary: string;
    description: string;

    featured?: boolean;
    homepageFeatured?: boolean;

    liveUrl?: string;
    liveLabel?: string;

    icon?: string;
    initials: string;
    visualTheme: ProjectVisualTheme;

    coverImage?: string;
    coverAlt?: string;
    coverImageClassName?: string;

    categories: ProjectCategory[];
    proof: string[];
    metrics: ProjectMetric[];

    stack: string[];
    scope: string[];
    highlights: string[];
    outcome: string[];

    challenge: string;
    solution: string;
};

export const projects: Project[] = [
    {
        slug: "gobusly",
        name: "GoBusly",
        role: "Product Engineer / Co-founder",
        period: "2025 — Present",
        status: "Live platform",
        featured: true,
        homepageFeatured: true,
        summary:
            "Bus booking platform for Balkan and European routes with route pages, booking flows, payments, and operator workflows.",
        description:
            "GoBusly is a public transport booking platform focused on routes between the Balkans and Europe. The product includes customer-facing pages, booking flows, route SEO, payment flows, email notifications, and operator-facing workflows.",
        liveUrl: "https://gobusly.com",
        liveLabel: "Open GoBusly",
        icon: "/gobusly.webp",
        initials: "GB",
        visualTheme: "gobusly",
        coverImage: "/work/gobusly.webp",
        coverAlt: "GoBusly online bus booking platform preview",
        categories: ["Booking", "Transport", "Client Work"],
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
        challenge:
            "Bus booking in the Balkan market is fragmented, trust-sensitive, and often handled through outdated flows, manual communication, or offline operator processes.",
        solution:
            "We built a modern booking experience with route discovery, destination pages, booking flows, operator workflows, payments, emails, and a production-ready foundation for expansion.",
    },
    {
        slug: "doros-premium",
        name: "Doros Premium",
        role: "Design & Development",
        period: "2025",
        status: "E-commerce website",
        featured: true,
        homepageFeatured: true,
        summary:
            "Premium e-commerce website for a Swiss client expanding into the Macedonian market.",
        description:
            "Doros Premium is a capsule and coffee e-commerce website built for a Swiss client expanding into Macedonia. The website focuses on premium presentation, clear product browsing, responsive layouts, and mobile-first shopping.",
        liveUrl: "https://dorospremium.com.mk",
        liveLabel: "Open Doros Premium",
        initials: "DP",
        icon: "/doros.svg",
        visualTheme: "doros",
        coverImage: "/work/doros-premium.webp",
        coverAlt: "Doros Premium e-commerce website preview",
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
        highlights: [
            "Built a polished e-commerce website for coffee capsules and related products.",
            "Focused on making the brand feel premium, trustworthy, and clear for the Macedonian market.",
            "Designed responsive product browsing and clean conversion-focused pages.",
            "Delivered a client-facing commercial website with strong visual execution.",
        ],
        outcome: [
            "Strong example of premium local/e-commerce web work.",
            "Shows ability to translate a business expansion into a polished digital presence.",
            "Useful proof for clients evaluating design and frontend quality.",
        ],
        challenge:
            "The client needed a digital presence that made the brand feel premium and credible while supporting market expansion into Macedonia.",
        solution:
            "We created a clean e-commerce experience with strong product presentation, responsive pages, clear browsing, and a polished visual direction aligned with a premium retail brand.",
    },
    {
        slug: "nextloop",
        name: "Nextloop",
        role: "Design & Development",
        period: "2025",
        status: "Swiss marketplace",
        featured: true,
        homepageFeatured: true,
        icon: "/nextloop.svg",
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
        highlights: [
            "Designed and built a polished marketplace experience for luxury goods.",
            "Worked on auction and bidding-oriented product flows.",
            "Focused on premium visuals, trust, responsive polish, and clear product browsing.",
            "Created a clean structure that supports marketplace expansion and future product categories.",
        ],
        outcome: [
            "Strong proof of premium client work.",
            "Shows ability to build complex commercial product experiences.",
            "Adds a high-end Swiss client project to the portfolio.",
        ],
        challenge:
            "The marketplace needed to feel premium and trustworthy while supporting browsing, product discovery, and auction-oriented interactions.",
        solution:
            "We built a refined marketplace experience with luxury visual direction, clean product presentation, responsive layouts, and bidding-focused UX patterns.",
    },
    {
        slug: "hakbus",
        name: "Hakbus",
        role: "Full-Stack Developer",
        period: "2024 — 2025",
        status: "Major client platform",
        featured: true,
        homepageFeatured: false,
        summary:
            "Complete digital ticketing system for a large Balkan bus operator, including mobile apps, web app, booking flows, and dashboards.",
        description:
            "Hakbus is a large transport operator with 100+ buses operating across the Balkans and Europe. I worked on their digital system across customer-facing apps, web booking flows, and internal dashboards.",
        liveUrl: "https://hakbus.org",
        liveLabel: "Open Hakbus",
        icon: "/hakbus.webp",
        initials: "HB",
        visualTheme: "hakbus",
        coverImage: "/work/hakbus.webp",
        coverAlt: "Hakbus transport booking platform preview",
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
            "Web app",
            "Admin dashboards",
            "Booking flows",
            "Operator workflows",
            "Analytics",
            "Responsive UI",
        ],
        highlights: [
            "Built customer-facing booking experiences across mobile and web.",
            "Worked on dashboards and internal tools for transport operations.",
            "Delivered production UI for a real operator with large-scale regional activity.",
            "Handled multi-platform product work across mobile, web, and business workflows.",
        ],
        outcome: [
            "One of the strongest client projects in the portfolio.",
            "Shows ability to build for a real operational business, not just personal products.",
            "Strong proof for React Native, Next.js, and full-stack product delivery.",
        ],
        challenge:
            "A large transport operator needed reliable digital systems across customer booking, mobile access, web flows, and internal operational tools.",
        solution:
            "We worked across customer-facing apps, web booking flows, dashboards, and operator workflows to support a real transport business operating across the Balkans and Europe.",
    },
    {
        slug: "logly",
        name: "Logly",
        role: "Founder & Lead Developer",
        period: "2026 — Present",
        status: "Live iOS app",
        featured: true,
        homepageFeatured: false,
        summary:
            "AI nutrition tracker for iOS with natural-language meal logging, macros, Health sync, subscriptions, and weekly insights.",
        description:
            "Logly is a production iOS nutrition tracker built around fast natural-language food logging. Users write what they ate, and the app estimates calories, macros, nutrition details, and progress insights.",
        liveUrl: "https://uselogly.app",
        liveLabel: "Open Logly",
        icon: "/logly.png",
        initials: "L",
        visualTheme: "logly",
        coverImage: "/work/logly.webp",
        coverAlt: "Logly AI nutrition tracker app preview",
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
        highlights: [
            "Built and launched a production iOS app with onboarding, authentication, subscriptions, and analytics.",
            "Implemented AI-powered meal parsing for calories, macros, and nutrition estimates.",
            "Integrated RevenueCat, Convex, Apple HealthKit, and PostHog across the mobile app.",
            "Designed Pro gating, weekly insights, nutrition targets, and App Store release workflows.",
        ],
        outcome: [
            "Live on the App Store with real users.",
            "Shows mobile, AI, subscription, and product-shipping experience.",
            "Built end-to-end from product direction to production release.",
        ],
        challenge:
            "Calorie tracking is slow and repetitive, especially for users eating meals that do not fit well into generic food databases.",
        solution:
            "We built an AI-first mobile app where users can write meals naturally, estimate nutrition, track progress, sync Apple Health data, and unlock Pro features through subscriptions.",
    },
    {
        slug: "speaksure",
        name: "SpeakSure",
        role: "Founder & Lead Developer",
        period: "2026 — Present",
        status: "Live iOS app",
        featured: true,
        homepageFeatured: false,
        summary:
            "AI speaking coach for interviews, leadership updates, negotiations, and difficult conversations.",
        description:
            "SpeakSure helps users practice high-pressure communication scenarios by recording answers, transcribing speech, and receiving structured AI feedback.",
        liveUrl: "https://speaksure.app",
        liveLabel: "Open SpeakSure",
        icon: "/speaksure.png",
        initials: "S",
        visualTheme: "speaksure",
        coverImage: "/work/speaksure.webp",
        coverAlt: "SpeakSure AI speaking coach app preview",
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
        highlights: [
            "Built mobile voice-recording flows with AI transcription and structured feedback.",
            "Integrated Deepgram, OpenAI, Convex, RevenueCat, and PostHog.",
            "Created scenario-based drills for interviews, leadership, negotiation, and difficult conversations.",
            "Implemented answer scoring, rewritten answers, drill history, and subscription-aware access.",
        ],
        outcome: [
            "Live production app with a polished native experience.",
            "Strong proof of AI audio, mobile UX, and subscription product experience.",
            "Demonstrates complex app workflows beyond basic CRUD.",
        ],
        challenge:
            "People struggle to practice important conversations because feedback is usually delayed, vague, or unavailable.",
        solution:
            "We built a mobile AI speaking coach with recording, transcription, scoring, rewritten answers, scenario-based drills, and subscription-aware practice flows.",
    },
    {
        slug: "am-gebaeudereinigung",
        name: "AM Gebäudereinigung",
        role: "Design & Development",
        period: "2022",
        status: "Client website + CMS",
        featured: false,
        homepageFeatured: false,
        summary:
            "Business website with CMS for a cleaning company in Hamburg, built for credibility, services, and lead generation.",
        description:
            "AM Gebäudereinigung is a business website for a Hamburg-based cleaning company, built with a clean service structure, responsive pages, and CMS-backed content management.",
        liveUrl: "https://amgebaeudereinigung.hamburg",
        liveLabel: "Open website",
        initials: "AM",
        icon: "/am.svg",
        visualTheme: "am",
        coverImage: "/work/am-gebaeudereinigung.webp",
        coverAlt: "AM Gebäudereinigung business website preview",
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
        highlights: [
            "Built a clean business website for a real client in Hamburg.",
            "Implemented CMS-backed content updates for easier maintenance.",
            "Focused on services, trust, responsive layouts, and lead-generation structure.",
        ],
        outcome: [
            "Shows early client delivery and CMS experience.",
            "Adds credibility with a real European business website.",
            "Useful proof of practical client-focused development.",
        ],
        challenge:
            "The client needed a professional web presence that clearly presented services, improved credibility, and allowed easier content updates.",
        solution:
            "We created a responsive business website with service pages, SEO foundations, and CMS-backed content management for practical day-to-day use.",
    },
];

export const projectCategories: ProjectCategory[] = [
    "AI",
    "Mobile App",
    "Booking",
    "Transport",
    "Marketplace",
    "E-commerce",
    "Business Website",
    "CMS",
    "Client Work",
];

export function getProject(slug: string) {
    return projects.find((project) => project.slug === slug);
}

export function getFeaturedProjects() {
    return projects.filter((project) => project.featured);
}

export function getHomepageProjects() {
    return projects.filter((project) => project.homepageFeatured);
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