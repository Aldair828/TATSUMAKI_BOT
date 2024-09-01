import fg from 'api-dylux';
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

        let yt;
        if (format === 'mp3') {
            yt = await fg.yta(vid.url, '128kbps');
        } else if (format === 'mp4') {
            yt = await fg.ytv(vid.url, '360p');
        } else {
            return conn.reply(m.chat, `🚩 Formato no válido. Usa *mp3* o *mp4*.`, m);
        }

        let { dl_url, size, title } = yt;
        let limit = format === 'mp3' ? 100 : 300;

        if (parseFloat(size) > limit) {
            return conn.reply(m.chat, `🚩 El archivo pesa más de ${limit} MB, se canceló la descarga.`, m);
        }

        let messageOptions = format === 'mp3'
            ? { audio: { url: dl_url }, fileName: `${title}.mp3`, mimetype: 'audio/mp4' }
            : { document: { url: dl_url }, fileName: `${title}.mp4`, mimetype: 'video/mp4' };

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
