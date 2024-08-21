import db from '../lib/database.js'
import { createHash } from 'crypto'
import fs from 'fs'
import fetch from 'node-fetch'

let Reg = /\|?(.*)\.([0-9]+)\.([A-Za-z\s]+)$/i
let handler = async function (m, { conn, text, usedPrefix, command }) {
  let user = global.db.data.users[m.sender]
  let name2 = conn.getName(m.sender)
  if (user.registered === true) return m.reply(`🍭 Ya estás registrado.\n\n*¿Quiere volver a registrarse?*\n\nUse este comando para eliminar su registro.\n*${usedPrefix}unreg* <Número de serie>`)
  if (!Reg.test(text)) return m.reply(`🍭 Formato incorrecto.\n\nUso del comando: *${usedPrefix + command} nombre.edad.pais*\nEjemplo: *${usedPrefix + command} ${name2}.16.México*`)
  let [_, name, age, country] = text.match(Reg)
  if (!name) return m.reply('🍭 El nombre no puede estar vacío.')
  if (!age) return m.reply('🍭 La edad no puede estar vacía.')
  if (!country) return m.reply('🍭 El país no puede estar vacío.')
  if (name.length >= 100) return m.reply('🍭 El nombre es demasiado largo.')
  age = parseInt(age)
  if (age > 100) return m.reply('👴🏻 Wow el abuelo quiere jugar al bot.')
  if (age < 5) return m.reply('🚼 Hay un abuelo bebé jsjsj.')
  user.name = name.trim()
  user.age = age
  user.country = country.trim()
  user.regTime = + new Date
  user.registered = true
  let sn = createHash('md5').update(m.sender).digest('hex')
  let img = await (await fetch(`https://tinyurl.com/2cpfjwp4`)).buffer()
  let txt = '`– R E G I S T R O  -  U S E R`\n\n'
      txt += `┌  ✩  *Nombre* : ${name}\n`
      txt += `│  ✩  *Edad* : ${age} años\n`
      txt += `│  ✩  *País* : ${country}\n`
      txt += `│  ✩  *Número de serie*\n`
      txt += `└  ✩  ${sn}
    
      *𝙿𝙰𝚁𝙰 𝚅𝙸𝚂𝚄𝙰𝙻𝙸𝚉𝙰𝚁 𝚃𝚄 𝙿𝙴𝚁𝙵𝙸𝙻 𝚄𝚂𝙰 𝙴𝙻 𝙲𝙾𝙼𝙰𝙽𝙳𝙾*
      .perfil
      *𝙿𝙰𝚁𝙰 𝚅𝙴𝚁 𝙻𝙾𝚂 𝙲𝙾𝙼𝙰𝙽𝙳𝙾𝚂 𝚄𝚂𝙰*
      .menu 
      *𝙿𝙰𝚁𝙰 𝙲𝚄𝙰𝙻𝚀𝚄𝙸𝙴𝚁 𝙳𝚄𝙳𝙰 𝚄𝚂𝙰 𝙴𝙻 𝙲𝙾𝙼𝙰𝙽𝙳𝙾*
      .owner `
  await conn.sendAi(m.chat, botname, textbot, txt, img, img, canal, m)
  await m.react('✅')
}
handler.help = ['reg'].map(v => v + ' *<nombre.edad.pais>*')
handler.tags = ['rg']

handler.command = ['verify', 'reg', 'register', 'registrar']

export default handler
