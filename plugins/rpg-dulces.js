let handler = async (m, {conn, usedPrefix}) => {
   let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
   if (who == conn.user.jid) return error 
   if (!(who in global.db.data.users)) return conn.reply(m.chat, 'El usuario no se encuentra en mi base de Datos.', m)
   let user = global.db.data.users[who]
   await m.reply(`${who == m.sender ? `Tienes *${user.limit} 💸 Creditos* en tu Cartera` : `El usuario @${who.split('@')[0]} tiene *${user.limit} 🍬 Dulces* en su Cartera`}. `, null, { mentions: [who] })
}

handler.help = ['creditos']
handler.tags = ['rpg']
handler.command = ['wallet', 'cartera', 'creditos', 'bal', 'coins']
handler.register = true 
export default handler
