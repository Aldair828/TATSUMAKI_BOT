import fetch from 'node-fetch';
import axios from 'axios';
import { youtubedl, youtubedlv2 } from '@bochilteam/scraper';
import fs from 'fs';
import yts from 'yt-search';
import ytmp33 from '../lib/ytmp33.js';
import ytmp44 from '../lib/ytmp44.js';
import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

const limit1 = 100;
const limit2 = 400;
const limit_a1 = 50;
const limit_a2 = 400;

const handler = async (m, { conn, command, args, text, usedPrefix }) => {
  if (!text) throw `_* DESCARGAS (￣へ ￣ )*_\n\n*[ ℹ️ ] Hace falta el título o enlace del video de YouTube.*\n\n*[ 💡 ] Ejemplo:* _${usedPrefix + command} Good Feeling - Flo Rida_`;

  const yt_play = await search(args.join(' '));
  let additionalText = '';
  if (command === 'play5') {
    additionalText = 'audio';
  } else if (command === 'play6') {
    additionalText = 'vídeo';
  }

  const texto1 = `_*DESCARGAS - MEGUMIN 🔥*_\n╭───────┈♡┈──────\n│𐇵 *𝑻𝒊𝒕𝒖𝒍𝒐:* ${yt_play[0].title}\n│𐇵 *𝑃𝑢𝑏𝑙𝑖𝑐𝑎𝑑𝑜:* ${yt_play[0].ago}\n│𐇵 *𝐷𝑢𝑟𝑎𝑐𝑖𝑜𝑛:* ${secondString(yt_play[0].duration.seconds)}\n│𐇵 *𝑉𝑖𝑠𝑡𝑎𝑠:* ${MilesNumber(yt_play[0].views)}\n│𐇵 *𝐴𝑢𝑡𝑜𝑟:* ${yt_play[0].author.name}\n│𐇵 *𝐼𝐷:* ${yt_play[0].videoId}\n│𐇵 *𝑇𝑖𝑝𝑜:* ${yt_play[0].type}\n│𐇵 *𝐸𝑛𝑙𝑎𝑐𝑒:* ${yt_play[0].url}\n│𐇵 *𝐶𝑎𝑛𝑎𝑙:* ${yt_play[0].author.url}\n╰───────┈♢┈──────\n> *[ ℹ️ ] _𝐒𝐞 𝐞𝐬𝐭𝐚́ 𝐞𝐧𝐯𝐢𝐚𝐧𝐝𝐨 𝐞𝐥 ${additionalText}. 𝐞𝐬𝐩𝐞𝐫𝐞..._`.trim();

  const externalAdReply = {
    title: '♡  ͜ ۬︵࣪᷼⏜݊᷼𝘿𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙨⏜࣪᷼︵۬ ͜ ',
    body: '<(✿◠‿◠)> 𝙈𝙚𝙜𝙪𝙢𝙞𝙣🔥',
    sourceUrl: global.cn,
    thumbnail: global.logo7
  };

  conn.sendMessage(m.chat, { image: { url: yt_play[0].thumbnail }, caption: texto1, contextInfo: { externalAdReply } }, { quoted: m });

  if (command === 'play5') {
    try {
      const { status, resultados, error } = await ytmp33(yt_play[0].url);
      if (!status) throw new Error(error);

      const ttl = resultados.titulo;
      const buff_aud = await getBuffer(resultados.descargar);
      const size = calculateSize(buff_aud);

      if (size >= limit_a2) {
        await conn.sendMessage(m.chat, { text: `[ ℹ️ ] Descargue su audio en:* _${resultados.descargar}_` }, { quoted: m });
        return;
      }
      if (size >= limit_a1 && size <= limit_a2) {
        await conn.sendMessage(m.chat, { document: buff_aud, mimetype: 'audio/mpeg', fileName: ttl + `.mp3` }, { quoted: m });
        return;
      } else {
        await conn.sendMessage(m.chat, { audio: buff_aud, mimetype: 'audio/mpeg', fileName: ttl + `.mp3` }, { quoted: m });
        return;
      }
    } catch (error) {
      console.log('Error en ytmp33: ' + error);
      try {
        const audio = `${global.MyApiRestBaseUrl}/api/v1/ytmp3?url=${yt_play[0].url}&apikey=${global.MyApiRestApikey}`;
        const ttl = await yt_play[0].title;
        const buff_aud = await getBuffer(audio);
        const size = calculateSize(buff_aud);

        if (size >= limit_a2) {
          await conn.sendMessage(m.chat, { text: `[ ℹ️ ] Descargue su audio en:* _${audio}_` }, { quoted: m });
          return;
        }
        if (size >= limit_a1 && size <= limit_a2) {
          await conn.sendMessage(m.chat, { document: buff_aud, mimetype: 'audio/mpeg', fileName: ttl + `.mp3` }, { quoted: m });
          return;
        } else {
          await conn.sendMessage(m.chat, { audio: buff_aud, mimetype: 'audio/mpeg', fileName: ttl + `.mp3` }, { quoted: m });
          return;
        }
      } catch {
        throw '*[ ℹ️ ] Ocurrió un error. Por favor, inténtelo de nuevo más tarde.*';
      }
    }
  }

  if (command === 'play6') {
    try {
      const { status, resultados, error } = await ytmp44(yt_play[0].url);
      if (!status) throw new Error(error);

      const ttl2 = resultados.titulo;
      const buff_vid = await getBuffer(resultados.descargar);
      const size2 = calculateSize(buff_vid);

      if (size2 >= limit2) {
        await conn.sendMessage(m.chat, { text: `*[ ℹ️ ] Descargue su vídeo en:* _${resultados.descargar}_` }, { quoted: m });
        return;
      }
      if (size2 >= limit1 && size2 <= limit2) {
        await conn.sendMessage(m.chat, { document: buff_vid, mimetype: 'video/mp4', fileName: ttl2 + `.mp4` }, { quoted: m });
        return;
      } else {
        await conn.sendMessage(m.chat, { video: buff_vid, mimetype: 'video/mp4', fileName: ttl2 + `.mp4` }, { quoted: m });
        return;
      }
    } catch (error) {
      console.log('Error en ytmp44: ' + error);
      try {
        const video = `${global.MyApiRestBaseUrl}/api/v1/ytmp4?url=${yt_play[0].url}&apikey=${global.MyApiRestApikey}`;
        const ttl2 = await yt_play[0].title;
        const buff_vid = await getBuffer(video);
        const size2 = calculateSize(buff_vid);

        if (size2 >= limit2) {
          await conn.sendMessage(m.chat, { text: `*[ ℹ️ ] Descargue su vídeo en:* _${video}_` }, { quoted: m });
          return;
        }
        if (size2 >= limit1 && size2 <= limit2) {
          await conn.sendMessage(m.chat, { document: buff_vid, mimetype: 'video/mp4', fileName: ttl2 + `.mp4` }, { quoted: m });
          return;
        } else {
          await conn.sendMessage(m.chat, { video: buff_vid, mimetype: 'video/mp4', fileName: ttl2 + `.mp4` }, { quoted: m });
          return;
        }
      } catch {
        throw '*[ ℹ️ ] Ocurrió un error. Por favor, inténtelo de nuevo más tarde.*';
      }
    }
  }
};

handler.command = ['play5', 'play6'];
export default handler;

async function search(query, options = {}) {
  const search = await yts.search({ query, hl: 'es', gl: 'ES', ...options });
  return search.videos;
}

function MilesNumber(number) {
  const exp = /(\d)(?=(\d{3})+(?!\d))/g;
  const rep = '$1.';
  const arr = number.toString().split('.');
  arr[0] = arr[0].replace(exp, rep);
  return arr[1] ? arr.join('.') : arr[0];
}

 function secondString(seconds) {
  let minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);
  let hours = Math.floor(minutes / 60);
  minutes = Math.floor(minutes % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

async function getBuffer(url) {
  const response = await fetch(url);
  return await response.buffer();
}

function calculateSize(buffer) {
  // Size in bytes
  return buffer.length / 1024; // Size in KB
}
