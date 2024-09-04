const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const axios = require('axios');

// Membaca file JSON
const responses = JSON.parse(fs.readFileSync('chat.json', 'utf8'));

const client = new Client({
    authStrategy: new LocalAuth()
});

// Menampilkan QR code di terminal
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

// Client siap digunakan setelah login
client.on('ready', () => {
    console.log('Bot is ready!');
});

// Mengirim stiker
const sendSticker = async (chatId, stickerPath) => {
    try {
        const media = MessageMedia.fromFilePath(stickerPath);
        await client.sendMessage(chatId, media, { sendMediaAsSticker: true });
    } catch (error) {
        console.error('Error sending sticker:', error);
    }
};

client.on('message', async message => {
    const response = responses.chat.find(r => r.message.toLowerCase() === message.body.toLowerCase());
    
    if (response) {
        message.reply(response.response);
    } else if (message.body.includes('@') && !message.fromMe) {
        message.reply('Bot siap melayani  :)');
        const stickerPath = 'c:/Users/oktaviand/AppData/Local/Packages/5319275A.WhatsAppDesktop_cv1g1gvanyjgm/TempState/cdd43a04-5c1b-45b2-9e59-e97e722bb725.webp'; // Ganti dengan path ke stiker Anda
        await sendSticker(message.from, stickerPath);
    }
});

client.initialize();

// Menangani error umum
client.on('error', (err) => {
    console.error('Terjadi kesalahan: ', err);
});
