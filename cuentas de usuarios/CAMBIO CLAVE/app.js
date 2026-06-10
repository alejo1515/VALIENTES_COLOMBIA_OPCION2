window.addEventListener('DOMContentLoaded', async () => {
   
    const usuarioLogueado = await window.api.enviarAlMain('quien-es-el-usuario');


    //
    if (!usuarioLogueado) {
        alert("Acceso denegado. Por favor inicia sesión.");
        window.api.navegar('ir-al-login');
                return; 
    }
  
    console.log("Acceso autorizado para:", usuarioLogueado.USERNAME);

document.getElementById('formCambioClave').addEventListener('submit', async (e) => {
    
    e.preventDefault();

    const nombreVal = document.getElementById('nombreCompleto').value;
    const userVal = document.getElementById('username').value;
    const passVal = document.getElementById('nuevaClave').value;
    const ciudadVal = document.getElementById('ciudadNacimiento').value;



const datos = {
    nombreCompleto: nombreVal,
    username: userVal,
    password: passVal,
   ciudad: ciudadVal
};

    console.log("Intentando cambiar clave a:", datos.username);

    try {
        
        const respuesta = await window.api.enviarAlMain('Actualizar-clave', datos);

        if (respuesta.success) {
            alert("✅ ¡Usuario " + userVal + " cambio su clave exitosamente!");
            document.getElementById('formCambioClave').reset(); } else {
            alert("❌ Error: " + respuesta.error);
        }
    } catch (error) {
        console.error("Error en la comunicación:", error);
        alert("Hubo un fallo en la conexión con la base de datos.");
    }
});



    
const volverBtn = document.getElementById("volver-btn");
volverBtn.addEventListener('click', (e) => {
    window.api.navegar('ir-al-menu');
});


})        ;

