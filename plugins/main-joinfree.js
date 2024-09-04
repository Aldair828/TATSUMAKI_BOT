let handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply('Por favor, proporciona un enlace de grupo. Ejemplo: .joinfree https://chat.whatsapp.com/XXXXXXXXXXXXXX')

    try {
        // Unirse al grupo
        let result = await conn.groupAcceptInvite(args[0].split('https://chat.whatsapp.com/')[1]);
        
        // Obtener información del grupo recién unido
        let groupMetadata = await conn.groupMetadata(result);
        
        // Verificar si el grupo tiene más de 25 participantes
        if (groupMetadata.participants.length < 25) {
            await conn.groupLeave(result); // Dejar el grupo si tiene menos de 25 participantes
            return m.reply(`El grupo ${groupMetadata.subject} tiene menos de 25 participantes. No se unirá.`);
        }
        
        // Enviar mensaje de confirmación en el grupo al que se unió
        let message = 'El bot se unió al grupo correctamente\n\nJOINFREE\n\nCANAL:\nhttps://whatsapp.com/channel/0029VafZvB6J3jv3qCnqNu3x';
        await conn.sendMessage(result, { text: message });
        
    } catch (e) {
        m.reply('Hubo un error al intentar unirse al grupo. Por favor, verifica el enlace.');
    }
}

handler.help = ['joinfree']
handler.tags = ['group']
handler.command = /^joinfree$/i
handler.owner = true // Solo el owner puede usar este comando

export default handler
