 
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


const registroCForm = document.getElementById("formSeguimiento");
 const formUSER_ID = document.getElementById("user_identifier");
const formSALUD_FISICA = document.getElementById("SALUD_FISICA");
const formSALUD_MENTAL = document.getElementById("SALUD_MENTAL");
const formSEGURIDAD_PROTECCION = document.getElementById("SEGURIDAD_PROTECCION");
const formVIVIENDA = document.getElementById("VIVIENDA");
const formINGRESOS_MEDIOS_VIDA = document.getElementById("INGRESOS_MEDIOS_VIDA");
const formEDUCACION_BASICA = document.getElementById("EDUCACION_BASICA");
const formREDES_APOYO = document.getElementById("REDES_APOYO");
const formAUTONOMIA = document.getElementById("AUTONOMIA");
const formNOTA_SUCESO = document.getElementById("NOTA_SUCESO");
const formAPOYO_EQUIPO = document.getElementById("APOYO_EQUIPO");
const formDIFICULTADES_EQUIPO = document.getElementById("DIFICULTADES_EQUIPO");

 const sumaTotal = formSALUD_FISICA.value + formSALUD_MENTAL.value + formSEGURIDAD_PROTECCION.value + formVIVIENDA.value + formINGRESOS_MEDIOS_VIDA.value;
    const porcentaje = ((sumaTotal / 30) * 100).toFixed(2);

registroCForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newregistroC = {
        USER_ID: formUSER_ID.value,
        SALUD_FISICA: formSALUD_FISICA.value,
        SALUD_MENTAL: formSALUD_MENTAL.value,
        SEGURIDAD_PROTECCION: formSEGURIDAD_PROTECCION.value,
        VIVIENDA: formVIVIENDA.value,
        INGRESOS_MEDIOS_VIDA: formINGRESOS_MEDIOS_VIDA.value,
        EDUCACION_BASICA: formEDUCACION_BASICA.value,
        REDES_APOYO: formREDES_APOYO.value,
        AUTONOMIA: formAUTONOMIA.value,
        NOTA_SUCESO: formNOTA_SUCESO.value,
        APOYO_EQUIPO: formAPOYO_EQUIPO.value,
        DIFICULTADES_EQUIPO: formDIFICULTADES_EQUIPO.value,
    };


    const respuesta = await window.api.enviarAlMain('registrarSeguimientoMacro', newregistroC);  

    if (respuesta.success) {
        alert(`SEGUIMIENTO REGISTRADO EXITOSAMENTE!\nProgreso calculado: ${porcentaje}%`);
        window.api.navegar('ir-al-menu');


    } else {
        alert("Error al registrar seguimiento: " + respuesta.error);
    }




})
    const volverBtn = document.getElementById("volver-btn");
     volverBtn.addEventListener('click', (e) => {
        window.api.navegar('ir-al-menu');
     });

    });            