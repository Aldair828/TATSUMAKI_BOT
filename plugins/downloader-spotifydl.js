// Handler para banear y desbanear al bot
let handler = async (m, { conn, usedPrefix, command }) => {
    // Verifica si el comando es .ban o .unban
    if (command === 'ban') {
        // Agregar el ID del grupo y el ID del bot al baneo
        let groupId = m.chat;
        if (!global.db.data.groups) global.db.data.groups = {};
        if (!global.db.data.groups[groupId]) global.db.data.groups[groupId] = {};

        global.db.data.groups[groupId].banned = true;
        conn.reply(m.chat, '*El bot ha sido baneado en este grupo y no enviará mensajes hasta que se desbanee.*', m);
    } else if (command === 'unban') {
        // Quitar el baneo del bot
        let groupId = m.chat;
        if (!global.db.data.groups) global.db.data.groups = {};
        if (!global.db.data.groups[groupId]) global.db.data.groups[groupId] = {};

        global.db.data.groups[groupId].banned = false;
        conn.reply(m.chat, '*El bot ha sido desbaneado y puede enviar mensajes nuevamente.*', m);
    }
}

// Middleware para manejar los mensajes
let messageHandler = async (m, { conn }) => {
    let groupId = m.chat;
    if (!global.db.data.groups || !global.db.data.groups[groupId] || global.db.data.groups[groupId].banned) {
        // Si el grupo está en la lista de baneos o el bot está baneado, no envíe mensajes
        if (m.fromMe) return; // Si el mensaje es del bot, simplemente no hacer nada
        return; // No enviar el mensaje si está baneado
    }
    // Si el grupo no está baneado, procesar el mensaje normalmente
}

// Configura los comandos y el middleware
handler.help = ['ban', 'unban']
handler.tags = ['admin']
handler.command = /^ban|unban$/i
handler.group = true
handler.admin = true // Solo administradores pueden usar estos comandos

export { handler, messageHandler }
