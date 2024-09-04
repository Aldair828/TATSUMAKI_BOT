let handler = async (m, { conn, usedPrefix, command }) => {
    let pp = 'https://tinyurl.com/2yjwb8gd'; // Imagen para el primer enlace
    let pp2 = 'https://tinyurl.com/27fyq5lp'; // Imagen para el segundo enlace
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

    console.log(`Command received: ${command}`);
    console.log(`Who: ${who}, Name2: ${name2}, Sender: ${name}`);

    await conn.sendMessage(m.chat, {
        video: { url: [pp, pp2].getRandom() },
        gifPlayback: true,
        caption: `*${name}* ah besado a *${name2}* (ง'̀-'́)ง`
    }, { quoted: m });
};

handler.help = ['besar *<@user>*'];
handler.tags = ['fun'];
handler.command = ['besar', 'beso'];

export default handler;
