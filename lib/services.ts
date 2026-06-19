export type Service = {
    slug: string;
    title: string;
    eyebrow: string;
    shortDescription: string;
    description: string;
    seoTitle: string;
    seoDescription: string;
    keywords: string[];
    bestFor: string[];
    deliverables: string[];
    process: {
        title: string;
        description: string;
    }[];
    faq: {
        question: string;
        answer: string;
    }[];
};

export const services: Service[] = [
    {
        slug: "business-websites",
        title: "Business Websites",
        eyebrow: "Premium websites",
        shortDescription:
            "High-quality websites for businesses that need trust, clarity, and better conversion.",
        description:
            "Casevia builds premium business websites for companies that need to look credible, explain their offer clearly, and turn visitors into leads, bookings, or customers.",
        seoTitle: "Business Website Design & Development — Casevia",
        seoDescription:
            "Premium business website design and development for companies that need a fast, modern, responsive website built to generate trust, leads, and customers.",
        keywords: [
            "business website design",
            "business website development",
            "premium business website",
            "small business website",
            "website agency",
            "responsive website",
        ],
        bestFor: [
            "Restaurants and cafés",
            "Clinics and local services",
            "Cleaning and maintenance companies",
            "Real estate and rental businesses",
            "Premium local brands",
            "Service-based businesses",
        ],
        deliverables: [
            "Custom responsive website",
            "Homepage and service pages",
            "Contact and inquiry flows",
            "Google Maps and location sections",
            "Basic SEO structure",
            "Performance optimization",
            "Analytics setup",
            "Deployment support",
        ],
        process: [
            {
                title: "Structure",
                description:
                    "We define the pages, content flow, calls-to-action, and trust sections your business needs.",
            },
            {
                title: "Design",
                description:
                    "We create a clean, premium interface that makes the business feel credible and easy to understand.",
            },
            {
                title: "Build",
                description:
                    "We develop a responsive, fast website using modern frontend tools and clean implementation.",
            },
            {
                title: "Launch",
                description:
                    "We deploy, test, optimize, and prepare the website for real visitors.",
            },
        ],
        faq: [
            {
                question: "How long does a business website take?",
                answer:
                    "Most business websites take 2–5 weeks depending on page count, content, integrations, and revisions.",
            },
            {
                question: "Can you redesign an existing website?",
                answer:
                    "Yes. We can redesign an existing website, improve performance, clean up the structure, and modernize the user experience.",
            },
            {
                question: "Do you help with website content?",
                answer:
                    "Yes. We can help structure the content, write sharper sections, and organize the website around conversion.",
            },
        ],
    },
    {
        slug: "web-apps-dashboards",
        title: "Web Apps & Dashboards",
        eyebrow: "Custom software",
        shortDescription:
            "Dashboards, portals, booking systems, admin panels, and internal tools built around real workflows.",
        description:
            "Casevia builds custom web apps and dashboards for businesses that need more than a static website. This includes admin panels, internal tools, customer portals, booking systems, and data-driven platforms.",
        seoTitle: "Web App & Dashboard Development — Casevia",
        seoDescription:
            "Custom web app and dashboard development for businesses that need admin panels, portals, booking systems, internal tools, and scalable digital platforms.",
        keywords: [
            "web app development",
            "dashboard development",
            "admin panel development",
            "custom software development",
            "internal tool development",
            "booking system development",
        ],
        bestFor: [
            "Booking platforms",
            "Operator dashboards",
            "Admin panels",
            "Client portals",
            "Internal tools",
            "Multi-user systems",
        ],
        deliverables: [
            "Product planning",
            "User flows",
            "Dashboard UI",
            "Authentication",
            "Database structure",
            "Admin workflows",
            "Responsive frontend",
            "Production deployment",
        ],
        process: [
            {
                title: "Workflow mapping",
                description:
                    "We understand the real business process before designing screens or writing code.",
            },
            {
                title: "System structure",
                description:
                    "We define users, permissions, data models, actions, and core product flows.",
            },
            {
                title: "Product build",
                description:
                    "We build the interface, backend integration, database logic, and production-ready flows.",
            },
            {
                title: "Testing",
                description:
                    "We test the important user paths, edge cases, responsive behavior, and launch readiness.",
            },
        ],
        faq: [
            {
                question: "Do you build full-stack apps?",
                answer:
                    "Yes. We can handle frontend, backend integrations, database structure, authentication, and deployment.",
            },
            {
                question: "Can you build dashboards for existing businesses?",
                answer:
                    "Yes. We can create dashboards around your current workflows, data, team processes, or customer operations.",
            },
            {
                question: "What stack do you use?",
                answer:
                    "Usually Next.js, React, TypeScript, Tailwind CSS, Supabase, Convex, Firebase, Node.js, and modern API integrations.",
            },
        ],
    },
    {
        slug: "ecommerce-websites",
        title: "E-commerce Websites",
        eyebrow: "Online stores",
        shortDescription:
            "Polished product experiences for brands that need better browsing, trust, and buying flows.",
        description:
            "Casevia builds e-commerce websites for brands that need clean product presentation, fast browsing, responsive pages, and a premium buying experience.",
        seoTitle: "E-commerce Website Design & Development — Casevia",
        seoDescription:
            "Premium e-commerce website design and development for brands that need product pages, categories, responsive shopping flows, and conversion-focused design.",
        keywords: [
            "ecommerce website design",
            "ecommerce development",
            "online store development",
            "product page design",
            "premium ecommerce website",
            "responsive ecommerce",
        ],
        bestFor: [
            "Retail brands",
            "Premium product businesses",
            "Coffee and food brands",
            "Luxury goods",
            "Local shops",
            "Catalog-based businesses",
        ],
        deliverables: [
            "E-commerce website",
            "Product pages",
            "Category pages",
            "Product filtering",
            "Responsive shopping experience",
            "CMS/product management",
            "SEO foundations",
            "Launch support",
        ],
        process: [
            {
                title: "Product structure",
                description:
                    "We organize categories, product details, buying paths, and the customer journey.",
            },
            {
                title: "Visual direction",
                description:
                    "We create a premium visual system that supports the product positioning.",
            },
            {
                title: "Store build",
                description:
                    "We build responsive product pages, collections, browsing flows, and store structure.",
            },
            {
                title: "Optimization",
                description:
                    "We refine performance, mobile usability, SEO structure, and launch readiness.",
            },
        ],
        faq: [
            {
                question: "Can you build a product catalog without checkout?",
                answer:
                    "Yes. Some businesses only need a premium catalog with inquiry or WhatsApp ordering instead of full checkout.",
            },
            {
                question: "Can you build a full online store?",
                answer:
                    "Yes. Depending on the project, we can support product management, order flows, checkout integrations, and responsive shopping experiences.",
            },
            {
                question: "Do you focus on mobile?",
                answer:
                    "Yes. Most buyers browse on mobile, so responsive product browsing is a core part of the build.",
            },
        ],
    },
    {
        slug: "ai-automation",
        title: "AI & Automation",
        eyebrow: "AI systems",
        shortDescription:
            "AI-powered features and automations that reduce manual work or create new product value.",
        description:
            "Casevia builds AI-powered features, internal automations, and product workflows that help businesses save time, process information, and create smarter user experiences.",
        seoTitle: "AI Automation & AI Product Development — Casevia",
        seoDescription:
            "AI automation and AI product development for businesses that need AI features, internal tools, workflow automation, content systems, and API integrations.",
        keywords: [
            "AI automation",
            "AI product development",
            "AI app development",
            "business automation",
            "AI workflow automation",
            "AI software agency",
        ],
        bestFor: [
            "AI product ideas",
            "Internal automation",
            "Content workflows",
            "Customer support flows",
            "Data processing",
            "AI-assisted dashboards",
        ],
        deliverables: [
            "AI workflow planning",
            "Prompt and logic design",
            "API integrations",
            "Internal automation tools",
            "AI-powered product features",
            "Testing and guardrails",
            "Analytics and monitoring",
            "Deployment support",
        ],
        process: [
            {
                title: "Use-case definition",
                description:
                    "We identify where AI actually helps instead of forcing AI into places where it adds no value.",
            },
            {
                title: "Workflow design",
                description:
                    "We define inputs, outputs, data flow, edge cases, and how users interact with the AI system.",
            },
            {
                title: "Integration",
                description:
                    "We connect APIs, databases, UI flows, and automation logic into a usable product experience.",
            },
            {
                title: "Refinement",
                description:
                    "We test output quality, improve prompts and logic, and make the feature more reliable.",
            },
        ],
        faq: [
            {
                question: "Do all businesses need AI?",
                answer:
                    "No. AI only makes sense when it saves time, improves a workflow, enables a new product feature, or improves customer experience.",
            },
            {
                question: "Can you add AI to an existing app?",
                answer:
                    "Yes. We can add AI features to existing apps, dashboards, internal tools, or customer-facing platforms.",
            },
            {
                question: "Which AI APIs do you use?",
                answer:
                    "Depending on the project, we can use OpenAI, Deepgram, Gemini, Claude, or other APIs suitable for the workflow.",
            },
        ],
    },
];

export function getService(slug: string) {
    return services.find((service) => service.slug === slug);
}