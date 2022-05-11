const {Client, LocalAuth, MessageMedia} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const {insertEq, insertAd} = require('./src/db');

var datos = [];
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
                    sendMessage(from, '*Bienvenido al sistema de incidencias de laboratorios de computación* \n Ingresa la opción deseada \n \n 1.- Reporte de falla técnica \n 2.- Reporte administrativo \n 0.- Para salir');
                    num = from;
                }else if (txt === '1'){
                    sendMessage(from, 'Para hacer un reporte sobre una falla en un equipo envía los siguientes datos anteponiendo un guión alto *-* antes de cada dato (como se ve en la imagen de ejemplo), despues de cada dato recibirás un mensaje de confirmación: \n \n *Nombre* \n *Laboratorio* \n *Numero del equipo*  \n *Materia* \n *Descripción del reporte* \n \n Una vez guardados los datos escibe *3* para guardar el reporte. \n \n En caso de que te equivoques o quieras corregir un dato escribe la palabra *del* para borrar los datos o presiona *0* si quieres salir.');
                    sendMedia(from, 'tutodata.png');
                }else if (txt === '2'){
                    sendMessage(from, 'Para hacer un reporte sobre una incidencia administrativa envía los siguientes datos anteponiendo una guión alto *"-"* antes de cada dato (como se ve en la imagen de ejemplo), despues de cada dato recibirás un mensaje de confirmación: \n \n *Nombre* \n *Laboratorio* \n *Materia* \n *Descripción del reporte* \n \n Una vez guardados los datos escibe *4* para guardar el reporte. \n \n En caso de que te equivoques o quieras cambiar algún dato escribe la palabra *del* para borrar los datos.');
                    sendMedia(from, 'tutodata.png');
                }else if (txt.charAt(0)==='-'){
                    datos.push(body.slice(1,250));
                    sendMessage(from, 'Dato recibido');
                    console.log(datos);
                }else if(txt === '3'){
                    insertEq(datos);
                    datos.pop(),datos.pop(),datos.pop(),datos.pop(),datos.pop(),datos.pop();
                    num = '0';
                    sendMessage(from, 'El reporte se ha guardado con éxito. \n Hasta luego😀');
                }else if(txt === '4'){
                    insertAd(datos);
                    datos.pop(),datos.pop(),datos.pop(),datos.pop(),datos.pop(),datos.pop();
                    num = '0';
                    sendMessage(from, 'El reporte se ha guardado con éxito. \n Hasta luego😀');
                }else if (txt === 'del'){
                    datos.pop(),datos.pop(),datos.pop(),datos.pop(),datos.pop(),datos.pop();
                    sendMessage(from, 'Datos borrados, por favor vueleve a ingresar los datos desde el principio');
                }else if(txt === '0'){
                    datos.pop(),datos.pop(),datos.pop(),datos.pop(),datos.pop(),datos.pop();
                    num = '0';
                    sendMessage(from, 'Sesión finalizada');
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