import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;

  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://telegra.ph/file/4bd1287b136d79909b905.jpg')
  let img = await (await fetch(`${pp}`)).buffer()
  let chat = global.db.data.chats[m.chat]
  
  let userId = m.messageStubParameters[0]
  let user = global.db.data.users[userId]
  let creditos = user ? user.creditos : "No tiene registro"
  let fechaIngreso = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })

  if (m.text.startsWith('.setwelcome ')) {
    let newWelcomeText = m.text.slice(12).trim()
    chat.bienvenida = newWelcomeText
    conn.sendMessage(m.chat, `Nuevo mensaje de bienvenida establecido: ${newWelcomeText}`, { quoted: m })
    return
  }

  if (m.text.startsWith('.setbye ')) {
    let newByeText = m.text.slice(8).trim()
    chat.despedida = newByeText
    conn.sendMessage(m.chat, `Nuevo mensaje de despedida establecido: ${newByeText}`, { quoted: m })
    return
  }

  if (chat.bienvenida && m.messageStubType == 27) {
    let bienvenida = chat.bienvenida || `⁣🔰 BIENVENIDO A TATSUMAKI_BOT 🔰\n\n👨🏻‍💻🏷 @${userId.split`@`[0]} 𝐆𝐑𝐀𝐂𝐈𝐀𝐒 𝐏𝐎𝐑 𝐒𝐄𝐑 𝐏𝐀𝐑𝐓𝐄 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐎 𝐄𝐒𝐓𝐀𝐌𝐎𝐒\n\n𝐑𝐄𝐀𝐋𝐌𝐄𝐍𝐓𝐄 𝐅𝐄𝐋𝐈𝐂𝐄𝐒 𝐏𝐎𝐑 𝐇𝐀𝐁𝐄𝐑𝐓𝐄 𝐔𝐍𝐈𝐃𝐎 𝐀𝐋 𝐆𝐑𝐔𝐏𝐎🫧\n\n➛ 👨🏻‍💻𝐓𝐔 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂𝐈Ó𝐍 📑\n\n*💮➛ NUMERO:* ${userId.split`@`[0]}\n*💮➛ NOMBRE:* ${user?.nombre || "Desconocido"}\n*💮➛ CRÉDITOS:* ${creditos}\n*💮➛ INGRESÓ:* ${fechaIngreso}\n\n〽️𝐑𝐄𝐂𝐔𝐄𝐃𝐀 𝐂𝐔𝐌𝐏𝐋𝐈𝐑 𝐋𝐀𝐒 𝐑𝐄𝐆𝐋𝐀𝐒`
    await conn.sendAi(m.chat, botname, textbot, bienvenida, img, img, canal)
  }
  
  if (chat.despedida && m.messageStubType == 28) {
    let bye = chat.despedida || `┌─★ *𝚃𝚊𝚝𝚜𝚞𝚖𝚊𝚔𝚒_𝙱𝚘𝚝* \n│「 ADIOS 👋 」\n└┬★ 「 @${userId.split`@`[0]} 」\n   │✑  Se fue\n   │✑ Jamás te quisimos aquí\n   └───────────────┈ ⳹`
    await conn.sendAi(m.chat, botname, textbot, bye, img, img, canal)
  }
  
  if (chat.despedida && m.messageStubType == 32) {
    let kick = chat.despedida || `┌─★ *𝚃𝚊𝚝𝚜𝚞𝚖𝚎𝚘_𝙱𝚘𝚝* \n│「 ADIOS 👋 」\n└┬★ 「 @${userId.split`@`[0]} 」\n   │✑  Se fue\n   │✑ Jamás te quisimos aquí\n   └───────────────┈ ⳹`
    await conn.sendAi(m.chat, botname, textbot, kick, img, img, canal)
  }
}
