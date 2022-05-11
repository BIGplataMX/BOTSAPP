var date = new Date();



var fecha = day + '-' + month + '-' + year; 
var hora = hour + ':' + minutes;

function hora(){
    var date = new Date();

    var hour = date.getHours().toString()
    var minutes = date.getMinutes().toString()

    return hour + ' : ' + minutes + " hrs";
}

function fecha(){
    var date = new Date();
    var m = date.getMonth()+1;

    var day = date.getDate().toString()
    var month = m.toString()
    var year = date.getFullYear().toString()

    return day + '-' + month + '-' + year;

}