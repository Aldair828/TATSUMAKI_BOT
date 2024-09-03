const handler = async (m, { isOwner, isAdmin, conn, participants }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }

  // Tiempo límite de inactividad (24 horas en milisegundos)
  const tiempoLimite = 24 * 60 * 60 * 1000;

  // Filtrar los participantes que no han enviado mensajes en las últimas 24 horas
  let ahora = new Date().getTime();
  let fantasmas = participants.filter(mem => {
    let user = global.db.data.users[mem.id];
    return user && (ahora - user.lastMessage > tiempoLimite);
  });

  // Construir el mensaje
  let teks = `👻 *FANTASMAS EN EL GRUPO* 👻\n\nEstos usuarios no han hablado en las últimas 24 horas:\n\n`;
  teks += fantasmas.map(mem => `@${mem.id.split('@')[0]}`).join('\n') + '\n\n';

  // Enviar el mensaje al chat con las menciones
  if (fantasmas.length > 0) {
    await conn.sendMessage(m.chat, { text: teks, mentions: fantasmas.map(a => a.id) });
  } else {
    await conn.sendMessage(m.chat, { text: "No hay fantasmas en el grupo. Todos han participado en las últimas 24 horas." });
  }
};

handler.help = ['fantasmas'];
handler.tags = ['group'];
handler.command = /^(fantasmas|inactivos)$/i;
handler.admin = true;
handler.group = true;

export default handler;
