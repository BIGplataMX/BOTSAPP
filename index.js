const {Client, LocalAuth, MessageMedia} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const {insertHw, insertAd} = require('./src/db');

var datosE = [];
var datosA = [];
var num = '0';

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

//Función para detectar mensajes

 const listenMessage = () => {
    client.on('message',(msg) => {
        const {from, body} = msg;
        let txt = body.normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase();
            if (num === from || num === '0'){
                if(txt === 'hola' || txt === 'ola' || txt === 'buenos dias' || txt === 'buenas tardes' || txt === 'buenas noches' || txt === 'buen dia'){
                    sendMessage(from, '*Bienvenido al sistema de incidencias de laboratorios de computación* \n Ingresa la opción deseada \n 1.- Reporte de falla técnica \n 2.- Reporte administrativo');
                    num = from;
                }else if (txt === '1'){
                    sendMessage(from, 'Para hacer un reporte sobre una falla en un equipo envía los siguientes datos anteponiendo un guión alto *"-"* antes de cada dato (por ejemplo "-4001", "-Juan perez", etc.) despues de cada dato recibirás un mensaje de confiramación: \n \n *Nombre* \n *Laboratio* \n *Numero del equipo*  \n *Materia* \n *Descripción del reporte* \n \n Una vez guardados los datos escibe *3* para guardar el reporte. \n \n En caso de que te equivoques o quieras corregir un dato escribe la palabra *del* para borrar los datos.');
                }else if (txt === '2'){
                    sendMessage(from, 'Para hacer un reporte sobre una incidencia administrativa en un equipo envía los siguientes datos anteponiendo una coma *","* antes de cada dato (por ejemplo ",4001", ",Juan perez", etc.) despues de cada dato recibirás un mensaje de confiramación: \n \n *Nombre* \n *Número de laboratio* \n *Materia* \n *Descripción del reporte* \n \n Una vez guardados los datos escibe *4* para guardar el reporte. \n \n En caso de que te equivoques o quieras cambiar algún dato escribe la palabra *del* para borrar los datos.');
                }else if (txt.charAt(0)==='-'){
                    datosE.push(body.slice(1,250));
                    sendMessage(from, 'Dato recibido');
                    console.log(datosE);
                }else if (txt.charAt(0)===','){
                    datosA.push(body.slice(1,250));
                    sendMessage(from, 'Dato recibido');
                    console.log(datosA);
                }else if(txt === '3'){
                    insertHw(datosE);
                    datosE.pop(),datosE.pop(),datosE.pop(),datosE.pop();
                    num = '0';
                    sendMessage(from, 'El reporte se ha guardado con éxito. \n Hasta luego😀');
                }else if(txt === '4'){
                    insertAd(datosA);
                    datosA.pop(),datosA.pop(),datosA.pop(),datosA.pop();
                    num = '0';
                    sendMessage(from, 'El reporte se ha guardado con éxito. \n Hasta luego😀');
                }else if (txt === 'del'){
                    datosE.pop(),datosE.pop(),datosE.pop(),datosE.pop();
                    datosA.pop(),datosA.pop(),datosA.pop(),datosA.pop();
                    sendMessage(from, 'Datos borrados, por favor vueleve a ingresar los datos desde el principio');
                }else{
                    sendMessage(from,'Opción invalida');
                }
            }else{sendMessage(from, 'Por ahora no puedo antenderte intenalo de nuevo en 1 un minuto')}
        console.log(from, txt);
    })
}

const sendMedia = (to, file) => {
    const mediaFile = MessageMedia.fromFilePath(`./mediaSend/${file}`)
    client.sendMessage(to, mediaFile)
}

const sendMessage = (to, message) => {
    client.sendMessage(to, message)
} 