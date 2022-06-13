const {Client, LocalAuth, MessageMedia} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const {insertEq, insertAd} = require('./src/db');

var datos = [];
var num
var rep
numInit();

//Inicialización del cliente
const client = new Client({
    authStrategy: new LocalAuth()
});

console.log('->Iniciando sesión')

//Generación de código qr
client.on('qr', qr => {
    qrcode.generate(qr,{small: true})
});

client.on('ready', () => {
    console.log('->El cliente está listo');
    listenMessage(); //Detección de mensajes
});

client.initialize();

//Función para detectar mensajes
const listenMessage = () => {
    client.on('message',(msg) => {
        const {from, body} = msg;
        let txt = body.normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase();
            if (num === from || num === '0'){ //Condición para eviatr 2 ususarios al mismo tiempo
                if(txt === 'hola' || txt === 'ola' || txt === 'buenos dias' || txt === 'buenas tardes' || txt === 'buenas noches' || txt === 'buen dia'){
                    sendMessage(from, '*Bienvenido al sistema de incidencias de laboratorios de computación* \n Ingresa la opción deseada \n \n 1.- Reporte de falla técnica \n 2.- Reporte administrativo \n 0.- Para salir\nTambién puedes solicitar un horario enviando tu grupo *por ejemplo "9cv12"* (Actualmente solo se cuenta con los horarios de 5to a 9no semestre de ICE). \n \nSi necesitas ayuda para saber como enviar el reporte y como funcionan otros comandos, envía una *h* para obtener ayuda');
                    num = from;
                }else if (txt === '1'){
                    sendMessage(from, 'Para hacer un reporte sobre una falla en un equipo envía los siguientes datos anteponiendo un guión alto *-* antes de cada dato (como se ve en la imagen de ejemplo), despues de cada dato recibirás un mensaje de confirmación: \n \n *Nombre* \n *Laboratorio* \n *Numero del equipo*  \n *Materia* \n *Descripción del reporte* \n \n Una vez guardados los datos escibe *G* para guardar el reporte. \n \n En caso de que te equivoques o quieras corregir un dato escribe la palabra *del* para borrar los datos o presiona *0* si quieres salir.\n \n Si necesitas ayuda para saber como enviar el reporte y como funcionan otros comandos, envía una *h* para obtener ayuda');
                    rep = 1;
                    sendMedia(from, 'tutodata.png');
                }else if (txt === '2'){
                    sendMessage(from, 'Para hacer un reporte sobre una incidencia administrativa envía los siguientes datos anteponiendo una guión alto *"-"* antes de cada dato (como se ve en la imagen de ejemplo), despues de cada dato recibirás un mensaje de confirmación: \n \n *Nombre* \n *Laboratorio* \n *Materia* \n *Descripción del reporte* \n \n Una vez guardados los datos escibe *G* para guardar el reporte. \n \n En caso de que te equivoques o quieras cambiar algún dato escribe la palabra *del* para borrar los datos.\n \n Si necesitas ayuda para saber como enviar el reporte y como funcionan otros comandos, envía una *h* para obtener ayuda');
                    sendMedia(from, 'tutodata.png');
                    rep = 2;
                }else if (txt.charAt(0)==='-'){
                    num = from;
                    datos.push(body.slice(1,250));
                    if(rep === 1){
                        sendMessage(from, 'Dato recibido \n\n' + '*Nombre:*  ' + datos[0]+'\n' + '*Lab:*  ' + datos[1]+'\n'+ '*Equipo:*  ' + datos[2]+'\n' + '*Materia:*  ' + datos[3]+'\n' + '*Reporte:*  ' + datos[4]);
                    }else if (rep === 2 ){
                        sendMessage(from, 'Dato recibido \n\n' + '*Nombre:*  ' + datos[0]+'\n' + '*Lab:*  ' + datos[1]+'\n'+ '*Materia:*  ' + datos[2]+'\n' + '*Reporte:*  ' + datos[3]);
                    }else{
                        sendMessage(from, 'Dato recibido');
                    }
                    console.log(datos);
                }else if(txt === 'g'){
                    if(datos.length===5){
                        insertEq(datos);
                        delDatos();
                        console.log(datos);
                        num = '0';
                        sendMessage(from, 'El reporte se ha guardado con éxito. \n Hasta luego😀');
                    }else if (datos.length===4){
                        insertAd(datos);
                        delDatos();
                        console.log(datos);
                        num = '0';
                        sendMessage(from, 'El reporte se ha guardado con éxito. \n Hasta luego😀');
                    }else{
                        sendMessage(from, 'Los datos no han sido guardados correctamente, intentanlo de nuevo');
                        delDatos();
                        console.log(datos);
                    }
                    rep = 0;
                }else if (txt === 'del'){
                    delDatos();
                    console.log(datos);
                    sendMessage(from, 'Datos borrados \n\n' + '*Nombre:*  ' + datos[0]+'\n' + '*Lab:*  ' + datos[1]+'\n'+ '*Equipo:*  ' + datos[2]+'\n' + '*Materia:*  ' + datos[3]+'\n' + '*Reporte:*  ' + datos[4]);
                }else if(txt === '0'){
                    delDatos();
                    console.log(datos);
                    num = '0';
                    sendMessage(from, 'Sesión finalizada');
                }else if(txt === 'h'){
                    sendMessage(from, 'Las siguientes son caputras que te ayudarán a saber como usar el asistente');
                    sendMedia(from, 'tutoreporte.jpg');
                    sendMedia(from, 'del.jpg')
                }else if (txt.length > 3 && txt.length <= 5 && (txt.charAt(0) === '1' || txt.charAt(0) === '2' || txt.charAt(0) === '3' || txt.charAt(0) === '4' || txt.charAt(0) === '5' || txt.charAt(0) === '6' || txt.charAt(0) === '7' || txt.charAt(0) === '8' || txt.charAt(0) === '9')){
                    sendMessage(from, 'Horario');
                    sendHorario(from, txt + '.png');
                }else{
                    sendMessage(from,'Opción invalida');
                }
            }else{sendMessage(from, 'Por ahora no puedo antenderte intenalo de nuevo en 1 un minuto')}
        console.log(from, txt);
    })
}

//Función para enviar archivos
const sendMedia = (to, file) => {
    const mediaFile = MessageMedia.fromFilePath(`./mediaSend/${file}`)
    client.sendMessage(to, mediaFile)
}

//Función para enviar mensajes
const sendMessage = (to, message) => {
    client.sendMessage(to, message)
}

const sendHorario = (to, file) => {
    const mediaFile = MessageMedia.fromFilePath(`./mediaSend/horarios/${file}`)
    client.sendMessage(to, mediaFile)
}

//Inicailizar variable de control
function numInit(){
    num = '0';
}
//Llado a variable de control cada 5 minutos
var numInt = setInterval(numInit, 300000);

//Borrado de los datos del arreglo
function delDatos(){
    datos.pop(),datos.pop(),datos.pop(),datos.pop(),datos.pop(),datos.pop();
}