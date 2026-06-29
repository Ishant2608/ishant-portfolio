/**
 * Global constants for the WebCraft portfolio
 * Centralized configuration for reusable assets and URLs
 */

window.CONSTANTS = {
  // Resume configuration
  // Works with both JPG and PDF formats
  RESUME_URL: "/img/resume/ishant-resume.jpg",
  
  // Resume display options
  RESUME_FORMATS: {
    image: "image",
    pdf: "pdf"
  },
  
  // Social & contact links
  CONTACT: {
    phone: "+91 97204 35032",
    phoneE164: "919720435032",
    email: "ishantsantoshsharma@gmail.com",
    linkedin: "https://linkedin.com/in/ishant-sharma-116026229",
    github: "https://github.com/Ishant2608",
    twitter: "https://twitter.com",
    whatsapp: "https://wa.me/919720435032",
    whatsappMessage: "https://wa.me/919720435032?text=Hi%20Ishant,%0A%0AI%20found%20your%20portfolio%20website%20and%20would%20like%20to%20discuss%20a%20project%20with%20you."
  },

  // Brand information
  BRAND: {
    name: "WebCraft",
    owner: "Ishant Sharma",
    tagline: "Building websites that grow businesses.",
    yearsExperience: 4,
    projectsDelivered: 100
  }
};

// Export for module systems (if needed)
if (typeof module !== "undefined" && module.exports) {
  module.exports = window.CONSTANTS;
}
