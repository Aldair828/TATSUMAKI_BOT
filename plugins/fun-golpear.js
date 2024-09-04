let handler = async (m, { conn, usedPrefix, command }) => {
    let pp = 'https://tinyurl.com/26q5b36b'; // Imagen para el primer enlace
    let pp2 = 'https://tinyurl.com/26q5b36b'; // Imagen para el segundo enlace
    let who;

    if (m.isGroup) {
        who = m.mentionedJid[0];
    } else {
        who = m.chat;
    }

    if (!who) {
        return conn.reply(m.chat, '✦ Menciona al usuario con *@user*', m);
    }

    let name2 = conn.getName(who);
    let name = conn.getName(m.sender);

    await conn.sendMessage(m.chat, {
        video: { url: [pp, pp2].getRandom() },
        gifPlayback: true,
        caption: `*${name}*` + ' está golpeando a' + ` *${name2}*` + ' (ง'`(`'̀)ง'
    }, { quoted: m });
};

handler.help = ['golpear *<@user>*'];
handler.tags = ['fun'];
handler.command = ['golpear', 'pegar'];

export default handler;
