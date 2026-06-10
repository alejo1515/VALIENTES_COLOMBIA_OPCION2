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
            // Un solo resultado: Vinculación directa
            inputID.value = res.resultados[0].USER_ID;
            inputBusqueda.value = res.resultados[0].NOMBRES;
            Swal.fire('Vinculado', `Se vinculó a: ${res.resultados[0].NOMBRES}`, 'success');
        } else {
            const opciones = {};
            res.resultados.forEach(u => {
                // Mostramos ID y Nombre para diferenciar
                opciones[u.USER_ID] = `${u.NOMBRES} (ID: ${u.USER_ID})`;
            });

            const { value: idSeleccionado } = await Swal.fire({
                title: 'Se encontraron varios registros',
                input: 'select',
                inputOptions: opciones,
                inputPlaceholder: 'Seleccione el sobreviviente correcto',
                showCancelButton: true,
                confirmButtonColor: '#7e6eac'
            });

            if (idSeleccionado) {
                inputID.value = idSeleccionado;
            
                inputBusqueda.value = opciones[idSeleccionado].split(' (ID:')[0];
                Swal.fire('Vinculado', 'Usuario seleccionado correctamente', 'success');
            }
        }
    } else {
        Swal.fire('No encontrado', 'No existen sobrevivientes con ese nombre', 'error');
    }
});




    const ctx = document.getElementById('myChart');
    const registroForm = document.getElementById('consultaid'); 
    const inputUsuario = document.getElementById('user_identifier');
    let miGrafica = null;

    const conceptosMacro = [
        "Salud física", "Salud mental", "Seguridad y protección", "Vivienda", 
        "Ingresos y medios de vida", "Educación y formación", "Redes de apoyo", "Autonomía"
    ];

    const columnasDB = [
        "SALUD_FISICA", "SALUD_MENTAL", "SEGURIDAD_PROTECCION", "VIVIENDA", 
        "INGRESOS_MEDIOS_VIDA", "EDUCACION_BASICA", "REDES_APOYO", "AUTONOMIA"
    ];

    function generarColor(i) {
        const colores = ['#ff6384', '#36a2eb', '#ca74f5', '#ffce56', '#d1f551', '#ff9f40', '#7ce4f7', '#33cc33'];
        return colores[i % colores.length];
    }

    registroForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const idBusqueda = inputUsuario.value.trim();

        if (!idBusqueda) {
            alert("Ingrese el ID del sobreviviente");
            return;
        }

        try {
            const respuesta = await window.api.enviarAlMain('obtenerEstadisticasMacro', { user_identifier: idBusqueda });

            if (respuesta && respuesta.length > 0) {
                const datasetsHitos = columnasDB.map((columna, index) => {
                    return {
                        label: conceptosMacro[index],
                        data: respuesta.map(r => r[columna]),
                        borderColor: generarColor(index),
                        backgroundColor: generarColor(index) + '33',
                        tension: 0.3,
                        pointRadius: 6,
                        borderWidth: 3
                    };
                });

                if (miGrafica) {
                    miGrafica.destroy();
                }

                miGrafica = new Chart(ctx, {
                    type: 'line', 
                    data: {
                        labels: respuesta.map(r => r.fecha_formateada),
                        datasets: datasetsHitos 
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                min: 0,
                                max: 3, 
                                ticks: { stepSize: 1, color: '#ffffff' },
                                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                                title: { display: true, text: 'Nivel de Logro (1-3)', color: '#ffffff' }
                            },
                            x: {
                                ticks: { color: '#ffffff' },
                                grid: { color: 'rgba(255, 255, 255, 0.1)' }
                            }
                        },
                        plugins: {
                            legend: { 
                                position: 'bottom',
                                labels: {
                                    color: '#ffffff', 
                                    font: { size: 12, weight: 'bold' }
                                }
                            },
                            tooltip: { mode: 'index', intersect: false }
                        }
                    }
                });
            } else {
                alert("No se encontraron registros para este usuario.");
            }
        } catch (error) {
            console.error("Error al consultar:", error);
            alert("Ocurrió un error al obtener los datos.");
        }
    });
const volverBtn = document.getElementById("volver-btn");
volverBtn.addEventListener('click', (e) => {
    window.api.navegar('ir-al-menu');});

});