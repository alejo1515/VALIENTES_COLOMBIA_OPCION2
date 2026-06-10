
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
            "Red de apoyo cuidado", "Autocuidado básico", "Bienestar emocional", "Satisfacción con el proyecto elegido"
        ],
        bienestar: [
            "Reconocimiento necesidades", "Acceso a apoyo psicosocial", "Identificación de emociones",
            "Manejo de ansiedad/estrés", "Fortalecimiento autoestima", "Desarrollo autocuidado",
            "Límites personales", "Reducción de riesgos", "Proyecto de vida formulado", "Satisfacción en el proyecto"
        ]
    };

    const selector = document.getElementById('selectorProyecto');
    const contenedor = document.getElementById('contenedorHitos');
    const mensajeVacio = document.getElementById('mensajeVacio');
    const listaHitos = document.getElementById('listaHitos');
    const titulo = document.getElementById('tituloProyecto');

    //  cambiar el formulario
    selector.addEventListener('change', (e) => {
        const proyecto = e.target.value;
        
        if (!proyecto) {
            contenedor.style.display = 'none';
            mensajeVacio.style.display = 'block';
            return;
        }

        mensajeVacio.style.display = 'none';
        contenedor.style.display = 'block';
        listaHitos.innerHTML = "";
        titulo.innerText = `Hitos: ${proyecto.replace('_', ' ')}`;

        textosHitos[proyecto].forEach((texto, index) => {
            const item = document.createElement('div');
            item.className = 'hito-item';
            item.innerHTML = `
                <input type="number" id="hito_${index+1}" min="1" 
           max="3" 
           value="1" 
           class="custom-input"
           onkeydown="return false"
            class="check-hito">
                <label for="hito_${index+1}">${texto}</label>
            `;
            listaHitos.appendChild(item);
        });
    });

    




selector.addEventListener('change', (e) => {
    const proyecto = e.target.value;
    
    if (proyecto === "") {
        contenedor.style.display = 'none';
        return;
    }

    // Limpiamos
    listaHitos.innerHTML = "";
    contenedor.style.display = 'block';
    titulo.innerText = `Seguimiento de ${proyecto.toUpperCase()}`;

    // hitos 
    textosHitos[proyecto].forEach((texto, index) => {
        const div = document.createElement('div');
        div.className = 'input-wrapper';
        div.style.marginBottom = "10px";
        
        div.innerHTML = `
            <input type="number" id="hito_${index+1}" name="hitos" value="1">
            <label for="hito_${index+1}" style="margin-left: 10px; color: #333;">${texto}</label>
        `;
        listaHitos.appendChild(div);
    });
});

const formSeguimiento = document.getElementById("formSeguimiento")
const formUSER_ID = document.getElementById("user_identifier");
const formPROYECTO_ACTUAL = document.getElementById("selectorProyecto");
const formMOTIVACION_EXPECTATIVAS = document.getElementById("motivacionFija");


// boton guardar
// Listener del formulario
formSeguimiento.addEventListener('submit', async (e) => {
    e.preventDefault();

    const idUser = formUSER_ID.value;
    if (!idUser) return alert("Por favor ingresa el ID del sobreviviente");

    // 1. Capturamos los valores de los 10 hitos
    // Usamos una pequeña función interna para leer el valor o poner 1 por defecto
    const getHitoVal = (id) => {
        const el = document.getElementById(id);
        return el ? parseInt(el.value) : 1;
    };

    const h1 = getHitoVal("hito_1");
    const h2 = getHitoVal("hito_2");
    const h3 = getHitoVal("hito_3");
    const h4 = getHitoVal("hito_4");
    const h5 = getHitoVal("hito_5");
    const h6 = getHitoVal("hito_6");
    const h7 = getHitoVal("hito_7");
    const h8 = getHitoVal("hito_8");
    const h9 = getHitoVal("hito_9");
    const h10 = getHitoVal("hito_10");

    // 2. Calculamos el porcentaje basado en la escala 1-3
    // El máximo puntaje posible es 30 (10 hitos x nivel 3)
    const sumaTotal = h1 + h2 + h3 + h4 + h5 + h6 + h7 + h8 + h9 + h10;
    const porcentaje = ((sumaTotal / 30) * 100).toFixed(2);

    // 3. Creamos el objeto final
    const newregistroC = {
        USER_ID: idUser,
        PROYECTO_ACTUAL: formPROYECTO_ACTUAL.value,
        MOTIVACION_EXPECTATIVAS: formMOTIVACION_EXPECTATIVAS.value,
        HITO_1: h1,
        HITO_2: h2,
        HITO_3: h3,
        HITO_4: h4,
        HITO_5: h5,
        HITO_6: h6,
        HITO_7: h7,
        HITO_8: h8,
        HITO_9: h9,
        HITO_10: h10,
        PORCENTAJE_EXITO: porcentaje
    };

    console.log("Datos a enviar:", newregistroC);

    // 4. Envío al Main (Recuerda usar window sin 's')
    try {
        const respuesta = await window.api.enviarAlMain('registrarSeguimiento', newregistroC);

        if (respuesta.success) {
            alert(`¡REGISTRO EXITOSO!\nProgreso calculado: ${porcentaje}%`);
            window.api.navegar('ir-al-menu');
        } else {
            alert("Error: " + (respuesta.error || "No se pudo registrar."));
        }
    } catch (err) {
        alert("Error de conexión con el proceso principal.");
    }
});

const volverBtn = document.getElementById("volver-btn");
volverBtn.addEventListener('click', (e) => {
    window.api.navegar('ir-al-menu');
});
});