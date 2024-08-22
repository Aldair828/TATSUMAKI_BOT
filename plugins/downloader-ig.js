import { igdl } from 'ruhend-scraper'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return conn.reply(m.chat, `🍟 Ingresa un enlace de Instagram junto al comando.\n\nEjemplo:\n${usedPrefix + command} https://www.instagram.com/p/xyz/`, m)
    }

    try {
        let res = await igdl(args[0])
        let txt = `╭─⬣「 *Instagram Download* 」⬣\n`
        txt += `│  ≡◦ *📄 Tipo* : ${res.type}\n`
        txt += `│  ≡◦ *💬 Descripción* : ${res.description || "No disponible"}\n`
        txt += `╰─⬣`

        for (let media of res.data) {
            // Pausa de 2 segundos entre cada archivo enviado
            await new Promise(resolve => setTimeout(resolve, 2000))
            if (media.url.endsWith('.mp4')) {
                await conn.sendMessage(m.chat, { video: { url: media.url }, caption: txt }, { quoted: m })
            } else if (media.url.endsWith('.jpg') || media.url.endsWith('.jpeg') || media.url.endsWith('.png')) {
                await conn.sendMessage(m.chat, { image: { url: media.url }, caption: txt }, { quoted: m })
            }
        }
    } catch (e) {
        console.error(e)
        conn.reply(m.chat, '🚩 Ocurrió un error al intentar descargar el contenido de Instagram.', m)
    }
}

handler.command = ['instagram', 'ig']
handler.tags = ['descargas']
handler.help = ['instagram <url ig>']
handler.estrellas = 1
handler.group = true
handler.register = true

export default handler
