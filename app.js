const {Client, LocalAuth, MessageMedia} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "incidenciastest"
  });

const client = new Client({
    authStrategy: new LocalAuth()
});

console.log('->Iniciando sesión')

client.on('qr', qr => {
    qrcode.generate(qr,{small: true})
});

client.on('ready', () => {
    console.log('->El cliente está listo');
    listenMessage();
});

client.initialize();

/**
 * Función para detectar mensajes
 */
 const listenMessage = () => {
    client.on('message',(msg) => {
        const {from, body} = msg;
        let txt = body.normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase();
        
        if(txt === 'hola' || txt === 'ola' || txt === 'buenos dias' || txt === 'buenas tardes' || txt === 'buenas noches'){
            sendMessage(from, 'Bienvenido al sistema de incidencias de laboratorios de computación.\n ¿Cuál es tu problema?\n 1.- Reporte de software\n 2.- Reporte de hardware\n 3.- Reporte administrativo\n');
            mainMenu();
        }else{
            sendMessage(from, 'Opción invalida')
        }

        console.log(from, txt);
    })
}

/** 
 * Función para enviar archivos
 */

const sendMedia = (to, file) => {
    const mediaFile = MessageMedia.fromFilePath(`./mediaSend/${file}`)
    client.sendMessage(to, mediaFile)
}

const sendMessage = (to, message) => {
    client.sendMessage(to, message)
}

const mainMenu = () => {
    client.on('message',(msg) => {
        const {from, to, body} = msg;
        let txt = body.normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase();
        switch(txt){
            case '1':
                sendMessage(from, 'Opción 1')
                break;
            case '2':
                sendMessage(from, 'Opción 2')
                break;
            case '3':
                sendMessage(from, 'Opción 3')
                break;
            case '4':
                sendMessage(from, 'Opción 4')
                break;
            default:
                sendMessage(from, 'Lo siento, no es una opción valida.');
                break;
        }

        console.log(from, to, txt);
    })
}

const insertFrom = (number) => {
    con.connect(function(err) {
        if (err) throw err;
        console.log("conectado");
        var sql = 'INSERT INTO sesion VALUES ?';
        var values = [['NULL', number]];
        con.query(sql, [values], function (err, result) {
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
        });
    });
}