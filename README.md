# 🌍 Urban Holidays — Complete Website Setup Guide
**Domain:** urbanholidays.com

---

## 📁 File Structure

```
urbanholidays/
├── index.html          ← Homepage
├── about.html          ← About Us
├── tours.html          ← All Tours Listing
├── tour-detail.html    ← Individual Tour Detail
├── gallery.html        ← Photo Gallery
├── contact.html        ← Contact / Enquiry
│
├── css/
│   └── style.css       ← Shared styles (all pages)
│
├── js/
│   ├── main.js         ← Shared JS (cursor, navbar, animations)
│   └── components.js   ← Navbar + Footer injector
│
└── backend/
    ├── server.js       ← Node.js Express backend
    ├── package.json
    └── .env.example    ← Copy to .env and fill values
```

---

## 🚀 STEP 1: Local Testing (Free, No Server Needed)

Just open `index.html` in your browser to preview all pages.

For the contact forms to work, you need the backend running (Step 2).

---

## 🖥️ STEP 2: Run the Backend Locally

**Requirements:** Node.js 18+ installed

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your Gmail and settings
nano .env   # or open in VS Code

# Start the server
npm start
```

Then open: `http://localhost:3000`

---

## 🌐 STEP 3: Deploy to Production (Live Server)

### Option A: VPS / Hostinger / DigitalOcean (Recommended)

**1. Buy a VPS** — Hostinger VPS starts from ~₹300/month

**2. SSH into your server:**
```bash
ssh root@YOUR_SERVER_IP
```

**3. Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**4. Upload your files:**
```bash
# Using FileZilla (SFTP) or scp
scp -r /path/to/urbanholidays root@YOUR_SERVER_IP:/var/www/urbanholidays
```

**5. Install and start with PM2 (keeps it running 24/7):**
```bash
npm install pm2 -g
cd /var/www/urbanholidays/backend
npm install
cp .env.example .env
nano .env   # fill in your values
pm2 start server.js --name "urbanholidays"
pm2 startup   # auto-restart on reboot
pm2 save
```

**6. Install Nginx (web server / reverse proxy):**
```bash
sudo apt install nginx

# Create config
sudo nano /etc/nginx/sites-available/urbanholidays.com
```

Paste this Nginx config:
```nginx
server {
    listen 80;
    server_name urbanholidays.com www.urbanholidays.com;

    location / {
        root /var/www/urbanholidays;
        index index.html;
        try_files $uri $uri/ =404;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/urbanholidays.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**7. Point your domain to the server:**
- Log into GoDaddy / Namecheap (wherever you bought `urbanholidays.com`)
- Go to DNS settings
- Set **A record** → `@` → `YOUR_SERVER_IP`
- Set **A record** → `www` → `YOUR_SERVER_IP`
- Wait 5–30 minutes for propagation

**8. Add FREE SSL (HTTPS) with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d urbanholidays.com -d www.urbanholidays.com
```

✅ Your site is now live at `https://urbanholidays.com`!

---

### Option B: Hostinger Web Hosting (Easiest)

If you have shared hosting (not VPS), the Node.js backend won't run directly. Instead:

1. Upload all HTML/CSS/JS files via **File Manager** or **FTP**
2. For form submissions, use a **free form service** instead:
   - **Formspree** (free) — `https://formspree.io`
   - **EmailJS** (free tier) — `https://emailjs.com`

Replace the form action in `contact.html`:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

---

## 📧 STEP 4: Set Up Email Notifications

1. Go to your Google Account
2. Security → 2-Step Verification → App Passwords
3. Create a new App Password for "Mail"
4. Copy the 16-character password
5. Paste it in your `.env` file as `EMAIL_PASS`

```
EMAIL_USER=info@urbanholidays.com  (or your Gmail)
EMAIL_PASS=xxxx xxxx xxxx xxxx    (16-char app password)
OWNER_EMAIL=your-personal@gmail.com
```

---

## 🖼️ STEP 5: Replace Placeholder Images

All images currently use Unsplash (free, high quality). To use your own:

1. Upload your travel photos to the `images/` folder
2. Replace Unsplash URLs with local paths, e.g.:
   ```html
   <!-- Before -->
   <img src="https://images.unsplash.com/photo-xxx" />
   
   <!-- After -->
   <img src="images/goa-beach.jpg" />
   ```

**Recommended image sizes:**
- Hero images: 1800×1000px
- Tour card thumbnails: 600×400px
- Gallery: 600×800px (portrait) or 600×400px (landscape)
- Team photos: 400×400px (square)

**Free image compression:** `squoosh.app`

---

## 📞 STEP 6: Update Contact Details

Search & replace these placeholders across all files:

| Placeholder | Replace with |
|-------------|-------------|
| `+91 XXXXX XXXXX` | Your actual phone number |
| `91XXXXXXXXXX` | Phone without + (for WhatsApp) |
| `info@urbanholidays.com` | Your email |
| `Ballari, Karnataka 583101` | Your exact address |
| `@urban_holidays_ballari` | Your Instagram handle |

---

## 🗺️ STEP 7: Add Your Google Maps Embed

1. Go to `maps.google.com`
2. Search your office address
3. Click Share → Embed a map → Copy HTML
4. Replace the `<iframe src="...">` in `contact.html`

---

## 🔧 Adding More Tours

To add a new tour to `tour-detail.html`, add to the `tours` object in the `<script>` tag:

```javascript
mynewdestination: {
  title: 'My New Tour',
  badge: '🇮🇳 Domestic Tour',
  price: '₹15,000',
  wPrice: '15000',
  heroImg: 'images/mynewdest-hero.jpg',
  images: ['images/img1.jpg', 'images/img2.jpg', ...],
  meta: [{i:'🕐',l:'Duration',v:'5 Days'}, ...],
  desc: 'Description paragraph 1...',
  desc2: 'Description paragraph 2...',
  itinerary: [{d:1, t:'Day Title', txt:'Day description...'}, ...],
  includes: ['Hotel stay', 'Breakfast', ...],
  excludes: ['Flights', ...],
},
```

Then link to it: `<a href="tour-detail.html?id=mynewdestination">`

---

## 🛡️ Security Checklist

- [ ] Never commit `.env` to GitHub (add to `.gitignore`)
- [ ] Change `ADMIN_KEY` in `.env` to a random secret string
- [ ] Enable HTTPS (SSL) via Certbot
- [ ] Keep `npm` packages updated: `npm update`
- [ ] Backup `enquiries.json` regularly

---

## 📱 SEO Tips

Add to each page's `<head>`:
```html
<!-- Google Search Console verification -->
<meta name="google-site-verification" content="YOUR_CODE">

<!-- Open Graph for social sharing -->
<meta property="og:title" content="Urban Holidays | Where Memories Begin"/>
<meta property="og:description" content="Ballari's finest travel house — book your dream vacation today."/>
<meta property="og:image" content="https://urbanholidays.com/images/og-image.jpg"/>
<meta property="og:url" content="https://urbanholidays.com"/>
```

---

## 🆘 Support

For technical help, contact your web developer or reach out via:
- WhatsApp: (your number)
- Email: info@urbanholidays.com

---

*Built for Urban Holidays, Ballari © 2025*
