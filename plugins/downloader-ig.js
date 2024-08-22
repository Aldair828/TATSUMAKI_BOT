import { igdl } from 'ruhend-scraper'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return conn.reply(m.chat, `🍟 Ingresa un enlace de Instagram junto al comando.\n\nEjemplo:\n${usedPrefix + command} https://www.instagram.com/p/xyz/`, m)
    }

    try {
        // Reacción inicial para confirmar que el comando se está procesando
        await m.react('⏳')

        // Realizar la descarga usando el scraper
        let res = await igdl(args[0])

        // Verifica si se obtuvo una respuesta válida
        if (!res || !res.data || res.data.length === 0) {
            await m.react('❌')
            return conn.reply(m.chat, '🚩 No se encontró ningún contenido para descargar.', m)
        }

        let txt = `╭─⬣「 *Instagram Download* 」⬣\n`
        txt += `│  ≡◦ *📄 Tipo* : ${res.type}\n`
        txt += `│  ≡◦ *💬 Descripción* : ${res.description || "No disponible"}\n`
        txt += `╰─⬣`

        for (let media of res.data) {
            // Pausa de 2 segundos entre cada archivo enviado
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Enviar video o imagen basado en la URL
            if (media.url.endsWith('.mp4')) {
                await conn.sendMessage(m.chat, { video: { url: media.url }, caption: txt }, { quoted: m })
            } else if (media.url.endsWith('.jpg') || media.url.endsWith('.jpeg') || media.url.endsWith('.png')) {
                await conn.sendMessage(m.chat, { image: { url: media.url }, caption: txt }, { quoted: m })
            }
        }

        // Reaccionar con éxito
        await m.react('✅')
    } catch (e) {
        console.error(e)
        await m.react('❌')
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
