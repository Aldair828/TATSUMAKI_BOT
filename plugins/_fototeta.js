// Handler para los comandos de banco
let handler = async (m, { conn, usedPrefix, command, text }) => {
    let user = global.db.data.users[m.sender];

    // Comando .banco
    if (command === 'banco') {
        let saldoBanco = user.banco || 0;
        conn.reply(m.chat, `*Saldo en tu banco: ${saldoBanco} créditos*`, m);
    }

    // Comando .depositar
    else if (command === 'depositar') {
        if (!text || isNaN(text)) return conn.reply(m.chat, `Uso: ${usedPrefix}${command} <cantidad>`, m);
        
        let cantidad = parseInt(text);
        if (cantidad <= 0) return conn.reply(m.chat, 'La cantidad debe ser mayor que 0', m);
        
        if (user.creditos < cantidad) return conn.reply(m.chat, 'No tienes suficientes créditos para depositar', m);
        
        user.creditos -= cantidad;
        user.banco = (user.banco || 0) + cantidad;
        
        conn.reply(m.chat, `*Has depositado ${cantidad} créditos en tu banco*`, m);
    }

    // Comando .retirar
    else if (command === 'retirar') {
        if (!text || isNaN(text)) return conn.reply(m.chat, `Uso: ${usedPrefix}${command} <cantidad>`, m);
        
        let cantidad = parseInt(text);
        if (cantidad <= 0) return conn.reply(m.chat, 'La cantidad debe ser mayor que 0', m);
        
        if ((user.banco || 0) < cantidad) return conn.reply(m.chat, 'No tienes suficientes créditos en tu banco', m);
        
        user.banco -= cantidad;
        user.creditos += cantidad;
        
        conn.reply(m.chat, `*Has retirado ${cantidad} créditos de tu banco*`, m);
    }
}

handler.help = ['banco', 'depositar', 'retirar']
handler.tags = ['econ']
handler.command = /^banco|depositar|retirar$/i
handler.group = true
handler.register = true

export default handler
