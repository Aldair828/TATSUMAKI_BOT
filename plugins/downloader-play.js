import axios from 'axios';
import yts from 'yt-search';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args || !args[0]) return conn.reply(m.chat, `🚩 Ingresa el formato y el título de un video o canción de YouTube.\n\n*Ejemplo:*\n*${usedPrefix + command}* mp3 Alan Walker - Sing Me To Sleep`, m);

    let format = args[0].toLowerCase();
    let query = args.slice(1).join(' ');
    if (!query) return conn.reply(m.chat, `🚩 Ingresa el título de un video o canción de YouTube.\n\n*Ejemplo:*\n*${usedPrefix + command}* mp3 Alan Walker - Sing Me To Sleep`, m);

    try {
        await m.react('🕓');
        let res = await yts(query);
        let vid = res.videos[0];
        if (!vid) return conn.reply(m.chat, '🚩 No se encontraron resultados.', m);

        let txt = `*YOUTUBE PLAY*\n\n`;
        txt += `✩ *Título*: ${vid.title}\n`;
        txt += `✩ *Duración*: ${vid.timestamp}\n`;
        txt += `✩ *Visitas*: ${vid.views}\n`;
        txt += `✩ *Autor*: ${vid.author.name}\n`;
        txt += `✩ *Publicado*: ${vid.ago}\n`;
        txt += `✩ *Url*: ${vid.url}\n\n`;
        txt += `*- El archivo se está enviando, espera un momento...*`;

        await conn.sendFile(m.chat, vid.thumbnail, 'thumbnail.jpg', txt, m);

        // Llamando a la API de akuari
        let apiUrl = `https://api.akuari.my.id/downloader/youtube?link=${encodeURIComponent(vid.url)}`;
        let response = await axios.get(apiUrl);

        if (response.data.status !== true) {
            return conn.reply(m.chat, `🚩 Ocurrió un error al procesar la solicitud.`, m);
        }

        let downloadUrl;
        let fileName;
        let mimetype;

        if (format === 'mp3') {
            downloadUrl = response.data.mp3[0].url;
            fileName = `${vid.title}.mp3`;
            mimetype = 'audio/mp4';
        } else if (format === 'mp4') {
            downloadUrl = response.data.mp4[0].url;
            fileName = `${vid.title}.mp4`;
            mimetype = 'video/mp4';
        } else {
            return conn.reply(m.chat, `🚩 Formato no válido. Usa *mp3* o *mp4*.`, m);
        }

        let messageOptions = format === 'mp3'
            ? { audio: { url: downloadUrl }, fileName: fileName, mimetype: mimetype }
            : { document: { url: downloadUrl }, fileName: fileName, mimetype: mimetype };

        await conn.sendMessage(m.chat, messageOptions, { quoted: m });
        await m.react('✅');
    } catch (error) {
        console.error(error);
        await m.react('✖️');
        conn.reply(m.chat, `🚩 Ocurrió un error durante la descarga.`, m);
    }
};

handler.help = ['play2'].map(v => v + " *<formato> <búsqueda>*");
handler.tags = ['downloader'];
handler.command = ['play', 'play2'];
handler.register = true;

export default handler;
