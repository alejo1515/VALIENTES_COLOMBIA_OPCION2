
window.addEventListener('DOMContentLoaded', async () => {
   
    const usuarioLogueado = await window.api.enviarAlMain('quien-es-el-usuario');

    //
    if (!usuarioLogueado) {
        alert("Acceso denegado. Por favor inicia sesión.");
        window.api.navegar('ir-al-login');
                return; 
    }

  
    console.log("Acceso autorizado para:", usuarioLogueado.USERNAME);


    

document.getElementById('formRegistro').addEventListener('submit', async (e) => {
    
    e.preventDefault();

    
    const nombreVal = document.getElementById('nombre').value;
    const userVal = document.getElementById('username').value;
    const passVal = document.getElementById('password').value;
    const ciudadVal = document.getElementById('ciudad').value;



    const datos = {
        nombreCompleto: nombreVal,
        username: userVal,
        password: passVal,
       ciudad: ciudadVal
    };

    console.log("Intentando registrar a:", datos.username);

    try {
        
        const respuesta = await window.api.enviarAlMain('registrar-usuario', datos);

        if (respuesta.success) {
            alert("✅ ¡Usuario " + userVal + " creado con éxito!");
            document.getElementById('formRegistro').reset(); // Limpia el formulario
        } else {
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


});