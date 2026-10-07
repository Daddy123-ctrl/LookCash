// ============================================================
// LookCash — Panel de administración
//
// Los usuarios que se listan aquí abajo son los REALES, guardados
// por auth.js en localStorage cuando alguien se registra desde
// registro.html (o entra con el botón de Google simulado).
// Suspender/reactivar/eliminar un usuario aquí queda guardado de
// verdad: se refleja la próxima vez que esa persona intente iniciar
// sesión.
//
// "Registros por día" y "Actividad reciente" SÍ siguen siendo datos
// de ejemplo (no hay todavía un registro histórico de eventos ni de
// metas/retos/conversaciones) — cuando exista ese backend, se
// reemplazan por datos reales igual que ya se hizo con los usuarios.
// ============================================================

let usuarios = [];

// ---------- Datos de ejemplo (sin backend real todavía) ----------
const registrosPorDia = [
  { dia: "Lun", valor: 18 },
  { dia: "Mar", valor: 26 },
  { dia: "Mié", valor: 14 },
  { dia: "Jue", valor: 32 },
  { dia: "Vie", valor: 41 },
  { dia: "Sáb", valor: 22 },
  { dia: "Dom", valor: 12 },
];

const actividadReciente = [
  { tipo: "verde", texto: "María Torres completó el reto \"Ahorra 3 semanas seguidas\"." },
  { tipo: "naranja", texto: "Nuevo usuario registrado: juanpa_23@gmail.com" },
  { tipo: "verde", texto: "Se creó una meta de ahorro: \"Portátil nuevo\" ($1.200.000)." },
  { tipo: "gris", texto: "El chatbot respondió 214 preguntas en la última hora." },
  { tipo: "naranja", texto: "Un usuario solicitó eliminar sus datos (Ley 1581 de 2012)." },
];

// ---------- Sesión / topbar ----------
function pintarSesionAdmin() {
  if (typeof scObtenerSesion !== "function") return;

  const sesion = scObtenerSesion();
  if (!sesion) return;

  document.getElementById("adminName").textContent = sesion.nombre;
  document.getElementById("adminAvatar").textContent = iniciales(sesion.nombre);
}

// ---------- Barras de registros por día ----------
function pintarBarras() {
  const contenedor = document.getElementById("adminBars");
  const max = Math.max(...registrosPorDia.map(d => d.valor));

  contenedor.innerHTML = registrosPorDia.map(d => {
    const alturaPorc = Math.round((d.valor / max) * 100);
    return `
      <div class="bar" style="height:${alturaPorc}%;" title="${d.dia}: ${d.valor} registros">
        <span>${d.dia}</span>
      </div>
    `;
  }).join("");
}

// ---------- Lista de actividad reciente ----------
function pintarActividad() {
  const lista = document.getElementById("adminActivity");
  lista.innerHTML = actividadReciente.map(item => `
    <li>
      <span class="badge ${item.tipo}"></span>
      <span>${item.texto}</span>
    </li>
  `).join("");
}

// ---------- KPIs ----------
function pintarKpis() {
  const activos = usuarios.filter(u => u.estado === "activo").length;

  document.getElementById("kpiUsuarios").textContent = usuarios.length;
  document.getElementById("kpiActivos").textContent = activos;
  // Metas y conversaciones: aún sin backend, quedan como ejemplo.
}

// ---------- Iniciales para el avatar ----------
function iniciales(nombre) {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0])
    .join("")
    .toUpperCase();
}

// ---------- Tabla de usuarios ----------
function pintarUsuarios(lista) {
  const cuerpo = document.getElementById("usersTableBody");

  if (usuarios.length === 0) {
    cuerpo.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; color:var(--tinta-suave); padding:26px;">
          Todavía no se ha registrado ningún usuario. Cuando alguien
          cree una cuenta desde "registro.html", va a aparecer aquí.
        </td>
      </tr>
    `;
    return;
  }

  if (lista.length === 0) {
    cuerpo.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; color:var(--tinta-suave); padding:26px;">
          No se encontraron usuarios con ese criterio de búsqueda.
        </td>
      </tr>
    `;
    return;
  }

  cuerpo.innerHTML = lista.map(u => `
    <tr>
      <td>
        <div class="user-cell">
          <div class="avatar">${iniciales(u.nombre)}</div>
          <div class="meta">
            <strong>${u.nombre}</strong>
            <span>${u.correo}</span>
          </div>
        </div>
      </td>
      <td>${u.rol}</td>
      <td>${u.nivel}</td>
      <td><span class="status-pill ${u.estado}">${etiquetaEstado(u.estado)}</span></td>
      <td>${u.fechaRegistro}</td>
      <td>
        <div class="row-actions">
          <button type="button" data-accion="ver" data-correo="${u.correo}">Ver</button>
          <button type="button" class="danger" data-accion="suspender" data-correo="${u.correo}">
            ${u.estado === "suspendido" ? "Reactivar" : "Suspender"}
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

function etiquetaEstado(estado) {
  if (estado === "activo") return "Activo";
  if (estado === "pendiente") return "Pendiente";
  if (estado === "suspendido") return "Suspendido";
  return estado;
}

// ---------- Búsqueda de usuarios ----------
function configurarBusqueda() {
  const input = document.getElementById("userSearch");
  input.addEventListener("input", () => {
    const termino = input.value.trim().toLowerCase();
    const filtrados = usuarios.filter(u =>
      u.nombre.toLowerCase().includes(termino) ||
      u.correo.toLowerCase().includes(termino)
    );
    pintarUsuarios(filtrados);
  });
}

// ---------- Acciones de la tabla (ver / suspender) ----------
function configurarAccionesTabla() {
  document.getElementById("usersTableBody").addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-accion]");
    if (!boton) return;

    const correo = boton.dataset.correo;
    const usuario = usuarios.find(u => u.correo === correo);
    if (!usuario) return;

    if (boton.dataset.accion === "ver") {
      alert(
        `Usuario: ${usuario.nombre}\n` +
        `Correo: ${usuario.correo}\n` +
        `Rol: ${usuario.rol}\n` +
        `Nivel: ${usuario.nivel}\n` +
        `Estado: ${etiquetaEstado(usuario.estado)}\n` +
        `Registro: ${usuario.fechaRegistro}`
      );
      return;
    }

    if (boton.dataset.accion === "suspender") {
      usuario.estado = usuario.estado === "suspendido" ? "activo" : "suspendido";
      scGuardarUsuarios(usuarios); // persiste el cambio de verdad en localStorage
      pintarUsuarios(usuarios);
      pintarKpis();
    }
  });
}

// ---------- Menú lateral en móvil ----------
function configurarMenuMovil() {
  const shell = document.getElementById("adminShell");
  const boton = document.getElementById("adminMenuToggle");

  boton.addEventListener("click", () => {
    const abierto = shell.classList.toggle("is-open");
    boton.setAttribute("aria-expanded", String(abierto));
  });
}

// ---------- Navegación lateral (cambia el título de la sección) ----------
function configurarNavegacion() {
  const titulos = {
    dashboard: ["Dashboard", "Resumen general de la actividad en LookCash"],
    usuarios: ["Usuarios", "Administra las cuentas registradas en la plataforma"],
    metas: ["Metas de ahorro", "Metas creadas por los usuarios y su progreso"],
    retos: ["Retos y gamificación", "Puntos, insignias y retos activos"],
    conversaciones: ["Conversaciones IA", "Historial de interacciones con el chatbot"],
    configuracion: ["Configuración", "Ajustes generales del panel"],
  };

  const enlaces = document.querySelectorAll(".admin-nav a");
  const shell = document.getElementById("adminShell");

  enlaces.forEach(enlace => {
    enlace.addEventListener("click", (evento) => {
      evento.preventDefault();

      enlaces.forEach(e => e.classList.remove("is-active"));
      enlace.classList.add("is-active");

      const seccion = enlace.dataset.section;
      const [titulo, subtitulo] = titulos[seccion] || titulos.dashboard;
      document.querySelector(".admin-topbar h1").textContent = titulo;
      document.querySelector(".admin-topbar p").textContent = subtitulo;

      // Cierra el menú en móvil al navegar
      shell.classList.remove("is-open");
    });
  });
}

// ---------- Inicio ----------
document.addEventListener("DOMContentLoaded", () => {
  usuarios = typeof scObtenerUsuarios === "function" ? scObtenerUsuarios() : [];

  pintarSesionAdmin();
  pintarBarras();
  pintarActividad();
  pintarUsuarios(usuarios);
  pintarKpis();
  configurarBusqueda();
  configurarAccionesTabla();
  configurarMenuMovil();
  configurarNavegacion();
});
