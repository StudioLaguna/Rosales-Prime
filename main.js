/* ===========================
   ROSALES PRIME — main.js
   =========================== */

'use strict';

// ---- NAVBAR: scroll state + burger ----
const navbar = document.getElementById('navbar');
const burger = document.getElementById('burger');
const navMenu = document.getElementById('nav-menu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

burger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  burger.classList.toggle('active', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
});

navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', false);
  });
});

// ---- PARALLAX HERO ----
const heroParallax = document.getElementById('hero-parallax');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (heroParallax && !prefersReducedMotion) {
  let rafId = null;

  const updateParallax = () => {
    const scrollY = window.scrollY;
    // La imagen se desplaza hacia arriba a 0.35x la velocidad del scroll
    // Esto crea la ilusión de profundidad sin salirse del contenedor
    heroParallax.style.transform = `translateY(${scrollY * 0.35}px)`;
    rafId = null;
  };

  window.addEventListener('scroll', () => {
    if (!rafId) {
      rafId = requestAnimationFrame(updateParallax);
    }
  }, { passive: true });
}


window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

burger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  burger.classList.toggle('active', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
});

// Cierra menu movil al hacer click en un link
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', false);
  });
});

// ---- SWIPER ----
const swiper = new Swiper('.galeria__swiper', {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 16,
  centeredSlides: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    640: {
      slidesPerView: 1.4,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 2.2,
      spaceBetween: 24,
    },
  },
  a11y: {
    prevSlideMessage: 'Foto anterior',
    nextSlideMessage: 'Foto siguiente',
  },
});

// ---- REVEAL ON SCROLL ----
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger ligero entre tarjetas del mismo grupo
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => observer.observe(el));

// ---- FORMULARIO -> WHATSAPP ----
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');

const fields = {
  nombre:   { el: document.getElementById('nombre'),   err: document.getElementById('error-nombre') },
  servicio: { el: document.getElementById('servicio'), err: document.getElementById('error-servicio') },
  telefono: { el: document.getElementById('telefono'), err: document.getElementById('error-telefono') },
};

function validate() {
  let valid = true;

  // Nombre
  const nombre = fields.nombre.el.value.trim();
  if (!nombre) {
    setError('nombre', 'Ingresa tu nombre.');
    valid = false;
  } else {
    clearError('nombre');
  }

  // Servicio
  const servicio = fields.servicio.el.value;
  if (!servicio) {
    setError('servicio', 'Selecciona el servicio que necesitas.');
    valid = false;
  } else {
    clearError('servicio');
  }

  // Telefono: 10 digitos
  const tel = fields.telefono.el.value.replace(/\D/g, '');
  if (tel.length < 10) {
    setError('telefono', 'Ingresa un número de 10 dígitos.');
    valid = false;
  } else {
    clearError('telefono');
  }

  return valid;
}

function setError(name, msg) {
  fields[name].el.classList.add('invalid');
  fields[name].err.textContent = msg;
}

function clearError(name) {
  fields[name].el.classList.remove('invalid');
  fields[name].err.textContent = '';
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validate()) return;

  const nombre   = fields.nombre.el.value.trim();
  const servicio = fields.servicio.el.value;
  const telefono = fields.telefono.el.value.trim();

  const mensaje = `Hola Rosales Prime, mi nombre es *${nombre}*.\nNecesito el servicio de: *${servicio}*.\nMi número de contacto es: *${telefono}*.`;

  const url = `https://wa.me/528701723452?text=${encodeURIComponent(mensaje)}`;

  submitBtn.textContent = 'Redirigiendo...';
  submitBtn.disabled = true;

  setTimeout(() => {
    window.open(url, '_blank', 'noopener,noreferrer');
    submitBtn.textContent = 'Enviar por WhatsApp';
    submitBtn.disabled = false;
    form.reset();
  }, 400);
});

// Limpiar error al corregir campo
Object.values(fields).forEach(({ el, err }) => {
  el.addEventListener('input', () => {
    if (el.classList.contains('invalid')) {
      el.classList.remove('invalid');
      err.textContent = '';
    }
  });
});
