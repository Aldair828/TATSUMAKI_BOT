let handler = async (m, { conn, text }) => {
    // Verificar si se especificaron el usuario y la cantidad
    let [mention, cantidad] = text.split(' ');
    cantidad = parseInt(cantidad);

    // Verificar si los parámetros son válidos
    if (!mention || isNaN(cantidad) || cantidad <= 0) {
        return conn.reply(m.chat, 'Uso incorrecto del comando. Ejemplo: .transferir @usuario 100', m);
    }

    // Obtener el ID del usuario que recibe la transferencia
    let who = mention.replace(/[@]/g, '') + '@s.whatsapp.net';

    // Verificar si el usuario tiene suficientes créditos
    let senderUser = global.db.data.users[m.sender];
    if (senderUser.limit < cantidad) {
        return conn.reply(m.chat, 'No tienes suficientes créditos para transferir esa cantidad.', m);
    }

    // Verificar si el destinatario existe en la base de datos
    let recipientUser = global.db.data.users[who];
    if (!recipientUser) {
        return conn.reply(m.chat, 'El usuario al que intentas transferir no existe o no está registrado.', m);
    }

    // Transferir los créditos
    senderUser.limit -= cantidad;
    recipientUser.limit += cantidad;

    // Responder con un mensaje de confirmación
    conn.reply(m.chat, `Has transferido ${cantidad} créditos a @${who.split('@')[0]}.`, m, {
        mentions: [who]
    });
};

handler.help = ['transferir @usuario <cantidad>'];
handler.tags = ['econ'];
handler.command = /^transferir$/i;
handler.group = true; // El comando solo funcionará en grupos

export default handler;
