const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT, 10),
    options: {
        encrypt: true, 
        trustServerCertificate: true 
    }
};

function hora() {
    var date = new Date();

    var hour = date.getHours().toString().padStart(2, '0'); // Formato "HH"
    var minutes = date.getMinutes().toString().padStart(2, '0'); // Formato "MM"
    var seconds = date.getSeconds().toString().padStart(2, '0'); // Formato "SS"

    // Retorna en formato "HH:MM:SS.SSS"
    return `${hour}:${minutes}:${seconds}`;
}

function fecha() {
    var date = new Date();
    var day = date.getDate().toString().padStart(2, '0');
    var month = (date.getMonth() + 1).toString().padStart(2, '0');
    var year = date.getFullYear().toString();

    return `${year}-${month}-${day}`;
}

async function insertEq(data) {
    try {
        let pool = await sql.connect(config);
        const horaCurrent = hora();
        const fechaCurrent = fecha();

        let insert = await pool.request()
            .query(`INSERT INTO equipos (nombre, lab, equipo, materia, incidencia, hora, fecha, his) VALUES ('${data[1]}' , '${data[2]}', '${data[3]}', '${data[4]}', '${data[5]}', '${horaCurrent}', '${fechaCurrent}', 0)`);

        console.log('Reporte de quipo guardado:', insert.rowsAffected);
    } catch (err) {
        console.error('Error al insertar los datos:', err);
    } finally {
        await sql.close();
    }
}

async function insertAd(data) {
    try {
        let pool = await sql.connect(config);
        const horaCurrent = hora();
        const fechaCurrent = fecha();

        let insert = await pool.request()
            .query(`INSERT INTO administrativos (nombre, lab, materia, incidencia, hora, fecha, his) VALUES ('${data[1]}' , '${data[2]}', '${data[3]}', '${data[4]}', '${horaCurrent}', '${fechaCurrent}', 0)`);

        console.log('Reporte administrativo guardado:', insert.rowsAffected);
    } catch (err) {
        console.error('Error al insertar los datos:', err);
    } finally {
        await sql.close();
    }
    
}


// function conectar(){
//     con.query('select 1 + 1 as solution', function (result){
//         console.log('Comprobación de la base de datos:   ' + 'hora: ' + hora() + ' ---- ' + 'Fecha' + fecha())
//     });
// }

module.exports = {insertEq, insertAd}