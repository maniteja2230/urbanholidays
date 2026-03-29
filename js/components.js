/* ═══════════════════════════════════════════════
   URBAN HOLIDAYS — Nav & Footer HTML Components
   Include this file and call injectNav() / injectFooter()
═══════════════════════════════════════════════ */

function injectNav(isDark = false) {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  nav.dataset.dark = isDark ? 'true' : 'false';
  nav.innerHTML = `
    <a href="index.html" class="nav-logo">Urban<span>Holidays</span><small>where memories begin</small></a>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html">Home</a></li>
      <li><a href="about.html">About</a></li>
      <li class="nav-dropdown">
        <a href="tours.html">Tours ▾</a>
        <ul class="dropdown-menu">
          <li><a href="tours.html?type=domestic">Domestic Tours</a></li>
          <li><a href="tours.html?type=international">International Tours</a></li>
          <li><a href="tours.html?type=honeymoon">Honeymoon Packages</a></li>
          <li><a href="tours.html?type=group">Group Tours</a></li>
        </ul>
      </li>
      <li><a href="gallery.html">Gallery</a></li>
      <li><a href="contact.html">Contact</a></li>
      <li><a href="contact.html" class="nav-cta-btn">Book Now</a></li>
    </ul>
    <div class="hamburger" id="hamburger" onclick="toggleMenu()">
      <span></span><span></span><span></span>
    </div>
  `;
}

function injectFooter() {
  const footer = document.getElementById('footer');
  if (!footer) return;
  footer.innerHTML = `
    <div class="footer-top">
      <div class="footer-brand">
        <a href="index.html" class="footer-brand-logo">Urban<span>Holidays</span><small>where memories begin</small></a>
        <p>Based in Ballari, we craft extraordinary travel experiences that turn your dreams into unforgettable memories. Domestic or international — we've got you covered.</p>
        <div class="footer-social">
          <a href="https://www.instagram.com/urban_holidays_ballari/" target="_blank" class="social-btn" title="Instagram">📸</a>
          <a href="#" class="social-btn" title="Facebook">📘</a>
          <a href="#" class="social-btn" title="WhatsApp">💬</a>
          <a href="#" class="social-btn" title="YouTube">▶️</a>
        </div>
      </div>
      <div class="footer-col">
        <h5>Company</h5>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About Us</a></li>
          <li><a href="tours.html">Our Tours</a></li>
          <li><a href="gallery.html">Gallery</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5>Tours</h5>
        <ul>
          <li><a href="tours.html?type=domestic">Domestic Tours</a></li>
          <li><a href="tours.html?type=international">International Tours</a></li>
          <li><a href="tours.html?type=honeymoon">Honeymoon Packages</a></li>
          <li><a href="tours.html?type=group">Group Tours</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h5>Contact Us</h5>
        <div class="footer-contact-item"><span class="icon">📍</span><span>Ballari, Karnataka, India</span></div>
        <div class="footer-contact-item"><span class="icon">📱</span><span><a href="tel:+91XXXXXXXXXX">+91 XXXXX XXXXX</a></span></div>
        <div class="footer-contact-item"><span class="icon">📧</span><span><a href="mailto:info@urbanholidays.com">info@urbanholidays.com</a></span></div>
        <div class="footer-contact-item"><span class="icon">📸</span><span>@urban_holidays_ballari</span></div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© ${new Date().getFullYear()} Urban Holidays. All rights reserved.</p>
      <p>Made with ❤️ in Ballari, Karnataka</p>
    </div>
  `;
}
