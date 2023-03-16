var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "incidenciastest"
  });

function hora(){
    var date = new Date();

    var hour = date.getHours().toString()
    var minutes = date.getMinutes().toString()

    if (minutes<10){
        return hour + ' : 0' + minutes + " hrs";
    }else{
        return hour + ' : ' + minutes + " hrs";
    }
    
}

function fecha(){
    var date = new Date();
    var m = date.getMonth()+1;

    var day = date.getDate().toString()
    var month = m.toString()
    var year = date.getFullYear().toString()

    return day + '-' + month + '-' + year;

}

const insertEq = (data) => {
    var sql = 'INSERT INTO equipos VALUES ?';
    var sql2 = 'INSERT INTO equiposh VALUES ?';
    var values = [["NULL", data[0], data[1],data[2],data[3],data[4],hora(),fecha()]]
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
    var values = [["NULL", data[0], data[1],data[2],data[3],hora(),fecha()]]
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
var conexion = setInterval(conectar, 2700000);

module.exports = {insertEq, insertAd}