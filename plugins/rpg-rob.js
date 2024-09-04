let ro = 3000  // Cantidad máxima de créditos que se puede robar

let handler = async (m, { conn, usedPrefix, command }) => {
    let time = global.db.data.users[m.sender].lastrob + 7200000
    if (new Date - global.db.data.users[m.sender].lastrob < 7200000) 
        throw `*⏱️ ¡Hey! Espera ${msToTime(time - new Date())} para volver a robar*`

    let who
    if (m.isGroup) 
        who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
    else 
        who = m.chat

    if (!who) 
        throw `𝙀𝙏𝙄𝙌𝙐𝙀𝙏𝘼 𝘼 𝘼𝙇𝙂𝙐𝙄𝙀𝙉 𝙋𝘼𝙍𝘼 𝙍𝙊𝘽𝘼𝙍`

    if (!(who in global.db.data.users)) 
        throw `𝙀𝙇 𝙐𝙎𝙐𝘼𝙍𝙄𝙊 𝙉𝙊 𝙎𝙀 𝙀𝙉𝘾𝙐𝙀𝙉𝙏𝙍𝘼 𝙀𝙉 𝙈𝙄 𝘽𝘼𝙎𝙀 𝘿𝙀 𝘿𝘼𝙏𝙊𝙎.`

    let targetUser = global.db.data.users[who]
    let rob = Math.floor(Math.random() * ro)

    // Verificar si el usuario objetivo tiene suficientes créditos
    if (targetUser.money < rob) 
        return m.reply(`😿 @${who.split`@`[0]} tiene menos de *${ro} Créditos*. No robes a un pobre :v`, null, { mentions: [who] })

    // Transferir créditos
    global.db.data.users[m.sender].money += rob
    global.db.data.users[who].money -= rob

    // Enviar mensaje de éxito
    m.reply(`*✧ Robaste ${rob} Créditos a @${who.split`@`[0]}*`, null, { mentions: [who] })
    global.db.data.users[m.sender].lastrob = new Date * 1
}

handler.help = ['robar', 'rob']
handler.tags = ['econ']
handler.command = ['robar', 'rob']
handler.group = true
handler.register = true

export default handler  

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
    hours = (hours < 10) ? "0" + hours : hours
    minutes = (minutes < 10) ? "0" + minutes : minutes
    seconds = (seconds < 10) ? "0" + seconds : seconds
    return hours + " Hora(s) " + minutes + " Minuto(s)"
}
