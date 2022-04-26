const {Client, LocalAuth, MessageMedia} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const {insertHw} = require('./src/db');
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "incidenciastest"
  });

var datos = [];
var num;

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
            if(txt === 'hola' || txt === 'ola' || txt === 'buenos dias' || txt === 'buenas tardes' || txt === 'buenas noches' || txt === 'buen dia'){
                sendMessage(from, '*Bienvenido al sistema de incidencias de laboratorios de computación* \n Ingresa la opción deseada \n 1.- Reporte de falla técnica \n 2.- Reporte administrativo');
            }else if (txt === '1'){
                sendMessage(from, 'Para hacer un reporte de hardware o software en lista los siguientes datos anteponiendo un guión *(-)* antes de los datos (por ejemplo "-4001", "-Juan perez", etc.): \n *Número de laboratio* \n *Nombre* \n *Materia* \n *Descrioción del reporte*\n Una vez guardados los datos escibe *save* para guardar el reporte.');
            }else if (txt === '2'){
                sendMessage(from, 'Para hacer un reporte administrativo lista los sigientes datos anteponiendo una *(-)* antes de cada dato y en diferentes mensajes (por ejemplo "-4001", "-Juan perez", etc.): \n *Número de laboratio* \n *Nombre* \n *Materia* \n *Descrioción del reporte*\n Una vez guardados los datos escibe *save* para guardar el reporte.');
            }else if (txt.charAt(0)==='-'){
                datos.push(txt.slice(1,250));
                sendMessage(from, 'Dato recibido');
                console.log(datos);
            }else if(txt === 'save'){
                insertHw(datos);
                sendMessage(from, 'Su reporte se ha guardado con exito');
            }else if (txt === 'fin'){
                datos.pop(),datos.pop(),datos.pop(),datos.pop();
                sendMessage(from, 'Hasta luego');
            }else{
                sendMessage(from,'Opción invalida');
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