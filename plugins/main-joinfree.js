let handler = async (m, { conn, args }) => {
    if (!args[0]) {
        return m.reply('Por favor, proporciona un enlace de grupo. Ejemplo: .joinfree https://chat.whatsapp.com/XXXXXXXXXXXXXX\n\nAviso: el bot solo se unirá si el grupo tiene más de 30 participantes.');
    }

    try {
        // Obtener el código de invitación del enlace
        let inviteCode = args[0].split('https://chat.whatsapp.com/')[1];
        
        // Verificar el enlace de invitación
        let groupInfo = await conn.queryInvite(inviteCode);

        // Verificar si el grupo tiene más de 30 participantes
        if (groupInfo.size < 30) {
            return m.reply(`El grupo ${groupInfo.subject} tiene menos de 30 participantes. No se unirá.`);
        }

        // Unirse al grupo
        let result = await conn.groupAcceptInvite(inviteCode);

        // Obtener información del grupo recién unido
        let groupMetadata = await conn.groupMetadata(result);

        // Enviar mensaje de confirmación en el grupo al que se unió
        let message = 'El bot se unió al grupo correctamente\n\nEstará en el grupo durante 48 horas\n\nJOINFREE\n\nCANAL:\nhttps://whatsapp.com/channel/0029VafZvB6J3jv3qCnqNu3x';
        await conn.sendMessage(result, { text: message });

        // Establecer un temporizador para dejar el grupo después de 48 horas
        setTimeout(async () => {
            await conn.sendMessage(result, { text: 'El bot se retirará del grupo ahora.' });
            await conn.groupLeave(result);
        }, 48 * 60 * 60 * 1000); // 48 horas en milisegundos

    } catch (e) {
        m.reply('Hubo un error al intentar unirse al grupo. Por favor, verifica el enlace.');
    }
}

handler.help = ['joinfree'];
handler.tags = ['group'];
handler.command = /^joinfree$/i;

export default handler;
