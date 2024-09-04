let handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply('Por favor, proporciona un enlace de grupo. Ejemplo: .joinfree https://chat.whatsapp.com/XXXXXXXXXXXXXX')

    try {
        // Unirse al grupo
        let inviteCode = args[0].split('https://chat.whatsapp.com/')[1];
        await conn.groupAcceptInvite(inviteCode);

        // Esperar un momento para que el bot se una al grupo
        await new Promise(resolve => setTimeout(resolve, 5000)); // 5 segundos de espera

        // Obtener metadata del grupo recién unido
        let groupMetadata = await conn.groupMetadata(inviteCode);
        
        // Verificar si el grupo tiene más de 25 participantes
        if (groupMetadata.participants.length < 25) {
            // Si el grupo tiene menos de 25 participantes, el bot abandona el grupo
            await conn.groupLeave(inviteCode);
            return m.reply(`El grupo ${groupMetadata.subject} tiene menos de 25 participantes. El bot ha abandonado el grupo.`);
        }
        
        // Enviar mensaje de confirmación en el grupo al que se unió
        let message = 'El bot se unió al grupo correctamente\n\nJOINFREE\n\nCANAL:\nhttps://whatsapp.com/channel/0029VafZvB6J3jv3qCnqNu3x';
        await conn.sendMessage(inviteCode, { text: message });
        
    } catch (e) {
        m.reply('Hubo un error al intentar unirse al grupo. Por favor, verifica el enlace o la validez del grupo.');
    }
}

handler.help = ['joinfree']
handler.tags = ['group']
handler.command = /^joinfree$/i
handler.group = false // Disponible en chats individuales
handler.admin = false // No requiere ser admin

export default handler
