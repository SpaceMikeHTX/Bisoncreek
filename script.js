const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.site-nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('contactForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const data = new FormData(this);
  const name = data.get('name');
  const company = data.get('company') || 'Not provided';
  const email = data.get('email');
  const project = data.get('project');
  const details = data.get('details');

  const subject = encodeURIComponent(`Project Inquiry: ${project}`);
  const body = encodeURIComponent(
`Name: ${name}
Company: ${company}
Email: ${email}
Project Type: ${project}

Project Details:
${details}`
  );

  document.getElementById('formStatus').textContent =
    'Your email app is opening with the project details filled in.';

  window.location.href = `mailto:hello@bisoncreekmedia.com?subject=${subject}&body=${body}`;
});
