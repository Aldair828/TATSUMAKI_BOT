// Handler del comando de robar
let handler = async (m, { conn, usedPrefix }) => {
    // Definir el tiempo de espera de 20 segundos (20,000 milisegundos)
    let cooldown = 20000;
    let user = global.db.data.users[m.sender];
    let time = user.lastrob + cooldown;

    if (new Date - user.lastrob < cooldown) 
        return conn.reply(m.chat, `*⏱️¡Espera ${msToTime(time - new Date())} para volver a robar!*`, m);

    let who;
    if (m.isGroup) 
        who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false;
    else 
        who = m.chat;

    if (!who) 
        return conn.reply(m.chat, 'Uso: `.robar @usuario`', m);

    let targetUser = global.db.data.users[who];

    // Verificar si el usuario objetivo está registrado
    if (!targetUser) 
        return conn.reply(m.chat, '*Este usuario no se encuentra registrado en mi base de datos*', m);

    // Robar créditos aleatoriamente entre 5 y 15
    let limit = Math.floor(Math.random() * 11) + 5; // Genera un número aleatorio entre 5 y 15

    if (targetUser.creditos < limit) 
        return conn.reply(m.chat, `😿 @${who.split`@`[0]} tiene menos de *${limit} créditos* No robes a un pobre :v`, null, { mentions: [who] });

    // Transferir créditos
    user.creditos += limit;
    targetUser.creditos -= limit;

    // Actualizar el tiempo del último robo
    user.lastrob = new Date * 1;

    conn.reply(m.chat, `*✧ Robaste ${limit} créditos a @${who.split`@`[0]}*`, null, { mentions: [who] });
}

handler.help = ['robar @user']
handler.tags = ['econ']
handler.command = /^robar$/i
handler.group = true
handler.register = true

export default handler

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return minutes + " Minuto(s) " + seconds + " Segundo(s)";
}
