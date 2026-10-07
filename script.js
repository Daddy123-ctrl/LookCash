// ============ Sesión de usuario ============
// Si hay una sesión guardada (login.html o registro.html la crearon
// con auth.js), cambia el header para mostrar el nombre del usuario
// y un botón de "Cerrar sesión" en vez de "Iniciar sesión".
document.addEventListener('DOMContentLoaded', () => {
  const headerCta = document.getElementById('headerCta');
  if (!headerCta || typeof scObtenerSesion !== 'function') return;

  const sesion = scObtenerSesion();
  if (!sesion) return;

  const primerNombre = sesion.nombre.split(' ')[0];

  headerCta.innerHTML = `
    <span class="user-greeting">Hola, ${primerNombre}</span>
    <a href="dashboard.html" class="btn btn-primary">Ir a mi LookCash</a>
    <a href="#" class="btn btn-ghost" id="cerrarSesionBtn">Cerrar sesión</a>
  `;

  document.getElementById('cerrarSesionBtn').addEventListener('click', (evento) => {
    evento.preventDefault();
    scCerrarSesion();
    window.location.reload();
  });
});

// ============ Menú móvil ============
const header = document.getElementById('site-header');
const navToggle = document.getElementById('navToggle');

navToggle.addEventListener('click', () => {
  const isOpen = header.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Cierra el menú móvil al hacer clic en un enlace
document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', () => {
    header.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ============ Acordeón de preguntas frecuentes ============
document.querySelectorAll('.accordion-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.accordion-item');
    const isOpen = item.classList.contains('is-open');

    // Comportamiento tipo "un panel a la vez"
    document.querySelectorAll('.accordion-item.is-open').forEach(openItem => {
      if (openItem !== item) {
        openItem.classList.remove('is-open');
        openItem.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
      }
    });

    item.classList.toggle('is-open', !isOpen);
    trigger.setAttribute('aria-expanded', String(!isOpen));
  });
});
