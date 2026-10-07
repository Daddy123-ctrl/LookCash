// ============================================================
// Lukas — chatbot de LookCash
//
// IMPORTANTE: esto es un motor de respuestas simple por palabras
// clave, NO una IA real todavía. Funciona completamente en el
// navegador, sin necesitar servidor ni API key.
//
// Cuando conecten un modelo de IA real (por ejemplo a través de un
// backend propio que llame a una API de lenguaje), el único cambio
// necesario es reemplazar la función generarRespuestaLukas() por una
// llamada fetch() a ese backend — nunca se debe llamar a una API de
// IA con una clave secreta directamente desde este archivo, porque
// cualquiera que abra el código del sitio podría robarla.
// ============================================================

let lukasAbierto = false;
let lukasYaSaludo = false;

document.addEventListener("DOMContentLoaded", () => {
  const fab = document.getElementById("lukasFab");
  const panel = document.getElementById("lukasPanel");
  const cerrar = document.getElementById("lukasClose");
  const formulario = document.getElementById("lukasForm");
  const input = document.getElementById("lukasInput");

  if (!fab || !panel || !formulario) return;

  fab.addEventListener("click", () => {
    lukasAbierto ? cerrarLukas() : abrirLukas();
  });

  cerrar.addEventListener("click", cerrarLukas);

  // El módulo "Pregúntale a Lukas" del dashboard dispara este evento
  // para abrir el chat sin que dashboard.js y lukas.js dependan
  // directamente el uno del otro.
  document.addEventListener("lukas:abrir", abrirLukas);

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const texto = input.value.trim();
    if (texto === "") return;

    agregarMensaje(texto, "usuario");
    input.value = "";

    mostrarEscribiendo();

    setTimeout(() => {
      quitarEscribiendo();
      agregarMensaje(generarRespuestaLukas(texto), "lukas");
    }, 600 + Math.random() * 500);
  });

  function abrirLukas() {
    lukasAbierto = true;
    panel.hidden = false;
    panel.classList.add("is-open");
    fab.setAttribute("aria-expanded", "true");

    if (!lukasYaSaludo) {
      lukasYaSaludo = true;
      const sesion = typeof scObtenerSesion === "function" ? scObtenerSesion() : null;
      const nombre = sesion ? sesion.nombre.split(" ")[0] : "";
      const saludo = nombre
        ? `¡Hola, ${nombre}! Soy Lukas 🤖. Pregúntame sobre presupuesto, ahorro, deudas o lo que necesites.`
        : "¡Hola! Soy Lukas 🤖. Pregúntame sobre presupuesto, ahorro, deudas o lo que necesites.";
      agregarMensaje(saludo, "lukas");
    }

    input.focus();
  }

  function cerrarLukas() {
    lukasAbierto = false;
    panel.hidden = true;
    panel.classList.remove("is-open");
    fab.setAttribute("aria-expanded", "false");
  }
});

// ---------- Mensajes en pantalla ----------
function agregarMensaje(texto, de) {
  const contenedor = document.getElementById("lukasMessages");
  const burbuja = document.createElement("div");
  burbuja.className = `lukas-msg lukas-msg--${de}`;
  burbuja.textContent = texto;
  contenedor.appendChild(burbuja);
  contenedor.scrollTop = contenedor.scrollHeight;
}

function mostrarEscribiendo() {
  const contenedor = document.getElementById("lukasMessages");
  const burbuja = document.createElement("div");
  burbuja.className = "lukas-msg lukas-msg--lukas lukas-msg--escribiendo";
  burbuja.id = "lukasEscribiendo";
  burbuja.innerHTML = "<span></span><span></span><span></span>";
  contenedor.appendChild(burbuja);
  contenedor.scrollTop = contenedor.scrollHeight;
}

function quitarEscribiendo() {
  const burbuja = document.getElementById("lukasEscribiendo");
  if (burbuja) burbuja.remove();
}

// ---------- Motor de respuestas por palabras clave ----------
function generarRespuestaLukas(mensajeOriginal) {
  const mensaje = mensajeOriginal
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // quita tildes para comparar más fácil

  const contiene = (...palabras) => palabras.some(p => mensaje.includes(p));

  if (contiene("hola", "buenas", "ey", "hey")) {
    return "¡Hola! ¿En qué te puedo ayudar hoy? Puedo hablarte de presupuesto, ahorro, deudas o interés compuesto.";
  }

  if (contiene("gracias")) {
    return "¡Con mucho gusto! Aquí estoy cuando me necesites. 💚";
  }

  if (contiene("quien eres", "qué eres", "que eres")) {
    return "Soy Lukas, el asistente de educación financiera de LookCash. Todavía estoy en una versión de prototipo, así que mis respuestas son sencillas por ahora, pero ya estoy aprendiendo.";
  }

  if (contiene("presupuesto")) {
    return "Un presupuesto simple empieza así: anota todo lo que entra (ingresos) y todo lo que sale (gastos) durante un mes, y divide tus gastos en necesidades, deseos y ahorro. En el módulo de Presupuesto puedes empezar a registrar los tuyos.";
  }

  if (contiene("ahorro", "ahorrar", "meta")) {
    return "Para una meta de ahorro realista: define cuánto necesitas, en cuánto tiempo lo quieres lograr, y divide esa cifra entre las semanas que tienes. Ahorrar poco pero constante funciona mejor que ahorrar mucho una sola vez.";
  }

  if (contiene("deuda", "deudas", "prestamo", "préstamo")) {
    return "Si tienes varias deudas, una estrategia sencilla es ordenar por la tasa de interés más alta y pagar esa primero (mientras pagas el mínimo de las demás). Así pagas menos intereses en total.";
  }

  if (contiene("interes compuesto", "interes", "interés")) {
    return "El interés compuesto es cuando ganas (o pagas) intereses no solo sobre tu dinero inicial, sino también sobre los intereses que ya se generaron antes. Por eso entre más temprano empiezas a ahorrar o invertir, más crece con el tiempo.";
  }

  if (contiene("gamificacion", "puntos", "nivel", "insignia", "reto")) {
    return "Cada buen hábito financiero que registras te da puntos. Con esos puntos subes de nivel y desbloqueas insignias. ¡Revisa el módulo de Retos y niveles!";
  }

  if (contiene("datos", "privacidad", "ley 1581")) {
    return "Tus datos financieros se manejan bajo la Ley 1581 de 2012 de Colombia. Tú decides qué compartes y puedes pedir que los eliminemos cuando quieras.";
  }

  return "Todavía estoy aprendiendo y esa pregunta me quedó grande 😅. Por ahora puedo ayudarte con temas de presupuesto, ahorro, deudas, interés compuesto o gamificación. ¿Quieres que hablemos de alguno de esos?";
}
