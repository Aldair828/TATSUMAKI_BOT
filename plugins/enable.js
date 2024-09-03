let handler = async (m, { conn, usedPrefix, command, args, isOwner }) => {
  let isEnable = /true|enable|(turn)?on|1/i.test(command)
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  let bot = global.db.data.settings[conn.user.jid] || {}
  let type = (args[0] || '').toLowerCase()

  switch (type) {
    case 'welcome':
    case 'bv':
    case 'bienvenida':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isOwner && !isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.bienvenida = isEnable
      break

    case 'document':
    case 'documento':
      user.useDocument = isEnable
      break

    case 'antilink':
      if (m.isGroup) {
        if (!isOwner && !isAdmin) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiLink = isEnable
      break

    case 'nsfw':
    case 'modohorny':
      if (m.isGroup) {
        if (!isOwner && !isAdmin) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.nsfw = isEnable
      break

    case 'antiprivado':
      if (!isOwner) {
        global.dfail('owner', m, conn)
        throw false
      }
      bot.antiprivado = isEnable

      if (isEnable) {
        let chats = Object.keys(global.db.data.chats)
        for (let chatId of chats) {
          if (!chatId.endsWith('@g.us')) {
            conn.updateBlockStatus(chatId, 'block')
          }
        }
        m.reply('🚫 El bot ha sido bloqueado de todos los privados de WhatsApp.')
      } else {
        m.reply('✅ El bot ha sido desbloqueado y responderá en privados.')
      }
      break

    default:
      if (!/[01]/.test(command)) return m.reply(`
*🍟 Ingresa una opción para habilitar o deshabilitar*

*≡ Lista de opciones*
*Tipo :* welcome
*Descripción :* Des/Activa la *Bienvenida* y *Despedida* para Grupos

*Tipo :* nsfw 
*Descripción :* Des/Activa los comandos *NSFW* para Grupos

*Tipo :* antilink 
*Descripción :* Des/Activa el *AntiLink* para Grupos

*Tipo :* document 
*Descripción :* Des/Activa la *Descarga En Documentos* para el Usuario

*Tipo :* antiprivado 
*Descripción :* Des/Activa la *respuesta del bot* en chats privados

*• Ejemplo:*
*- ${usedPrefix + command}* welcome
`.trim())
      throw false
  }
  m.reply(`🍭 La función *${type}* se *${isEnable ? 'activó' : 'desactivó'}* correctamente.`)
}

handler.before = async (m, { conn }) => {
  let bot = global.db.data.settings[conn.user.jid] || {}
  if (m.chat.endsWith('@s.whatsapp.net') && bot.antiprivado) {
    await conn.reply(m.chat, '🚫 El bot está inhabilitado en privado. Por favor, únete a un grupo para interactuar con él.', m)
    await conn.updateBlockStatus(m.chat, 'block')
    return !0
  }
}

handler.help = ['enable', 'disable']
handler.tags = ['nable']
handler.command = /^(enable|disable|on|off|1|0)$/i

export default handler
