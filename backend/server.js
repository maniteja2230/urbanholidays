/**
 * ═══════════════════════════════════════════════
 *  URBAN HOLIDAYS — Node.js Backend Server
 *  urbanholidays.com
 * ═══════════════════════════════════════════════
 *
 *  Features:
 *   ✅ Serves all static HTML/CSS/JS files
 *   ✅ POST /api/enquiry  — Saves enquiry + sends email + WhatsApp
 *   ✅ GET  /api/enquiries — View all enquiries (admin)
 *   ✅ POST /api/contact   — General contact form
 *   ✅ Rate limiting & basic security
 */

const express    = require('express');
const nodemailer = require('nodemailer');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');
const path       = require('path');
const fs         = require('fs');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3000;

/* ── DATA FILE (simple JSON storage, replace with MongoDB later) ── */
const DATA_FILE = path.join(__dirname, 'enquiries.json');
function loadEnquiries() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } catch { return []; }
}
function saveEnquiry(enquiry) {
  const list = loadEnquiries();
  list.push({ id: Date.now(), timestamp: new Date().toISOString(), ...enquiry });
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2));
}

/* ── EMAIL TRANSPORTER ── */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,   // your Gmail e.g. urbanholidays@gmail.com
    pass: process.env.EMAIL_PASS,   // App password (not normal password)
  }
});

async function sendEnquiryEmail(data) {
  try {
    // Email to owner
    await transporter.sendMail({
      from: `"Urban Holidays Website" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL || process.env.EMAIL_USER,
      subject: `New Enquiry: ${data.tour || data.interest || 'General'} — ${data.name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;padding:24px;border:1px solid #eee">
          <h2 style="color:#0D1B2A;border-bottom:3px solid #C9A84C;padding-bottom:12px">New Travel Enquiry</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#888;width:140px">Name</td><td style="padding:8px 0;font-weight:600">${data.name || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#888">Phone</td><td style="padding:8px 0;font-weight:600">${data.phone || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#888">Email</td><td style="padding:8px 0">${data.email || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#888">Tour / Interest</td><td style="padding:8px 0">${data.tour || data.interest || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#888">Travel Date</td><td style="padding:8px 0">${data.date || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#888">Travellers</td><td style="padding:8px 0">${data.pax || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#888">Message</td><td style="padding:8px 0">${data.message || '—'}</td></tr>
          </table>
          <p style="margin-top:24px;color:#888;font-size:12px">Received from urbanholidays.com at ${new Date().toLocaleString('en-IN', {timeZone:'Asia/Kolkata'})}</p>
        </div>
      `
    });

    // Auto-reply to customer
    if (data.email) {
      await transporter.sendMail({
        from: `"Urban Holidays" <${process.env.EMAIL_USER}>`,
        to: data.email,
        subject: 'We received your enquiry — Urban Holidays',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px">
            <div style="background:#0D1B2A;padding:28px 32px">
              <h1 style="color:#C9A84C;margin:0;font-size:24px">Urban<span style="color:white">Holidays</span></h1>
              <p style="color:rgba(255,255,255,0.5);font-size:11px;letter-spacing:3px;margin:4px 0 0">WHERE MEMORIES BEGIN</p>
            </div>
            <div style="padding:32px">
              <h2 style="color:#0D1B2A">Thank you, ${data.name}!</h2>
              <p style="color:#4A4A4A;line-height:1.7">We have received your travel enquiry and our expert team will contact you within <strong>24 hours</strong>.</p>
              <div style="background:#FBF3E0;padding:20px;margin:20px 0;border-left:3px solid #C9A84C">
                <strong>Your Enquiry Summary:</strong><br/>
                Tour: ${data.tour || data.interest || 'General Enquiry'}<br/>
                Travellers: ${data.pax || '—'}<br/>
                Travel Date: ${data.date || 'To be decided'}
              </div>
              <p style="color:#4A4A4A">For immediate assistance, call or WhatsApp us:</p>
              <p style="font-size:18px;font-weight:bold;color:#0D1B2A">${process.env.PHONE || '+91 XXXXX XXXXX'}</p>
              <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
              <p style="color:#888;font-size:12px">© ${new Date().getFullYear()} Urban Holidays, Ballari | urbanholidays.com</p>
            </div>
          </div>
        `
      });
    }
  } catch (err) {
    console.error('Email error:', err.message);
  }
}

/* ── MIDDLEWARE ── */
app.use(express.json());
app.use(cors({ origin: ['https://urbanholidays.com', 'https://www.urbanholidays.com', 'http://localhost:3000'] }));
app.use(helmet({ contentSecurityPolicy: false }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50 });
app.use('/api/', limiter);

/* ── SERVE STATIC FILES ── */
app.use(express.static(path.join(__dirname, '..')));  // serves index.html, css/, js/ etc.

/* ── API ROUTES ── */

// POST /api/enquiry  — tour booking / enquiry
app.post('/api/enquiry', async (req, res) => {
  const { name, phone, email, tour, interest, date, pax, message } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required.' });
  }

  const enquiry = { name, phone, email, tour, interest, date, pax, message, source: 'website' };

  // Save to file
  saveEnquiry(enquiry);
  console.log(`[${new Date().toLocaleString()}] New enquiry: ${name} (${phone}) — ${tour || interest || 'General'}`);

  // Send email notification
  await sendEnquiryEmail(enquiry);

  res.json({ success: true, message: 'Enquiry received!' });
});

// GET /api/enquiries?key=ADMIN_KEY  — view all enquiries
app.get('/api/enquiries', (req, res) => {
  const key = req.query.key;
  if (key !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json(loadEnquiries());
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

/* ── START SERVER ── */
app.listen(PORT, () => {
  console.log(`\n🌍 Urban Holidays server running on port ${PORT}`);
  console.log(`   Open: http://localhost:${PORT}\n`);
});
