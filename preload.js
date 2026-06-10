const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    enviarAlMain: (canal, datos) => {
        return ipcRenderer.invoke(canal, datos);
    },

    enviarDatos: (canal, datos) => {
        ipcRenderer.send(canal, datos);
    },

    navegar: (canal) => {
        ipcRenderer.send(canal);
    }
});