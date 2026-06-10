

window.addEventListener('DOMContentLoaded', async () => {
   
    const usuarioLogueado = await window.api.enviarAlMain('quien-es-el-usuario');


    //
    if (!usuarioLogueado) {
        alert("Acceso denegado. Por favor inicia sesión.");
        window.api.navegar('ir-al-login');
                return; 
    }
  
    console.log("Acceso autorizado para:", usuarioLogueado.USERNAME);




const btncrear_usuario = document.getElementById("crear_usuario_button");

btncrear_usuario.addEventListener('click', () => {

    window.api.navegar('ir-al-registrousuario');
});



const btnCambiarClave = document.getElementById("cambiar_clave_button");

btnCambiarClave.addEventListener('click', () => {

    window.api.navegar('ir-al-cambioclave');
});





const volverBtn = document.getElementById("volver-btn");
volverBtn.addEventListener('click', (e) => {
    window.api.navegar('ir-al-menu');
});




}); 
