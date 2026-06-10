window.addEventListener('DOMContentLoaded', async () => {

    const usuarioLogueado = await window.api.enviarAlMain('quien-es-el-usuario');
    
    if (!usuarioLogueado) {
        alert("Acceso denegado. Por favor inicia sesión.");
        window.api.navegar('ir-al-login'); 
        return; 
    }


const inputBusqueda = document.getElementById('buscador_nombre');
const inputID = document.getElementById('user_id');
const btnBuscar = document.getElementById('btn_buscar_u');

btnBuscar.addEventListener('click', async () => {
    const nombre = inputBusqueda.value;
    if (nombre.length < 3) return Swal.fire('Aviso', 'Escribe al menos 3 letras para buscar', 'info');

    const res = await window.api.enviarAlMain('buscarPorNombre', nombre);
    
    if (res.success && res.resultados.length > 0) {
        if (res.resultados.length === 1) {
            inputID.value = res.resultados[0].USER_ID;
            inputBusqueda.value = res.resultados[0].NOMBRE8;
            Swal.fire('Vinculado', `Se vinculó a: ${res.resultados[0].NOMBRE8}`, 'success');
        } else {
            
                        let htmlCoincidencias = `
                <p style="font-size: 14px; color: #555; margin-bottom: 15px;">
                    Se encontraron varios registros. Haz clic en el correcto para vincularlo:
                </p>
                <div style="max-height: 200px; overflow-y: auto; border: 1px solid #ddd; border-radius: 8px; padding: 5px; background: #f9f9f9;">
            `;

          
            res.resultados.forEach(u => {
                htmlCoincidencias += `
                    <button class="btn-coincidencia" data-id="${u.USER_ID}" data-nombre="${u.NOMBRES}" 
                        style="width: 100%; text-align: left; padding: 10px 12px; margin-bottom: 5px; 
                               background: white; border: 1px solid #e0e0e0; border-radius: 6px; 
                               cursor: pointer; font-size: 14px; transition: all 0.2s ease;">
                        <strong style="color: #7e6eac;">ID: ${u.USER_ID}</strong> — ${u.NOMBRES}
                    </button>
                `;
            });

            htmlCoincidencias += `</div>`;

            Swal.fire({
                title: 'Coincidencias Encontradas',
                html: htmlCoincidencias,
                showConfirmButton: false, 
                showCancelButton: true,
                cancelButtonText: 'Cerrar',
                cancelButtonColor: '#d33',
                width: '450px', // Tamaño de ventana pequeña
                
                // 3. ESCUCHAMOS LOS CLICS DENTRO DE NUESTRA MINI VENTANA
                didOpen: () => {
                    const contenedor = Swal.getHtmlContainer();
                    const botones = contenedor.querySelectorAll('.btn-coincidencia');
                    
                    botones.forEach(boton => {
                        // Efecto visual hover manual mediante JS
                        boton.addEventListener('mouseenter', () => {
                            boton.style.background = '#f1edfa';
                            boton.style.borderColor = '#7e6eac';
                        });
                        boton.addEventListener('mouseleave', () => {
                            boton.style.background = 'white';
                            boton.style.borderColor = '#e0e0e0';
                        });

                        // Acción al seleccionar un sobreviviente
                        boton.addEventListener('click', () => {
                            const id = boton.getAttribute('data-id');
                            const nombreSeleccionado = boton.getAttribute('data-nombre');

                            // Asignamos a los inputs de tu interfaz
                            inputID.value = id;
                            inputBusqueda.value = nombreSeleccionado;

                            // Cerramos la ventana y avisamos del éxito
                            Swal.close();
                            Swal.fire('Vinculado', `Se vinculó correctamente a: ${nombreSeleccionado}`, 'success');
                        });
                    });
                }
            });
        }
    } else {
        Swal.fire('No encontrado', 'No existen sobrevivientes con ese nombre', 'error');
    }
});


async function renderizarSeguimientoVertical() {
    
        const contenedor = document.getElementById('tabla-resultados'); 
        
        const datosBusqueda = {
            userId: document.getElementById('busqueda').value.trim(),
            inicio: document.getElementById('busquedaFecha').value,
            fin: document.getElementById('busquedaFecha2').value
        };

        if (!datosBusqueda.userId || !datosBusqueda.inicio || !datosBusqueda.fin) {
            alert("Por favor, complete todos los campos de búsqueda.");
            return;
        }

        try {
            const registros = await window.api.enviarAlMain('ConsultarSeguimientoEspecifico', datosBusqueda);

            contenedor.innerHTML = ""; // Limpiamos el contenedor

            if (registros.length === 0) {
                contenedor.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <i class="bi bi-search-heart" style="font-size: 3rem; color: #ccc;"></i>
                        <p class="mt-3 text-muted">No se encontraron registros para el ID ${datosBusqueda.userId} en este rango.</p>
                    </div>`;
                return;
            }

            // Mapeo de iconos para cada campo para mantener la estética
            const iconMap = {
                salud: "bi-activity",
                mente: "bi-brain",
                seguridad: "bi-shield-check",
                vivienda: "bi-house-door",
                ingresos: "bi-cash-coin",
                educacion: "bi-book",
                redes: "bi-people",
                autonomia: "bi-person-check"
            };

            registros.forEach(reg => {
                const fechaFormateada = new Date(reg.fecha_Seguimiento).toLocaleDateString('es-CO', {
                    year: 'numeric', month: 'long', day: 'numeric'
                });

                // Creamos un contenedor por cada fecha encontrada
                const grupoCard = document.createElement('div');
                grupoCard.className = "row g-3 mb-5 border-bottom pb-4"; // Separación entre seguimientos
                
                grupoCard.innerHTML = `
                    <div class="col-12 d-flex justify-content-between align-items-center mb-2">
                        <h5 class="text-primary mb-0"><i class="bi bi-calendar-check me-2"></i>Seguimiento del ${fechaFormateada}</h5>
                        <span class="badge bg-success">${reg.porcentaje || 0}% Avance</span>
                    </div>

                    <div class="info-card highlight">
                        <div class="card-icon"><i class="bi bi-hash"></i></div>
                        <div class="card-texts"><label>ID Seguimiento</label><span>${reg.ID_SEGUIMIENTO_MACRO}</span></div>
                    </div>
                    <div class="info-card">
                        <div class="card-icon"><i class="${iconMap.salud}"></i></div>
                        <div class="card-texts"><label>Salud Física</label><span>${reg.SALUD_FISICA}</span></div>
                    </div>
                    <div class="info-card">
                        <div class="card-icon"><i class="${iconMap.mente}"></i></div>
                        <div class="card-texts"><label>Salud Mental</label><span>${reg.SALUD_MENTAL}</span></div>
                    </div>
                    <div class="info-card">
                        <div class="card-icon"><i class="${iconMap.seguridad}"></i></div>
                        <div class="card-texts"><label>Seguridad</label><span>${reg.SEGURIDAD_PROTECCION}</span></div>
                    </div>
                    <div class="info-card">
                        <div class="card-icon"><i class="${iconMap.vivienda}"></i></div>
                        <div class="card-texts"><label>Vivienda</label><span>${reg.VIVIENDA}</span></div>
                    </div>
                    <div class="info-card">
                        <div class="card-icon"><i class="${iconMap.ingresos}"></i></div>
                        <div class="card-texts"><label>Ingresos</label><span>${reg.INGRESOS_MEDIOS_VIDA}</span></div>
                    </div>
                    
                    <div class="info-card large">
                        <div class="card-icon"><i class="bi bi-journal-text"></i></div>
                        <div class="card-texts"><label>Nota de Sucesos</label><span>${reg.NOTA_SUCESO || 'Sin observaciones'}</span></div>
                    </div>

                    <div class="col-12 mt-3">
                        <button class="btn btn-outline-danger btn-sm" onclick="confirmarEliminarCaso(${reg.ID_SEGUIMIENTO_MACRO})">
                            <i class="bi bi-trash"></i> Eliminar este registro
                        </button>
                    </div>
                `;
                contenedor.appendChild(grupoCard);
            });

        } catch (error) {
            console.error("Error al renderizar:", error);
            alert("Ocurrió un error al intentar recuperar los datos.");
        }
    }

    document.getElementById('formBusqueda').addEventListener('submit', (e) => {
        e.preventDefault();
        renderizarSeguimientoVertical();
    });


    
window.confirmarEliminarCaso = async function(seguimientoId) {
    
    
    const respuesta = confirm(`¿Está seguro de eliminar de forma permanente el registro de seguimiento #${seguimientoId}?`);
    
    if (!respuesta) return; 

    try {
        const resultado = await window.api.enviarAlMain('EliminarSeguimiento', seguimientoId);
        
        if (resultado && resultado.success) {
            alert(resultado.message || "Registro eliminado correctamente.");
            
if (typeof renderizarSeguimientoVertical === 'function') {
                renderizarSeguimientoVertical(); 
            }
        } else {

            alert(`Atención: ${resultado.message || "No se pudo procesar la eliminación."}`);
        }

    } catch (error) {

        console.error("Falla en la comunicación de eliminación:", error);
        alert("Error crítico: No se pudo establecer conexión con el servidor de datos.");
    }
};







    const volverBtn = document.getElementById("volver-btn");
    volverBtn.addEventListener('click', () => {
        window.api.navegar('ir-al-menu');
    });

});