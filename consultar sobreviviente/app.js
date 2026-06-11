window.addEventListener('DOMContentLoaded', async () => {
    // 1. Le preguntamos al Main si hay alguien logueado
    const usuarioLogueado = await window.api.enviarAlMain('quien-es-el-usuario');

    // 2. Si NO hay nadie (es null), lo sacamos de aquí inmediatamente
    if (!usuarioLogueado) {
        alert("Acceso denegado. Por favor inicia sesión.");
        window.api.navegar('ir-al-login'); 
        return; 
    }

    console.log("Acceso autorizado para:", usuarioLogueado.USERNAME);

    const registroForm = document.getElementById("consultaform");
    const tablaBody = document.getElementById("tabla-resultados");

    // Escuchador del formulario de búsqueda
    registroForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const busqueda = document.getElementById("id_busqueda").value;

        if (!busqueda) {
            alert("Por favor, ingrese un nombre o ID para buscar.");
            return;
        }

        // Llamado al backend (Trae todas las coincidencias)
        const respuesta = await window.api.enviarAlMain('ConsultarSobreviviente', busqueda);
        console.log("Respuesta de la DB:", respuesta);

        // Limpiamos la tabla por completo antes de pintar
        tablaBody.innerHTML = "";

        if (respuesta && respuesta.length > 0) {
            // El bucle recorre TODOS los registros encontrados sin detenerse
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
                        <button class="btn btn-danger btn-sm" onclick="window.confirmarEliminar('${persona.USER_ID}')">
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
    });

    // Botón volver
    const volverBtn = document.getElementById("volver-btn");
    if (volverBtn) {
        volverBtn.addEventListener('click', () => {
            window.api.navegar('ir-al-menu');
        });
    }
});

// 📌 FUNCIÓN GLOBAL DE ELIMINACIÓN (Fuera del DOMContentLoaded para que el HTML la detecte siempre)
window.confirmarEliminar = async function(id) {
    if (confirm(`¿Está seguro de eliminar al sobreviviente con ID ${id}?`)) {
        const resultado = await window.api.enviarAlMain('EliminarSobreviviente', id);
        if (resultado.success) {
            alert("Eliminado con éxito");
            // Disparamos el submit del formulario para refrescar la lista completa en tiempo real
            document.getElementById("consultaform").dispatchEvent(new Event('submit')); 
        } else {
            alert("Error al eliminar: " + (resultado.error || "Desconocido"));
        }
    }
};