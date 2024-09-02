const handler = async (m, { conn, text, command, usedPrefix }) => {
    // Verificar si el mensaje es en un grupo
    if (m.isGroup) {
        let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text;
        const user = global.db.data.users[who] || { warn: 0 };
        const usuario = conn.user.jid.split`@`[0] + '@s.whatsapp.net';
        const bot = global.db.data.settings[conn.user.jid] || {};
        const dReason = 'Sin motivo';
        const msgtext = text || dReason;
        const sdms = msgtext.replace(/@\d+-?\d* /g, '');
        const warntext = `*❌ Etiquete a una persona o responda a un mensaje del grupo para advertir al usuario*\n\n*Ejemplo:*\n*${usedPrefix + command} @tag*`;

        if (!who) {
            return m.reply(warntext, m.chat, { mentions: conn.parseMention(warntext) });
        }

        for (let i = 0; i < global.owner.length; i++) {
            let ownerNumber = global.owner[i][0];
            if (usuario.replace(/@s\.whatsapp\.net$/, '') === ownerNumber) {
                let aa = ownerNumber + '@s.whatsapp.net';
                await conn.reply(m.chat, `…`, m, { mentions: [aa] });
                return;
            }
        }

        user.warn = (user.warn || 0) + 1;

        // Enviar el mensaje de advertencia
        await m.reply(`
𝘼𝘿𝙑𝙀𝙍𝙏𝙀𝙉𝘾𝙄𝘼𝙎 ⚠️

@${who.split`@`[0]} 𝙍𝙀𝘾𝙄𝘽𝙄𝙊́ 𝙐𝙉𝘼 𝘼𝘿𝙑𝙀𝙍𝙏𝙀𝙉𝘾𝙄𝘼

𝙈𝙊𝙏𝙄𝙑𝙊: ${sdms}

𝘼𝘿𝙑𝙀𝙍𝙏𝙀𝙉𝘾𝙄𝘼𝙎: ${user.warn}/4
        `.trim(), null, { mentions: [who] });

        // Si el usuario alcanza 4 advertencias, eliminar del grupo
        if (user.warn >= 4) {
            user.warn = 0;
            await m.reply(`𝚃𝙀 𝙇𝙊 𝙰𝙳𝚅𝙀𝚁𝚃𝙄 𝚅𝙰𝚁𝙸𝙰𝚂 𝚅𝙴𝙲𝙴𝚂!!\n*@${who.split`@`[0]}* 𝚂𝚄𝙿𝙀𝚁𝙰𝚂𝚃𝙴 𝙻𝙰𝚂 *4* 𝙰𝙳𝚅𝙀𝚁𝚃𝙴𝙽𝘾𝙄𝘼𝚂, 𝙰𝙷𝙾𝚁𝙰 𝚂𝙴𝚁𝙰𝚂 𝙴𝙻𝙸𝙼𝙸𝙽𝙰𝙳𝙾/𝙰 👽`, null, { mentions: [who] });
            await conn.groupParticipantsUpdate(m.chat, [who], 'remove');
        }

    } else {
        m.reply('Este comando solo se puede usar en grupos.');
    }
};

handler.command = ['advertir', 'advertencia', 'warn', 'warning'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
export default handler;
