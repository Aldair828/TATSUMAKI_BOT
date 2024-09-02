import { WAMessageStubType } from '@whiskeysockets/baileys';
import fetch from 'node-fetch';

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;

  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => 'https://telegra.ph/file/4bd1287b136d79909b905.jpg');
  let img = await (await fetch(`${pp}`)).buffer();
  let chat = global.db.data.chats[m.chat];

  let userId = m.messageStubParameters[0];
  let user = global.db.data.users[userId];
  let creditos = user ? user.creditos : "No tiene registro";
  let fechaIngreso = `1 de septiembre`;
  let horaIngreso = `8:34 pm`;

  if (chat.bienvenida && m.messageStubType == 27) {
    let bienvenida = `*_FENIX_BOT  🐦‍🔥_*\n\n𝘽𝙄𝙀𝙉𝙑𝙀𝙉𝙄𝘿𝙊 @${userId.split`@`[0]}\n\n𝙂𝙍𝙐𝙋𝙊:\n\n*< ${groupMetadata.subject} >*\n\n*╔══════✮•°♛°•✮ ═════╗*\n\n       *TU INFORMACIÓN 📜*\n\n*╚══════✮•°♛°•✮ ═════╝*\n\n*➢ NUMERO:* ${userId.split`@`[0]}\n*➢ NOMBRE:* ${user?.nombre || "Desconocido"}\n*➢ INGRESO:* ${fechaIngreso} --- ${horaIngreso}`;

    await conn.sendAi(m.chat, botname, textbot, bienvenida, img, img, canal);
  }

  if (chat.bienvenida && m.messageStubType == 28) {
    let bye = `@${userId.split`@`[0]} *SALIÓ DEL GRUPO* 🌐`;
    await conn.sendAi(m.chat, botname, textbot, bye, img, img, canal);
  }

  if (chat.bienvenida && m.messageStubType == 32) {
    let kick = `@${userId.split`@`[0]} *SALIÓ DEL GRUPO* 🌐`;
    await conn.sendAi(m.chat, botname, textbot, kick, img, img, canal);
  }
}
