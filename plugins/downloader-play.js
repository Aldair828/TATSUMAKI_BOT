import fg from 'api-dylux';
import { youtubedl, youtubedlv2 } from '@bochilteam/scraper';
import fs from "fs";
import yts from 'yt-search';
import axios from 'axios';
import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

let limit1 = 100;
let limit2 = 400;
let limit_a1 = 50;
let limit_a2 = 400;

const handler = async (m, { conn, command, args, text, usedPrefix }) => {
  try {
    if (!text) throw `_* DESCARGAS (￣へ￣ )*_\n\n*[ ℹ️ ] Hace falta el título o enlace del video de YouTube.*\n\n*[ 💡 ] Ejemplo:* _${usedPrefix + command} Good Feeling - Flo Rida_`;

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

    await conn.sendMessage(m.chat, { image: { url: yt_play[0].thumbnail }, caption: texto1, contextInfo: { externalAdReply } }, { quoted: m });

    if (command === 'play5') {
      await downloadAudio(m, conn, yt_play[0].url, yt_play[0].title);
    } else if (command === 'play6') {
      await downloadVideo(m, conn, yt_play[0].url, yt_play[0].title);
    }
  } catch (error) {
    console.error('Error en el comando:', error);
    await conn.sendMessage(m.chat, { text: '*[ ℹ️ ] Ocurrió un error. Por favor, inténtalo de nuevo más tarde.*' }, { quoted: m });
  }
};

async function downloadAudio(m, conn, url, title) {
  try {
    const { source, error } = await fg.mp3(url);
    if (error) throw new Error(error);

    const buff_aud = await getBuffer(source);
    const size = (buff_aud.byteLength / (1024 * 1024)).toFixed(2);

    if (size >= limit_a2) {
      await conn.sendMessage(m.chat, { text: `[ ℹ️ ] Descargue su audio en: _${source}_` }, { quoted: m });
    } else if (size >= limit_a1 && size <= limit_a2) {
      await conn.sendMessage(m.chat, { document: buff_aud, mimetype: 'audio/mpeg', fileName: `${title}.mp3` }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, { audio: buff_aud, mimetype: 'audio/mpeg', fileName: `${title}.mp3` }, { quoted: m });
    }
  } catch (error) {
    console.log('Error en la descarga de audio:', error);
    throw '*[ ℹ️ ] Ocurrió un error al descargar el audio. Por favor, inténtalo de nuevo más tarde.*';
  }
}

async function downloadVideo(m, conn, url, title) {
  try {
    const { source, error } = await fg.mp4(url);
    if (error) throw new Error(error);

    const buff_vid = await getBuffer(source);
    const size2 = (buff_vid.byteLength / (1024 * 1024)).toFixed(2);

    if (size2 >= limit2) {
      await conn.sendMessage(m.chat, { text: `*[ ℹ️ ] Descargue su vídeo en: _${source}_` }, { quoted: m });
    } else if (size2 >= limit1 && size2 <= limit2) {
      await conn.sendMessage(m.chat, { document: buff_vid, mimetype: 'video/mp4', fileName: `${title}.mp4` }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, { video: buff_vid, mimetype: 'video/mp4', fileName: `${title}.mp4` }, { quoted: m });
    }
  } catch (error) {
    console.log('Error en la descarga de vídeo:', error);
    throw '*[ ℹ️ ] Ocurrió un error al descargar el vídeo. Por favor, inténtalo de nuevo más tarde.*';
  }
}

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
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const dDisplay = d > 0 ? d + (d == 1 ? 'd ' : 'd ') : '';
  const hDisplay = h > 0 ? h + (h == 1 ? 'h ' : 'h ') : '';
  const mDisplay = m > 0 ? m + (m == 1 ? 'm ' : 'm ') : '';
  const sDisplay = s > 0 ? s + (s == 1 ? 's' : 's') : '';
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

const getBuffer = async (url, options) => {
  options = options || {};
  const res = await axios({ method: 'get', url, headers: { 'DNT': 1, 'Upgrade-Insecure-Request': 1 }, ...options, responseType: 'arraybuffer' });
  return res.data;
};

handler.command = ['play5', 'play6'];
export default handler;
