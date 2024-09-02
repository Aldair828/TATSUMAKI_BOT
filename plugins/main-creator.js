let handler = async (m, { conn, usedPrefix, isOwner, command, text }) => {
    // VCards para los contactos predeterminados
    let vcard1 = `BEGIN:VCARD\nVERSION:3.0\nN:𝐀𝐋𝐃𝐀𝐈𝐑 👨🏻‍💻;;\nFN:𝐀𝐋𝐃𝐀𝐈𝐑 👨🏻‍💻\nORG:𝐂𝐑𝐄𝐀𝐃𝐎𝐑 𝐎𝐅𝐂 👁‍🗨\nTITLE:\nitem1.TEL;waid=51925015528:+51925015528\nitem1.X-ABLabel:𝐀𝐋𝐃𝐀𝐈𝐑 👨🏻‍💻\nX-WA-BIZ-DESCRIPTION:𝙳𝚄𝙳𝙰𝚂 𝙴𝚂𝙲𝚁𝙸𝙱𝙸𝚁𝙼𝙴 👇🏻\nX-WA-BIZ-NAME:𝐀𝐋𝐃𝐀𝐈𝐑 👨🏻‍💻\nEND:VCARD`;

    let vcard2 = `BEGIN:VCARD\nVERSION:3.0\nN:Daniel 🤖;;\nFN:Abraham PRO YT 🇲🇽\nORG:𝚂𝙾𝙿𝙾𝚁𝚃𝙴 𝙳𝙴 𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿 🌐\nTITLE:\nitem1.TEL;waid=522482267952:+522482267952\nitem1.X-ABLabel:Abraham PRO YT 🇲🇽\nX-WA-BIZ-DESCRIPTION:Abraham PRO YT 🇲🇽\nX-WA-BIZ-NAME:Abraham PRO YT 🇲🇽\nEND:VCARD`;

    // Si el comando es 'owner' o variantes
    if (['owner', 'creator', 'creador', 'dueño'].includes(command)) {
        // Construir la lista de VCards con los owners actuales
        let ownersVcards = global.owner.map(owner => `BEGIN:VCARD\nVERSION:3.0\nN:Owner;;\nFN:Owner\nORG:Owner\nTEL;waid=${owner[0].replace('@s.whatsapp.net', '')}:${owner[0].replace('@s.whatsapp.net', '')}\nEND:VCARD`);

        // Enviar los contactos
        await conn.sendMessage(m.chat, {
            contacts: {
                displayName: 'Contactos',
                contacts: [
                    { vcard: vcard1 },
                    { vcard: vcard2 },
                    ...ownersVcards.map(vcard => ({ vcard }))
                ]
            }
        }, { quoted: m });
    } else if (command === 'addowner') {
        let newOwner = text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false;
        if (!newOwner) return conn.reply(m.chat, `${lenguajeGB['smsAvisoMG']()} *𝙐𝙎𝘼𝙍 𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 𝙀𝙎𝙏𝘼 𝙁𝙊𝙍𝙈𝘼*\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊 : ${usedPrefix}addowner @usuario`, m);

        if (!global.owner.find(owner => owner[0] === newOwner)) {
            global.owner.push([newOwner, m.mentionedJid[0] || 'Desconocido']);
            await conn.reply(m.chat, `${lenguajeGB['smsAvisoEG']()} *𝙉𝙐𝙀𝙑𝙊 𝙉𝙐𝙈𝙀𝙍𝙊 𝘼𝙂𝙍𝙀𝙂𝘼𝘿𝙊 𝘾𝙊𝙈𝙊 𝙊𝚆𝙉𝙀𝙍.*`, m);
        } else {
            await conn.reply(m.chat, `${lenguajeGB['smsAvisoFG']()} *𝙀𝙇 𝙉𝙐𝙈𝙀𝙍𝙊 𝙀𝙓𝙄𝙎𝙏𝙀 𝙀𝙉 𝙇𝘼 𝙇𝙄𝙎𝙏𝘼 𝘿𝙀 𝙊𝙒𝙉𝙀𝙍𝙎.*`, m);
        }
    }
}

handler.help = ['owner', 'addowner'];
handler.tags = ['main'];
handler.command = /^(owner|creator|creador|dueño|addowner)$/i;
handler.rowner = true;

export default handler;
