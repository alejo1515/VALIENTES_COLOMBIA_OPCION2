const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

let dbInstance = null;

async function getConnection() {

    if (dbInstance) {
        return dbInstance;
    }


    dbInstance = await open({
        filename: path.join(__dirname, 'database', 'valientes.sqlite'),
        driver: sqlite3.Database
    });

    
    await dbInstance.get('PRAGMA foreign_keys = ON');

    return dbInstance;
}

module.exports = { getConnection };