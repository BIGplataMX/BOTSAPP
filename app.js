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

        if (body === 'Hola' || body === 'hola' || body === 'ola' || body === 'Ola'){
            sendMessage(from,'*¡Bienvenido al asistente virtual de ESIME Zacatenco!*\n' + 'a continuación escribe la opción de tu interés:\n' + 'Escribe *Matutino* o *Vespertino* para obtener información acerca los correos y ventanillas de gestión escolar\n' + 'Escribe tu *Grupo* en formato de "1xx1" para obtener tu horario y salones\n *(Actualemente solo se cuenta con los horarios de 5to a 9no semestre)*');

        }else if ( body === 'Matutino' || body === 'matutino' || body === 'Vespertino' || body === 'vespertino' ){
            switch (body) {
                case 'Matutino':
                    sendMedia(from, 'matutino.png');
                    break;
                case 'matutino':
                    sendMedia(from, 'matutino.png');
                    break;
                case 'Vespertino':
                    sendMedia(from, 'vespertino.png');
                    break;
                case 'vespertino':
                    sendMedia(from, 'vespertino.png');
                    break;
            }
        }else{
            sendMessage(from, 'Este el horario del grupo solicitado: ');
            sendMedia(from, body + '.png');
        }    

        console.log(from, to, body);
    })
}

const sendMedia = (to, file) => {
    const mediaFile = MessageMedia.fromFilePath(`./mediaSend/${file}`)
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
