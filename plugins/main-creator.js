

let handler = async (m, { conn, usedPrefix, isOwner }) => {
    let vcard1 = `BEGIN:VCARD\nVERSION:3.0\nN:𝐀𝐋𝐃𝐀𝐈𝐑 👨🏻‍💻;;\nFN:𝐀𝐋𝐃𝐀𝐈𝐑 👨🏻‍💻\nORG:𝐂𝐑𝐄𝐀𝐃𝐎𝐑 𝐎𝐅𝐂 👁‍🗨\nTITLE:\nitem1.TEL;waid=51925015528:+51925015528\nitem1.X-ABLabel:𝐀𝐋𝐃𝐀𝐈𝐑 👨🏻‍💻\nX-WA-BIZ-DESCRIPTION:𝙳𝚄𝙳𝙰𝚂 𝙴𝚂𝙲𝚁𝙸𝙱𝙸𝚁𝙼𝙴 👇🏻\nX-WA-BIZ-NAME:𝐀𝐋𝐃𝐀𝐈𝐑 👨🏻‍💻\nEND:VCARD`;

    let vcard2 = `BEGIN:VCARD\nVERSION:3.0\nN:Kevib 🤖;;\nFN:Abraham PRO YT 🇲🇽\nORG:𝚂𝙾𝙿𝙾𝚁𝚃𝙴 𝙳𝙴 𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿 🐦‍🔥-🌐\nTITLE:\nitem1.TEL;waid=522482267952:+522482267952\nitem1.X-ABLabel:Abraham PRO YT 🇲🇽\nX-WA-BIZ-DESCRIPTION:Abraham PRO YT 🇲🇽\nX-WA-BIZ-NAME:Abraham PRO YT 🇲🇽\nEND:VCARD`;

    let vcard3 = `BEGIN:VCARD\nVERSION:3.0\nN:𝑲𝑬𝑽𝑰𝑵 𝑺𝑶𝑷𝑶𝑹𝑻;;\nFN:𝑲𝑬𝑽𝑰𝑵 𝑺𝑶𝑷𝑶𝑹𝑻\nORG:𝚂𝙾𝙿𝙾𝚁𝚃𝙴 𝙵𝙽𝚇 𝙱𝙾𝚃 🐦‍🔥\nTITLE:\nitem1.TEL;waid=5493624187763:+5493624187763\nitem1.X-ABLabel:𝑲𝑬𝑽𝑰𝑵 𝑺𝑶𝑷𝑶𝑹𝑻\nX-WA-BIZ-DESCRIPTION:𝑲𝑬𝑽𝑰𝑵 𝑺𝑶𝑷𝑶𝑹𝑻\nX-WA-BIZ-NAME:𝑲𝑬𝑽𝑰𝑵 𝑺𝑶𝑷𝑶𝑹𝑻\nEND:VCARD`;

    let vcard4 = `BEGIN:VCARD\nVERSION:3.0\nN:Ajolote 🤖;;\nFN:Jorge\nORG:𝚂𝚄𝙱𝙾𝚃 🌐\nTITLE:\nitem1.TEL;waid=51962506486:+51962506486\nitem1.X-ABLabel:JORGE\nX-WA-BIZ-DESCRIPTION:JORGE\nX-WA-BIZ-NAME:JORGE\nEND:VCARD`;


    await conn.sendMessage(m.chat, {
        contacts: {
            displayName: 'Contactos',
            contacts: [
                { vcard: vcard1 },
                { vcard: vcard2 }, 
                { vcard: vcard3 }, 
                { vcard: vcard4 }
            ]
        }
    }, { quoted: m });
}

handler.help = ['owner']
handler.tags = ['main']
handler.command = ['owner', 'creator', 'creador', 'dueño'] 

export default handler

