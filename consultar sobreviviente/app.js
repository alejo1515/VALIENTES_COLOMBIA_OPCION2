
window.addEventListener('DOMContentLoaded', async () => {
    // 1. Le preguntamos al Main si hay alguien logueado
    const usuarioLogueado = await window.api.enviarAlMain('quien-es-el-usuario');

    // 2. Si NO hay nadie (es null), lo sacamos de aquí inmediatamente
    if (!usuarioLogueado) {
        alert("Acceso denegado. Por favor inicia sesión.");
        window.api.navegar('ir-al-login'); // Cambia esto por el nombre de tu ruta de login
        return; 
    }

    console.log("Acceso autorizado para:", usuarioLogueado.USERNAME);
    





const registroForm = document.getElementById("consultaform");
const tablaBody = document.getElementById("tabla-resultados");

registroForm.addEventListener('submit', async (e) => {

    e.preventDefault();
    
    const busqueda = document.getElementById("id_busqueda").value;

    if (!busqueda) {
        alert("Por favor, ingrese un nombre o ID para buscar.");
        return;
    }

    const respuesta = await window.api.enviarAlMain('ConsultarSobreviviente', busqueda);
    console.log("Respuesta de la DB:", respuesta);

    tablaBody.innerHTML = "";

    if (respuesta && respuesta.length > 0) {
        respuesta.forEach(persona => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td><strong>${persona.USER_ID}</strong></td>
                <td>${persona.NOMBRES}</td>
                <td>${persona.FECHA_NACIMIENTO}</td>
                <td>${persona.LUGAR_NACIMIENTO}</td>
                <td>${persona.EDAD}</td>
                <td>${persona.CIUDAD}</td>
                <td>${persona.EPS}</td>
                <td>${persona.TIPO_AFILIACION_EPS}</td>
                <td>${persona.NIVEL_EDUCATIVO}</td>
                <td>${persona.OCUPACION}</td>
                
                <td>
                    <button class="btn btn-danger btn-sm" onclick="confirmarEliminar('${persona.USER_ID}')">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </td>
            `;
            tablaBody.appendChild(fila);
        });
    } else {
        tablaBody.innerHTML = `
            <tr>
                <td colspan="11" class="text-center text-muted">
                    No se encontraron sobrevivientes con los datos ingresados.
                </td>
            </tr>
        `;
    }
})



// Función para eliminar 
async function confirmarEliminar(id) {
    if (confirm(`¿Está seguro de eliminar al sobreviviente con ID ${id}?`)) {
        const resultado = await window.api.enviarAlMain('EliminarSobreviviente', id);
        if (resultado.success) {
            alert("Eliminado con éxito");
            registroForm.dispatchEvent(new Event('submit')); 
        } else {
            alert("Error al eliminar");
        }
    }
}


// Haz la función global para que el botón pueda verla
window.confirmarEliminar = async function(id) {
    if (confirm(`¿Está seguro de eliminar al sobreviviente con ID ${id}?`)) {
        const resultado = await window.api.enviarAlMain('EliminarSobreviviente', id);
        if (resultado.success) {
            alert("Eliminado con éxito");
            // Esto vuelve a ejecutar la búsqueda para refrescar la tabla
            document.getElementById("consultaform").dispatchEvent(new Event('submit')); 
        } else {
            alert("Error al eliminar: " + (resultado.error || "Desconocido"));
        }
    }
};

const volverBtn = document.getElementById("volver-btn");
volverBtn.addEventListener('click', (e) => {
    window.api.navegar('ir-al-menu');});

});