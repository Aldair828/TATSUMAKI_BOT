let handler = async (m, { conn, text, usedPrefix, command }) => {
    let mentionedJid = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : null;
    if (!mentionedJid) {
        return conn.reply(m.chat, `Uso correcto: ${usedPrefix}${command} @usuario cantidad`, m);
    }

    let [_, limit] = text.trim().split(' ');
    limit = parseInt(limit);

    if (isNaN(limit) || limit <= 0) {
        return conn.reply(m.chat, 'Por favor, ingrese una cantidad válida de créditos.', m);
    }

    let user = global.db.data.users[mentionedJid];
    if (!user) {
        return conn.reply(m.chat, 'Usuario no encontrado o no registrado.', m);
    }

    if (command === 'agregarcreditos') {
        user.limit += limit;
        conn.reply(m.chat, `Se han agregado ${limit} créditos a ${conn.getName(mentionedJid)}. Ahora tiene ${user.limit} créditos.`, m);
    } else if (command === 'quitarcreditos') {
        if (user.limit < limit) {
            return conn.reply(m.chat, `El usuario no tiene suficientes créditos para quitar. Tiene ${user.limit} créditos.`, m);
        }
        user.limit -= limit;
        conn.reply(m.chat, `Se han quitado ${limit} créditos a ${conn.getName(mentionedJid)}. Ahora tiene ${user.limit} créditos.`, m);
    }
}

handler.help = ['agregarcreditos @usuario cantidad', 'quitarcreditos @usuario cantidad'];
handler.tags = ['owner'];
handler.command = /^(agregarcreditos|quitarcreditos)$/i;
handler.rowner = true; // Solo puede ser usado por el owner del bot

export default handler;
