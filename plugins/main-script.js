import moment from 'moment-timezone'
import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {
let res = await fetch('')
let json = await res.json()
try {
let txt = '`- 乂  S C R I P T  -  M A I N`\n\n'
    txt += `	•   *Nombre* : Tatsumaki_Bot`
    txt += `	•   *Visitas* : ${json.watchers_count}\n`
    txt += `	•   *Peso* : ${(json.size / 1024).toFixed(2)} MB\n`
    txt += `	•   *Actualizado* : ${moment(json.updated_at).format('DD/MM/YY - HH:mm:ss')}\n`
    txt += `	•   *Url* : pv`
    txt += `	•   *Forks* : ${json.forks_count}\n`
    txt += `	•   *Stars* : ${json.stargazers_count}\n\n`
    txt += `> 🚩 *${textbot}*`
let img = await (await fetch(`https://telegra.ph/file/fe6a85c234611b741a557.jpg`)).buffer()

await conn.sendAi(m.chat, botname, textbot, txt, img, img, canal, m)
} catch {
await m.react('✖️')
}}
handler.help = ['script']
handler.tags = ['main']
handler.command = ['script', 'sc']
handler.register = true 
export default handler
