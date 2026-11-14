(() => {
  const collections = window.aviationCollections;
  const dialog = document.getElementById('aviation-lightbox');
  if (!collections || !dialog || typeof dialog.showModal !== 'function') return;

  const fullPhoto = document.getElementById('aviation-full-photo');
  const caption = document.getElementById('aviation-photo-caption');
  const counter = document.getElementById('aviation-photo-counter');
  const title = document.getElementById('aviation-lightbox-title');
  const thumbs = dialog.querySelector('.aviation-lightbox-thumbs');
  const error = document.getElementById('aviation-photo-error');
  let activeCollection;
  let index = 0;
  let opener;
  let touchStart;

  function showPhoto(nextIndex) {
    index = (nextIndex + activeCollection.photos.length) % activeCollection.photos.length;
    const photo = activeCollection.photos[index];
    error.hidden = true;
    fullPhoto.hidden = false;
    fullPhoto.alt = photo.alt;
    fullPhoto.src = photo.src;
    caption.textContent = photo.alt;
    counter.textContent = `${index + 1} of ${activeCollection.photos.length} photographs`;
    error.querySelector('a').href = photo.src;
    thumbs.querySelectorAll('button').forEach((button, thumbIndex) => {
      button.setAttribute('aria-current', String(thumbIndex === index));
    });
    const activeThumb = thumbs.children[index];
    if (activeThumb) thumbs.scrollLeft = activeThumb.offsetLeft - thumbs.offsetLeft - thumbs.clientWidth / 2 + activeThumb.clientWidth / 2;
  }

  function openCollection(key, startIndex, trigger) {
    const collection = collections[key];
    if (!collection || !collection.photos.length) return;
    activeCollection = collection;
    opener = trigger;
    title.textContent = collection.title;
    dialog.querySelectorAll('.aviation-lightbox-stage>button').forEach(button => { button.disabled = collection.photos.length === 1; });
    thumbs.replaceChildren();
    collection.photos.forEach((photo, photoIndex) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `Show photograph ${photoIndex + 1}: ${photo.alt}`);
      const image = document.createElement('img');
      image.src = photo.preview || photo.src;
      image.alt = '';
      image.loading = 'lazy';
      image.width = 66;
      image.height = 46;
      button.append(image);
      button.addEventListener('click', () => showPhoto(photoIndex));
      thumbs.append(button);
    });
    document.body.classList.add('aviation-dialog-open');
    dialog.showModal();
    showPhoto(startIndex);
  }

  document.querySelectorAll('[data-photo-collection]').forEach(link => {
    const collection = collections[link.dataset.photoCollection];
    const photo = collection?.photos[Number(link.dataset.photoIndex)];
    if (!photo) return;
    const image = link.querySelector('img');
    if (image && link.closest('[data-photo-grid]')) {
      image.alt = photo.alt;
      image.src = photo.preview || photo.src;
      if (photo.width && photo.height) { image.width = photo.width; image.height = photo.height; }
    }
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      openCollection(link.dataset.photoCollection, Number(link.dataset.photoIndex), link);
    });
  });

  document.querySelectorAll('[data-open-collection]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => openCollection(button.dataset.openCollection, 0, button));
  });

  document.querySelectorAll('[data-feature-photo]').forEach(link => {
    const key = `feature-${link.dataset.featurePhoto}`;
    const image = link.querySelector('img');
    collections[key] = {title:'Flight simulators', photos:[{src:link.getAttribute('href'), alt:image.alt}]};
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      openCollection(key, 0, link);
    });
  });

  dialog.querySelector('.aviation-dialog-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.aviation-photo-prev').addEventListener('click', () => showPhoto(index - 1));
  dialog.querySelector('.aviation-photo-next').addEventListener('click', () => showPhoto(index + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(index + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(index - 1); }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('aviation-dialog-open');
    fullPhoto.removeAttribute('src');
    opener?.focus({preventScroll:true});
  });
  fullPhoto.addEventListener('error', () => { if (!dialog.open) return; fullPhoto.hidden = true; error.hidden = false; });
  fullPhoto.addEventListener('touchstart', event => { touchStart = event.changedTouches[0]; }, {passive:true});
  fullPhoto.addEventListener('touchend', event => {
    if (!touchStart) return;
    const end = event.changedTouches[0];
    const horizontal = end.clientX - touchStart.clientX;
    if (Math.abs(horizontal) > 60 && Math.abs(horizontal) > Math.abs(end.clientY - touchStart.clientY)) showPhoto(index + (horizontal < 0 ? 1 : -1));
    touchStart = null;
  }, {passive:true});

  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); toggle.focus();
    }
  });
})();
