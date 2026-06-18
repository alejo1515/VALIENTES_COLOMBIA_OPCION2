const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

let dbInstance = null;

async function getConnection() {
    if (dbInstance) {
        return dbInstance;
    }

    // 🚀 DETECTAR SI ESTAMOS EN DESARROLLO O EN PRODUCCIÓN (EMPAQUETADO)
    let dbPath;

    if (process.env.NODE_ENV === 'development' || !process.resourcesPath) {
        // Si estás programando en VS Code, lee la carpeta local de desarrollo
        dbPath = path.join(__dirname, 'database', 'valientes.sqlite');
    } else {
        // 🔥 SI ESTÁ EMPAQUETADO: Busca la carpeta "database" que está AL LADO del ValientesColombia.exe
        const rootPath = path.dirname(process.execPath);
        dbPath = path.join(rootPath, 'database', 'valientes.sqlite');
    }

    console.log("👉 Conectando directamente a la BD en:", dbPath);

    // Conexión directa al archivo seleccionado
    dbInstance = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    await dbInstance.get('PRAGMA foreign_keys = ON');

    return dbInstance;
}

module.exports = { getConnection };