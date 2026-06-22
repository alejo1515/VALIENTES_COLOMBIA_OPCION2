const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');
const { app, dialog } = require('electron'); // 🔥 Es vital importar 'app' desde electron

let dbInstance = null;

async function getConnection() {
    if (dbInstance) {
        return dbInstance;
    }

    let dbPath;

    // 🚀 VALIDACIÓN DE ENTORNO SEGURA
    if (!app.isPackaged) {
        // MODO DESARROLLO (npm start): Forzamos la raíz de tu espacio de trabajo
        dbPath = path.join(app.getAppPath(), 'database', 'valientes.sqlite');
    } else {
        // MODO PRODUCCIÓN (out/): Busca al lado del ejecutable final de la app
        const rootPath = path.dirname(process.execPath);
        dbPath = path.join(rootPath, 'database', 'valientes.sqlite');
    }

    console.log("👉 Conectando directamente a la BD en:", dbPath);

    try {
        dbInstance = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        // Habilitar claves foráneas si las usas
        await dbInstance.get('PRAGMA foreign_keys = ON');
        return dbInstance;

    } catch (error) {
        // Manejo de errores visual en producción o consola en desarrollo
        if (app.isPackaged) {
            dialog.showErrorBox(
                'Error de Conexión a Base de Datos',
                `Ruta intentada:\n${dbPath}\n\nDetalle:\n${error.message}`
            );
        } else {
            console.error("❌ Error abriendo SQLite en desarrollo:", error.message);
        }
        throw error;
    }
}

module.exports = { getConnection };