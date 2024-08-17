import { promises as fs } from 'fs';
import { join } from 'path';

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    // Lee y parsea el archivo package.json
    let _package = JSON.parse(await fs.readFile(join(__dirname, '../package.json')).catch(_ => '{}')) || {};

    // Obtén la información del usuario desde la base de datos global
    let { exp, limit, level } = global.db.data.users[m.sender];
    let name = await conn.getName(m.sender);
    
    // Configuración de la fecha y hora locales
    let d = new Date(new Date() + 3600000); // Ajusta la hora si es necesario
    let locale = 'es';
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5];
    let week = d.toLocaleDateString(locale, { weekday: 'long' });
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d);
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });

    // Obtén el uptime del proceso
    let _uptime = process.uptime() * 1000;
    let _muptime;
    if (process.send) {
      process.send('uptime');
      _muptime = await new Promise(resolve => {
        process.once('message', resolve);
        setTimeout(resolve, 1000);
      }) * 1000;
    }
    let muptime = clockString(_muptime);
    let uptime = clockString(_uptime);
    
    // Obtén el total de usuarios registrados
    let totalreg = Object.keys(global.db.data.users).length;
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length;

    // Texto del nuevo menú
    let menuText = `
    “ Bienvenido *${name}*, usted entró al menú de *Tatsumaki_Bot* ”

    *Puede seguir el canal del bot: https://whatsapp.com/channel/0029VafZvB6J3jv3qCnqNu3x  :)*
    
    ╭──⬣「 *Info User* 」⬣
    │  ≡◦ *🍭 Nombre ∙* ${name}
    │  ≡◦ *💸 Creditos ∙* ${limit}
    │  ≡◦ *💫 XP ∙* ${exp}
    │  ≡◦ *🐢 Nivel ∙* ${level}
    ╰──⬣
    
    *L I S T A  -  M E N Ú S*

    ╭──⬣「 *Info 📚* 」⬣
    │  ≡◦ *.owner*
    │  ≡◦ *.grupos*
    │  ≡◦ *.status*
    │  ≡◦ *.totalfunciones*
    │  ≡◦ *.menu*
    │  ≡◦ *.ping*
    │  ≡◦ *.runtime*
    │  ≡◦ *.script*
    ╰──⬣

    ╭──⬣「 *Busquedas 🔎* 」⬣
    │  ≡◦ *.mercadolibre <búsqueda>*
    │  ≡◦ *.pinterest*
    │  ≡◦ *.soundsearch <búsqueda>*
    │  ≡◦ *.spotifysearch <búsqueda>*
    │  ≡◦ *.tiktoksearch <txt>*
    │  ≡◦ *.tweetposts <búsqueda>*
    ╰──⬣
    `;

    // Enviar el menú
    conn.sendMessage(m.chat, menuText, 'conversation');
  } catch (e) {
    console.error(e);
  }
}

// Función auxiliar para formatear el tiempo
function clockString(ms) {
  if (isNaN(ms)) return '--:--:--';
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}

export default handler;
