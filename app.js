const fs = require('fs');
const { Client, MessageMedia, LegacySessionAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const req = require('express/lib/request');
const { sensitiveHeaders } = require('http2');
const { log } = require('./src/log');


const SESSION_FILE_PATH = './session.json';
let client;
let sessionData;

const withSession = () => {
    // Si se detecta una sesion iniciadada, entoces secarga el archivo con las credenciales

    sessionData = require(SESSION_FILE_PATH);

    console.log('-> Iniciando Sesión')
    
    client = new Client({
        authStrategy: new LegacySessionAuth({
            session: sessionData
        })
    })

    client.on('ready', () => {
        console.log('-> El cliente está listo')
        listenMessage();
    })

    client.on('auth_failure', () => {
        console.log('-> Error de auntenticación');
    })

    client.initialize();
}

/**
 * Esta función genera el codigo QR y guarda el archivo con las credenciales
 */

const withOutSession = () => {

    console.log('No hay una sesion guardada')
    log();
}
/**
 * Función para detectar mensajes
 */
 const listenMessage = () => {
    client.on('message',(msg) => {
        const {from, to, body} = msg;
        text = body.toLowerCase();

        if (text === 'hola' || text === 'ola' || text=== 'buenas tardes' || text === 'buenos dias'){
            sendMessage(from,'*¡Bienvenido al asistente virtual de ESIME Zacatenco!*\n \n' + 'a continuación escribe la opción de tu interés:\n' + 'Escribe *Matutino* o *Vespertino* para obtener información acerca los correos y ventanillas de gestión escolar\n \n' + 'Escribe tu *Grupo* en formato de "1XX1" para obtener tu horario y salones *(Actualemente solo se cuenta con los horarios de 5to a 9no semestre)*\n \n' + '*Escribe documentos si necesitas descargar algún formato*');

        }else if (text === 'matutino' || text === 'vespertino' ){
                    sendDocumento(from, text + '.png');

        }else if (text === 'documentos'){
            sendMessage(from, '*Los documentos con los que contamos son los siguientes* (escribe el nombre del documento que necesites):\n' + '1.- Socilicitud de reinscripción\n' + '2.- Solicitud de baja\n' + '3.- Solicitud de baja de materia\n' + '4.- Solicitud de cambio de turno\n' + '5.- Materias antecedentes\n')

        }else if (text === 'materias antecedentes'){
            sendMessage(from, 'Selecciona tu carrera:\n' + '1.- ICE\n' + '2.- IE\n' + '3.- ICA\n' + '4.- ISISA\n' + '5.- IF')

        }else if (text === 'solicitud de reinscripcion' || text === 'solicitud de baja' || text === 'solicitud de baja de materia' || text === 'solicitud de cambio de turno'){
            sendDocumento(from, text + '.pdf')

        }else if (text === 'ice' || text === 'ica' || text === 'ie' || text === 'if' || text === 'isisa'){
            sendDocumento(from, text + '.pdf')

        }else if (text.length > 3 && text.length <= 5 && (text.charAt(0) === '1' || text.charAt(0) === '2' || text.charAt(0) === '3' || text.charAt(0) === '4' || text.charAt(0) === '5' || text.charAt(0) === '6' || text.charAt(0) === '7' || text.charAt(0) === '8' || text.charAt(0) === '9')){
            sendMessage(from, 'Horario')
            sendHorario(from, text + '.png')

        }else if (text.length === 10 && text.charAt(0) === '2'){
            sendMessage(from, 'Tu boleta es:\n' + text);

        }else{sendMessage(from, 'Lo siento no entendí, vuelve a intentarlo')}   

        console.log(from, to, body);
    })
}

/** 
 * Función para enviar archivos
 */

const sendMedia = (to, file) => {
    const mediaFile = MessageMedia.fromFilePath(`./mediaSend/${file}`)
    client.sendMessage(to, mediaFile)
}

const sendHorario = (to, file) => {
    const mediaFile = MessageMedia.fromFilePath(`./mediaSend/horarios/${file}`)
    client.sendMessage(to, mediaFile)
}

const sendDocumento = (to, file) => {
    const mediaFile = MessageMedia.fromFilePath(`./mediaSend/documentos/${file}`)
    client.sendMessage(to, mediaFile)
}
/**
 * Función para enviar mensajes
 */
const sendMessage = (to, message) => {
    client.sendMessage(to, message)
}

/** */
(fs.existsSync(SESSION_FILE_PATH)) ? withSession() : withOutSession();