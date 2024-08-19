import { createHash } from 'crypto';
import PhoneNumber from 'awesome-phonenumber';
import fetch from 'node-fetch';

// Handler del perfil
let handler = async (m, { conn, usedPrefix }) => {
  let fkontak = {
    "key": {
      "participants": "0@s.whatsapp.net",
      "remoteJid": "status@broadcast",
      "fromMe": false,
      "id": "Halo"
    },
    "message": {
      "contactMessage": {
        "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    "participant": "0@s.whatsapp.net"
  }

  let user = global.db.data.users[m.sender];
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
  
  // Verificar si el usuario está registrado
  if (!user.registered) {
    conn.reply(m.chat, 'Por favor, regístrate usando el comando `.reg nombre.edad` antes de usar este comando`.', m);
    return;
  }

  let pp = 'https://telegra.ph/file/2180abd039f16b246d23f.jpg';
  try {
    pp = await conn.getProfilePicture(who);
  } catch (e) {
    // Manejar errores si es necesario
  } finally {
    let { name, limit, lastclaim, registered, regTime, age, banned, level, premiumTime } = global.db.data.users[who];
    let mentionedJid = [who];
    let username = conn.getName(who);
    let prem = global.prems.includes(who.split`@`[0]);
    let sn = createHash('md5').update(who).digest('hex');

    // Definir estado basado en si el usuario está baneado o no
    let estado = banned ? 'BANEADO [❌]' : 'LIBRE [✅]';

    // Verificar si es usuario premium y cuánto tiempo le queda
    let premiumStatus = prem ? `Usuario VIP (Expira en ${premiumTime} días)` : 'Usuario Regular';

    let str = `*PERFIL DE* @${who.split('@')[0]}

*[👤] NOMBRE →* ${name}
*[📅] EDAD →* ${age} años
*[🔗] ID →* ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
*[💬] NICKNAME →* ${username}
*[💰] CRÉDITOS →* ${registered ? limit : 'No se encuentra registrado'}
*[🌟] NIVEL →* ${level || 1}
*[💎] PREMIUM →* ${premiumStatus}
*[🔒] ESTADO →* ${estado}


*[🔢] NÚMERO DE SERIE:* ${sn}`;
    
    conn.sendFile(m.chat, pp, 'pp.jpg', str, fkontak, false, { contextInfo: { mentionedJid }});
  }
}

handler.help = ['profile [@user]'];
handler.tags = ['xp'];
handler.command = /^perfil|profile?$/i;

export default handler;

// Comando para otorgar premium
let givePremium = async (m, { conn, text }) => {
  let [mentionedJid, days] = text.split(' '); // Mencionado y días de premium
  if (!mentionedJid || !days) return conn.reply(m.chat, 'Uso: .premium @usuario número_de_días', m);
  mentionedJid = mentionedJid.replace('@', '') + '@s.whatsapp.net';
  
  let user = global.db.data.users[mentionedJid];
  if (!user) return conn.reply(m.chat, 'Usuario no encontrado', m);

  user.premiumTime = (user.premiumTime || 0) + parseInt(days);
  if (!global.prems.includes(mentionedJid)) global.prems.push(mentionedJid);

  conn.reply(m.chat, `*${conn.getName(mentionedJid)}* ahora tiene premium por ${days} días.`, m);
}

givePremium.command = /^premium$/i;
givePremium.help = ['premium @usuario número_de_días'];
givePremium.tags = ['admin'];
givePremium.rowner = true;

export { givePremium };
