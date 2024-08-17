let handler = async (m, { conn, usedPrefix, isOwner }) => {
let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:𝐀𝐋𝐃𝐀𝐈𝐑 👨🏻‍💻;;\nFN:𝐀𝐋𝐃𝐀𝐈𝐑 👨🏻‍💻\nORG:𝐀𝐋𝐃𝐀𝐈𝐑 👨🏻‍💻\nTITLE:\nitem1.TEL;waid=51925015528:+51925015528\nitem1.X-ABLabel:𝐀𝐋𝐃𝐀𝐈𝐑 👨🏻‍💻\nX-WA-BIZ-DESCRIPTION:𝙳𝚄𝙳𝙰𝚂 𝙴𝚂𝙲𝚁𝙸𝙱𝙸𝚁𝙼𝙴 👇🏻\nX-WA-BIZ-NAME:𝐀𝐋𝐃𝐀𝐈𝐑 👨🏻‍💻\nEND:VCARD`
await conn.sendMessage(m.chat, { contacts: { displayName: 'おDanịel.xyz⁩', contacts: [{ vcard }] }}, {quoted: m})
}
handler.help = ['owner']
handler.tags = ['main']
handler.command = ['owner', 'creator', 'creador', 'dueño'] 

export default handler
