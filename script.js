const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

document.querySelectorAll('.site-nav a').forEach(link => {
  link.addEventListener('click', () => {
    if (!nav || !navToggle) return;
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const galleries = {
  corporate: {
    category: 'Corporate',
    title: 'People Behind the Operation',
    images: ['corporate-01.jpg', 'corporate-02.jpg', 'corporate-03.jpg']
  },
  western: {
    category: 'Western',
    title: 'Ranch & Rodeo',
    images: ['western-01.jpg', 'western-02.jpg', 'western-03.jpg', 'western-04.jpg']
  },
  industrial: {
    category: 'Industrial',
    title: 'Work in Motion',
    images: ['industrial-01.jpg', 'industrial-02.jpg', 'industrial-03.jpg']
  },
  outdoor: {
    category: 'Outdoor',
    title: 'Field Stories',
    images: ['outdoor-01.jpg', 'outdoor-02.jpg', 'outdoor-03.jpg', 'outdoor-04.jpg', 'outdoor-05.jpg']
  },
  brand: {
    category: 'Brand',
    title: 'Campaign Content',
    images: ['brand-01.jpg', 'brand-02.jpg', 'brand-03.jpg']
  }
};

const galleryModal = document.getElementById('galleryModal');
const galleryCategory = document.getElementById('galleryCategory');
const galleryTitle = document.getElementById('galleryTitle');
const galleryCounter = document.getElementById('galleryCounter');
const galleryImage = document.getElementById('galleryImage');
const galleryThumbs = document.getElementById('galleryThumbs');
const galleryPrev = document.querySelector('.gallery-prev');
const galleryNext = document.querySelector('.gallery-next');
let activeGallery = null;
let activeIndex = 0;
let lastFocusedProject = null;

function imagePath(name) {
  return `assets/portfolio/${name}`;
}

function renderGallery() {
  if (!activeGallery || !galleryImage || !galleryThumbs) return;
  const current = activeGallery.images[activeIndex];
  galleryCategory.textContent = activeGallery.category;
  galleryTitle.textContent = activeGallery.title;
  galleryCounter.textContent = `Image ${activeIndex + 1} of ${activeGallery.images.length}`;
  galleryImage.src = imagePath(current);
  galleryImage.alt = `${activeGallery.title} image ${activeIndex + 1}`;
  galleryThumbs.innerHTML = activeGallery.images.map((image, index) => `
    <button type="button" class="${index === activeIndex ? 'active' : ''}" data-index="${index}" aria-label="Show image ${index + 1}">
      <img src="${imagePath(image)}" alt="" loading="lazy" />
    </button>
  `).join('');
}

function openGallery(key, trigger) {
  activeGallery = galleries[key];
  if (!activeGallery || !galleryModal) return;
  activeIndex = 0;
  lastFocusedProject = trigger;
  renderGallery();
  galleryModal.hidden = false;
  document.body.classList.add('gallery-open');
  const closeButton = document.querySelector('.gallery-close');
  if (closeButton) closeButton.focus();
}

function closeGallery() {
  if (!galleryModal || !galleryImage) return;
  galleryModal.hidden = true;
  document.body.classList.remove('gallery-open');
  activeGallery = null;
  galleryImage.removeAttribute('src');
  if (lastFocusedProject) lastFocusedProject.focus();
}

function stepGallery(direction) {
  if (!activeGallery) return;
  activeIndex = (activeIndex + direction + activeGallery.images.length) % activeGallery.images.length;
  renderGallery();
}

document.querySelectorAll('[data-gallery]').forEach(project => {
  project.addEventListener('click', () => openGallery(project.dataset.gallery, project));
});

if (galleryPrev) galleryPrev.addEventListener('click', () => stepGallery(-1));
if (galleryNext) galleryNext.addEventListener('click', () => stepGallery(1));
if (galleryThumbs) {
  galleryThumbs.addEventListener('click', event => {
    const button = event.target.closest('button[data-index]');
    if (!button) return;
    activeIndex = Number(button.dataset.index);
    renderGallery();
  });
}

document.querySelectorAll('[data-close-gallery]').forEach(closeControl => {
  closeControl.addEventListener('click', closeGallery);
});

document.addEventListener('keydown', event => {
  if (!galleryModal || galleryModal.hidden) return;
  if (event.key === 'Escape') closeGallery();
  if (event.key === 'ArrowLeft') stepGallery(-1);
  if (event.key === 'ArrowRight') stepGallery(1);
});

const workshopGalleryItems = Array.from(document.querySelectorAll('[data-workshop-gallery-index]'));
const workshopLightbox = document.getElementById('workshopLightbox');
const workshopLightboxImage = document.getElementById('workshopLightboxImage');
const workshopLightboxClose = document.querySelector('.workshop-lightbox-close');
const workshopLightboxPrev = document.querySelector('.workshop-lightbox-prev');
const workshopLightboxNext = document.querySelector('.workshop-lightbox-next');
let activeWorkshopImage = 0;
let lastFocusedWorkshopImage = null;

function renderWorkshopLightbox() {
  if (!workshopLightboxImage || !workshopGalleryItems.length) return;
  const image = workshopGalleryItems[activeWorkshopImage].querySelector('img');
  if (!image) return;
  workshopLightboxImage.src = image.currentSrc || image.src;
  workshopLightboxImage.alt = '';
}

function openWorkshopLightbox(index, trigger) {
  if (!workshopLightbox || !workshopGalleryItems.length) return;
  activeWorkshopImage = index;
  lastFocusedWorkshopImage = trigger;
  renderWorkshopLightbox();
  workshopLightbox.hidden = false;
  document.body.classList.add('gallery-open');
  if (workshopLightboxClose) workshopLightboxClose.focus();
}

function closeWorkshopLightbox() {
  if (!workshopLightbox || !workshopLightboxImage) return;
  workshopLightbox.hidden = true;
  document.body.classList.remove('gallery-open');
  workshopLightboxImage.removeAttribute('src');
  if (lastFocusedWorkshopImage) lastFocusedWorkshopImage.focus();
}

function stepWorkshopLightbox(direction) {
  if (!workshopGalleryItems.length || !workshopLightbox || workshopLightbox.hidden) return;
  activeWorkshopImage = (activeWorkshopImage + direction + workshopGalleryItems.length) % workshopGalleryItems.length;
  renderWorkshopLightbox();
}

workshopGalleryItems.forEach(item => {
  item.addEventListener('click', () => {
    openWorkshopLightbox(Number(item.dataset.workshopGalleryIndex), item);
  });
});

if (workshopLightboxClose) workshopLightboxClose.addEventListener('click', closeWorkshopLightbox);
if (workshopLightboxPrev) workshopLightboxPrev.addEventListener('click', () => stepWorkshopLightbox(-1));
if (workshopLightboxNext) workshopLightboxNext.addEventListener('click', () => stepWorkshopLightbox(1));
if (workshopLightbox) {
  workshopLightbox.addEventListener('click', event => {
    if (event.target === workshopLightbox) closeWorkshopLightbox();
  });
}

document.addEventListener('keydown', event => {
  if (!workshopLightbox || workshopLightbox.hidden) return;
  if (event.key === 'Escape') closeWorkshopLightbox();
  if (event.key === 'ArrowLeft') stepWorkshopLightbox(-1);
  if (event.key === 'ArrowRight') stepWorkshopLightbox(1);
});

const topicTabs = Array.from(document.querySelectorAll('[data-topic-tab]'));
const topicPanels = Array.from(document.querySelectorAll('.topic-panel'));

function activateTopic(tab) {
  const panelId = tab.dataset.topicTab;
  topicTabs.forEach(topicTab => {
    const isActive = topicTab === tab;
    topicTab.classList.toggle('active', isActive);
    topicTab.setAttribute('aria-selected', String(isActive));
  });
  topicPanels.forEach(panel => {
    const isActive = panel.id === panelId;
    panel.classList.toggle('active', isActive);
    panel.hidden = !isActive;
  });
}

topicTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTopic(tab));
  tab.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (index + direction + topicTabs.length) % topicTabs.length;
    topicTabs[nextIndex].focus();
    activateTopic(topicTabs[nextIndex]);
  });
});

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const data = new FormData(this);
  const name = data.get('name');
  const company = data.get('company') || 'Not provided';
  const email = data.get('email');
  const project = data.get('project');
  const details = data.get('details');
  const subject = encodeURIComponent(`Project Inquiry: ${project}`);
  const body = encodeURIComponent(`Name: ${name}
Company: ${company}
Email: ${email}
Project Type: ${project}

Project Details:
${details}`);
  const formStatus = document.getElementById('formStatus');
  if (formStatus) {
    formStatus.textContent = 'Your email app is opening with the project details filled in.';
  }
  window.location.href = `mailto:Michael@Bisoncreekmedia.com?subject=${subject}&body=${body}`;
  });
}
