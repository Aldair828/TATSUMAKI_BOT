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

    // Determinar si hay códigos disponibles
    let availableCodes = global.db.data.codes && Object.keys(global.db.data.codes).length > 0;

    // Texto del nuevo menú
    let menuText = `
*🐦‍🔥 FENIX_BOT 🐦‍🔥*

*Bienvenido* @${name} 

*Puede seguir el canal del bot:* https://whatsapp.com/channel/0029VafZvB6J3jv3qCnqNu3x

*🔰INFORMACIÓN DEL BOT🔰*

*𝘈𝘊𝘛𝘜𝘈𝘓𝘐𝘡𝘈𝘊𝘐𝘖𝘕  < 1.1.1 >*

➢ *[👨🏻‍💻] CREADOR:* ALDAIR
➢ *[🤖] NÚMERO OFICIAL:* +522481729896
➢ *[💮] ESTADO:* ACTIVO 🟢
➢ *[👥] USUARIOS REGISTRADOS:* ${rtotalreg} 
➢ *[⏳] TIEMPO ACTIVO:* ${uptime}
➢ *[🔐] MODO:* ${global.opts['self'] ? 'Privado' : 'Público'}




 ╭──────༺♡༻──────╮
                *INFO-BOT*
╰──────༺♡༻──────╯


➢ .owner 
➥ ve los contactos de los creadores 

➢ .grupos 
➥ ve los grupos y canales oficiales del bot 

➢ .estado 
➥ ve el estado del bot 

➢ .totalfunciones 
➥ ve cuantas funciones tiene el bot 

➢ .ping 
➥ ve la velocidad del bot 

➢ .runtime 
➥ ve cuanto tiempo lleva activo el bot

➢ .joinfree link
➥ agrega al bot a tu grupo 


╭──────༺♡༻──────╮
               *ECONOMÍA*
╰──────༺♡༻──────╯

➢ .minar
➥ mina diamantes

➢ .work
➥ trabaja en algo y gana diamantes

➢ .cazar 
➥ caza animales y gana créditos 

➢ .slot cantidad 
➥ apuesta créditos y gana 

➢ .ruleta 10 negro / rojo 
➥ apuesta y gana créditos 

➢ .crimen 
➥ roba créditos a otros usuarios 

➢ .robar @user
➥ roba los créditos de otros usuarios / no se puede robar si esta en el banco

➢ .depositar cantidad 
➥ deposita el dinero al Banco y guardalos 

➢ .retirar cantidad 
➥ retira el dinero del Banco 

➢ .banco 
➥ guarda tus créditos de cualquier robo 

➢ .topcreditos
➥ ve el top de mayores créditos 

➢ .prestamo cantidad 
➥ pide prestamo al bot 

➢ .pagar cantidad 
➥ paga el préstamo 

➢ .transferir @user cantidad 
➥ transfiere créditos a otros usuarios


╭──────༺♡༻──────╮
                        *XP*
╰──────༺♡༻──────╯
 
➢ .xp 
➥ ve tu cartera de xp 

➢ .vip 
➥ ve si eres usuario vip

➢ .tienda vip 
➥ comprar vip por un tiempo 

➢ .topxp 
➥ ve quienes son los top de más xp

➢ .ppt piedra / papel / tijera
➥ juega y gana xp

➢ .adivina 1 - 100
➥ adivina el número y gana mucho xp


╭──────༺♡༻──────╮
         *TIENDA Y VENTAS*
╰──────༺♡༻──────╯
 
➢ .comprarwaifu 
➥ comprar una waifu 

➢ .miswaifus 
➥ ve tus waifus que compraste

➢ .venderwaifu
➥ vende la waifu que tienes

➢ .pokemon pikachu
➥ para ver el pokemon y sus estadísticas

➢ .comprarpokemon pikachu
➥ compra el pokemon

➢ .mipokemon
➥ ve tu pokemon que tienes 

➢ .venderpokemon número 
➥ vende tu pokemon 

➢ .regalarpokemon @user Pikachu
➥ regala un pokemon a tu amigo 

➢ .tienda 
➥ ve los rangos y precios en la tienda 

➢ .comprar rango 
➥ comprar un rango y múltiplica tus ganancias 

➢ .mirango 
➥ ve tu rango que tienes


╭──────༺♡༻──────╮
              *BUSQUEDAS*
╰──────༺♡༻──────╯


➢ .pinterest 
➥ busca imágenes de pinterest

➢ .fenixgpt cuanto es 1+1
➥ busca información rápido con fenixgpt 🐦‍🔥

➢ .google búsqueda
➥ busca cosas de google 

➢ .imagen búsqueda
➥ busca imagen de lo que busques

➢ .tiktok link 
➥ descarga un vídeo de tiktok sin marca de agua 

➢ .tiktoksearch nombre 
➥ ve videos de tiktok en carrusel


╭──────༺♡༻──────╮
               *SUB BOTS*
╰──────༺♡༻──────╯


➢ .bots 
➥ ve cuantos subots ahí 

➢ .code 
➥ pide Código para vincular y ser un subot 

➢ .qr
➥ pide Código qr para escanear y ser un subot


╭──────༺♡༻──────╮
                *REGISTRO*
╰──────༺♡༻──────╯


➢ .reg nombre.edad
➥ regístrate en el bot 

➢ .unreg número de serie 
➥ elimina tu registro del bot 

➢ .nserie 
➥ ve tu número de serie 

➢ .perfil 
➥ ve tu perfil en el bot


╭──────༺♡༻──────╮
                *STICKERS*
╰──────༺♡༻──────╯


➢ .s / .stikert 
➥ convierte una foto en stikert


╭──────༺♡༻──────╮
               *IMÁGENES*
╰──────༺♡༻──────╯


➢ .megumin 

➢ .neko 

➢ .shinobu


╭──────༺♡༻──────╮
               *DIVERSION*
╰──────༺♡༻──────╯


➢ .afk razón 
➥ quédate afk sin que te molesten 

➢ .dance @user 
➥ baila con un usuario

➢ .abrazo @user 
➥ abraza a un usuario 

➢ .golpear @user
➥ golpear a un usuario

➢ .besar @user
➥ besa a un usuario 

➢ .gay @user 
➥ ve el promedio de gay de un usuario 

➢ .ship @user @user 
➥ shipea a dos usuarios 

➢ .bot hola 
➥ interactúa con el bot


╭──────༺♡༻──────╮
                  *GRUPOS*
╰──────༺♡༻──────╯

➢ .infogrupo
➥ ve la información del grupo

➢ .grupo cerrar 
➥ cierra el grupo

➢ .grupo abrir
➥ abre el grupo 

➢ .kick @user 
➥ elimina a un usuario 

➢ .link 
➥ ve el link del Grupo 

➢ .encuesta pregunta|opciones 
➥ haz encuestas en el grupo 

➢ .promote @user 
➥ asciende a admin a un usuario 

➢ .invocar mensaje 
➥ invoca a todo el grupo


╭──────༺♡༻──────╮
                 *ON / OFF*
╰──────༺♡༻──────╯


➢ .on / off welcome 
➥ activa y desactiva la bienvenida

➢ .on / off antilink 
➥ activa y desactiva el antilink


⋘ FENIX_BOT 🐦‍🔥 ⋙

`.trim()

    let imageUrl = 'https://telegra.ph/file/52034ef36501ddbadfd0b.jpg' // Reemplaza esto con el enlace directo a tu imagen
    await conn.sendMessage(m.chat, { image: { url: imageUrl }, caption: menuText }, { quoted: m })

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
