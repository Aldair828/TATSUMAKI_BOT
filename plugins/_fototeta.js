let handler = async (m, { conn, usedPrefix, command}) => {
    // Definir el tiempo de espera de 10 segundos (10,000 milisegundos)
    let cooldown = 10000
    let time = global.db.data.users[m.sender].lastrob + cooldown
    if (new Date - global.db.data.users[m.sender].lastrob < cooldown) 
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
    
    // Robar créditos aleatoriamente entre 5 y 15
    let robCredits = Math.floor(Math.random() * 11) + 5 // Genera un número aleatorio entre 5 y 15

    if (users.creditos < robCredits) 
        return m.reply(`😿 @${who.split`@`[0]} tiene menos de *${robCredits} créditos* No robes a un pobre :v`, null, { mentions: [who] })    

    // Transferir créditos
    global.db.data.users[m.sender].creditos += robCredits
    global.db.data.users[who].creditos -= robCredits 

    m.reply(`*✧ Robaste ${robCredits} créditos a @${who.split`@`[0]}*`, null, { mentions: [who] })
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
    return minutes + " Minuto(s) " + seconds + " Segundo(s)"
}
