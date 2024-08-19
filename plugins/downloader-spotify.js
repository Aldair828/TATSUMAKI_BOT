let cooldowns = {}

let handler = async (m, { conn, args, usedPrefix, command }) => {

    if (!args[0]) return m.reply('✋ Ingresa la cantidad de *Creditos* que deseas apostar.\n\n`Ejemplo:`\n' + `> *${usedPrefix + command}* 10 piedra`)
    if (isNaN(args[0])) return m.reply('✋ Ingresa una cantidad válida de *Creditos*.\n\n`Ejemplo:`\n' + `> *${usedPrefix + command}* 10 piedra`)

    let apuesta = parseInt(args[0])
    let userChoice = args[1]?.toLowerCase()
    let users = global.db.data.users[m.sender]
    
    if (!['piedra', 'papel', 'tijeras'].includes(userChoice)) {
        return m.reply('✋ Elección no válida. Ingresa *piedra*, *papel*, o *tijeras*.\n\n`Ejemplo:`\n' + `> *${usedPrefix + command}* 10 piedra`)
    }

    if (apuesta > users.limit) {
        return m.reply(`❌ No tienes suficientes *Creditos* para apostar esa cantidad.`)
    }
    
    let tiempoEspera = 15

    if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempoEspera * 1000) {
        let tiempoRestante = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempoEspera * 1000 - Date.now()) / 1000))
        return m.reply(`⏱ Espera *${tiempoRestante}* para jugar nuevamente.`)
    }

    let choices = ['piedra', 'papel', 'tijeras']
    let botChoice = choices[Math.floor(Math.random() * choices.length)]

    let result
    if (userChoice === botChoice) {
        result = `🤝 ¡Empate! Ambos eligieron *${botChoice}*. No se ha cambiado tu saldo.`
    } else if (
        (userChoice === 'piedra' && botChoice === 'tijeras') ||
        (userChoice === 'papel' && botChoice === 'piedra') ||
        (userChoice === 'tijeras' && botChoice === 'papel')
    ) {
        let ganancia = apuesta * 2
        users.limit += ganancia
        result = `🎉 ¡Ganaste! Tú elegiste *${userChoice}* y Tatsumaki_Bot eligio *${botChoice}*. Has ganado *${ganancia}* *Creditos*.`
    } else {
        users.limit -= apuesta
        result = `😞 ¡Perdiste! Tú elegiste *${userChoice}* y Tatsumaki_Bot eligió *${botChoice}*. Has perdido *${apuesta}* *Creditos*.`
    }

    cooldowns[m.sender] = Date.now()

    return await conn.reply(m.chat, result, m)
}

handler.help = ['ppt <apuesta> <elección>']
handler.tags = ['game']
handler.command = ['ppt', 'piedrapapelotijeras']
handler.register = true
handler.group = false 
export default handler

function segundosAHMS(segundos) {
    let minutos = Math.floor(segundos / 60)
    let segundosRestantes = segundos % 60
    return minutos > 0 
        ? `${minutos} minuto(s) y ${segundosRestantes} segundo(s)` 
        : `${segundosRestantes} segundo(s)`
}
