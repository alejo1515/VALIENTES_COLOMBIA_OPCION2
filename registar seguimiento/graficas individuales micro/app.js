
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

let miGrafica;


const textosHitos = {
    emprendimiento: [
        "Idea de emprendimiento definida", "Capacitación técnica inicial", "Capacitación en gestión básica",
        "Plan simple de negocios", "Acceso a insumos", "Inicio de actividades productivas",
        "Primera venta realizada", "Gestión básica de ingresos/gastos", "Sostenibilidad inicial", "Satisfacción con el proyecto"
    ],
    estudio: [
        "Interés educativo identificado", "Decisión vocacional acompañada", "Información de oferta educativa",
        "Inscripción realizada", "Acceso a materiales", "Asistencia regular",
        "Rendimiento satisfactorio", "Permanencia sin abandono", "Proyección de continuidad", "Satisfacción con el estudio"
    ],
    trabajo: [
        "Interés laboral identificado", "Revisión de habilidades", "Elaboración de CV",
        "Búsqueda activa", "Entrevistas realizadas", "Inserción laboral inicial",
        "Condiciones dignas", "Continuidad en el empleo", "Adaptación laboral", "Satisfacción en el trabajo"
    ],
    hogar: [
        "Decisión consciente rol ciudad", "Vivienda adecuada", "Acceso a servicios básicos",
        "Organización de rutinas", "Escolarización infantil", "Acceso a salud familiar",
        "Red de apoyo cuidado", "Autocuidado básico", "Bienestar emocional", "Satisfacción con el proyecto"
    ],
    bienestar: [
        "Reconocimiento necesidades", "Acceso a apoyo psicosocial", "Identificación de emociones",
        "Manejo de ansiedad/estrés", "Fortalecimiento autoestima", "Desarrollo autocuidado",
        "Límites personales", "Reducción de riesgos", "Proyecto de vida formulado", "Satisfacción en el proyecto"
    ]
};


const mapeoProyectos = {
    'Emprendimiento': 'emprendimiento',
    'Estudio': 'estudio',
    'Trabajo Estable': 'trabajo', 
    'Hogar': 'hogar',
    'Bienestar': 'bienestar'
};

function generarColor(i) {
    const colores = [
        '#ff6384', '#36a2eb', '#ca74f5', '#ffce56', '#d1f551', 
        '#ff9f40', '#7ce4f7', '#33cc33', '#a65628', '#f1e5e5'
    ];
    return colores[i % colores.length];
}


registroForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const busqueda = inputUsuario.value; 

    if (!busqueda) {
        alert("Ingrese el ID del sobreviviente para la búsqueda");
        return;
    }

    try {
        // Comunicación con el proceso Main de Electron
        const respuesta = await window.api.enviarAlMain('obtenerEstadisticasHitos', busqueda);

        if (respuesta && respuesta.length > 0) {

            const tipoProyectoDB = respuesta[0].PROYECTO_ACTUAL; 
            const claveProyecto = mapeoProyectos[tipoProyectoDB] || 'emprendimiento';
            
            const etiquetasHitos = textosHitos[claveProyecto];


            const datasetsHitos = etiquetasHitos.map((texto, index) => {
                const hKey = `h${index + 1}`; 
                return {
                    label: texto, 
                    data: respuesta.map(r => r[hKey]),
                    borderColor: generarColor(index),
                    backgroundColor: generarColor(index) + '33', // Color con transparencia para el punto
                    tension: 0.3,
                    borderWidth: 2,
                    pointRadius: 4
                };
            }); 


            if (miGrafica) {
                miGrafica.destroy();
            }


            miGrafica = new Chart(ctx, {
                type: 'line', 
                data: {
                    labels: respuesta.map(r => r.mes_anio), // Fechas en el eje X
                    datasets: datasetsHitos 
                },
                options: {
    responsive: true,
    scales: {
        y: {
            beginAtZero: true,
            max: 3, 
            ticks: { 
                stepSize: 1, 
                color: "#ffffff" // Blanco para los números (0-3)
            },
            grid: { 
                color: 'rgba(255, 255, 255, 0.1)' // Cuadrícula sutil
            },
            title: { 
                display: true, 
                text: 'Nivel de Logro (1-3)', 
                color: '#ffffff' // Título eje Y en blanco
            }
        },
        x: {
            ticks: { 
                color: '#ffffff' // Blanco para los periodos
            },
            grid: { 
                color: 'rgba(255, 255, 255, 0.1)' 
            },
            title: {
                display: true,
                text: 'Periodo (Año-Mes)',
                color: '#ffffff' // Título eje X en blanco
            }
        }
    },
    plugins: {
        legend: {
            position: 'bottom',
            labels: { 
                padding: 20, 
                boxWidth: 12, 
                color: '#ffffff', // Leyendas en blanco
                font: { weight: 'bold' }
            }
        },
        tooltip: { 
            mode: 'index', 
            intersect: false 
        }
    }
}});

        } else {
            alert("No se encontraron registros de seguimiento para este usuario.");
        }
    } catch (error) {
        console.error("Error al consultar:", error);
        alert("Ocurrió un error al intentar obtener los datos.");
    }
});

const volverBtn = document.getElementById("volver-btn");
volverBtn.addEventListener('click', (e) => {
    window.api.navegar('ir-al-menu');});

});