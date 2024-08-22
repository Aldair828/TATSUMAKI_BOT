import Scraper from 'ruhend-scraper'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return conn.reply(m.chat, `🍟 Ingresa un enlace de Instagram junto al comando.\n\nEjemplo:\n${usedPrefix + command} https://www.instagram.com/p/xyz/`, m)
    }

    try {
        let res = await Scraper.igdl(args[0])
        let txt = `╭─⬣「 *Instagram Download* 」⬣\n`
        txt += `│  ≡◦ *📄 Tipo* : ${res.type}\n`
        txt += `│  ≡◦ *💬 Descripción* : ${res.description || "No disponible"}\n`
        txt += `╰─⬣`

        for (let media of res.data) {
            await conn.sendMessage(m.chat, { video: { url: media.url }, caption: txt }, { quoted: m })
        }
    } catch {
        try {
            conn.reply(m.chat, '🚩 Ocurrió un error al intentar descargar el video.', m)
        } catch {
            console.error('Error al enviar el mensaje de error.')
        }
    }
}

handler.command = ['instagram', 'ig']
handler.tags = ['descargas']
handler.help = ['instagram <url ig>']
handler.estrellas = 1
handler.group = true
handler.register = true

export default handler
