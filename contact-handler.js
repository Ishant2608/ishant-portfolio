/**
 * Contact Form Handler
 * 
 * Handles:
 * - Form validation
 * - Turnstile CAPTCHA verification
 * - Submission to Google Apps Script
 * - Success/error messaging
 * - Local storage for draft recovery
 */

(function () {
  "use strict";

  // Only run on contact page
  if (document.body.dataset.page !== "contact") return;
  if (!window.CONTACT_CONFIG) {
    console.error("CONTACT_CONFIG not found. Load config.js before this script.");
    return;
  }

  const config = window.CONTACT_CONFIG;
  const form = document.getElementById(config.FORM_ID);
  if (!form) return;

  const successMsg = document.getElementById("successMessage");
  const errorMsg = document.getElementById("errorMessage");
  const successText = document.getElementById("successText");
  const errorText = document.getElementById("errorText");
  const submitBtn = document.getElementById("submitBtn");
  const submitText = document.getElementById("submitText");
  const turnstileContainer = document.getElementById("turnstileContainer");

  let isSubmitting = false;
  let turnstileToken = null;

  // ============================================================
  // INITIALIZATION
  // ============================================================

  function init() {
    // Load draft from localStorage if available
    loadDraft();

    // Setup Turnstile if enabled
    if (config.ENABLE_TURNSTILE) {
      setupTurnstile();
    }

    // Attach event listeners
    form.addEventListener("submit", handleSubmit);
    form.addEventListener("input", saveDraft);

    // Clear messages on input
    form.addEventListener("input", () => {
      successMsg.style.display = "none";
      errorMsg.style.display = "none";
    });
  }

  // ============================================================
  // TURNSTILE SETUP
  // ============================================================

  function setupTurnstile() {
    if (!config.TURNSTILE_SITE_KEY || config.TURNSTILE_SITE_KEY.includes("YOUR_")) {
      console.warn("Turnstile not configured. CAPTCHA disabled.");
      config.ENABLE_TURNSTILE = false;
      return;
    }

    turnstileContainer.style.display = "block";
    turnstileContainer.querySelector(".cf-turnstile").setAttribute("data-sitekey", config.TURNSTILE_SITE_KEY);

    // Wait for Turnstile to load
    if (typeof window.turnstile !== "undefined") {
      window.turnstile.render("#" + turnstileContainer.querySelector(".cf-turnstile").id || ".cf-turnstile", {
        sitekey: config.TURNSTILE_SITE_KEY,
        theme: "light",
        callback: handleTurnstileCallback
      });
    } else {
      // Retry after delay
      setTimeout(() => {
        if (typeof window.turnstile !== "undefined") {
          window.turnstile.render(".cf-turnstile", {
            sitekey: config.TURNSTILE_SITE_KEY,
            theme: "light",
            callback: handleTurnstileCallback
          });
        }
      }, 500);
    }
  }

  function handleTurnstileCallback(token) {
    turnstileToken = token;
  }

  // ============================================================
  // FORM SUBMISSION
  // ============================================================

  async function handleSubmit(e) {
    e.preventDefault();

    if (isSubmitting) return;

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Check Turnstile
    if (config.ENABLE_TURNSTILE && !turnstileToken) {
      showError(config.MESSAGES.validation.turnstile);
      return;
    }

    // Check rate limit
    if (config.ENABLE_RATE_LIMIT && !checkLocalRateLimit()) {
      showError(config.MESSAGES.rateLimit);
      return;
    }

    // Collect form data
    const formData = collectFormData();

    // Add metadata
    formData.timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    formData.sourcePage = window.location.pathname;
    formData.referrer = document.referrer || "Direct";
    formData.ipAddress = "Client-side (will be added server-side)";
    formData.deviceType = getDeviceType();
    formData.browser = getBrowserInfo();
    formData.turnstileToken = turnstileToken;

    // Show loading state
    setSubmitting(true);

    try {
      // Send to Google Apps Script
      const response = await submitToGoogleAppsScript(formData);

      if (response.success) {
        // Clear form
        if (config.AUTO_CLEAR_FORM) {
          form.reset();
          clearDraft();
        }

        // Reset Turnstile
        if (config.ENABLE_TURNSTILE && typeof window.turnstile !== "undefined") {
          window.turnstile.reset();
          turnstileToken = null;
        }

        // Show success message
        showSuccess(response.message || config.MESSAGES.success);

        // Track in analytics if available
        if (typeof gtag !== "undefined") {
          gtag("event", "form_submission", { event_category: "contact", event_label: "success" });
        }

        // Clear localStorage
        clearDraft();

        // Scroll to success message
        setTimeout(() => {
          successMsg.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      } else {
        showError(response.message || config.MESSAGES.error);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      showError(error.message || config.MESSAGES.error);
    } finally {
      setSubmitting(false);
    }
  }

  // ============================================================
  // FORM DATA COLLECTION
  // ============================================================

  function collectFormData() {
    const formElements = form.elements;
    const data = {};

    for (let i = 0; i < formElements.length; i++) {
      const field = formElements[i];
      if (field.name && field.type !== "submit") {
        data[field.name] = field.value.trim();
      }
    }

    return data;
  }

  // ============================================================
  // VALIDATION
  // ============================================================

  function validateForm() {
    const errors = {};
    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const service = form.querySelector("#service").value.trim();
    const message = form.querySelector("#message").value.trim();

    // Validate name
    if (!name) {
      errors.name = config.MESSAGES.validation.name;
    }

    // Validate email
    if (!email || !isValidEmail(email)) {
      errors.email = config.MESSAGES.validation.email;
    }

    // Validate service
    if (!service) {
      errors.service = config.MESSAGES.validation.service;
    }

    // Validate message
    if (!message || message.length < config.MIN_MESSAGE_LENGTH) {
      errors.message = config.MESSAGES.validation.message;
    }

    // Display errors
    if (Object.keys(errors).length > 0) {
      displayValidationErrors(errors);
      return false;
    }

    clearValidationErrors();
    return true;
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function displayValidationErrors(errors) {
    // Clear all errors first
    clearValidationErrors();

    // Display specific errors
    for (const [field, message] of Object.entries(errors)) {
      const errorElement = form.querySelector(`[data-error-for="${field}"]`);
      if (errorElement) {
        errorElement.textContent = message;
        const fieldElement = form.querySelector(`#${field}`);
        if (fieldElement) {
          fieldElement.closest(".form-field").classList.add("has-error");
        }
      }
    }

    // Show error message
    showError("Please fix the errors above.");
  }

  function clearValidationErrors() {
    form.querySelectorAll(".form-field.has-error").forEach((field) => {
      field.classList.remove("has-error");
    });
    form.querySelectorAll(".form-field__error").forEach((error) => {
      error.textContent = "";
    });
  }

  // ============================================================
  // GOOGLE APPS SCRIPT SUBMISSION
  // ============================================================

  async function submitToGoogleAppsScript(data) {
    if (!config.APPS_SCRIPT_URL || config.APPS_SCRIPT_URL.includes("YOUR_")) {
      throw new Error("Google Apps Script URL not configured. Check config.js");
    }

    const response = await fetch(config.APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    // Note: With no-cors, we can't read the response body directly
    // So we'll assume success after 2 seconds (server is processing)
    // This is a limitation of client-side form submission

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: config.MESSAGES.success
        });
      }, 2000);
    });
  }

  // ============================================================
  // UI STATE MANAGEMENT
  // ============================================================

  function setSubmitting(state) {
    isSubmitting = state;
    submitBtn.disabled = state;
    submitText.textContent = state ? config.MESSAGES.sending : "Send Message";
    form.style.opacity = state ? "0.6" : "1";
  }

  function showSuccess(message) {
    successText.textContent = message;
    successMsg.style.display = "block";
    errorMsg.style.display = "none";
  }

  function showError(message) {
    errorText.textContent = message;
    errorMsg.style.display = "block";
    successMsg.style.display = "none";
  }

  // ============================================================
  // DRAFT MANAGEMENT (Local Storage)
  // ============================================================

  function saveDraft() {
    const draft = collectFormData();
    localStorage.setItem("contact_form_draft", JSON.stringify(draft));
  }

  function loadDraft() {
    const draft = localStorage.getItem("contact_form_draft");
    if (!draft) return;

    try {
      const data = JSON.parse(draft);
      for (const [key, value] of Object.entries(data)) {
        const field = form.querySelector(`[name="${key}"]`);
        if (field) {
          field.value = value;
        }
      }
    } catch (error) {
      console.error("Error loading draft:", error);
    }
  }

  function clearDraft() {
    localStorage.removeItem("contact_form_draft");
  }

  // ============================================================
  // RATE LIMITING (Client-side check)
  // ============================================================

  function checkLocalRateLimit() {
    const key = "contact_form_submissions";
    const now = Date.now();
    const submissions = JSON.parse(localStorage.getItem(key) || "[]");

    // Remove submissions older than 1 hour
    const recentSubmissions = submissions.filter((timestamp) => now - timestamp < 3600000);

    // Check if rate limit exceeded
    if (recentSubmissions.length >= config.RATE_LIMIT) {
      return false;
    }

    // Add current submission
    recentSubmissions.push(now);
    localStorage.setItem(key, JSON.stringify(recentSubmissions));
    return true;
  }

  // ============================================================
  // DEVICE & BROWSER DETECTION
  // ============================================================

  function getDeviceType() {
    const ua = navigator.userAgent;
    if (/Mobile|Android|iPhone/.test(ua)) return "Mobile";
    if (/Tablet|iPad/.test(ua)) return "Tablet";
    return "Desktop";
  }

  function getBrowserInfo() {
    const ua = navigator.userAgent;
    if (ua.indexOf("Firefox") > -1) return "Firefox";
    if (ua.indexOf("Chrome") > -1) return "Chrome";
    if (ua.indexOf("Safari") > -1) return "Safari";
    if (ua.indexOf("Edge") > -1) return "Edge";
    if (ua.indexOf("MSIE") > -1 || ua.indexOf("Trident") > -1) return "IE";
    return "Other";
  }

  // ============================================================
  // INIT
  // ============================================================

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
