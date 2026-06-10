
window.addEventListener('DOMContentLoaded', async () => {
    // 1
    const usuarioLogueado = await window.api.enviarAlMain('quien-es-el-usuario');

    //
    if (!usuarioLogueado) {
        alert("Acceso denegado. Por favor inicia sesión.");
        window.api.navegar('ir-al-login'); // Cambia esto por el nombre de tu ruta de login
        return; 
    }

    console.log("Acceso autorizado para:", usuarioLogueado.USERNAME);
    


    const btnCerrarSesion = document.getElementById("cerrar_sesionbutton");

    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', async () => {
            try {
                const confirmacion = confirm(`¿${usuarioLogueado.USERNAME}, deseas cerrar tu sesión en Valientes Colombia?`);
                
                if (confirmacion) {
                    console.log("Cerrando sesión...");
                    
                    await window.api.navegar('ir-a-cerrarSesion');
                }
            } catch (error) {
                console.error("Error al procesar el cierre de sesión:", error);
                alert("Hubo un problema al intentar cerrar la sesión.");
            }
        });
    }


const btnRegistro = document.getElementById("registro_sobrevivientebutton");

btnRegistro.addEventListener('click', () => {

    window.api.navegar('ir-al-registro');
});


const btnConsultar = document.getElementById("consultar_sobrevivientebutton");

btnConsultar.addEventListener('click', () => {

    window.api.navegar('ir-a-consultaSobreviviente');
});


const btnConsultar_Caso = document.getElementById("consultar_casobutton");

btnConsultar_Caso.addEventListener('click', () => {

    window.api.navegar('ir-a-consultarcaso');
});



const btnRegistrar_Seguimiento = document.getElementById("registrar_seguimientobutton");

btnRegistrar_Seguimiento.addEventListener('click', () => {

    window.api.navegar('ir-a-registrarseguimiento');
});



const btnConsultar_Seguimiento = document.getElementById("consultar_seguimientobutton");

btnConsultar_Seguimiento.addEventListener('click', () => {

    window.api.navegar('ir-a-consultarseguimiento');
});



const btnRegistrar_Caso = document.getElementById("registrar_casobutton");

btnRegistrar_Caso.addEventListener('click', () => {

    window.api.navegar('ir-al-registrar_caso');
});


const btnCuentasUsuario = document.getElementById("cuentas_usuariobutton");

btnCuentasUsuario.addEventListener('click', () => {

    window.api.navegar('ir-a-cuentasusuario');
});



});
