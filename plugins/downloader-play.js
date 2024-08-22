import ytdl from 'ytdl-core';
import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, 'Por favor, ingresa el nombre de la canción que deseas buscar.', m);
  
  // Busca el video en YouTube
  let res = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(text)}`);
  let json = await res.text();
  let id = json.match(/"videoId":"(.*?)"/);

  if (!id) {
    conn.reply(m.chat, 'No se encontró la canción.', m);
    return;
  }

  let url = 'https://www.youtube.com/watch?v=' + id[1];

  try {
    // Descargar y enviar el audio
    let info = await ytdl.getInfo(url);
    let title = info.videoDetails.title;

    conn.reply(m.chat, `Buscando la canción: *${title}*`, m);

    ytdl(url, { filter: 'audioonly' }).pipe(conn.sendMessage(m.chat, { audio: { url: url }, mimetype: 'audio/mp4' }, { quoted: m }));

  } catch (e) {
    console.error(e);
    conn.reply(m.chat, 'Hubo un error al procesar tu solicitud. Por favor, intenta nuevamente.', m);
  }
}

handler.help = ['play <nombre de la canción>'];
handler.tags = ['music'];
handler.command = /^play$/i;

export default handler;
