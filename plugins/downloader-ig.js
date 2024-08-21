let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender];
    let who = m.mentionedJid && m.mentionedJid[0];

    // Comando para invitar a ser pareja
    if (command === 'pareja') {
        if (!who) return conn.reply(m.chat, `Etiqueta a alguien para invitar a ser tu pareja.\n\nUso: ${usedPrefix}pareja @usuario`, m);
        
        if (user.pareja) return conn.reply(m.chat, `Ya tienes pareja con @${user.pareja.split('@')[0]}. Usa ${usedPrefix}romperpareja para terminar la relación.`, m, { mentions: [user.pareja] });

        let target = global.db.data.users[who];
        if (target.pareja) return conn.reply(m.chat, `@${who.split('@')[0]} ya tiene una pareja.`, m, { mentions: [who] });

        conn.reply(who, `@${m.sender.split('@')[0]} quiere ser tu pareja. Responde con ${usedPrefix}aceptar o ${usedPrefix}rechazar.`, m, { mentions: [m.sender] });

        // Guardar la solicitud en una propiedad temporal
        target.parejaSolicitud = m.sender;
    }

    // Comando para aceptar o rechazar la solicitud de pareja
    if (command === 'aceptar' || command === 'rechazar') {
        if (!user.parejaSolicitud) return conn.reply(m.chat, `No tienes ninguna solicitud de pareja pendiente.`, m);

        let requester = global.db.data.users[user.parejaSolicitud];

        if (command === 'aceptar') {
            user.pareja = user.parejaSolicitud;
            requester.pareja = m.sender;
            conn.reply(m.chat, `¡Felicidades! Ahora eres pareja de @${user.pareja.split('@')[0]}.`, m, { mentions: [user.pareja] });
        } else if (command === 'rechazar') {
            conn.reply(m.chat, `Has rechazado la solicitud de @${user.parejaSolicitud.split('@')[0]}.`, m, { mentions: [user.parejaSolicitud] });
        }

        // Limpiar la solicitud
        delete user.parejaSolicitud;
    }

    // Comando para romper con la pareja actual
    if (command === 'romperpareja') {
        if (!user.pareja) return conn.reply(m.chat, `No tienes pareja actualmente.`, m);

        let pareja = global.db.data.users[user.pareja];
        pareja.pareja = null;
        user.pareja = null;

        conn.reply(m.chat, `Has roto la relación con @${user.pareja.split('@')[0]}.`, m, { mentions: [user.pareja] });
    }

    // Comando para mostrar la pareja actual del usuario
    if (command === 'mipareja') {
        if (!user.pareja) return conn.reply(m.chat, `No tienes pareja actualmente.`, m);

        conn.reply(m.chat, `Tu pareja actual es @${user.pareja.split('@')[0]}.`, m, { mentions: [user.pareja] });
    }
};

handler.help = ['pareja @user', 'aceptar', 'rechazar', 'romperpareja', 'mipareja'];
handler.tags = ['social'];
handler.command = /^(pareja|aceptar|rechazar|romperpareja|mipareja)$/i;
handler.register = true;

export default handler;
