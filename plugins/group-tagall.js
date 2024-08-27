const handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }

  const pesan = args.join` `;
  const oi = `${pesan}`;
  let teks = `🇮 🇳 🇻 🇴 🇨 🇦 🇳 🇩 🇴  \n\n🇦 🇱  \n\n🇬 🇷 🇺 🇵 🇴\n\n*RAZÓN:* ${oi}\n\n╭──────༺♡༻──────╮\n\n`;

  // Añadir menciones para etiquetar a todos los participantes
  teks += participants.map(mem => `🤖 @${mem.id.split('@')[0]}`).join('\n') + '\n\n';

  teks += `╰──────༺♡༻──────╯`;

  conn.sendMessage(m.chat, { text: teks, mentions: participants.map(a => a.id) });
};

handler.help = ['tagall <mensaje>', 'invocar <mensaje>'];
handler.tags = ['group'];
handler.command = /^(tagall|invocar|marcar|todos|invocación|ta)$/i;
handler.admin = true;
handler.group = true;

export default handler;
