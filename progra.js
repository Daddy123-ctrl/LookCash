// ============================================================
// LookCash — validación y lógica de login / registro
//
// Usa las funciones de auth.js (scRegistrarUsuario, scValidarCredenciales,
// scIniciarSesion, etc.) para que registrarse e iniciar sesión sean
// funcionales de verdad dentro del navegador, usando localStorage.
// Este archivo debe cargarse DESPUÉS de auth.js en el HTML.
// ============================================================

// Si ya hay una sesión activa, no tiene sentido mostrar el
// formulario de login/registro: se manda directo a la app.
if (typeof scRedirigirSiYaHaySesion === "function") {
    scRedirigirSiYaHaySesion();
}

const formulario = document.querySelector("form");

if (formulario) {
    formulario.addEventListener("submit", function (evento) {

        evento.preventDefault();

        // Detecta si estamos en el formulario de REGISTRO
        // (tiene el campo "confirmar_contrasena") o en el de LOGIN.
        const esRegistro = document.getElementById("confirmar_contrasena") !== null;

        if (esRegistro) {
            manejarRegistro();
        } else {
            manejarLogin();
        }
    });
}

// ---------- LOGIN ----------
function manejarLogin() {
    const correo = document.getElementById("correo").value.trim();
    const contrasena = document.getElementById("contrasena").value;

    if (correo === "" || contrasena === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const resultado = scValidarCredenciales(correo, contrasena);

    if (resultado.motivo === "suspendido") {
        alert("Esta cuenta está suspendida. Contacta a un administrador.");
        return;
    }

    if (!resultado.usuario) {
        alert("Correo o contraseña incorrectos.");
        return;
    }

    scIniciarSesion(resultado.usuario);
    window.location.href = "dashboard.html";
}

// ---------- REGISTRO ----------
function manejarRegistro() {
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const contrasena = document.getElementById("contrasena").value;
    const confirmar = document.getElementById("confirmar_contrasena").value;
    const terminos = document.getElementById("terminos").checked;

    if (nombre === "" || correo === "" || contrasena === "" || confirmar === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    if (!validarCorreo(correo)) {
        alert("Ingresa un correo electrónico válido.");
        return;
    }

    if (contrasena.length < 8) {
        alert("La contraseña debe tener al menos 8 caracteres.");
        return;
    }

    if (contrasena !== confirmar) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    if (!terminos) {
        alert("Debes aceptar el tratamiento de datos y los términos de uso para continuar.");
        return;
    }

    const resultado = scRegistrarUsuario(nombre, correo, contrasena);

    if (!resultado.exito) {
        alert(resultado.mensaje);
        return;
    }

    // Registro exitoso: inicia sesión automáticamente y entra a la app
    const usuarioCreado = scBuscarUsuarioPorCorreo(correo);
    scIniciarSesion(usuarioCreado);

    alert("¡Cuenta creada correctamente! Bienvenido a LookCash, " + nombre.split(" ")[0] + ".");
    window.location.href = "dashboard.html";
}

function validarCorreo(correo) {
    const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return patron.test(correo);
}

// ---------- BOTÓN "INICIAR / REGISTRARME CON GOOGLE" (simulado) ----------
const botonGoogle = document.querySelector(".google");

if (botonGoogle) {
    const textoOriginalGoogle = botonGoogle.textContent;

    botonGoogle.addEventListener("click", function () {

        botonGoogle.disabled = true;
        botonGoogle.textContent = "Conectando con Google...";

        // Simula el tiempo que tomaría la autenticación real con Google.
        // Como es una simulación, usamos un correo de demostración fijo;
        // si ya existe (porque entraste antes con Google), solo inicia
        // sesión con ese mismo perfil en vez de crear uno nuevo.
        setTimeout(function () {
            const correoGoogle = "usuario.google@gmail.com";
            let usuario = scBuscarUsuarioPorCorreo(correoGoogle);

            if (!usuario) {
                scRegistrarUsuario("Usuario de Google", correoGoogle, "google-oauth-simulado");
                usuario = scBuscarUsuarioPorCorreo(correoGoogle);
            }

            if (usuario.estado === "suspendido") {
                alert("Esta cuenta de Google está suspendida. Contacta a un administrador.");
                botonGoogle.disabled = false;
                botonGoogle.textContent = textoOriginalGoogle;
                return;
            }

            scIniciarSesion(usuario);
            window.location.href = "dashboard.html";
        }, 900);
    });
}
