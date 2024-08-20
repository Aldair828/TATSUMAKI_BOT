let handler = async (m, { conn, usedPrefix, command}) => {
    let time = global.db.data.users[m.sender].lastrob + 7200000
    if (new Date - global.db.data.users[m.sender].lastrob < 7200000) 
        throw `*⏱️¡Hey! Espera ${msToTime(time - new Date())} para volver a robar*`

    let who
    if (m.isGroup) 
        who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
    else 
        who = m.chat

    if (!who) 
        throw `𝙀𝙏𝙄𝙌𝙐𝙀𝙏𝘼 𝘼 𝘼𝙇𝙂𝙐𝙄𝙀𝙉 𝙋𝘼𝙍𝘼 𝙍𝙊𝘽𝘼𝙍`

    if (!(who in global.db.data.users)) 
        throw `*Este usuario no se encuentra registrado en mi base de datos*`

    let users = global.db.data.users[who]
    
    // Robar créditos aleatoriamente entre 10 y 14
    let robLimit = Math.floor(Math.random() * 5) + 10 // Genera un número aleatorio entre 10 y 14

    if (users.limit < robLimit) 
        return m.reply(`😿 @${who.split`@`[0]} tiene menos de *${robLimit} créditos* No robes a un pobre :v`, null, { mentions: [who] })    

    // Robar créditos
    global.db.data.users[m.sender].limit += robLimit
    global.db.data.users[who].limit -= robLimit 

    m.reply(`*✧ Robaste ${robLimit} créditos a @${who.split`@`[0]}*`, null, { mentions: [who] })
    global.db.data.users[m.sender].lastrob = new Date * 1
}

handler.help = ['rob']
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
