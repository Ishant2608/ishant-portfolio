/**
 * Contact Form Configuration
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. GOOGLE SHEETS INTEGRATION:
 *    - Create a new Google Sheet
 *    - Copy its ID from the URL (between /d/ and /edit)
 *    - Go to script.google.com > Create new project
 *    - Paste the code from google-apps-script.gs
 *    - Replace YOUR_SHEET_ID_HERE with your actual Sheet ID
 *    - Deploy > New deployment > Web app
 *    - Execute as: Your account
 *    - Who has access: Anyone
 *    - Copy the deployment URL and paste below
 * 
 * 2. CLOUDFLARE TURNSTILE (Spam Protection):
 *    - Go to https://dash.cloudflare.com/
 *    - Create a new Turnstile site
 *    - Get Site Key and Secret Key
 *    - Add TURNSTILE_SITE_KEY below
 *    - Keep TURNSTILE_SECRET_KEY safe (never expose in frontend)
 * 
 * 3. EMAIL NOTIFICATIONS:
 *    - Gmail is used via Google Apps Script
 *    - Ensure 2FA is enabled on your Google account
 *    - Allow "Less secure app access" OR use App Passwords
 */

window.CONTACT_CONFIG = {
  // ============================================================
  // GOOGLE APPS SCRIPT WEB APP URL
  // ============================================================
  // Get this from: Deploy > Deployments > Copy the URL
  // Example: https://script.google.com/macros/s/AKfy...../usercoderun
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/usercoderun",
  
  // ============================================================
  // CLOUDFLARE TURNSTILE (Spam Protection)
  // ============================================================
  // Get from: https://dash.cloudflare.com/ > Turnstile > Create site
  TURNSTILE_SITE_KEY: "0x4AAAAAAAK1H5p8C....", // Replace with your site key
  
  // ============================================================
  // EMAIL SETTINGS
  // ============================================================
  ADMIN_EMAIL: "ishantsantoshsharma@gmail.com",
  SENDER_NAME: "WebCraft Portfolio",
  
  // ============================================================
  // FORM SETTINGS
  // ============================================================
  FORM_ID: "contactForm",
  
  // Max submission attempts per IP per hour
  RATE_LIMIT: 5,
  
  // Minimum message length (characters)
  MIN_MESSAGE_LENGTH: 10,
  
  // Service options (match your form)
  SERVICES: [
    "Full-time Role",
    "Freelance Project",
    "WordPress Development",
    "E-commerce Website",
    "Website Optimization",
    "Something else"
  ],
  
  // ============================================================
  // UI MESSAGES
  // ============================================================
  MESSAGES: {
    success: "✓ Thank you! Your message has been sent successfully. I'll get back to you within 24 hours.",
    error: "✗ Something went wrong. Please try again.",
    sending: "Sending...",
    rateLimit: "Too many submissions. Please try again later.",
    validation: {
      name: "Please enter your name.",
      email: "Please enter a valid email.",
      service: "Please select a service.",
      message: "Message must be at least 10 characters.",
      turnstile: "Please verify that you're not a bot."
    }
  },
  
  // ============================================================
  // FEATURE FLAGS
  // ============================================================
  ENABLE_TURNSTILE: true,  // Set to false if not using Turnstile
  ENABLE_RATE_LIMIT: true,
  AUTO_CLEAR_FORM: true,
  SHOW_ERROR_DETAILS: false // Set to true only for debugging
};
