let handler = async (m, { conn, args }) => {
    if (!args[0]) return m.reply('Por favor, proporciona un enlace de grupo. Ejemplo: .joinfree https://chat.whatsapp.com/XXXXXXXXXXXXXX')

    try {
        let result = await conn.groupAcceptInvite(args[0].split('https://chat.whatsapp.com/')[1]);
        m.reply('El bot se unió al grupo correctamente\n\nJOINFREE\n\nCANAL:\nhttps://whatsapp.com/channel/0029VafZvB6J3jv3qCnqNu3x');
    } catch (e) {
        m.reply('Hubo un error al intentar unirse al grupo. Por favor, verifica el enlace.');
    }
}

handler.help = ['joinfree']
handler.tags = ['group']
handler.command = /^joinfree$/i
handler.owner = true // Solo el owner puede usar este comando

export default handler
