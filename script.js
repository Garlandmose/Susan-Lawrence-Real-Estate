// Susan Lawrence contact information
const CONTACT = {
  phone: "+1 (262) 286-9903",
  address: "3145 Carlisle St #101, Columbia, SC 29205, USA",
  email: "susan.lawrence_remax@outlook.com",
  facebook: "https://web.facebook.com/profile.php?id=61585842321740"
};

// ✅ FEATURED LISTINGS — Now with full Zillow image arrays (e.g., 32 for CO listing)
const listingsData = [
  {
    id: 1, type: 'sale', badge: 'AFFILIATE LISTING · FOR SALE',
    price: '$299,900', address: '826 Arrowwood Rd, Columbia, SC 29210',
    beds: 3, baths: 2, sqft: 2055, lotSize: 'Verify with source', yearBuilt: 1959,
    images: [], sourceLabel: 'Columbia Home Source · Century 21 803 Realty',
    sourceUrl: 'https://cdn.columbiahomesource.com/homedetails/sc/columbia/scconsolidated-f383c89967b635bf9fdafe3b236cd1c6-scconsolidated/826-arrowwood-rd-columbia-sc-29210',
    features: ['3 bedrooms', '2 bathrooms', 'Attached garage', 'Deck', 'Central air'],
    description: 'Publicly advertised South Carolina property. The listing source reported this home as active at $299,900 with 3 bedrooms, 2 bathrooms, and approximately 2,055 square feet when checked. Confirm current availability, price, property condition, and showing arrangements directly with the credited listing source.',
    virtualTour: '#'
  },
  {
    id: 2, type: 'rent', badge: 'AFFILIATE LISTING · FOR RENT',
    price: '$2,295/mo', address: '4357 Azalea Dr, Columbia, SC 29205',
    beds: 2, baths: 2.5, sqft: 1301, images: [],
    sourceLabel: 'Property Management Services of Columbia',
    sourceUrl: 'https://pmservicescolumbia.appfolio.com/listings/listings',
    leaseTerm: 'Confirm with listing source', utilities: 'Confirm with listing source',
    features: ['2 bedrooms', '2.5 bathrooms', 'Washer/dryer', 'Granite countertops', 'Pets with approval'],
    description: 'Publicly advertised rental from Property Management Services of Columbia. The listing source reported rent of $2,295 per month and availability when checked. Confirm current availability, rent, deposits, pet policy, and lease terms directly with the property manager.',
    virtualTour: '#'
  },
  {
    id: 3, type: 'student', badge: 'AFFILIATE LISTING · STUDENT RENTAL',
    price: '$1,050/mo', address: '114.5 South Edisto Ave, Columbia, SC 29205',
    campus: 'University of South Carolina', university: 'usc',
    beds: 1, baths: 1, sqft: 'Verify with source',
    leaseTerm: 'Confirm with listing source', utilities: 'Confirm with listing source',
    images: [], sourceLabel: 'CollegePads · USC Off-Campus Housing',
    sourceUrl: 'https://www.rentcollegepads.com/off-campus-housing/university-of-south-carolina/search',
    features: ['1 bedroom', 'Student-area rental', 'Near University of South Carolina'],
    description: 'Publicly advertised student-area rental. CollegePads listed this address at $1,050 per month and marked it available when checked. Availability and all lease details must be reconfirmed directly with the listing provider.',
    virtualTour: '#'
  }
];

// DOM Elements

const listingsContainer = document.getElementById('listings-container');
const studentListingsContainer = document.getElementById('student-listings');
const modalBody = document.getElementById('modalBody');
const saveNotification = document.getElementById('saveNotification');

// ✅ ENHANCED LIGHTBOX — Auto-rotate + arrows + keyboard
const lightboxHTML = `
  <div id="imageLightbox" class="lightbox">
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <button class="lightbox-nav lightbox-prev" aria-label="Previous image">‹</button>
      <img id="lightbox-img" src="" alt="Property image" class="lightbox-img">
      <div id="lightbox-caption"></div>
      <button class="lightbox-nav lightbox-next" aria-label="Next image">›</button>
      <div id="lightbox-counter"></div>
    </div>
  </div>
`;
if (!document.getElementById('imageLightbox')) {
  document.body.insertAdjacentHTML('beforeend', lightboxHTML);
}

// ✅ Enhanced Lightbox Controller
function openLightbox(images, startIndex = 0, captions = []) {
  const lightbox = document.getElementById('imageLightbox');
  const imgEl = document.getElementById('lightbox-img');
  const captionEl = document.getElementById('lightbox-caption');
  const counterEl = document.getElementById('lightbox-counter');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  const closeBtn = document.querySelector('.lightbox-close');

  let currentIndex = startIndex;
  let autoInterval;

  const updateLightbox = () => {
    imgEl.src = images[currentIndex];
    captionEl.textContent = captions[currentIndex] || '';
    counterEl.textContent = `${currentIndex + 1} / ${images.length}`;
  };

  const nextSlide = () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightbox();
  };

  const prevSlide = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightbox();
  };

  // Controls
  prevBtn.onclick = (e) => { e.stopPropagation(); prevSlide(); resetAuto(); };
  nextBtn.onclick = (e) => { e.stopPropagation(); nextSlide(); resetAuto(); };
  closeBtn.onclick = () => {
    clearInterval(autoInterval);
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
  };

  // Keyboard nav
  const handleKey = (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    else if (e.key === 'ArrowRight') nextSlide();
    else if (e.key === 'Escape') closeBtn.click();
  };
  document.addEventListener('keydown', handleKey);

  // Cleanup on close
  const observer = new MutationObserver(() => {
    if (lightbox.style.display === 'none') {
      clearInterval(autoInterval);
      document.removeEventListener('keydown', handleKey);
      observer.disconnect();
    }
  });
  observer.observe(lightbox, { attributes: true, attributeFilter: ['style'] });

  // Auto-rotate (4s) — pauses on hover/click
  const startAuto = () => {
    autoInterval = setInterval(nextSlide, 4000);
  };
  const resetAuto = () => {
    clearInterval(autoInterval);
    startAuto();
  };

  imgEl.addEventListener('click', resetAuto); // click image → reset timer
  lightbox.addEventListener('mouseenter', () => clearInterval(autoInterval));
  lightbox.addEventListener('mouseleave', startAuto);

  // Init
  updateLightbox();
  lightbox.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  startAuto();
}

// ✅ Universal Modal Close Handler
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('close')) {
    const modalId = e.target.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }
  if (e.target.hasAttribute('data-action') && e.target.getAttribute('data-action') === 'close') {
    const modalId = e.target.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }
  if (e.target.classList.contains('modal')) {
    e.target.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
  // Close lightbox
  if (e.target.classList.contains('lightbox')) {
    e.target.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// ✅ Lightbox Open/Close
function openLightbox(images, startIndex = 0, captions = []) {
  const lightbox = document.getElementById('imageLightbox');
  const imgEl = document.getElementById('lightbox-img');
  const captionEl = document.getElementById('lightbox-caption');
  const counterEl = document.getElementById('lightbox-counter');

  let currentIndex = startIndex;

  const updateLightbox = () => {
    imgEl.src = images[currentIndex];
    captionEl.textContent = captions[currentIndex] || '';
    counterEl.textContent = `${currentIndex + 1} / ${images.length}`;
  };

  // Nav
  document.querySelector('.lightbox-prev').onclick = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightbox();
  };
  document.querySelector('.lightbox-next').onclick = () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightbox();
  };
  document.querySelector('.lightbox-close').onclick = () => {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
  };

  updateLightbox();
  lightbox.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// Render Listings
function renderListings(type = 'all') {
  const filtered = type === 'all' ? listingsData : listingsData.filter(item => item.type === type);
  if (listingsContainer) {
    listingsContainer.innerHTML = filtered.map(listing => {
      const firstImg = Array.isArray(listing.images) ? listing.images[0] : listing.img;
      const imageStyle = firstImg ? `background-image: url('${firstImg}')` : 'background-color: #e9ecef;';
      return `
        <div class="listing-card" data-id="${listing.id}">
          <div class="listing-img" style="${imageStyle}">
            <span class="listing-badge">${listing.badge}</span>
            ${listing.images && listing.images.length > 1 
              ? `<button class="view-all-photos" data-id="${listing.id}">📷 ${listing.images.length} Photos</button>` 
              : ''}
          </div>
          <div class="listing-content">
            <div class="listing-price">${listing.price}</div>
            <div class="listing-address">${listing.address}</div>
            <div class="listing-source">Affiliate listing · <a href="${listing.sourceUrl}" target="_blank" rel="noopener">Source: ${listing.sourceLabel}</a></div>
            <div class="listing-features">
              <span>${listing.beds} BR</span>
              <span>${listing.baths} BA</span>
              <span>${listing.sqft} sqft</span>
            </div>
          </div>
          <div class="listing-footer">
            <button class="btn btn-primary view-details-btn" data-id="${listing.id}">View Details</button>
            <button class="btn save-btn" data-id="${listing.id}">❤️ Save</button>
          </div>
        </div>
      `;
    }).join('');
  }
  attachListingEventListeners();
}

// Render Student Listings
function renderStudentListings() {
  let filtered = listingsData.filter(item => item.type === 'student');
  const university = document.querySelector('#university-filter')?.value;
  if (university) filtered = filtered.filter(item => item.university === university);
  if (studentListingsContainer) {
    studentListingsContainer.innerHTML = filtered.map(listing => {
      const firstImg = Array.isArray(listing.images) ? listing.images[0] : listing.img;
      const imageStyle = firstImg ? `background-image: url('${firstImg}')` : 'background-color: #e9ecef;';
      return `
        <div class="listing-card" data-id="${listing.id}">
          <div class="listing-img" style="${imageStyle}">
            <span class="listing-badge">${listing.badge}</span>
            ${listing.images && listing.images.length > 1 
              ? `<button class="view-all-photos" data-id="${listing.id}">📷 ${listing.images.length} Photos</button>` 
              : ''}
          </div>
          <div class="listing-content">
            <div class="listing-price">${listing.price}</div>
            <div class="listing-address">${listing.address}</div>
            <div class="listing-source">Affiliate listing · <a href="${listing.sourceUrl}" target="_blank" rel="noopener">Source: ${listing.sourceLabel}</a></div>
            <div class="listing-features">
              <span>${listing.beds} BR</span>
              <span>${listing.baths} BA</span>
              <span>${listing.leaseTerm || 'Flexible'}</span>
            </div>
          </div>
          <div class="listing-footer">
            <button class="btn btn-primary view-details-btn" data-id="${listing.id}">Virtual Tour</button>
            <button class="btn contact-btn" data-id="${listing.id}">📞 Contact</button>
          </div>
        </div>
      `;
    }).join('');
  }
  attachListingEventListeners();
}

function attachListingEventListeners() {
  document.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      openModal(id);
    });
  });
  document.querySelectorAll('.save-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.target.dataset.id);
      saveProperty(id);
    });
  });
  document.querySelectorAll('.contact-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('contactOptionsModal').style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
  });
  // ✅ Click photos badge → open lightbox
  document.querySelectorAll('.view-all-photos').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(e.target.dataset.id);
      const property = listingsData.find(p => p.id === id);
      if (!property) return;
      const images = property.images || [property.img];
      const captions = images.map((_, i) => `${property.address} — Photo ${i + 1}`);
      openLightbox(images, 0, captions);
    });
  });
}

// ✅ MODAL WITH BOOTSTRAP-STYLE CAROUSEL + CLICKABLE IMAGES
function openModal(id) {
  const property = listingsData.find(p => p.id === id);
  if (!property) return;

  const imageSources = Array.isArray(property.images) ? property.images : (property.img ? [property.img] : []);

  const captions = imageSources.map((_, i) => {
    const base = property.address.split(',')[0];
    return i === 0 ? `${base} — Front` :
           i === 1 ? `${base} — Interior` :
           i === 2 ? `${base} — Kitchen` :
           i === 3 ? `${base} — Bedroom` :
           `${base} — View ${i + 1}`;
  });

  let campusInfo = property.campus ? `<p><strong>📍 Campus:</strong> ${property.campus}</p>` : '';
  let leaseInfo = '';
  if (property.leaseTerm || property.utilities) {
    leaseInfo = `
      <div class="feature-item"><span class="feature-icon">📅</span><span><strong>Lease:</strong> ${property.leaseTerm || 'Flexible'}</span></div>
      <div class="feature-item"><span class="feature-icon">💡</span><span><strong>Utilities:</strong> ${property.utilities || 'Not Included'}</span></div>
    `;
  }

  // ✅ Carousel with CLICKABLE images (opens lightbox)
  const carouselHTML = imageSources.length ? `
    <div class="property-carousel">
      <div class="carousel-inner">
        ${imageSources.map((src, i) => `
          <div class="carousel-item ${i === 0 ? 'active' : ''}" data-index="${i}">
            <img src="${src}" class="d-block w-100 carousel-img clickable-img" data-index="${i}" data-prop-id="${property.id}" alt="${property.address} — Image ${i + 1}">
            <div class="carousel-caption d-none d-md-block">
              <p>${captions[i]}</p>
            </div>
          </div>
        `).join('')}
      </div>
      ${imageSources.length > 1 ? `
        <button class="carousel-control-prev" type="button" aria-label="Previous">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>
        <button class="carousel-control-next" type="button" aria-label="Next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
        <div class="carousel-indicators">
          ${imageSources.map((_, i) => `
            <button type="button" class="${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>
          `).join('')}
        </div>
      ` : ''}
    </div>
  ` : '<div class="property-image-placeholder">Photos and additional details are available from the credited listing source.</div>';

  if (!modalBody) return;
  modalBody.innerHTML = `
    <div class="modal-body">
      ${carouselHTML}

      <div class="modal-details">
        <h2>${property.address}</h2>
        <div class="price">${property.price}</div>
        <p>${property.description}</p>
        <p class="listing-source">Affiliate listing · <a href="${property.sourceUrl}" target="_blank" rel="noopener">View original listing: ${property.sourceLabel}</a></p>
        <p class="affiliate-disclosure">The Keydeniers Team may receive a referral fee or commission under an affiliate agreement if a referral leads to a completed transaction. Verify all property information with the original source.</p>
        <div class="features-grid">
          <div class="feature-item"><span class="feature-icon">🛏️</span><span><strong>${property.beds} Bedrooms</strong></span></div>
          <div class="feature-item"><span class="feature-icon">🛁</span><span><strong>${property.baths} Bathrooms</strong></span></div>
          <div class="feature-item"><span class="feature-icon">📐</span><span><strong>${property.sqft} sqft</strong></span></div>
          ${property.lotSize ? `<div class="feature-item"><span class="feature-icon">🌳</span><span><strong>${property.lotSize}</strong></span></div>` : ''}
          ${property.yearBuilt ? `<div class="feature-item"><span class="feature-icon">📅</span><span><strong>Built: ${property.yearBuilt}</strong></span></div>` : ''}
          ${leaseInfo}
        </div>
        ${campusInfo}
        <h3>Features</h3>
        <ul>${property.features.map(f => `<li>✅ ${f}</li>`).join('')}</ul>
        <div style="margin-top:1.5rem;display:flex;flex-wrap:wrap;gap:0.75rem;">
          <button id="modalVirtualTourBtn" class="btn" style="background:#0056b3;color:white;">🎥 Request Listing Details</button>
          <button id="modalContactBtn" class="btn btn-primary">📞 Contact Susan</button>
          <button id="modalSaveBtn" class="btn" style="color:#e63900;">❤️ Save</button>
        </div>
      </div>
    </div>
  `;

  // ✅ Make carousel images clickable (lightbox)
  document.querySelectorAll('.clickable-img').forEach(img => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      const propId = parseInt(img.dataset.propId);
      const idx = parseInt(img.dataset.index);
      const prop = listingsData.find(p => p.id === propId);
      if (!prop) return;
      const imgs = prop.images || [prop.img];
      const caps = imgs.map((_, i) => `${prop.address} — Photo ${i + 1}`);
      openLightbox(imgs, idx, caps);
    });
  });

  // Initialize carousel if multi-image
  if (imageSources.length > 1) {
    initPropertyCarousel();
  }

  // Reattach action buttons
  document.getElementById('modalVirtualTourBtn')?.addEventListener('click', () => {
    document.getElementById('propertyModal').style.display = 'none';
    openVirtualTourModal(property.id);
  });
  document.getElementById('modalContactBtn')?.addEventListener('click', () => {
    document.getElementById('propertyModal').style.display = 'none';
    document.getElementById('contactOptionsModal').style.display = 'block';
  });
  document.getElementById('modalSaveBtn')?.addEventListener('click', () => {
    saveProperty(property.id);
  });

  document.getElementById('propertyModal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// ✅ Lightweight Carousel Controller
function initPropertyCarousel() {
  const items = document.querySelectorAll('.carousel-item');
  const indicators = document.querySelectorAll('.carousel-indicators button');
  const prevBtn = document.querySelector('.carousel-control-prev');
  const nextBtn = document.querySelector('.carousel-control-next');
  let currentIndex = 0;
  let autoInterval;

  const showSlide = (index) => {
    currentIndex = ((index % items.length) + items.length) % items.length;
    items.forEach((item, i) => item.classList.toggle('active', i === currentIndex));
    indicators.forEach((ind, i) => ind.classList.toggle('active', i === currentIndex));
  };

  const nextSlide = () => showSlide(currentIndex + 1);
  const prevSlide = () => showSlide(currentIndex - 1);

  nextBtn?.addEventListener('click', (e) => { e.stopPropagation(); nextSlide(); resetAuto(); });
  prevBtn?.addEventListener('click', (e) => { e.stopPropagation(); prevSlide(); resetAuto(); });

  indicators.forEach((btn, i) => {
    btn.addEventListener('click', (e) => { e.stopPropagation(); showSlide(i); resetAuto(); });
  });

  const startAuto = () => {
    autoInterval = setInterval(nextSlide, 5000);
  };
  const resetAuto = () => {
    clearInterval(autoInterval);
    startAuto();
  };
  startAuto();

  const carousel = document.querySelector('.property-carousel');
  carousel?.addEventListener('mouseenter', () => clearInterval(autoInterval));
  carousel?.addEventListener('mouseleave', startAuto);
}

function openVirtualTourModal(id) {
  const property = listingsData.find(p => p.id === id);
  if (!property) return;
  document.getElementById('virtualTourPropertyAddress').textContent = `Property: ${property.address}`;
  document.getElementById('vt-property-address').value = property.address;
  document.getElementById('virtualTourModal').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

// Save Property
function saveProperty(id) {
  const saved = JSON.parse(localStorage.getItem('savedProperties') || '[]');
  if (!saved.includes(id)) {
    saved.push(id);
    localStorage.setItem('savedProperties', JSON.stringify(saved));
    const btn = document.querySelector(`.save-btn[data-id="${id}"]`);
    if (btn) {
      btn.innerHTML = '❤️ Saved';
      btn.style.color = '#e63900';
    }
    if (saveNotification) {
      saveNotification.classList.add('show');
      setTimeout(() => saveNotification.classList.remove('show'), 2000);
    }
  }
}

// Tab & Filter Listeners
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderListings(btn.dataset.tab);
  });
});

document.getElementById('distance-filter')?.addEventListener('input', (e) => {
  document.getElementById('distance-value').textContent = `${e.target.value} miles`;
});

document.getElementById('university-filter')?.addEventListener('change', renderStudentListings);
document.querySelectorAll('input[name="room-type"]').forEach(r => r.addEventListener('change', renderStudentListings));

// Mobile Menu
document.querySelector('.mobile-menu-btn')?.addEventListener('click', () => {
  document.querySelector('.nav-links')?.classList.toggle('show');
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    if (!this.getAttribute('href') || ['#'].includes(this.getAttribute('href'))) return;
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
      document.querySelector('.nav-links')?.classList.remove('show');
    }
  });
});

// ✅ Form submission UX feedback
document.addEventListener('DOMContentLoaded', () => {
  renderListings('all');
  renderStudentListings();

  document.querySelectorAll('form').forEach(form => {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;

    form.addEventListener('submit', () => {
      submitBtn.disabled = true;
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '📤 Sending...';
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 3000);
    });
  });
});