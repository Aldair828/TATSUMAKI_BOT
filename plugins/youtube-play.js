import fg from 'api-dylux'
import { youtubedl, youtubedlv2 } from '@bochilteam/scraper'
import yts from 'yt-search'
import fetch from 'node-fetch' 

let handler = async (m, { conn, args, usedPrefix, text, command }) => {
    if (!text) return conn.reply(m.chat, `🚩 Ingresa el título de un video o música de YouTube.`, m)

    // Comienza por buscar el video en YouTube
    let res = await yts(text)
    let vid = res.videos[0]
    if (!vid) return conn.reply(m.chat, '🚩 No se encontró el video.', m)

    let q = '128kbps'
    let limit = 100

    const details = `✩ *Título:* ${vid.title}\n✩ *Duración:* ${vid.timestamp}\n✩ *Visitas:* ${vid.views}\n✩ *Autor:* ${vid.author.name}\n✩ *Publicado:* ${vid.ago}\n✩ *Url:* https://youtu.be/${vid.videoId}`

    try {
        let yt, dl_url, size;
        if (command === 'mp3' || command === 'mp3doc') {
            yt = await fg.yta(vid.url, q)
            dl_url = yt.dl_url
            size = yt.size

            if (size.split('MB')[0] >= limit) {
                return conn.reply(m.chat, `El archivo pesa más de ${limit} MB, se canceló la descarga.`, m).then(() => m.react('✖️'))
            }

            let options = {
                audio: { url: dl_url },
                mimetype: "audio/mp4",
                fileName: `${vid.title}.mp3`,
                quoted: m,
                contextInfo: {
                    forwardingScore: 200,
                    isForwarded: true,
                    externalAdReply: {
                        showAdAttribution: false,
                        title: `${vid.title}`,
                        body: `${vid.author.name}`,
                        mediaType: 2,
                        sourceUrl: `${vid.url}`,
                        thumbnail: await (await fetch(vid.thumbnail)).buffer()
                    }
                }
            }

            if (command === 'mp3doc') {
                options = {
                    document: { url: dl_url },
                    mimetype: "audio/mpeg",
                    fileName: `${vid.title}.mp3`,
                    quoted: m,
                    contextInfo: {
                        forwardingScore: 200,
                        isForwarded: true,
                        externalAdReply: {
                            showAdAttribution: false,
                            title: `${vid.title}`,
                            body: `${vid.author.name}`,
                            mediaType: 2,
                            sourceUrl: `${vid.url}`,
                            thumbnail: await (await fetch(vid.thumbnail)).buffer()
                        }
                    }
                }
            }

            await conn.sendMessage(m.chat, options, { quoted: m })
            await m.react('✅')

        } else if (command === 'mp4' || command === 'mp4doc') {
            yt = await fg.ytv(vid.url, '360p')
            dl_url = yt.dl_url
            size = yt.size

            if (size.split('MB')[0] >= limit) {
                return conn.reply(m.chat, `El archivo pesa más de ${limit} MB, se canceló la descarga.`, m).then(() => m.react('✖️'))
            }

            let options = {
                video: { url: dl_url },
                caption: `${vid.title}\n⇆ㅤㅤ◁ㅤㅤ❚❚ㅤㅤ▷ㅤㅤ↻\n00:15 ━━●────── ${vid.timestamp}`,
                quoted: m,
                contextInfo: {
                    forwardingScore: 200,
                    isForwarded: true,
                    externalAdReply: {
                        showAdAttribution: false,
                        title: `${vid.title}`,
                        body: `${vid.author.name}`,
                        mediaType: 2,
                        sourceUrl: `${vid.url}`,
                        thumbnail: await (await fetch(vid.thumbnail)).buffer()
                    }
                }
            }

            if (command === 'mp4doc') {
                options = {
                    document: { url: dl_url },
                    caption: `${vid.title}\n⇆ㅤㅤ◁ㅤㅤ❚❚ㅤㅤ▷ㅤㅤ↻\n00:15 ━━●────── ${vid.timestamp}`,
                    mimetype: 'video/mp4',
                    fileName: `${vid.title}.mp4`,
                    quoted: m,
                    contextInfo: {
                        forwardingScore: 200,
                        isForwarded: true,
                        externalAdReply: {
                            showAdAttribution: false,
                            title: `${vid.title}`,
                            body: `${vid.author.name}`,
                            mediaType: 2,
                            sourceUrl: `${vid.url}`,
                            thumbnail: await (await fetch(vid.thumbnail)).buffer()
                        }
                    }
                }
            }

            await conn.sendMessage(m.chat, options, { quoted: m })
            await m.react('✅')
        }
    } catch (error) {
        console.error(error)
        await conn.reply(m.chat, `☓ Ocurrió un error inesperado`, m).then(() => m.react('✖️'))
    }
}

handler.help = ["play"].map(v => v + " <formato> <búsqueda>")
handler.tags = ["downloader"]
handler.command = ['play', 'play2', 'mp3', 'mp4', 'mp3doc', 'mp4doc']
handler.register = true 
handler.star = 2
export default handler
