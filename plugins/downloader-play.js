import fg from 'api-dylux'
import { youtubedl, youtubedlv2 } from '@bochilteam/scraper'
import yts from 'yt-search'
import fetch from 'node-fetch' 

let handler = async (m, { conn, args, usedPrefix, text, command }) => {
    let lister = ["mp3", "yta", "audio", "ytv", "video", "vídeo", "mp4", "mp3doc", "ytadoc", "audiodoc", "mp4doc", "ytvdoc", "videodoc", "vídeodoc"]

    let [feature, ...searchTerms] = text.split(" ")
    if (!lister.includes(feature)) {
        return conn.reply(m.chat, `🚩 Ingresa el formato en que deseas descargar más el título de un video o música de YouTube.\n\nEjemplo : ${usedPrefix + command} *mp3* SUICIDAL-IDOL - ecstacy\n\nFormatos disponibles :\n${usedPrefix + command} *mp3*\n${usedPrefix + command} *mp3doc*\n${usedPrefix + command} *mp4*\n${usedPrefix + command} *mp4doc*`, m)
    }
    
    if (!searchTerms.length) {
        return conn.reply(m.chat, `🚩 Ingresa el título de un video o canción de YouTube.\n\n*Ejemplo:*\n*${usedPrefix + command}* Alan Walker - Sing Me To Sleep`, m)
    }

    await m.react('🕓')
    let searchQuery = searchTerms.join(" ")
    let res = await yts(searchQuery)
    let vid = res.videos[0]
    if (!vid) {
        return conn.reply(m.chat, `🚩 No se encontraron resultados para la búsqueda: ${searchQuery}`, m)
    }

    let txt = `*乂  Y O U T U B E  -  P L A Y*\n\n`
        + `✩   *Título* : ${vid.title}\n`
        + `✩   *Duración* : ${vid.timestamp}\n`
        + `✩   *Visitas* : ${vid.views}\n`
        + `✩   *Autor* : ${vid.author.name}\n`
        + `✩   *Publicado* : ${eYear(vid.ago)}\n`
        + `✩   *Url* : https://youtu.be/${vid.videoId}\n\n`
        + `*- ↻ El ${feature.includes("mp3") ? "audio" : "video"} se está enviando, espera un momento...*`

    await conn.sendFile(m.chat, vid.thumbnail, 'thumbnail.jpg', txt, m)

    try {
        let yt;
        let limit = feature.includes("mp4") ? 300 : 100;

        if (feature.includes("mp3")) {
            yt = await fg.yta(vid.url, '128kbps');
        } else if (feature.includes("mp4")) {
            yt = await fg.ytv(vid.url, '360p');
        } else {
            return;
        }

        let { title, dl_url, size } = yt;

        if (parseFloat(size) > limit) {
            return conn.reply(m.chat, `El archivo pesa más de ${limit} MB, se canceló la descarga.`, m);
        }

        let fileOptions = {
            caption: '',
            fileName: `${title}.${feature.includes("mp3") ? "mp3" : "mp4"}`,
            mimetype: feature.includes("mp3") ? 'audio/mpeg' : 'video/mp4',
        };

        if (feature.includes("doc")) {
            fileOptions = { ...fileOptions, document: { url: dl_url } };
        } else {
            fileOptions = { ...fileOptions, [feature.includes("mp3") ? "audio" : "video"]: { url: dl_url } };
        }

        await conn.sendMessage(m.chat, fileOptions, { quoted: m });
        await m.react('✅');
    } catch (err) {
        await m.react('✖️');
        conn.reply(m.chat, `🚩 Ocurrió un error durante la descarga.`, m);
        console.error(err);
    }
}

handler.help = ['play2'].map(v => v + " *<formato> <búsqueda>*")
handler.tags = ['downloader']
handler.command = ['play', 'play2']
handler.register = true 
export default handler

function eYear(txt) {
    if (!txt) return '×';
    if (txt.includes('month ago')) return `hace ${txt.replace("month ago", "").trim()} mes`;
    if (txt.includes('months ago')) return `hace ${txt.replace("months ago", "").trim()} meses`;
    if (txt.includes('year ago')) return `hace ${txt.replace("year ago", "").trim()} año`;
    if (txt.includes('years ago')) return `hace ${txt.replace("years ago", "").trim()} años`;
    return txt;
	}
