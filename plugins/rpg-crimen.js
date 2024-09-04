let cooldowns = {}

let handler = async (m, { conn, text, command, usedPrefix }) => {
    let users = global.db.data.users
    let senderId = m.sender
    let senderName = conn.getName(senderId)
  
    // Determinar el tiempo de espera según el comando
    let tiempoEspera = command === 'robar' || command === 'rob' ? 30 * 60 : 5 * 60 // 30 minutos para robar, 5 minutos para crimen

    if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
        let tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000))
        m.reply(`🍭 Ya has cometido un Crimen o Robo recientemente, espera *⏱ ${tiempoRestante}* para realizar otro.`)
        return
    }
  
    cooldowns[m.sender] = Date.now()
  
    let senderLimit = users[senderId].limit || 0

    let randomUserId = Object.keys(users)[Math.floor(Math.random() * Object.keys(users).length)]

    while (randomUserId === senderId) {
        randomUserId = Object.keys(users)[Math.floor(Math.random() * Object.keys(users).length)]
    }

    let randomUserLimit = users[randomUserId].limit || 0

    let minAmount = 15
    let maxAmount = 50

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

    let amountTaken = Math.floor(Math.random() * (maxAmount - minAmount + 1)) + minAmount

    let randomOption = Math.floor(Math.random() * 3)

    switch (randomOption) {
        case 0:
            // Aplicar multiplicador solo cuando se ganan créditos
            let amountWithMultiplier = amountTaken * multiplicador
            users[senderId].limit = Math.min(senderLimit + amountWithMultiplier, maxAmount * multiplicador)
            users[randomUserId].limit = Math.max(randomUserLimit - amountTaken, 0)
            conn.sendMessage(m.chat, {
                text: `🍭¡Lograste cometer tu crimen con éxito!, acabas de robar *${amountWithMultiplier} Créditos* a @${randomUserId.split("@")[0]}${rangoMensaje}\n\nSe suman *+${amountWithMultiplier} Créditos* a ${senderName}.`,
                contextInfo: { 
                    mentionedJid: [randomUserId],
                }
            }, { quoted: m })
            break

        case 1:
            // No aplicar multiplicador cuando se pierden créditos
            let amountSubtracted = Math.min(Math.floor(Math.random() * (senderLimit - minAmount + 1)) + minAmount, maxAmount)
            users[senderId].limit = Math.max(senderLimit - amountSubtracted, 0)
            conn.reply(m.chat, `🍭 No fuiste cuidadoso y te atraparon mientras cometías tu crimen, se restaron *-${amountSubtracted} Créditos* a ${senderName}.`, m)
            break

        case 2:
            // Aplicar multiplicador solo a los créditos robados
            let smallAmountTaken = Math.min(Math.floor(Math.random() * (randomUserLimit / 2 - minAmount + 1)) + minAmount, maxAmount)
            let smallAmountWithMultiplier = smallAmountTaken * multiplicador
            users[senderId].limit = Math.min(senderLimit + smallAmountWithMultiplier, maxAmount * multiplicador)
            users[randomUserId].limit = Math.max(randomUserLimit - smallAmountTaken, 0)
            conn.sendMessage(m.chat, {
                text: `🍭 Lograste cometer tu crimen con éxito, pero te descubrieron y solo lograste tomar *${smallAmountWithMultiplier} Créditos* de @${randomUserId.split("@")[0]}${rangoMensaje}\n\nSe suman *+${smallAmountWithMultiplier} Créditos* a ${senderName}.`,
                contextInfo: { 
                    mentionedJid: [randomUserId],
                }
            }, { quoted: m })
            break
    }

    global.db.write()
}

handler.tags = ['rpg']
handler.help = ['crimen', 'robar']
handler.command = ['crimen', 'crime', 'robar', 'rob']
handler.register = true
handler.group = true

export default handler

function segundosAHMS(segundos) {
    let horas = Math.floor(segundos / 3600)
    let minutos = Math.floor((segundos % 3600) / 60)
    let segundosRestantes = segundos % 60
    return `${minutos} minutos y ${segundosRestantes} segundos`
                                                 }
