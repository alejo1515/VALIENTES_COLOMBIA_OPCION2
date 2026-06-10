

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
    

const btnRegistrarSeguimientomicro = document.getElementById("registro_microbutton");

btnRegistrarSeguimientomicro.addEventListener('click', () => {

    window.api.navegar('ir-al-registroSegMicro');
});


const btnRegistrarSeguimientomacro= document.getElementById("registro_macrobutton");

btnRegistrarSeguimientomacro.addEventListener('click', () => {

    window.api.navegar('ir-al-registroSegMacro');
});


const btnGraficasSegMacro= document.getElementById("grafico_macrobutton");

btnGraficasSegMacro.addEventListener('click', () => {

    window.api.navegar('ir-al-GraficoMacro');
});



const btnGraficasSegMicro= document.getElementById("grafico_microbutton");

btnGraficasSegMicro.addEventListener('click', () => {

    window.api.navegar('ir-al-GraficoMicro');
});


const btnGraficasSegMicrofactor= document.getElementById("grafico_microbuttonindividual");

btnGraficasSegMicrofactor.addEventListener('click', () => {

    window.api.navegar('ir-al-graficaMicrofactor');
});



const btnGraficasSegMacrofactor= document.getElementById("grafico_macrobuttonindividual");

btnGraficasSegMacrofactor.addEventListener('click', () => {

    window.api.navegar('ir-al-graficaMacrofactor');
});


const volverBtn = document.getElementById("volver-btn");
volverBtn.addEventListener('click', (e) => {
    window.api.navegar('ir-al-menu');
});


});