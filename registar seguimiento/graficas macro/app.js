
window.addEventListener('DOMContentLoaded', async () => {

    const usuarioLogueado = await window.api.enviarAlMain('quien-es-el-usuario');

    
    if (!usuarioLogueado) {
        alert("Acceso denegado. Por favor inicia sesión.");
        window.api.navegar('ir-al-login'); 
        return; 
    }

     
    console.log("Acceso autorizado para:", usuarioLogueado.USERNAME);



    
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
const registroForm = document.getElementById('consultaid'); // El <form>
const inputUsuario = document.getElementById('user_identifier'); // El <input>

let miGrafica;

registroForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    

    const busqueda = inputUsuario.value; 

    if (!busqueda) {
        alert("Ingrese el ID del sobreviviente para la búsqueda");
        return;
    }

    try {
        
        const respuesta = await window.api.enviarAlMain('obtenerTodosLosSeguimientosMacro', busqueda);
        
        if (respuesta && respuesta.length > 0) {
            // 4. Mapeo de datos para Chart.js
            const fechas = respuesta.map(r =>String (r.mes_anio || r.FECHA_REGISTRO || 'sin fecha'));
            const porcentajes = respuesta.map(r => Number ( r.promedio || r.porcentaje || 0));
            console.log("datos de consola" ,{fechas, porcentajes});

            // 5. Si ya existe una gráfica, la borramos para que no se encimen
            if (miGrafica) {
                miGrafica.destroy();
            }

            // 6. Creación del gráfico
            miGrafica = new Chart(ctx, {
                type: 'line', 
                data: {
                    labels: fechas,
                    datasets: [{
                        label: 'Progreso de Sobreviviente (%)',
                        color:'#ffff',
                        data: porcentajes,
                        borderColor: '#6f42c1', // Color de Valientes Colombia
                        backgroundColor: 'rgba(111, 66, 193, 0.1)',
                        fill: true,
                        tension: 0.4, // Curva suave
                        borderWidth: 3,
                        pointBackgroundColor: '#6f42c1'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
        padding: 20 },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: { color: '#ffffff' },
                            title: { display: true, text: 'Porcentaje de Avance', color:'#ffff' }
                        },
                        x: {ticks: { color: '#ffffff' },
                            title: { display: true, text: 'Fecha de Registro', color :'#ffff' }
                        }
                    }
                }
            });

        } else {
            alert("No se encontraron registros para este ID.");
        }
    } catch (error) {
        console.error("Error en la consulta:", error);
        alert("Ocurrió un error al conectar con la base de datos.");
    }


  

});
  const volverBtn = document.getElementById("volver-btn");
volverBtn.addEventListener('click', (e) => {
    window.api.navegar('ir-al-menu');});
});