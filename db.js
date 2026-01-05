const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

let db;

async function initDB (){
    db = await open ({
        filename: path.join(__dirname, 'database.db'),
        driver: sqlite3.Database
    });


    const fs = require ('fs');
    const initSql = fs.readFileSync (path.join (__dirname, 'script','init_db.sql'), 'utf8');
    await db.exec (initSql);
    return db;
}

function getDB (){
    if (!db){
        throw new Error ('Database not initialized. Call initDB() first.');
    }
    return db;
}

module.exports = {
    initDB,
    getDB
}