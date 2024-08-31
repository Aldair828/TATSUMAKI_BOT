import fetch from 'node-fetch'

let handler  = async (m, { conn, usedPrefix, command }) => {
let img = await (await fetch(`https://tinyurl.com/2xvnwtnq`)).buffer()
const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
let txt = `*Hola!, te invito a unirte a los grupos oficiales de la Bot para convivir con la comunidad :D*

𝙵𝙴𝙽𝙸𝚇_𝙱𝙾𝚃 🐦‍🔥

*🎌* ${group}

*꒷꒦꒷꒷꒦꒷꒦꒷꒷꒦꒷꒦꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷꒦꒷꒦꒷꒦꒷꒦꒷*

𝙵𝙴𝙽𝙸𝚇_𝙱𝙾𝚃 🐦‍🔥

Canal :
*🏷️* ${canal}

> 🚩 ${textbot}`
await conn.sendFile(m.chat, img, "Thumbnail.jpg", txt, m, null, rcanal)
}
handler.help = ['grupos']
handler.tags = ['main']
handler.command = /^(grupos)$/i
export default handler
