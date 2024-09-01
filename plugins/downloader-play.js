import axios from 'axios';
import fg from 'api-dylux';
import yts from 'yt-search';

const handler = async (m, { conn, command, args, text, usedPrefix }) => {
    if (!text) throw `_* DESCARGAS (￣へ ￣ )*_\n\n*[ ℹ️ ] Hace falta el título o enlace del video de YouTube.*\n\n*[ 💡 ] Ejemplo:* _${usedPrefix + command} Good Feeling - Flo Rida_`;

    try {
        const yt_play = await search(args.join(' '));
        const { title, thumbnail, url } = yt_play[0];

        const caption = `_*DESCARGAS - MEGUMIN 🔥*_\n\n*Título:* ${title}\n*Enlace:* ${url}\n\n*[ ℹ️ ] Descargando ${command === 'play' ? 'audio' : 'video'}...*`;
        await conn.sendMessage(m.chat, { image: { url: thumbnail }, caption }, { quoted: m });

        let source, buffer;

        if (command === 'play') {
            ({ source } = await fg.mp3(url));
            buffer = await getBuffer(source);
        } else if (command === 'play2') {
            ({ source } = await fg.mp4(url));
            buffer = await getBuffer(source);
        }

        if (!buffer || buffer.byteLength === 0) {
            throw new Error('No se pudo descargar el archivo correctamente.');
        }

        const sizeMB = (buffer.byteLength / (1024 * 1024)).toFixed(2);

        if (sizeMB >= 100) {
            await conn.sendMessage(m.chat, { text: `[ ℹ️ ] El archivo es muy grande para enviarse directamente, descárgalo aquí: ${source}` }, { quoted: m });
        } else {
            const messageOptions = command === 'play' 
                ? { audio: buffer, mimetype: 'audio/mpeg', fileName: `${title}.mp3` } 
                : { video: buffer, mimetype: 'video/mp4', fileName: `${title}.mp4` };
            
            await conn.sendMessage(m.chat, messageOptions, { quoted: m });
        }

    } catch (error) {
        console.log('Error:', error.message || error);
        throw '*[ ℹ️ ] Ocurrió un error. Por favor, inténtalo de nuevo más tarde.*';
    }
};

handler.command = ['play', 'play2'];
export default handler;

async function search(query) {
    const searchResults = await yts.search({ query, hl: 'es', gl: 'ES' });
    return searchResults.videos;
}

async function getBuffer(url) {
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    return res.data;
}
