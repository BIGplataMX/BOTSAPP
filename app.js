const fs = require('fs');
const { Client, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const req = require('express/lib/request');
const { sensitiveHeaders } = require('http2');


const SESSION_FILE_PATH = './session.json';
let client;
let sessionData;

const withSession = () => {
    // Si se detecta una sesion iniciadada, entoces secarga el archivo con las credenciales

    sessionData = require(SESSION_FILE_PATH);

    console.log('-> Iniciando Sesión')
    
    client = new Client({
        session:sessionData
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
 * Esta sesion genera el codigo QR
 */

const withOutSession = () => {

    console.log('No hay una sesion guardada')
    client = new Client();
    client.on('qr', qr => {
        qrcode.generate(qr, { small: true});
    });

    client.on('authenticated', (session) =>{
        //Aquí se guardan las credenciales de la sesión
        sessionData = session;
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session),  (err) => {
            if (err) {
                console.log(err);
            }
        });
    });

    client.initialize();
}
/**
 * Función para detectar mensajes
 */
const listenMessage = () => {
    client.on('message',(msg) => {
        const {from, to, body} = msg;

        switch (body) {
            case 'Adios':
                sendMessage(from, 'Hasta Luego 😁')
                break;
            case 'Hola':
                sendMessage(from,'¡Bienvenido!')
                sendMedia(from, 'esime_original.png')
                break;
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