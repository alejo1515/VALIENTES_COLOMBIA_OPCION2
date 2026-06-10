window.addEventListener('DOMContentLoaded', async () => {
    
    const usuarioLogueado = await window.api.enviarAlMain('quien-es-el-usuario');
    
    if (!usuarioLogueado) {
        alert("Acceso denegado. Por favor inicia sesión.");
        window.api.navegar('ir-al-login');
        return; 
    }
     
    console.log("Acceso autorizado para:", usuarioLogueado.USERNAME);
    
    const registroForm = document.getElementById("registroform");
    
    if (registroForm) {
        registroForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const newregistro = {
                NOMBRES: document.getElementById("nombres").value,
                FECHA_NACIMIENTO: document.getElementById("fecha_nacimiento").value,
                CIUDAD: document.getElementById("ciudad").value,
                LUGAR_NACIMIENTO: document.getElementById("lugar_nacimiento").value, 
                EPS: document.getElementById("eps").value,
                TIPO_AFILIACION_EPS: document.getElementById("tipo_afiliacion_eps").value,
                OCUPACION: document.getElementById("ocupacion").value,
                NIVEL_EDUCATIVO: document.getElementById("nivel_educativo").value
            };

            const respuesta = await window.api.enviarAlMain('registro', newregistro);

            if (respuesta && respuesta.success) {
                alert("Usuario registrado");
                window.api.navegar('ir-al-menu');
            } else {
                alert("Error: " + (respuesta.error || "No se pudo registrar"));
            }
        });
    }

    const volverBtn = document.getElementById("volver-btn");
    if (volverBtn) {
        volverBtn.addEventListener('click', (e) => {
            window.api.navegar('ir-al-menu');
        });
    }
});