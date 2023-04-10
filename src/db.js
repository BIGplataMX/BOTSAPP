var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "LABS_ICE"
  });

function hora(){
    var date = new Date();

    var hour = date.getHours().toString()
    var minutes = date.getMinutes().toString()
    var seconds = date.getSeconds().toString()
  
    return hour + ':' + minutes + ':' + seconds;
    
}

function fecha(){
    var date = new Date();
    var m = date.getMonth()+1;

    var day = date.getDate().toString()
    var month = m.toString()
    var year = date.getFullYear().toString()

    return year + '-' + month + '-' + day;

}

const insertEq = (data) => {
    var sql = 'INSERT INTO equipos VALUES ?';
    var sql2 = 'INSERT INTO equiposh VALUES ?';
    var values = [["NULL", data[1], data[2],data[3],data[4],data[5],hora(),fecha()]]
    con.query(sql, [values], function (result) {
        //if (err) throw err;
        console.log("Reporte guardado");
    })
    con.query(sql2, [values], function (result) {
        //if (err) throw err;
        console.log("Reporte guardado en el historial");
    })
}

const insertAd = (data) => {
    var sql = 'INSERT INTO administrativos VALUES ?';
    var sql2 = 'INSERT INTO administrativosh VALUES ?';
    var values = [["NULL", data[1], data[2],data[3],data[4],hora(),fecha()]]
    con.query(sql, [values], function (result) {
        //if (err) throw err;
        console.log("Reporte guardado");
    })
    con.query(sql2, [values], function (result) {
        //if (err) throw err;
        console.log("Reporte guardado en el historial");
    })
}

function conectar(){
    con.query('select 1 + 1 as solution', function (result){
        console.log('Comprobación de la base de datos:   ' + 'hora: ' + hora() + ' ---- ' + 'Fecha' + fecha())
    });
}

var horaInt = setInterval(hora, 1000);
var fechaInt = setInterval(fecha, 1000);

module.exports = {insertEq, insertAd, conectar}