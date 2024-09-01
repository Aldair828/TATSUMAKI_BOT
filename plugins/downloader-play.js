let handler = async (m, { text, usedPrefix, command, conn }) => {
    try {
        if (!text) throw `_* DESCARGAS (￣へ￣ )*_\n\n*[ ℹ️ ] Hace falta el título o enlace del video de YouTube.*\n\n*[ 💡 ] Ejemplo:* _${usedPrefix + command} Good Feeling - Flo Rida_`;

        await conn.reply(m.chat, `*[ ⏳ ] Buscando el video...*\n\n*Por favor espera...*`, m);

        let vid = (await conn.search(text)).videos[0] || {};
        if (!vid) throw '*[ ⚠️ ] No se encontró ningún video.*';

        let { title, description, thumbnail, videoId, durationH, viewH, publishedTime } = vid;
        let url = `https://www.youtube.com/watch?v=${videoId}`;
        let buttons = [
            { buttonId: `.ytmp3 ${url}`, buttonText: { displayText: 'Audio 🎵' }, type: 1 },
            { buttonId: `.ytmp4 ${url}`, buttonText: { displayText: 'Video 🎥' }, type: 1 }
        ];

        let buttonMessage = {
            image: { url: thumbnail },
            caption: `*✅ Título:* ${title}\n*🗒️ Descripción:* ${description}\n*⏳ Duración:* ${durationH}\n*👀 Visitas:* ${viewH}\n*📅 Publicado:* ${publishedTime}`,
            footer: 'Elige una opción para descargar:',
            buttons: buttons,
            headerType: 4
        };

        await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, `*[ ⚠️ ] Error al procesar el comando. Verifica el enlace o intenta de nuevo más tarde.*`, m);
    }
};

handler.command = ['play', 'play5', 'play6'];
export default handler;
