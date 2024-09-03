let handler = async (m, { conn, command, text, participants }) => {
    let mentionedJid = m.mentionedJid[0];
    if (!mentionedJid) {
        return conn.reply(m.chat, `Por favor, menciona al usuario que deseas ${command === 'mute' ? 'mutear' : 'desmutear'}.`, m);
    }

    // Comprobar si el usuario es admin
    let isAdmin = participants.find(p => p.admin && p.id === mentionedJid);
    if (isAdmin) {
        return conn.reply(m.chat, `No puedes ${command === 'mute' ? 'mutear' : 'desmutear'} a un administrador.`, m);
    }

    // Realizar la acción de mutear o desmutear
    let action = command === 'mute' ? 'mute' : 'unmute';
    await conn.groupParticipantsUpdate(m.chat, [mentionedJid], action);
    conn.reply(m.chat, `El usuario @${mentionedJid.split('@')[0]} ha sido ${command === 'mute' ? 'silenciado' : 'desilenciado'}.`, m, {
        mentions: [mentionedJid]
    });
};

handler.help = ['mute @usuario', 'unmute @usuario'];
handler.tags = ['group'];
handler.command = /^(mute|unmute)$/i;
handler.group = true; // Solo funcionará en grupos
handler.admin = true; // Requiere ser admin

export default handler;
