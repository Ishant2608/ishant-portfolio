window.PORTFOLIO_DATA = {
  categories: [
    "All",
    "WordPress",
    "WooCommerce",
    "Shopify",
    "CRM / ERP",
    "Dashboard",
    "E-commerce",
    "Custom Development"
  ],
  projects: [
    {
      title: "Admin Dashboard",
      slug: "admin-dashboard",
      categories: ["CRM / ERP", "Dashboard"],
      industry: "Healthcare",
      projectType: "CRM Dashboard",
      technologies: ["React", "Node.js", "Express", "PostgreSQL"],
      description: "Patient and appointment CRM with role-based access, real-time reporting, and secure data management for healthcare operations.",
      thumbnail: "img/crm-dashboards/admin-board.png",
      heroImage: "img/crm-dashboards/admin-board.png",
      galleryImages: [
        { title: "Dashboard Overview", src: "img/crm-dashboards/admin-board.png" },
        { title: "Analytics View", src: "img/crm-dashboards/admin-board.png" }
      ],
      features: ["CRM", "Role-Based Access", "Real-Time Reports", "Patient Management", "Appointment Scheduling"],
      challenges: [
        {
          challenge: "Managing complex staff permissions across multiple locations.",
          solution: "Built granular role and location-level permission controls with secure data isolation."
        }
      ],
      results: ["Reduced scheduling effort by 40%", "Improved patient follow-up speed", "Centralized reporting"],
      myRole: ["Full Stack Development", "Database Design", "API Architecture"],
      overview: "A comprehensive CRM solution designed for healthcare clinics to manage operations, patient lifecycle, and team workflows efficiently.",
      businessGoals: "Improve operational efficiency, patient communication, and administrative visibility.",
      clientRequirements: "Secure data handling, audit trails, and strong performance on large datasets.",
      targetUsers: "Clinic administrators, front-desk staff, and healthcare providers.",
      completionYear: "2026",
      clientType: "Enterprise",
      featuredProject: true
    },
    {
      title: "Seller Dashboard",
      slug: "seller-dashboard",
      categories: ["CRM / ERP", "Dashboard"],
      industry: "E-commerce",
      projectType: "Admin Dashboard",
      technologies: ["React", "TypeScript", "REST API", "Firebase"],
      description: "Operations dashboard for sellers to track orders, inventory, analytics, and performance metrics in real-time.",
      thumbnail: "img/crm-dashboards/sellers-board.png",
      heroImage: "img/crm-dashboards/sellers-board.png",
      galleryImages: [
        { title: "Sales Dashboard", src: "img/crm-dashboards/sellers-board.png" },
        { title: "Orders Management", src: "img/crm-dashboards/sellers-board.png" }
      ],
      features: ["Sales Analytics", "Order Management", "Inventory Tracking", "Performance Metrics", "Real-Time Notifications"],
      challenges: [
        {
          challenge: "Displaying high-volume operational data without overwhelming sellers.",
          solution: "Implemented intelligent data filtering, prioritization, and progressive loading with progressive disclosure."
        }
      ],
      results: ["Faster issue triage", "Better business visibility", "Improved seller satisfaction"],
      myRole: ["React Development", "API Integration", "UI/UX Design"],
      overview: "A data-focused dashboard providing sellers with comprehensive insights into their sales, inventory, and business performance.",
      businessGoals: "Enable sellers to make data-driven decisions and manage operations efficiently.",
      clientRequirements: "Real-time data updates, mobile-friendly interface, and intuitive analytics.",
      targetUsers: "E-commerce sellers and business managers.",
      completionYear: "2026",
      clientType: "Business",
      featuredProject: true
    },
    {
      title: "FurniFlow Shopify Store",
      slug: "furniflow-shopify-store",
      categories: ["Shopify", "E-commerce"],
      industry: "Furniture & Home Décor",
      projectType: "E-commerce Store",
      technologies: ["Shopify", "Liquid", "JavaScript", "Klaviyo"],
      description: "High-conversion Shopify storefront featuring custom sections, product bundles, and optimized checkout flows for furniture retail.",
      thumbnail: "img/shopify-project/project-1/ff-store-1.png",
      heroImage: "img/shopify-project/project-1/ff-store-2.png",
      galleryImages: [
        { title: "Homepage", src: "img/shopify-project/project-1/ff-store-1.png" },
        { title: "Product Page", src: "img/shopify-project/project-1/ff-store-2.png" }
      ],
      features: ["Custom Sections", "Product Bundles", "Optimized Checkout", "Mobile Responsive", "Email Marketing Integration"],
      challenges: [
        {
          challenge: "High checkout abandonment rate.",
          solution: "Simplified checkout steps, improved trust indicators, and reduced friction at payment points."
        }
      ],
      results: ["28% conversion rate improvement", "31% faster load times", "Higher average order value"],
      myRole: ["Shopify Development", "Performance Optimization", "UI Implementation"],
      overview: "A conversion-focused Shopify storefront designed specifically for furniture e-commerce with premium visual presentation.",
      businessGoals: "Increase online sales and reduce cart abandonment through optimized user experience.",
      clientRequirements: "Fast storefront, custom merchandising controls, and easy product management.",
      targetUsers: "Online furniture shoppers across desktop and mobile devices.",
      completionYear: "2025",
      clientType: "Business",
      featuredProject: true
    },
    {
      title: "Thread2Form Store",
      slug: "thread2form-store",
      categories: ["Shopify", "E-commerce"],
      industry: "Fashion & Apparel",
      projectType: "E-commerce Store",
      technologies: ["Shopify", "Liquid", "JavaScript"],
      description: "Branded Shopify storefront with custom templates and merchandise-first product flows optimized for fashion retail.",
      thumbnail: "img/shopify-project/project-2/thred-to-form-1.png",
      heroImage: "img/shopify-project/project-2/thred-to-form-2.png",
      galleryImages: [
        { title: "Homepage", src: "img/shopify-project/project-2/thred-to-form-1.png" },
        { title: "Collection Page", src: "img/shopify-project/project-2/thred-to-form-2.png" }
      ],
      features: ["Custom Templates", "Dynamic Collections", "Responsive Design", "Product Search", "Cart Optimization"],
      challenges: [
        {
          challenge: "Inconsistent product presentation across multiple categories.",
          solution: "Created reusable section patterns and dynamic product templates for consistency and scalability."
        }
      ],
      results: ["Improved product discoverability", "Reduced product page bounce rate", "Faster category browsing"],
      myRole: ["Shopify Development", "Theme Customization", "UI Design"],
      overview: "A scalable Shopify solution tailored for fashion brands with emphasis on visual merchandising and brand consistency.",
      businessGoals: "Improve product discovery and boost conversion through optimized visual merchandising.",
      clientRequirements: "Reusable components, brand-consistent design, and easy inventory management.",
      targetUsers: "Fashion-conscious online shoppers.",
      completionYear: "2025",
      clientType: "Startup",
      featuredProject: false
    },
    {
      title: "Shopify Plus Store",
      slug: "shopify-plus-store",
      categories: ["Shopify", "E-commerce"],
      industry: "Lifestyle & Retail",
      projectType: "E-commerce Platform",
      technologies: ["Shopify Plus", "Liquid", "JavaScript", "Node.js"],
      description: "Enterprise-grade Shopify Plus store with custom apps, multi-channel integration, and advanced merchandising automation.",
      thumbnail: "img/shopify-project/project-3/plus-store-1.png",
      heroImage: "img/shopify-project/project-3/plus-store-2.png",
      galleryImages: [
        { title: "Store Homepage", src: "img/shopify-project/project-3/plus-store-1.png" },
        { title: "Checkout Flow", src: "img/shopify-project/project-3/plus-store-2.png" }
      ],
      features: ["Multi-Channel Selling", "Advanced Analytics", "Custom Apps", "API Integration", "High-Volume Support"],
      challenges: [
        {
          challenge: "Managing high-traffic loads during peak sales periods.",
          solution: "Implemented performance optimization, edge caching, and scalable infrastructure on Shopify Plus."
        }
      ],
      results: ["Handled 10x traffic spikes", "99.9% uptime maintained", "Improved conversion rate"],
      myRole: ["Shopify Plus Development", "Performance Engineering", "App Integration"],
      overview: "An enterprise-grade Shopify solution built for high-volume retailers with complex operations and integration needs.",
      businessGoals: "Support rapid growth, streamline operations, and maximize revenue per transaction.",
      clientRequirements: "Enterprise-scale reliability, custom integrations, and advanced analytics.",
      targetUsers: "Enterprise retailers and high-volume online merchants.",
      completionYear: "2026",
      clientType: "Enterprise",
      featuredProject: true
    },
    {
      title: "Zenska Marketplace",
      slug: "zenska-ph",
      categories: ["WordPress", "E-commerce"],
      industry: "Fashion & Beauty",
      projectType: "Multi-Vendor Marketplace",
      technologies: ["React", "TypeScript", "WordPress", "REST API"],
      description: "Production-grade multi-vendor marketplace with dedicated admin, vendor, and customer dashboards for seamless commerce operations.",
      thumbnail: "img/crm-dashboards/admin-board.png",
      heroImage: "img/crm-dashboards/admin-board.png",
      galleryImages: [
        { title: "Admin Dashboard", src: "img/crm-dashboards/admin-board.png" },
        { title: "Vendor Dashboard", src: "img/crm-dashboards/sellers-board.png" }
      ],
      features: ["Multi-Vendor Support", "Payment Gateway", "Real-Time Analytics", "Notifications", "Mobile Responsive"],
      challenges: [
        {
          challenge: "Managing multi-role permissions without data leakage.",
          solution: "Implemented role-scoped APIs and UI permissions with strict data isolation by vendor and user type."
        },
        {
          challenge: "Vendor onboarding was manual and slow.",
          solution: "Built validated onboarding workflow with progressive verification and automated approval flows."
        }
      ],
      results: ["100,000+ products supported", "40% faster dashboard load", "Improved vendor acquisition speed"],
      myRole: ["Full Stack Development", "React Architecture", "API Design", "Performance Optimization"],
      overview: "Zenska.ph is a production marketplace ecosystem enabling independent vendors to reach customers through a unified platform.",
      businessGoals: "Enable vendor growth, improve operational visibility, and scale product/order volume.",
      clientRequirements: "Secure role-based access, automated approvals, and maintainable long-term architecture.",
      targetUsers: "Marketplace admins, independent vendors, and end consumers.",
      completionYear: "2026",
      clientType: "Business",
      featuredProject: true
    }
  ]
};
