var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "incidenciastest"
  });

const insertHw = (data) => {
    var sql = 'INSERT INTO equipos VALUES ?';
    var values = [["NULL", data[0], data[1],data[2],data[3],data[4]]]
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Reporte guardado");
    });
}

const insertAd = (data) => {
    var sql = 'INSERT INTO administrativos VALUES ?';
    var values = [["NULL", data[0], data[1],data[2],data[3]]]
    con.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Reporte guardado");
    });
}

module.exports = {insertHw, insertAd}