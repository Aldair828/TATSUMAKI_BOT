let handler = async (m, { conn, isOwner }) => {
    if (!isOwner) {
        return conn.reply(m.chat, 'Este comando solo puede ser utilizado por el owner.', m);
    }

    let users = Object.entries(global.db.data.users);

    users.forEach(([jid, user]) => {
        user.limit = 20; // Restablece los créditos a 20
        user.bank = 0;   // Reinicia los créditos en el banco a 0
        // Elimina otros posibles atributos relacionados con créditos
        if (user.extraCredits) user.extraCredits = 0; // Si existe un campo extra de créditos
        if (user.profileCredits) user.profileCredits = 0; // Si existe un campo de créditos en el perfil
        // Añadir aquí cualquier otro campo relevante que deba reiniciarse
    });

    conn.reply(m.chat, 'Se han reiniciado todos los créditos a 20 y se han eliminado todos los créditos adicionales para todos los usuarios.', m);
}

handler.help = ['topcero'];
handler.tags = ['econ'];
handler.command = /^topcero$/i;
handler.rowner = true; // Solo el owner puede usar este comando

export default handler;
