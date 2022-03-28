const qrcode = require('qrcode-terminal');
const { Client, LegacySessionAuth } = require('whatsapp-web.js');
const fs = require('fs');
const { L } = require('qrcode-terminal/vendor/QRCode/QRErrorCorrectLevel');

const SESSION_FILE_PATH = "./session.json";
let sessionData;
let client;

const log = () =>{
    client = new Client({
        authStrategy: new LegacySessionAuth({
            session: sessionData
        })
    });

    client.initialize();

    client.on('qr', qr => {
        qrcode.generate(qr, {small: true});
    });

    client.on('authenticated', session => {
        session = session;
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), err =>{
            if(err){
                console.error(err);
            };
        });
    })
    
    client.on('auth_failure', msg => {
        console.error('Hubo un error de autenticación', msg)
    })
}

module.exports = { log }

