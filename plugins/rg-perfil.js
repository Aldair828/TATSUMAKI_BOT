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
        conn.reply(m.chat, 'Por favor, regístrate usando el comando `.reg nombre.edad.pais` antes de usar este comando.', m);
        return;
    }

    let pp = 'https://telegra.ph/file/37e80f39f8e371743c4cf.jpg';
    try {
        pp = await conn.getProfilePicture(who);
    } catch (e) {
        // Manejar errores si es necesario
    } finally {
        let { name, limit, lastclaim, registered, regTime, age, banned, level, premiumTime, country } = global.db.data.users[who];
        let mentionedJid = [who];
        let username = conn.getName(who);
        let prem = global.prems.includes(who.split`@`[0]);
        let sn = createHash('md5').update(who).digest('hex');

        // Calcular el top de créditos
        let sortedUsers = Object.entries(global.db.data.users)
            .filter(([jid, user]) => user.registered)
            .sort(([, a], [, b]) => b.limit - a.limit);
        
        let topPosition = sortedUsers.findIndex(([jid, u]) => jid === who) + 1;
        
        // Calcular el rango del usuario
        let rank;
        if (limit >= 1700) rank = '💮 LEYENDA';
        else if (limit >= 1200) rank = '🃏 MAESTRO';
        else if (limit >= 700) rank = '💎 DIAMANTE';
        else if (limit >= 300) rank = '🥇 ORO';
        else if (limit >= 100) rank = '🥈 PLATA';
        else rank = '🥉 BRONCE';

        // Definir estado basado en si el usuario está baneado o no
        let estado = banned ? 'BANEADO [❌]' : 'LIBRE [✅]';

        // Verificar si es usuario premium y cuánto tiempo le queda
        let premiumStatus = prem ? `Usuario VIP (Expira en ${premiumTime} días)` : 'Usuario Regular';

        let str = `*PERFIL DE* @${who.split('@')[0]}

*[👤] NOMBRE →* ${name}
*[📅] EDAD →* ${age} años
*[🔗] ID →* ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
*[💬] NICKNAME →* ${username}
*[💸] CRÉDITOS →* ${limit}
*[💵] CRÉDITOS EN EL BANCO →* ${user.banco || 0}
*[🌟] NIVEL →* ${level || 1}
*[🔱] TOP →* ${topPosition} de ${sortedUsers.length}
*[🔱] RANGO →* ${rank}
*[💎] PREMIUM →* ${premiumStatus}
*[🔒] ESTADO →* ${estado}

*[🔢] NÚMERO DE SERIE:* ${sn}


SI QUIERES GUARDAR TUS CRÉDITOS EN EL BANCO USA EL COMANDO 
.depositar cantidad 

SI QUIERES RETIRAR LOS CRÉDITOS DEL BANCO USA EL COMANDO 
.retirar cantidad

.top  para ver los mejores en créditos`;
        
        conn.sendFile(m.chat, pp, 'pp.jpg', str, fkontak, false, { contextInfo: { mentionedJid }});
    }
}

handler.help = ['profile [@user]'];
handler.tags = ['xp'];
handler.command = /^perfil|profile?$/i;

export default handler;
