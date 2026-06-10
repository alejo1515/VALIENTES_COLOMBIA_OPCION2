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



    
const registroForm = document.getElementById("formBusqueda");


registroForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const busqueda = document.getElementById("busqueda").value;


    const respuesta = await window.api.enviarAlMain('ConsultarCaso', busqueda);
    

    if (respuesta && respuesta.length > 0) {
        const caso = respuesta[0]; 


        document.getElementById("td-caso-id").innerText = caso.CASO_ID;
        document.getElementById("td-user-id").innerText = caso.USER_ID;
        document.getElementById("td-estado-caso").innerText = caso.ESTADO_CASO;
        document.getElementById("td-repatriacion").innerText = caso.REPATRIACION_AVION_SOLIDARIO;
        document.getElementById("td-atencion").innerText = caso.TIPO_ATENCION;
        document.getElementById("td-tipificacion").innerText = caso.TIPIFICACION;
        document.getElementById("td-entidad").innerText = caso.ENTIDAD_REMITENTE;
        document.getElementById("td-riesgo").innerText = caso.NIVEL_RIESGO;
        document.getElementById("td-denuncio").innerText = caso.DENUNCIO;
        document.getElementById("td-detalles").innerText = caso.DETALLES_DENUNCIA;
        document.getElementById("td-ruta").innerText = caso.RUTA_ACTIVA;
        document.getElementById("td-dinero").innerText = caso.RECIBIO_DINERO;
        document.getElementById("td-medio-pago").innerText = caso.MEDIOS_RECIBIDO_DINERO;
        document.getElementById("td-oferta").innerText = caso.OFERTA_CAPTACION;
        document.getElementById("td-aerolinea").innerText = caso.AEROLINEA_USADA;
        document.getElementById("td-trayecto").innerText = caso.TRAYECTO_VUELO;


        const celdas = document.querySelectorAll("#tabla-resultados td.text-muted");
        celdas.forEach(td => td.classList.remove("text-muted"));
        
        btnEliminar.disabled = false;

    } else {
        alert("No se encontró el caso.");
        btnEliminar.disabled = true;
    }
});

const btnEliminar = document.getElementById('btnEliminar');
const idParaBorrar = document.getElementById('td-caso-id'); 

btnEliminar.addEventListener('click', async () => {
    const casoId = idParaBorrar.innerText;

    if (casoId === "---") return;

    const respuesta = confirm(`¿Está seguro de eliminar el caso ${casoId}? Esta acción borrará también sus seguimientos.`);
    
    if (respuesta) {
        const exito = await window.api.eliminarCaso(casoId);
        
        if (exito) {
            alert("Caso eliminado correctamente.");
            location.reload();
        } else {
            alert("Error al intentar eliminar el caso.");
        }
    }
});

window.confirmarEliminarCaso = async function(casoId) {
    const respuesta = confirm(`¿Está seguro de eliminar el caso ${casoId}? Esta acción borrará también sus seguimientos.`);
    
    if (respuesta) {
    
        const resultado = await window.api.enviarAlMain('EliminarCaso', casoId);
        
        if (resultado.success) {
            alert("Caso eliminado correctamente.");
    
            registroForm.dispatchEvent(new Event('submit'));
        } else {
            alert("Error al intentar eliminar el caso.");
        }
    }
};

const volverBtn = document.getElementById("volver-btn");
volverBtn.addEventListener('click', (e) => {
    window.api.navegar('ir-al-menu');
});


});