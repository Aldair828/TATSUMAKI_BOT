import { addExif } from '../lib/sticker.js'
let handler = async (m, { conn, text }) => {
  if (!m.quoted) return m.reply(`🍭 Responde al stikert que desea robar el nombre\n\n Ejemplo: .robar Aldair 👨🏻‍💻`)
  let stiker = false
  try {
    let [packname, ...author] = text.split('|')
    author = (author || []).join('|')
    let mime = m.quoted.mimetype || ''
    if (!/webp/.test(mime)) return m.reply(`🍭 Responde al stikert que desea robar el nombre\n\n Ejemplo: .robar Aldair 👨🏻‍💻.`)
    let img = await m.quoted.download()
    if (!img) return m.reply(`🍭 Responde al stikert que desea robar el nombre\n\n Ejemplo: .robar Aldair 👨🏻‍💻`)
    stiker = await addExif(img, packname || '', author || '')
  } catch (e) {
    console.error(e)
    if (Buffer.isBuffer(e)) stiker = e
  } finally {
    if (stiker) conn.sendFile(m.chat, stiker, 'wm.webp', '', m)
    else return m.reply(`🍭 Responde al stikert que desea robar el nombre\n\n Ejemplo: .robar Aldair 👨🏻‍💻`)
  }
}
handler.help = ['wm <nombre>|<autor>']
handler.tags = ['sticker']
handler.command = ['take', 'robarstickert', 'wm'] 
handler.register = true 
export default handler
