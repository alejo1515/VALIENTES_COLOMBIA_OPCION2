
window.addEventListener('DOMContentLoaded', async () => {
   
    const usuarioLogueado = await window.api.enviarAlMain('quien-es-el-usuario');

    //
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

const registroCForm = document.getElementById("formulario_caso");
const formNOMBRE_CASO = document.getElementById("nombre_caso");
 const formUSER_ID = document.getElementById("user_id");
const formESTADO_CASO =document.getElementById("estado_caso");
const formREPATRIACION_AVION = document.getElementById("repatriacion");
const formTIPO_ATENCION = document.getElementById("tipo_atencion");
const formTIPIFICACION = document.getElementById("tipificacion");
const formENTIDAD_REMITENTE = document.getElementById("entidad_remitente");
const formNIVEL_RIESGO = document.getElementById("nivel_riesgo");
const formDENUNCIO = document.getElementById("denuncio");
const formDETALLES_DENUNCIA = document.getElementById("detalles_denuncia");
const formRUTA_ACTIVA = document.getElementById("ruta_activa");
const formRECIBIO_DINERO = document.getElementById("recibio_dinero");
const formMEDIOS_RECIBIDO_DINERO = document.getElementById("medios_recibido_dinero"); 
const formOFERTA_CAPTACION = document.getElementById("oferta_captacion");
const formAEROLINEA_USADA = document.getElementById("aerolinea_usada");
const formTRAYECTO_VUELO = document.getElementById("trayecto_vuelo");





registroCForm.addEventListener('submit', async (e) => {


    
    e.preventDefault();
;

    const newregistroC = {
      
        NOMBRE_CASO:formNOMBRE_CASO.value,
        USER_ID: formUSER_ID.value,
        ESTADO_CASO: formESTADO_CASO.value,
        REPATRIACION_AVION: formREPATRIACION_AVION.value,
        TIPO_ATENCION: formTIPO_ATENCION.value,
        TIPIFICACION: formTIPIFICACION.value,
        ENTIDAD_REMITENTE: formENTIDAD_REMITENTE.value,
        NIVEL_RIESGO: formNIVEL_RIESGO.value,
        DENUNCIO: formDENUNCIO.value,
        DETALLES_DENUNCIA: formDETALLES_DENUNCIA.value,
        RUTA_ACTIVA: formRUTA_ACTIVA.value,
        RECIBIO_DINERO: formRECIBIO_DINERO.value,
        MEDIOS_RECIBIDO_DINERO: formMEDIOS_RECIBIDO_DINERO.value, 
        OFERTA_CAPTACION: formOFERTA_CAPTACION.value,
        AEROLINEA_USADA: formAEROLINEA_USADA.value,
        TRAYECTO_VUELO:formTRAYECTO_VUELO.value
    };

const respuesta = await window.api.enviarAlMain('registrarCaso', newregistroC);

    
    if (respuesta.success) {
        alert("CASO REGISTRADO EXITOSAMENTE");
        
    
        window.api.navegar('ir-al-menu');
    } else {
        
        alert("Error: " + (respuesta.error || "No se pudo registrar"));
    }



})

const volverBtn = document.getElementById("volver-btn");
volverBtn.addEventListener('click', (e) => {
    window.api.navegar('ir-al-menu');});




});