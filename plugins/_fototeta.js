// Handler para los comandos de banco
let handler = async (m, { conn, usedPrefix, command, text }) => {
    let user = global.db.data.users[m.sender];

    // Comando .banco
    if (command === 'banco') {
        let saldoBanco = user.limit || 0;
        conn.reply(m.chat, `*Saldo en tu banco: ${saldoBanco} créditos*`, m);
    }

    // Comando .depositar
    else if (command === 'depositar') {
        if (!text || isNaN(text)) return conn.reply(m.chat, `Uso: ${usedPrefix}${command} <cantidad>`, m);
        
        let cantidad = parseInt(text);
        if (cantidad <= 0) return conn.reply(m.chat, 'La cantidad debe ser mayor que 0', m);
        
        if (user.limit < cantidad) return conn.reply(m.chat, 'No tienes suficientes créditos para depositar', m);
        
        user.limit -= cantidad;
        user.banco = (user.banco || 0) + cantidad;
        
        conn.reply(m.chat, `*Has depositado ${cantidad} créditos en tu banco*. Ahora tienes ${user.limit} créditos en tu perfil.`, m);
    }

    // Comando .retirar
    else if (command === 'retirar') {
        if (!text || isNaN(text)) return conn.reply(m.chat, `Uso: ${usedPrefix}${command} <cantidad>`, m);
        
        let cantidad = parseInt(text);
        if (cantidad <= 0) return conn.reply(m.chat, 'La cantidad debe ser mayor que 0', m);
        
        if ((user.banco || 0) < cantidad) return conn.reply(m.chat, 'No tienes suficientes créditos en tu banco', m);
        
        user.banco -= cantidad;
        user.limit += cantidad;
        
        conn.reply(m.chat, `*Has retirado ${cantidad} créditos de tu banco*. Ahora tienes ${user.limit} créditos en tu perfil.`, m);
    }
}

handler.help = ['banco', 'depositar', 'retirar']
handler.tags = ['econ']
handler.command = /^banco|depositar|retirar$/i
handler.group = true
handler.register = true

export default handler
