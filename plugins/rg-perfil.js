import { createHash } from 'crypto';
import PhoneNumber from 'awesome-phonenumber';
import fetch from 'node-fetch';

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
  
  // Check if the user is registered
  if (!user.registered) {
    conn.reply(m.chat, 'Por favor, regístrate usando el comando `.reg nombre.edad` antes de usar este comando`.', m);
    return;
  }

  let pp = 'https://telegra.ph/file/1f6505497e2ce19a16685.mp4';
  try {
    pp = await conn.getProfilePicture(who);
  } catch (e) {
    // Handle errors here if necessary
  } finally {
    let { name, limit, lastclaim, registered, regTime, age } = global.db.data.users[who];
    let mentionedJid = [who];
    let username = conn.getName(who);
    let prem = global.prems.includes(who.split`@`[0]);
    let sn = createHash('md5').update(who).digest('hex');
    let str = `[#Tatsumaki_Bot]

*DATOS GENERALES*

*[🙎‍♂️] ID →* ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
*[🗒] NOMBRES →* ${name}
*[⚡] ALIAS →* ${username}
*[💰] CREDITOS →* ${registered ? limit : 'No se encuentra registrado'}
*[📈] ESTADO →* ${registered ? 'Registrado' : 'No Registrado'}`;
    
    conn.sendFile(m.chat, pp, 'pp.jpg', str, fkontak, false, { contextInfo: { mentionedJid }});
  }
}

handler.help = ['profile [@user]'];
handler.tags = ['xp'];
handler.command = /^perfil|profile?$/i;

export default handler;
