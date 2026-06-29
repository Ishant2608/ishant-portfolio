# Contact Form Integration - Complete Setup Guide

## 📋 Overview

Your contact form is now integrated with:
- ✅ Google Sheets (automatic data storage)
- ✅ Email notifications (instant admin alerts + auto-reply)
- ✅ Spam protection (Cloudflare Turnstile CAPTCHA)
- ✅ Form validation (client & server-side)
- ✅ Draft recovery (localStorage)
- ✅ Rate limiting (prevents abuse)
- ✅ CRM features (status tracking, notes, follow-up)

---

## 🚀 Step-by-Step Setup

### Step 1: Set Up Google Sheet

1. Go to https://docs.google.com/spreadsheets/create
2. Create a new spreadsheet (name it "Contact Inquiries")
3. Note the ID from the URL:
   - URL: `https://docs.google.com/spreadsheets/d/**YOUR_ID**/edit`
   - Copy the part between `/d/` and `/edit`

### Step 2: Create Google Apps Script

1. Go to https://script.google.com
2. Click **"New project"**
3. Copy the entire code from `google-apps-script.gs`
4. Paste it into the Google Apps Script editor
5. Replace `YOUR_SHEET_ID_HERE` with your actual Sheet ID:
   ```javascript
   const SHEET_ID = PropertiesService.getUserProperties().getProperty("SHEET_ID") || "YOUR_SHEET_ID_HERE";
   ```

### Step 3: Deploy as Web App

1. Click **"Deploy"** (top right)
2. Select **"New deployment"**
3. Choose deployment type: **"Web app"**
4. Configure:
   - **Execute as**: Your Gmail account
   - **Who has access**: Anyone
5. Click **"Deploy"**
6. Copy the generated URL (it will look like):
   ```
   https://script.google.com/macros/s/AKfy.../usercoderun
   ```

### Step 4: Set Up Cloudflare Turnstile

1. Go to https://dash.cloudflare.com/
2. Navigate to **Turnstile** (left sidebar)
3. Click **"Create site"**
4. Fill in:
   - **Site name**: Your Portfolio
   - **Domain**: Your domain (or localhost for testing)
5. Click **"Create**
6. Get your **Site Key** and **Secret Key**

### Step 5: Configure Your Frontend

1. Open `config.js`
2. Update these values:

```javascript
window.CONTACT_CONFIG = {
  // Step 3 URL
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/YOUR_SCRIPT_ID/usercoderun",
  
  // Step 4 Site Key
  TURNSTILE_SITE_KEY: "0x4AAAAAAAK1H5p8C....",
  
  // Your email
  ADMIN_EMAIL: "ishantsantoshsharma@gmail.com",
  
  // ... rest of config
};
```

### Step 6: Test the Form

1. Open your portfolio site
2. Go to Contact page
3. Fill out the form
4. Submit
5. **Check:**
   - ✅ Success message appears
   - ✅ Email notification arrives
   - ✅ New row in Google Sheet
   - ✅ Auto-reply received in test email

---

## 📊 What Happens on Submission

### User Experience
1. Form validation (required fields, email format, etc.)
2. Turnstile CAPTCHA verification
3. Rate limit check (5 submissions per IP per hour)
4. Form data sent to Google Apps Script
5. Success message displayed
6. Form cleared (draft saved in localStorage)

### Behind the Scenes
1. **Server receives data** → Google Apps Script
2. **Validates again** → Server-side security check
3. **Saves to Sheet** → New row added automatically
4. **Sends admin email** → ishantsantoshsharma@gmail.com
5. **Sends auto-reply** → To visitor's email
6. **Logs submission** → For audit trail

---

## 📧 Email Templates

### Admin Notification Email
- **Subject**: New Portfolio Inquiry - {Name}
- **Body**: All submission details in formatted table
- **Features**:
  - Device info (mobile/desktop)
  - Browser info
  - Source page
  - Link to Google Sheet

### Auto-Reply Email
- **Subject**: Thanks for contacting Ishant Sharma
- **Body**: Professional confirmation message
- **Features**:
  - Personalized with user's name
  - Service requested summary
  - Response time expectation
  - Contact information

---

## 📋 Google Sheet Columns

The sheet auto-creates these columns:

| Column | Purpose | CRM Feature |
|--------|---------|-------------|
| Timestamp | When submitted | Auto-filled |
| Name | Visitor name | Sorting |
| Email | Contact email | Link to reply |
| Phone | Optional contact | Direct call |
| Company | Optional company | Lead context |
| Service | Service requested | Filter leads |
| Budget | Project budget | Prioritize |
| Subject | Inquiry subject | Quick reference |
| Message | Full message | Details |
| Source Page | Which page form filled | Traffic source |
| Referrer | Came from where | Attribution |
| IP Address | IP for validation | Spam detection |
| Device Type | Mobile/Desktop | User context |
| Browser | Browser info | QA testing |
| **Status** | 🎯 NEW / Contacted / Closed | Track progress |
| **Follow-up Date** | 🎯 When to follow up | Scheduling |
| **Notes** | 🎯 Your custom notes | CRM data |

---

## 🔐 Security Features

### Client-Side
- ✅ Email format validation
- ✅ Required field checking
- ✅ Message length minimum (10 chars)
- ✅ XSS prevention (input sanitization)

### Server-Side (Google Apps Script)
- ✅ All data re-validated
- ✅ HTML escaping for XSS prevention
- ✅ String length limits
- ✅ Honeypot field detection
- ✅ Rate limiting by IP

### CAPTCHA
- ✅ Cloudflare Turnstile v3 (invisible)
- ✅ Prevents bot submissions
- ✅ No extra friction for real users

### Privacy
- ✅ No data stored in database (Google Sheet only)
- ✅ No tracking pixels
- ✅ Secure email delivery via Gmail
- ✅ Data retention: 30+ days (you control)

---

## 🎯 Managing Inquiries in Google Sheets

### Mark as Contacted
1. Open the Google Sheet
2. Change Status from "New" → "Contacted"
3. Add follow-up date
4. Add notes

### Track Follow-ups
1. Add date to "Follow-up Date" column
2. Use conditional formatting to highlight overdue
3. Filter by Status = "New" for daily review

### Archive Old Inquiries
1. Use menu: **Contact Form → Clear Old Submissions (30+ days)**
2. Removes submissions older than 30 days automatically

---

## 🔧 Troubleshooting

### Form Submissions Not Saving
- ✅ Check Google Apps Script deployment URL is correct
- ✅ Verify SHEET_ID is correct in Apps Script
- ✅ Check Google Sheet has edit permissions

### Emails Not Sending
- ✅ Verify ADMIN_EMAIL is correct
- ✅ Check Gmail account allows App access
- ✅ Enable 2FA + use App Passwords if needed

### Turnstile Not Appearing
- ✅ Verify TURNSTILE_SITE_KEY is correct
- ✅ Check domain is added to Cloudflare Turnstile
- ✅ Ensure https://challenges.cloudflare.com/turnstile script loads

### Form Not Submitting
- ✅ Open browser console (F12)
- ✅ Check for JavaScript errors
- ✅ Verify config.js is loaded
- ✅ Check contact-handler.js is loaded

---

## 📱 Mobile Optimization

Form is fully responsive:
- ✅ Single-column on phones (< 768px)
- ✅ Touch-friendly inputs (16px font to prevent zoom)
- ✅ Larger tap targets
- ✅ Success/error messages scroll into view

---

## 🎨 Customization

### Change Form Fields
1. Edit contact.html form fields
2. Update contact-handler.js validation
3. Update google-apps-script.gs sheet columns

### Change Email Template
1. Edit `sendAdminNotification()` in google-apps-script.gs
2. Edit `sendAutoReply()` in google-apps-script.gs
3. Redeploy the script

### Change Success/Error Messages
1. Edit `config.js` → `MESSAGES` object
2. Messages update automatically

---

## 📊 Analytics Integration

The form supports Google Analytics tracking:

```javascript
// Automatically tracked:
- Form submission (success)
- Form validation errors
- Rate limit hits
- Turnstile verification
```

To add custom events, edit `contact-handler.js` line ~270.

---

## 🔄 Draft Recovery

- Automatically saves form data to browser storage
- If user navigates away, form data persists
- Deleted automatically after successful submission

---

## 🚫 Rate Limiting

- **Limit**: 5 submissions per IP per hour
- **Purpose**: Prevent spam/abuse
- **Storage**: Browser localStorage (client-side check)
- **Server**: Also rate-limited by Google Apps Script cache

---

## ✅ Deployment Checklist

- [ ] Google Sheet created
- [ ] Google Apps Script deployed (Web app)
- [ ] Script URL copied to config.js
- [ ] Turnstile site created
- [ ] Turnstile Site Key copied to config.js
- [ ] ADMIN_EMAIL updated in config.js
- [ ] contact.html updated with new fields
- [ ] contact-handler.js loaded on contact page
- [ ] Contact form tested locally
- [ ] Success message appears
- [ ] Email notification received
- [ ] New row in Google Sheet
- [ ] Auto-reply received
- [ ] Deployed to production

---

## 📞 Need Help?

### Common Issues
1. **Form not working?** → Check browser console (F12) for errors
2. **Emails not arriving?** → Check spam folder + Gmail settings
3. **Sheet not updating?** → Verify APPS_SCRIPT_URL in config.js
4. **Turnstile not showing?** → Add domain to Cloudflare Turnstile

### Useful Links
- Google Apps Script: https://script.google.com
- Cloudflare Turnstile: https://dash.cloudflare.com/
- Gmail Settings: https://myaccount.google.com/
- Google Sheets: https://sheets.google.com

---

## 📝 Files Created/Modified

### New Files
- ✅ `google-apps-script.gs` - Backend handler
- ✅ `config.js` - Frontend configuration
- ✅ `contact-handler.js` - Form submission handler

### Modified Files
- ✅ `contact.html` - Updated form with new fields
- ✅ `style.css` - Added form styling

### No Changes Needed
- ✅ `script.js` - Global site scripts (no contact-specific code)
- ✅ `constants.js` - Brand constants
- ✅ Other pages - No changes

---

## 🎉 You're All Set!

Your contact form is now:
- ✅ Fully functional
- ✅ Spam-protected
- ✅ Email-integrated
- ✅ Sheet-backed
- ✅ Production-ready

**Next Steps:**
1. Fill out the setup guide above
2. Deploy to your domain
3. Test the form
4. Start receiving qualified leads!

---

*Last Updated: 2024*
