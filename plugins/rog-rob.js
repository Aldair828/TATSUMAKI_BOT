// robar.js
let cooldowns = {}

let handler = async (m, { conn, text, command, usedPrefix }) => {
    let users = global.db.data.users
    let senderId = m.sender
    let senderName = conn.getName(senderId)
  
    let tiempoEspera = 30 * 60 // 30 minutos

    if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
        let tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000))
        m.reply(`🍭 Ya has cometido un Robo recientemente, espera *⏱ ${tiempoRestante}* para robar nuevamente.`)
        return
    }
  
    cooldowns[m.sender] = Date.now()
  
    let senderLimit = users[senderId].limit || 0
    let targetId = m.mentionedJid[0] || text.trim() + '@s.whatsapp.net'

    if (!targetId || !users[targetId]) {
        m.reply('🍭 Debes mencionar a un usuario válido para robarle.')
        return
    }

    let targetLimit = users[targetId].limit || 0

    let minAmount = 15
    let maxAmount = 50

    let amountTaken = Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount

    // Obtener el multiplicador según el rango del usuario
    let multiplicador = 1
    let rangoMensaje = ''
    if (users[senderId].rango) {
        switch (users[senderId].rango) {
            case 'bronce':
                multiplicador = 2
                break
            case 'plata':
                multiplicador = 3
                break
            case 'oro':
                multiplicador = 4
                break
            case 'diamante':
                multiplicador = 5
                break
            case 'maestro':
                multiplicador = 6
                break
            case 'leyenda':
                multiplicador = 7
                break
            default:
                multiplicador = 1
        }
        rangoMensaje = `\n\n𝚃𝙸𝙴𝙽𝙴 𝚄𝙽 𝚁𝙰𝙽𝙶𝙾: ${users[senderId].rango.charAt(0).toUpperCase() + users[senderId].rango.slice(1)}`
    }

    let amountWithMultiplier = amountTaken * multiplicador
    users[senderId].limit = Math.min(senderLimit + amountWithMultiplier, maxAmount * multiplicador)
    users[targetId].limit = Math.max(targetLimit - amountTaken, 0)

    conn.sendMessage(m.chat, {
        text: `🍭𝘼𝘾𝘼𝘽𝘼𝙎 𝘿𝙀 𝙍𝙊𝘽𝘼𝙍 *${amountWithMultiplier} Créditos* 𝘼𝙇 𝙐𝙎𝙐𝘼𝙍𝙄𝙊 @${targetId.split("@")[0]}${rangoMensaje}\n\nSe suman *+${amountWithMultiplier} Créditos* a ${senderName}.`,
        contextInfo: { 
            mentionedJid: [targetId],
        }
    }, { quoted: m })

    global.db.write()
}

handler.tags = ['rpg']
handler.help = ['robar']
handler.command = ['robar']
handler.register = true
handler.group = true

export default handler

function segundosAHMS(segundos) {
    let horas = Math.floor(segundos / 3600)
    let minutos = Math.floor((segundos % 3600) / 60)
    let segundosRestantes = segundos % 60
    return `${minutos} minutos y ${segundosRestantes} segundos`
                                              }
