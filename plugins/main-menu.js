import { promises } from 'fs'
import { join } from 'path'

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
    let { exp, limit, level } = global.db.data.users[m.sender]
    let name = await conn.getName(m.sender)
    let d = new Date(new Date() + 3600000)
    let locale = 'es'
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length

    // Texto del nuevo menú
    let menuText = `
'ྀི𓊆 _tatsumaki_ 𓊇ྀ

*Bienvenido* @${name} 
*Te Saluda Los Creadores Del Bot*

Aldair: +51925015528
Angela: +527772130823

*Puede seguir el canal del bot:* https://whatsapp.com/channel/0029VafZvB6J3jv3qCnqNu3x


*🔰SU INFORMACIÓN BÁSICA🔰*

➢ *[👤] USUARIO:* ${name}
➢ *[📱] NÚMERO:* ${m.sender.split('@')[0]}
➢ *[💸] CRÉDITOS:* ${limit}
➢ *[👾] NIVEL:* ${level}

*🔰INFORMACIÓN DEL BOT🔰*

➢ *[👨🏻‍💻] CREADORES:* ALDAIR - MEOW
➢ *[🤖] NÚMERO OFICIAL:* 51955109003
➢ *[💮] ESTADO:* ACTIVO 🟢
➢ *[👥] USUARIOS REGISTRADOS:* ${rtotalreg} 
➢ *[⏳] TIEMPO ACTIVO:* ${uptime}
➢ *[🔐] MODO:* ${global.opts['self'] ? 'Privado' : 'Público'}


᧔♡᧓  *L I S T A  -  M E N Ú S*  ᧔♡᧓


*⋘ TATSUMAKI_BOT ⋙*

➽  *DEVELOPER 👨🏻‍💻: Aldair*
*" https://wa.me/+51925015528 "*

➽  *DEVELOPER 👨🏻‍💻: MEOW - ANGELA* 
*" https://wa.me/+527772130823 "*
`.trim()

    let videoUrl = 'https://www.example.com/video.mp4' // Reemplaza esto con el enlace directo a tu video
    await conn.sendMessage(m.chat, { video: { url: videoUrl }, caption: menuText }, { quoted: m })

  } catch (e) {
    conn.reply(m.chat, 'Lo sentimos, el menú tiene un error.', m)
    throw e
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'help', 'menú'] 
handler.register = true 
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
