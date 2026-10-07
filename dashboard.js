// ============================================================
// LookCash — Página principal (dashboard) del usuario
//
// Requiere sesión activa (creada por auth.js al iniciar sesión o
// registrarse). Si no hay sesión, manda directo a login.html.
// ============================================================

const DASH_FRASES = [
  "Ahorrar no es dejar de vivir, es decidir en qué quieres gastar mañana.",
  "Cada gasto que registras hoy es una decisión más inteligente para tu futuro.",
  "Pequeños ahorros constantes construyen grandes metas.",
  "No se trata de cuánto ganas, sino de cuánto decides guardar.",
  "Tu yo del futuro te va a agradecer la meta que empieces hoy.",
  "Un presupuesto no te limita, te da libertad para elegir.",
  "El mejor momento para empezar a ahorrar fue ayer. El segundo mejor es hoy.",
];

// Cursos de ejemplo (placeholder): como todavía no hay videos propios
// de cada instructor grabados, los 4 usan el mismo clip de demostración
// (assets/img/SnaCash.mp4). Cuando tengas los videos reales, solo
// cambia el campo "video" de cada curso por su archivo correspondiente.
const DASH_CURSOS = [
  {
    titulo: "Fundamentos del presupuesto personal",
    instructor: "Jairo David Terazo",
    rolInstructor: "Mentor Financiero, LookCash",
    duracion: "6 min",
    descripcion: "Cómo organizar tus ingresos y gastos desde cero, sin hojas de cálculo complicadas.",
    color: "1",
    video: "assets/img/profesor 1.mp4",
  },
  {
    titulo: "Metas de ahorro que sí se cumplen",
    instructor: "Allejandro Barulin",
    rolInstructor: "Mentor Financiero, LookCash",
    duracion: "5 min",
    descripcion: "La diferencia entre una meta que se queda en propósito y una que sí logras.",
    color: "2",
    video: "assets/img/profesor 2.mp4",
  },
  {
    titulo: "Interés compuesto, sin dolor de cabeza",
    instructor: "Jairo From Barcelona",
    rolInstructor: "Mentor Financiero, LookCash",
    duracion: "7 min",
    descripcion: "Por qué el interés compuesto es la herramienta más poderosa para hacer crecer tu plata.",
    color: "3",
    video: "assets/img/profesor 3.mp4",
  },
  {
    titulo: "Cómo salir de una deuda paso a paso",
    instructor: "Juan David Tobardo",
    rolInstructor: "Mentor Financiero, LookCash",
    duracion: "8 min",
    descripcion: "Un método sencillo para priorizar tus deudas y dejar de sentir que no avanzas.",
    color: "4",
    video: "assets/img/profesor 4.mp4",
  },
];

let dashUsuario = null;

document.addEventListener("DOMContentLoaded", () => {
  // ---------- Requerir sesión ----------
  const sesion = typeof scObtenerSesion === "function" ? scObtenerSesion() : null;

  if (!sesion) {
    window.location.href = "login.html";
    return;
  }

  dashUsuario = typeof scBuscarUsuarioPorCorreo === "function"
    ? scBuscarUsuarioPorCorreo(sesion.correo)
    : null;

  pintarTopbar(sesion);
  pintarHero(sesion);
  pintarModulos();
  pintarCursos();
  configurarModal();
});

// ---------- Topbar ----------
function pintarTopbar(sesion) {
  const primerNombre = sesion.nombre.split(" ")[0];
  const nivel = dashUsuario ? dashUsuario.nivel : 1;

  document.getElementById("dashNombre").textContent = sesion.nombre;
  document.getElementById("dashAvatar").textContent = inicialesDash(sesion.nombre);
  document.getElementById("dashNivelPill").textContent = `Nivel ${nivel}`;

  document.getElementById("dashCerrarSesion").addEventListener("click", (evento) => {
    evento.preventDefault();
    scCerrarSesion();
    window.location.href = "login.html";
  });
}

function inicialesDash(nombre) {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0])
    .join("")
    .toUpperCase();
}

// ---------- Hero / saludo ----------
function pintarHero(sesion) {
  const primerNombre = sesion.nombre.split(" ")[0];
  const hora = new Date().getHours();

  let saludoHora = "Buenas noches";
  if (hora >= 5 && hora < 12) saludoHora = "Buenos días";
  else if (hora >= 12 && hora < 19) saludoHora = "Buenas tardes";

  document.getElementById("dashSaludo").textContent = `${saludoHora}, ${primerNombre} 👋`;

  const frase = DASH_FRASES[Math.floor(Math.random() * DASH_FRASES.length)];
  document.getElementById("dashFrase").textContent = frase;

  // Estadísticas de gamificación: todavía no hay un sistema real de
  // puntos/racha, así que se estiman a partir del nivel guardado en
  // el perfil solo para que la pantalla no se vea vacía. Cuando exista
  // el módulo de gamificación real, aquí se leen los valores reales.
  const nivel = dashUsuario ? dashUsuario.nivel : 1;
  document.getElementById("dashStatNivel").textContent = nivel;
  document.getElementById("dashStatRacha").textContent = Math.max(1, nivel * 2);
  document.getElementById("dashStatPuntos").textContent = (nivel * 150).toLocaleString("es-CO");
}

// ---------- Módulos ----------
function pintarModulos() {
  document.querySelectorAll(".module-card[data-modulo]").forEach(boton => {
    boton.addEventListener("click", () => {
      const nombreModulo = boton.dataset.modulo;
      alert(`"${nombreModulo}" está en construcción dentro de este prototipo. ¡Pronto vas a poder usarlo de verdad!`);
    });
  });

  // El módulo de Lukas no muestra alerta: abre el chat (lukas.js
  // escucha el evento "lukas:abrir" para no acoplar los dos archivos).
  const botonLukas = document.getElementById("abrirLukasDesdeModulo");
  if (botonLukas) {
    botonLukas.addEventListener("click", () => {
      document.dispatchEvent(new CustomEvent("lukas:abrir"));
    });
  }
}

// ---------- Cursos ----------
function pintarCursos() {
  const contenedor = document.getElementById("coursesGrid");

  contenedor.innerHTML = DASH_CURSOS.map((curso, indice) => `
    <article class="course-card">
      <button class="course-thumb course-thumb--${curso.color}" type="button" data-indice="${indice}" aria-label="Reproducir video de ${curso.titulo}">
        <span class="course-play">▶</span>
        <span class="course-duration">${curso.duracion}</span>
      </button>
      <div class="course-body">
        <h3>${curso.titulo}</h3>
        <p class="course-instructor">${curso.instructor} · ${curso.rolInstructor}</p>
        <p class="course-desc">${curso.descripcion}</p>
      </div>
    </article>
  `).join("");

  contenedor.querySelectorAll(".course-thumb").forEach(boton => {
    boton.addEventListener("click", () => abrirModalCurso(DASH_CURSOS[boton.dataset.indice]));
  });
}

// ---------- Modal de video ----------
function configurarModal() {
  document.getElementById("courseModalClose").addEventListener("click", cerrarModalCurso);
  document.getElementById("courseModalBackdrop").addEventListener("click", cerrarModalCurso);
}

function abrirModalCurso(curso) {
  const modal = document.getElementById("courseModal");
  const video = document.getElementById("courseModalVideo");

  document.getElementById("courseModalTitle").textContent = curso.titulo;
  document.getElementById("courseModalDesc").textContent =
    `${curso.instructor} · ${curso.rolInstructor} — ${curso.descripcion} (video de demostración)`;

  video.src = curso.video;
  video.load(); // fuerza a que el navegador cargue el nuevo src antes de reproducir

  modal.hidden = false;
  modal.classList.add("is-open");

  video.play().catch((error) => {
    // Si el navegador bloquea el autoplay, el video queda listo
    // y el usuario solo tiene que darle al botón de play nativo.
    console.warn("Autoplay bloqueado, usa el botón de play del video:", error);
  });
}

function cerrarModalCurso() {
  const modal = document.getElementById("courseModal");
  const video = document.getElementById("courseModalVideo");

  video.pause();
  video.removeAttribute("src");
  video.load();

  modal.hidden = true;
  modal.classList.remove("is-open");
}
