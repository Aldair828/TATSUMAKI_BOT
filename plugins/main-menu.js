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
    let menuText =`
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

╭──ꕤ「 *COMANDOS NUEVOS*」ꕤ
│  𓋜 *.cazar*
│  𓋜 *.slot cantidad*
│  𓋜 *.ruleta 10 negro / rojo*
│  𓋜 *.crimen*
│  𓋜 *.depositar cantidad*
│  𓋜 *.retirar cantidad*
│  𓋜 *.banco*
│  𓋜 *.perfil*
│  𓋜 *.top*
│  𓋜 *.comprarwaifu*
│  𓋜 *.miswaifus*
│  𓋜 *.venderwaifu*
│  𓋜 *.prestamo
│  𓋜 *.pagar cantidad
╰──ꕤ

╭──ꕤ「 *Info 🌸* 」ꕤ
│  𓋜 *.owner*
│  𓋜 *.grupos*
│  𓋜 *.status*
│  𓋜 *.totalfunciones*
│  𓋜 *.menu*
│  𓋜 *.ping*
│  𓋜 *.runtime*
╰── ꕤ

╭──ꕤ「 *Busquedas 🔎* 」ꕤ
│  𓋜 *.mercadolibre <búsqueda>*
│  𓋜 *.pinterest*
│  𓋜 *.google <búsqueda>*
│  𓋜 *.ytsearch <búsqueda>*
╰──ꕤ

╭──ꕤ「 *Juegos 🎮* 」ꕤ
│  𓋜 *.ruleta 10 negro/rojo*
│  𓋜 *.slot <apuesta>*
╰──ꕤ

╭──ꕤ「 *Sub Bots 🤖* 」ꕤ
│  𓋜 *.bots*
│  𓋜 *.serbot*
│  𓋜 *.stop*
│  𓋜 *.code*
╰──ꕤ

╭──ꕤ「 *RPG ⚖️* 」ꕤ
│  𓋜 *.claim*
│  𓋜 *.crimen*
│  𓋜 *.creditos*
│  𓋜 *.minar*
│  𓋜 *.work*
╰──ꕤ

╭──ꕤ「 *Registro 🧾* 」ꕤ
│  𓋜 *.sn*
│  𓋜 *.reg *<nombre.edad>**
│  𓋜 *.unreg*
╰──ꕤ

╭──ꕤ「 *Stickers 🎇* 」ꕤ
│  𓋜 *.quotly <texto>*
│  𓋜 *.scat*
│  𓋜 *.smeme <texto>*
│  𓋜 *.sticker*
│  𓋜 *.wm <nombre>|<autor>*
│  𓋜 *.tovid <sticker>*
╰──ꕤ

╭──ꕤ「 *Imágenes 🍡* 」ꕤ
│  𓋜 *.tiktokimg *<url>**
│  𓋜 *.imagen <búsqueda>*
│  𓋜 *.megumin*
│  𓋜 *.neko*
│  𓋜 *.pinterest <búsqueda>*
│  𓋜 *.ppcouple*
│  𓋜 *.shinobu*
│  𓋜 *.waifu*
╰──ꕤ

╭──ꕤ「 *Grupos 👥* 」ꕤ
│  𓋜 *.banearbot*
│  𓋜 *.group open / close*
│  𓋜 *.grupo abrir / cerrar*
│  𓋜 *.kick @user*
│  𓋜 *.link*
│  𓋜 *.encuesta *<pregunta|opciones>**
│  𓋜 *.promote *593xxx**
│  𓋜 *.promote *@usuario**
│  𓋜 *.promote *responder chat**
│  𓋜 *.setppgc*
│  𓋜 *.tag*
│  𓋜 *.tagall <mesaje>*
│  𓋜 *.invocar <mesaje>*
│  𓋜 *.desbanearbot*
│  𓋜 *.ds*
╰──ꕤ

╭──ꕤ「 *Logo - maker 🌹* 」ꕤ
│  𓋜 *.sadcat <texto>*
│  𓋜 *.tweet <comentario>*
╰──ꕤ

╭──ꕤ「 *On / Off 💥* 」ꕤ
│  𓋜 *.enable*
│  𓋜 *.disable*
╰──ꕤ

╭──ꕤ「 *Descargas 📥* 」ꕤ
│  𓋜 *.aptoide <búsqueda>*
│  𓋜 *.facebook <url fb>*
│  𓋜 *.gdrive <url gdrive>*
│  𓋜 *.gitclone <url git>*
│  𓋜 *.instagram <url ig>*
│  𓋜 *.mediafire <url mf>*
│  𓋜 *.pindl <pin url>*
│  𓋜 *.soundcloud *<búsqueda>**
│  𓋜 *.spotify <búsqueda>*
│  𓋜 *.spotifydl *<url spotify>**
│  𓋜 *.tiktok <url tt>*
│  𓋜 *.tiktokimg *<url>**
│  𓋜 *.tiktokuser *<usuario>**
│  𓋜 *.ytmp3 <yt url>*
│  𓋜 *.ytmp4 <yt url>*
╰──ꕤ

╭──ꕤ「 *Herramientas 🧰* 」ꕤ
│  𓋜 *.google <búsqueda>*
│  𓋜 *.base64 <enc/dec>*
│  𓋜 *.fake <texto/@tag/texto>*
│  𓋜 *.hd*
│  𓋜 *.ibb*
│  𓋜 *.igstalk <username>*
│  𓋜 *.morse <encode|decode>*
│  𓋜 *.ver*
│  𓋜 *.reenviar*
│  𓋜 *.ss *<url>**
│  𓋜 *.ssweb *<url>**
│  𓋜 *.ai *<petición>**
│  𓋜 *.togifaud*
│  𓋜 *.tomp3*
│  𓋜 *.tourl*
│  𓋜 *.tovid <sticker>*
│  𓋜 *.tts <texto>*
│  𓋜 *.whatmusic <audio/video>*
╰──ꕤ

╭──ꕤ「 *Diversión 🤪* 」ꕤ
│  𓋜 *.afk <razón>*
│  𓋜 *.dance *<@user>**
│  𓋜 *.gay*
│  𓋜 *.horny*
│  𓋜 *.ship*
│  𓋜 *.simi*
│  𓋜 *.bot*
╰──ꕤ

╭──ꕤ「 *Nsfw 🥵* 」ꕤ
│  𓋜 *.xnxxdl <url>*
╰──ꕤ

╭──ꕤ「 *Creador 🤴🏻* 」ꕤ
│  𓋜 *.getdb*
│  𓋜 *.getsesion*
│  𓋜 *.join <link>*
│  𓋜 *.reiniciar*
│  𓋜 *.salir*
│  𓋜 *.savefile <ruta/nombre>*
│  𓋜 *.update*
╰──ꕤ

╭──ꕤ「 *Audios 🔊* 」ꕤ
│  𓋜 *.bass <mp3/vn>*
│  𓋜 *.blown <mp3/vn>*
│  𓋜 *.deep <mp3/vn>*
│  𓋜 *.earrape <mp3/vn>*
│  𓋜 *.fast <mp3/vn>*
│  𓋜 *.fat <mp3/vn>*
│  𓋜 *.nightcore <mp3/vn>*
│  𓋜 *.reverse <mp3/vn>*
│  𓋜 *.robot <mp3/vn>*
│  𓋜 *.slow <mp3/vn>*
│  𓋜 *.smooth <mp3/vn>*
│  𓋜 *.tupai <mp3/vn>*
│  𓋜 *.reverb <mp3/vn>*
│  𓋜 *.chorus <mp3/vn>*
│  𓋜 *.flanger <mp3/vn>*
│  𓋜 *.distortion <mp3/vn>*
│  𓋜 *.pitch <mp3/vn>*
│  𓋜 *.highpass <mp3/vn>*
│  𓋜 *.lowpass <mp3/vn>*
│  𓋜 *.underwater <mp3/vn>*
╰──ꕤ

*⋘ TATSUMAKI_BOT ⋙*

➽  *DEVELOPER 👨🏻‍💻: Aldair*
*" https://wa.me/+51925015528 "*

➽  *DEVELOPER 👨🏻‍💻: MEOW - ANGELA* 
*" https://wa.me/+527772130823 "*
`.trim()

    let pp = './storage/img/miniurl.jpg' // Asegúrate de que esta ruta es válida para la imagen que deseas enviar
    await conn.sendFile(m.chat, pp, 'thumbnail.jpg', menuText, m, null)

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
