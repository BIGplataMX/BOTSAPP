var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "incidenciastest"
  });

const insertFrom = (number) => {
        var sql = 'INSERT INTO sesiom VALUES ?';
        var values = [['NULL', number]]
        con.query(sql, [values], function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
}

const insertHw = (data) => {
        var sql = 'INSERT INTO test VALUES ?';
        var values = [["NULL", data[0], data[1],data[2],data[3]]]
        con.query(sql, [values], function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
}

module.exports = {insertHw}