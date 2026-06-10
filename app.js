

const loginuser = document.getElementById("login-user");

loginuser.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newloginc = {
        NAME: document.getElementById("USERNAME").value,
        CLAVE: document.getElementById("PASSWORD").value,
    };

    // CAMBIO 1: Usamos window.api.enviarAlMain en lugar de ipcRenderer.invoke
    const usuarioEncontrado = await window.api.enviarAlMain('login', newloginc);

    if (usuarioEncontrado) {
        alert("Acceso correcto");
        localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));
        
        // CAMBIO 2: Usamos window.api.navegar en lugar de ipcRenderer.send
        window.api.navegar('ir-al-menu');
    } else {
        alert("Usuario o contraseña incorrectos");
    }
});