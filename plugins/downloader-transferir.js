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

    // Verificar si el destinatario existe en la base de datos
    let recipientUser = global.db.data.users[who];
    if (!recipientUser) {
        return conn.reply(m.chat, 'El usuario al que intentas transferir no existe o no está registrado.', m);
    }

    // Verificar si el usuario que envía es VIP
    let senderUser = global.db.data.users[m.sender];
    let esVIP = senderUser.vipTime > (Date.now() - senderUser.lastVip);

    // Configurar límites de transferencia
    let maxTransfer = esVIP ? 500 : 100;

    // Restricción de tiempo para usuarios VIP
    let tiempoActual = Date.now();
    let tiempoUltimaTransferencia = senderUser.lastTransfer || 0;
    let tiempoRestante = (1800000 - (tiempoActual - tiempoUltimaTransferencia)) / 60000; // 30 minutos en milisegundos

    if (esVIP && tiempoActual - tiempoUltimaTransferencia < 1800000) {
        return conn.reply(m.chat, `Como usuario VIP, debes esperar ${tiempoRestante.toFixed(1)} minutos antes de poder transferir nuevamente.`, m);
    }

    // Condición para usuarios no VIP: deben tener suficientes créditos
    if (!esVIP && senderUser.limit < cantidad) {
        return conn.reply(m.chat, 'No tienes suficientes créditos para transferir esa cantidad.', m);
    }

    // Condición para usuarios VIP: pueden transferir hasta 500 créditos, incluso si no tienen créditos
    if (esVIP && cantidad > maxTransfer) {
        return conn.reply(m.chat, `Como usuario VIP, solo puedes transferir hasta ${maxTransfer} créditos.`, m);
    } else if (!esVIP && cantidad > maxTransfer) {
        return conn.reply(m.chat, `Solo puedes transferir hasta ${maxTransfer} créditos.`, m);
    }

    // Transferir los créditos
    senderUser.limit -= esVIP ? 0 : cantidad; // Si es VIP, no se reduce el límite
    recipientUser.limit += cantidad;

    // Registrar la hora de la transferencia para VIPs
    if (esVIP) {
        senderUser.lastTransfer = tiempoActual;
    }

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
