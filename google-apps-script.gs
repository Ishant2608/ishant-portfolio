/**
 * Google Apps Script - Contact Form Handler
 * 
 * This script:
 * 1. Receives form submissions from the contact form
 * 2. Saves data to a Google Sheet
 * 3. Sends admin notification email
 * 4. Sends auto-reply to visitor
 * 5. Includes spam protection validation
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet and note its ID
 * 2. Go to Apps Script: script.google.com
 * 3. Create new project > Paste this code
 * 4. Deploy > New deployment > Web app
 * 5. Execute as: Your account
 * 6. Who has access: Anyone
 * 7. Copy the deployment URL
 * 8. Update config.js with the APPS_SCRIPT_URL
 * 
 * UPDATE THESE VALUES:
 */

// ============================================================
// CONFIGURATION - UPDATE THESE
// ============================================================

const ADMIN_EMAIL = "ishantsantoshsharma@gmail.com";
const SHEET_ID = PropertiesService.getUserProperties().getProperty("SHEET_ID") || "YOUR_SHEET_ID_HERE";
const SENDER_NAME = "WebCraft Portfolio";
const ADMIN_SIGNATURE = "Ishant Sharma";

// Rate limiting: max submissions per IP per hour
const RATE_LIMIT_PER_HOUR = 5;

// ============================================================
// MAIN HANDLER - Receives POST requests from contact form
// ============================================================

function doPost(e) {
  try {
    // Parse the request body
    const data = JSON.parse(e.postData.contents);
    
    // Validate required fields
    const validation = validateFormData(data);
    if (!validation.valid) {
      return sendResponse(false, validation.message);
    }
    
    // Check rate limiting
    if (!checkRateLimit(data.ipAddress)) {
      return sendResponse(false, "Too many submissions. Please try again later.");
    }
    
    // Sanitize input
    const sanitized = sanitizeData(data);
    
    // Add timestamp and status
    sanitized.timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    sanitized.status = "New";
    
    // Save to Google Sheet
    const sheetResult = saveToSheet(sanitized);
    if (!sheetResult.success) {
      return sendResponse(false, "Failed to save submission. Please try again.");
    }
    
    // Send admin notification email
    sendAdminNotification(sanitized);
    
    // Send auto-reply to visitor
    sendAutoReply(sanitized);
    
    // Success response
    return sendResponse(true, "Thank you! Your message has been received. I'll get back to you within 24 hours.");
    
  } catch (error) {
    Logger.log("Error in doPost: " + error.toString());
    return sendResponse(false, "An error occurred. Please try again.");
  }
}

// ============================================================
// VALIDATION FUNCTIONS
// ============================================================

function validateFormData(data) {
  // Check required fields
  if (!data.name || !data.name.trim()) {
    return { valid: false, message: "Name is required." };
  }
  
  if (!data.email || !isValidEmail(data.email)) {
    return { valid: false, message: "Valid email is required." };
  }
  
  if (!data.service || !data.service.trim()) {
    return { valid: false, message: "Service is required." };
  }
  
  if (!data.message || !data.message.trim() || data.message.length < 10) {
    return { valid: false, message: "Message must be at least 10 characters." };
  }
  
  // Email validation
  if (!isValidEmail(data.email)) {
    return { valid: false, message: "Please enter a valid email address." };
  }
  
  // Honeypot check (spam detection)
  if (data.honeypot && data.honeypot.length > 0) {
    return { valid: false, message: "Spam detected." };
  }
  
  return { valid: true };
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function checkRateLimit(ipAddress) {
  const cache = CacheService.getUserCache();
  const key = "ratelimit_" + ipAddress;
  const count = cache.get(key);
  
  if (!count) {
    cache.put(key, "1", 3600); // 1 hour TTL
    return true;
  }
  
  const currentCount = parseInt(count);
  if (currentCount >= RATE_LIMIT_PER_HOUR) {
    return false;
  }
  
  cache.put(key, (currentCount + 1).toString(), 3600);
  return true;
}

function sanitizeData(data) {
  return {
    timestamp: data.timestamp || "",
    name: sanitizeString(data.name),
    email: sanitizeEmail(data.email),
    phone: sanitizeString(data.phone || ""),
    company: sanitizeString(data.company || ""),
    service: sanitizeString(data.service),
    budget: sanitizeString(data.budget || ""),
    subject: sanitizeString(data.subject || ""),
    message: sanitizeString(data.message),
    sourcePage: sanitizeString(data.sourcePage || ""),
    referrer: sanitizeString(data.referrer || ""),
    ipAddress: sanitizeString(data.ipAddress || ""),
    deviceType: sanitizeString(data.deviceType || ""),
    browser: sanitizeString(data.browser || ""),
    status: "New",
    notes: ""
  };
}

function sanitizeString(str) {
  if (!str) return "";
  return str.toString()
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .slice(0, 500); // Limit length
}

function sanitizeEmail(email) {
  if (!email) return "";
  return email.toString().toLowerCase().slice(0, 254);
}

// ============================================================
// GOOGLE SHEETS INTEGRATION
// ============================================================

function saveToSheet(data) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    // Add header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Name",
        "Email",
        "Phone",
        "Company",
        "Service",
        "Budget",
        "Subject",
        "Message",
        "Source Page",
        "Referrer",
        "IP Address",
        "Device Type",
        "Browser",
        "Status",
        "Follow-up Date",
        "Notes"
      ]);
    }
    
    // Append data row
    sheet.appendRow([
      data.timestamp,
      data.name,
      data.email,
      data.phone,
      data.company,
      data.service,
      data.budget,
      data.subject,
      data.message,
      data.sourcePage,
      data.referrer,
      data.ipAddress,
      data.deviceType,
      data.browser,
      data.status,
      "",
      data.notes
    ]);
    
    return { success: true };
  } catch (error) {
    Logger.log("Sheet save error: " + error.toString());
    return { success: false };
  }
}

// ============================================================
// EMAIL NOTIFICATIONS
// ============================================================

function sendAdminNotification(data) {
  try {
    const subject = `New Portfolio Inquiry - ${data.name}`;
    
    const htmlBody = `
      <h2>New Contact Form Submission</h2>
      
      <p><strong>Submitted at:</strong> ${data.timestamp}</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr style="background-color: #f5f5f5;">
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${data.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
          <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${data.email}">${data.email}</a></td>
        </tr>
        <tr style="background-color: #f5f5f5;">
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${data.phone || "Not provided"}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Company</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${data.company || "Not provided"}</td>
        </tr>
        <tr style="background-color: #f5f5f5;">
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Service Required</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${data.service}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Budget</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${data.budget || "Not specified"}</td>
        </tr>
        <tr style="background-color: #f5f5f5;">
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Subject</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${data.subject || "No subject"}</td>
        </tr>
      </table>
      
      <h3 style="margin-top: 30px;">Message:</h3>
      <p style="white-space: pre-wrap; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
        ${data.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
      </p>
      
      <table style="width: 100%; margin-top: 30px; font-size: 12px; color: #666;">
        <tr>
          <td><strong>Source Page:</strong> ${data.sourcePage}</td>
          <td><strong>Device:</strong> ${data.deviceType}</td>
        </tr>
        <tr>
          <td><strong>Browser:</strong> ${data.browser}</td>
          <td><strong>IP:</strong> ${data.ipAddress}</td>
        </tr>
      </table>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #666;">
        <p>
          <a href="https://docs.google.com/spreadsheets/d/${SHEET_ID}" style="color: #4F6BFF; text-decoration: none;">
            View in Google Sheets
          </a>
        </p>
      </div>
    `;
    
    GmailApp.sendEmail(ADMIN_EMAIL, subject, "", { 
      htmlBody: htmlBody,
      from: ADMIN_EMAIL
    });
    
    return true;
  } catch (error) {
    Logger.log("Admin email error: " + error.toString());
    return false;
  }
}

function sendAutoReply(data) {
  try {
    const subject = "Thanks for contacting Ishant Sharma";
    
    const htmlBody = `
      <p>Hi ${data.name},</p>
      
      <p>Thank you for reaching out. I have received your message and will review it shortly.</p>
      
      <p>Here are the details of your submission:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #666;">Service Requested:</td>
          <td style="padding: 10px;">${data.service}</td>
        </tr>
        <tr style="background-color: #f5f5f5;">
          <td style="padding: 10px; font-weight: bold; color: #666;">Submitted:</td>
          <td style="padding: 10px;">${data.timestamp}</td>
        </tr>
      </table>
      
      <p>I usually reply within <strong>24 hours</strong>. If you don't hear from me by then, feel free to follow up via:</p>
      
      <ul>
        <li><strong>Email:</strong> ishantsantoshsharma@gmail.com</li>
        <li><strong>Phone:</strong> +91 97204 35032</li>
        <li><strong>LinkedIn:</strong> linkedin.com/in/ishant-sharma-116026229</li>
      </ul>
      
      <p>Looking forward to discussing your project!</p>
      
      <p>Best regards,<br>
      <strong>${ADMIN_SIGNATURE}</strong><br>
      Full Stack Developer & Web Solutions</p>
      
      <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;">
      
      <p style="font-size: 12px; color: #999; text-align: center;">
        This is an automated message from WebCraft portfolio website.
      </p>
    `;
    
    GmailApp.sendEmail(data.email, subject, "", { 
      htmlBody: htmlBody,
      from: ADMIN_EMAIL,
      name: SENDER_NAME
    });
    
    return true;
  } catch (error) {
    Logger.log("Auto-reply email error: " + error.toString());
    return false;
  }
}

// ============================================================
// RESPONSE HANDLER
// ============================================================

function sendResponse(success, message) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: success,
      message: message
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// ADMIN FUNCTIONS (Optional: Call from Google Sheets)
// ============================================================

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("Contact Form")
    .addItem("Get Script URL", "showScriptUrl")
    .addSeparator()
    .addItem("Clear Old Submissions (30+ days)", "clearOldSubmissions")
    .addToUi();
}

function showScriptUrl() {
  const url = ScriptApp.getService().getUrl();
  const ui = SpreadsheetApp.getUi();
  ui.alert("Web App URL:\n\n" + url + "\n\nAdd this to your config.js");
}

function clearOldSubmissions() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  let deletedCount = 0;
  for (let i = data.length - 1; i > 0; i--) {
    const submitDate = new Date(data[i][0]);
    if (submitDate < thirtyDaysAgo) {
      sheet.deleteRow(i + 1);
      deletedCount++;
    }
  }
  
  SpreadsheetApp.getUi().alert("Deleted " + deletedCount + " old submissions.");
}
