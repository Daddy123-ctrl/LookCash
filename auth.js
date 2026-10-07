// ============================================================
// LookCash — autenticación simulada con localStorage
//
// IMPORTANTE: esto es un prototipo para sustentación. Las cuentas
// y contraseñas se guardan en el navegador del usuario (localStorage),
// NO en un servidor, y las contraseñas no están cifradas.
// Cuando el backend esté listo, estas funciones se reemplazan por
// fetch() hacia la API real (con contraseñas en hash en el servidor),
// usando el modelo de datos de LookCash.mwb (tabla USER, etc) .
// wonka dijo gozalo.
// ============================================================

const LOOKCASH_USUARIOS_KEY = "Lookcash_usuarios";
const LOOKCASH_SESION_KEY = "Lookcash_sesion";

// ---------- Utilidades ----------
function scFormatearFechaHoy() {
    const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, "0");
    return `${dia} ${meses[hoy.getMonth()]} ${hoy.getFullYear()}`;
}

// ---------- Usuarios registrados ----------
function scObtenerUsuarios() {
    const datos = localStorage.getItem(LOOKCASH_USUARIOS_KEY);
    return datos ? JSON.parse(datos) : [];
}

function scGuardarUsuarios(usuarios) {
    localStorage.setItem(LOOKCASH_USUARIOS_KEY, JSON.stringify(usuarios));
}

function scBuscarUsuarioPorCorreo(correo) {
    const usuarios = scObtenerUsuarios();
    return usuarios.find(u => u.correo.toLowerCase() === correo.toLowerCase()) || null;
}

// Registra un usuario nuevo. Devuelve { exito: true } o
// { exito: false, mensaje: "..." } si el correo ya existe.
function scRegistrarUsuario(nombre, correo, contrasena, rol) {
    if (scBuscarUsuarioPorCorreo(correo)) {
        return { exito: false, mensaje: "Ya existe una cuenta registrada con ese correo." };
    }

    const usuarios = scObtenerUsuarios();
    usuarios.push({
        nombre: nombre,
        correo: correo,
        contrasena: contrasena,
        rol: rol || "Usuario",
        nivel: 1,
        estado: "activo",
        fechaRegistro: scFormatearFechaHoy()
    });
    scGuardarUsuarios(usuarios);

    return { exito: true };
}

// Devuelve el usuario si el correo y la contraseña coinciden y la
// cuenta no está suspendida. Si está suspendida, devuelve un motivo.
function scValidarCredenciales(correo, contrasena) {
    const usuario = scBuscarUsuarioPorCorreo(correo);

    if (!usuario || usuario.contrasena !== contrasena) {
        return { usuario: null, motivo: "credenciales" };
    }

    if (usuario.estado === "suspendido") {
        return { usuario: null, motivo: "suspendido" };
    }

    return { usuario: usuario, motivo: null };
}

// ---------- Sesión activa ----------
function scIniciarSesion(usuario) {
    localStorage.setItem(LOOKCASH_SESION_KEY, JSON.stringify({
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol || "Usuario"
    }));
}

function scCerrarSesion() {
    localStorage.removeItem(LOOKCASH_SESION_KEY);
}

function scObtenerSesion() {
    const datos = localStorage.getItem(LOOKCASH_SESION_KEY);
    return datos ? JSON.parse(datos) : null;
}

// Si ya hay sesión activa, redirige a index.html. Se usa en
// login.html y registro.html para no mostrar el formulario de
// nuevo a alguien que ya inició sesión.
function scRedirigirSiYaHaySesion() {
    if (scObtenerSesion()) {
        window.location.href = "dashboard.html";
        return true;
    }
    return false;
}
