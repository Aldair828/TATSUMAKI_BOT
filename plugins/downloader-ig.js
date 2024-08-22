import { igdl } from 'ruhend-scraper'
import axios from 'axios'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        m.reply(`🍟 Ingresa un enlace del vídeo de Instagram junto al comando.\n\nEjemplo:\n${usedPrefix + command} https://www.instagram.com/p/CO4JbLJHqxt/`)
        return
    }

    try {
        let res = await igdl(args[0])
        let { title, duration, thumbnail, size, quality, url } = res.data[0]

        let txt = `╭─⬣「 *Instagram Download* 」⬣\n`
        txt += `│  ≡◦ *📚 Título* : ${title}\n`
        txt += `│  ≡◦ *🕜 Duración* : ${duration} Segundos\n`
        txt += `│  ≡◦ *🪴 Calidad* : ${quality}\n`
        txt += `│  ≡◦ *🌵 Tamaño* : ${convertBytesToMB(size)}\n`
        txt += `╰─⬣`

        await conn.sendMessage(m.chat, { video: { url }, caption: txt }, { quoted: m })
    } catch (e) {
        try {
            const api = await fetch(`https://api-starlights-team.koyeb.app/api/instagram?url=${args[0]}`)
            const data = await api.json()

            if (data.status) {
                const { title, duration, quality, url } = data.data
                let txt = `╭─⬣「 *Instagram Download* 」⬣\n`
                txt += `│  ≡◦ *📚 Título* : ${title}\n`
                txt += `│  ≡◦ *🕜 Duración* : ${duration} Segundos\n`
                txt += `│  ≡◦ *🪴 Calidad* : ${quality}\n`
                txt += `╰─⬣`

                await conn.sendMessage(m.chat, { video: { url }, caption: txt }, { quoted: m })
            }
        } catch (e) {
            try {
                const api1 = await fetch(`https://delirius-api-oficial.vercel.app/api/instagram?url=${args[0]}`)
                const data1 = await api1.json()

                if (data1.status) {
                    const { title, duration, size, quality, url } = data1.data
                    let txt = `╭─⬣「 *Instagram Download* 」⬣\n`
                    txt += `│  ≡◦ *📚 Título* : ${title}\n`
                    txt += `│  ≡◦ *🕜 Duración* : ${duration} Segundos\n`
                    txt += `│  ≡◦ *🪴 Calidad* : ${quality}\n`
                    txt += `│  ≡◦ *🌵 Tamaño* : ${convertBytesToMB(size)}\n`
                    txt += `╰─⬣`

                    await conn.sendMessage(m.chat, { video: { url }, caption: txt }, { quoted: m })
                }
            } catch (e) {
                m.reply('🚩 Error al procesar el enlace de Instagram.')
            }
        }
    }
}

handler.help = ['instagram <url ig>']
handler.tags = ['downloader']
handler.command = ['instagram', 'ig', 'instagramdl', 'instadl']
handler.register = true

export default handler

function convertBytesToMB(bytes) {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
    }
