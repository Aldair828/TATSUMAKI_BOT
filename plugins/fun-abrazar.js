let handler = async (m, { conn, usedPrefix, command }) => {
  let pp = 'https://tinyurl.com/25k3wmz4' // URL de la imagen o GIF de abrazo
  let pp2 = 'https://tinyurl.com/2p8csdhj' // Segunda URL de la imagen o GIF de abrazo
  let who
  if (m.isGroup) who = m.mentionedJid[0]
  else who = m.chat
  if (!who) return conn.reply(m.chat, '✦ Menciona al usuario con *@user*', m)
  
  let name2 = conn.getName(who)
  let name = conn.getName(m.sender)

  await conn.sendMessage(m.chat, { 
    video: { url: [pp, pp2].getRandom() }, 
    gifPlayback: true, 
    caption: `*${name}* le da un abrazo a *${name2}* (づ｡◕‿‿◕｡)づ` 
  }, { quoted: m })
}

handler.help = ['hug *<@user>*']
handler.tags = ['fun']
handler.command = ['hug', 'abrazo']

export default handler
