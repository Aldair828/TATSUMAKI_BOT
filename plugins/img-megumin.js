let handler = async (m, { conn, isOwner }) => {
    if (!isOwner) {
        return conn.reply(m.chat, 'Este comando solo puede ser utilizado por el owner.', m);
    }

    let users = Object.entries(global.db.data.users);

    users.forEach(([jid, user]) => {
        user.limit = 20; // Restablece los créditos a 20
    });

    conn.reply(m.chat, 'Se han reiniciado todos los créditos a 20 para todos los usuarios.', m);
}

handler.help = ['topcero'];
handler.tags = ['econ'];
handler.command = /^topcero$/i;
handler.rowner = true; // Solo el owner puede usar este comando

export default handler;
