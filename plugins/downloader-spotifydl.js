// Handler para banear y desbanear usuarios
let handler = async (m, { conn, usedPrefix, command }) => {
    // Verificar si el comando es .ban o .unban
    if (command === 'ban') {
        let userToBan = m.text.split(' ')[1]; // Extrae el número del mensaje
        if (!userToBan) return conn.reply(m.chat, 'Uso: .ban [número de usuario]', m);

        // Asegúrate de que la base de datos de baneos existe
        if (!global.db.data.bannedUsers) global.db.data.bannedUsers = [];
        
        // Agregar el usuario a la lista de baneos
        if (!global.db.data.bannedUsers.includes(userToBan)) {
            global.db.data.bannedUsers.push(userToBan);
            conn.reply(m.chat, `*Usuario ${userToBan} ha sido baneado y no recibirá respuestas del bot.*`, m);
        } else {
            conn.reply(m.chat, 'Este usuario ya está baneado.', m);
        }
    } else if (command === 'unban') {
        let userToUnban = m.text.split(' ')[1]; // Extrae el número del mensaje
        if (!userToUnban) return conn.reply(m.chat, 'Uso: .unban [número de usuario]', m);

        // Asegúrate de que la base de datos de baneos existe
        if (!global.db.data.bannedUsers) global.db.data.bannedUsers = [];
        
        // Eliminar el usuario de la lista de baneos
        if (global.db.data.bannedUsers.includes(userToUnban)) {
            global.db.data.bannedUsers = global.db.data.bannedUsers.filter(user => user !== userToUnban);
            conn.reply(m.chat, `*Usuario ${userToUnban} ha sido desbaneado y recibirá respuestas del bot nuevamente.*`, m);
        } else {
            conn.reply(m.chat, 'Este usuario no está baneado.', m);
        }
    }
}

// Middleware para manejar los mensajes de usuarios baneados
let messageHandler = async (m, { conn }) => {
    let sender = m.sender.split('@')[0];
    if (!global.db.data.bannedUsers) global.db.data.bannedUsers = [];
    
    // Si el usuario está baneado, no responder
    if (global.db.data.bannedUsers.includes(sender)) {
        if (m.fromMe) return; // Si el mensaje es del bot, simplemente no hacer nada
        return; // No enviar respuesta si el usuario está baneado
    }
    
    // Procesar el mensaje normalmente si el usuario no está baneado
}

// Configura los comandos y el middleware
handler.help = ['ban', 'unban']
handler.tags = ['admin']
handler.command = /^ban|unban$/i
handler.group = true
handler.admin = true // Solo administradores pueden usar estos comandos

export { handler, messageHandler }
