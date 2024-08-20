let handler = async (m, { conn, text, usedPrefix }) => {
    let mentionedJid = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : null;
    if (!mentionedJid) {
        return conn.reply(m.chat, `Uso correcto: ${usedPrefix}agregarcreditos @usuario cantidad`, m);
    }

    let [_, limit] = text.trim().split(' ');
    limit = parseInt(limit);

    if (isNaN(limit) || limit <= 0) {
        return conn.reply(m.chat, 'Por favor, ingrese una cantidad válida de créditos a agregar.', m);
    }

    let user = global.db.data.users[mentionedJid];
    if (!user) {
        return conn.reply(m.chat, 'Usuario no encontrado o no registrado.', m);
    }

    user.limit += limit;
    conn.reply(m.chat, `Se han agregado ${limit} créditos a ${conn.getName(mentionedJid)}. Ahora tiene ${user.limit} créditos.`, m);
}

handler.help = ['agregarcreditos @usuario cantidad'];
handler.tags = ['owner'];
handler.command = /^agregarcreditos$/i;
handler.rowner = true; // Solo puede ser usado por el owner del bot

export default handler;
