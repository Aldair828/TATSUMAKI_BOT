let handler = async (m, { conn }) => {
    let users = Object.entries(global.db.data.users)
        .map(([key, value]) => ({ ...value, jid: key }))
        .filter(user => user.xp > 0)
        .sort((a, b) => b.xp - a.xp)
        .slice(0, 29);

    let text = users.map((user, i) => {
        // Calcular el nivel según el XP
        const niveles = [150, 300, 600, 1200, 2400, 4800, 9600, 19200, 38400, 76800];
        let nivel = 0;
        for (let j = 0; j < niveles.length; j++) {
            if (user.xp >= niveles[j]) {
                nivel = j + 1;
            } else {
                break;
            }
        }

        return `${i + 1})\n*[💮] NOMBRE:* ${conn.getName(user.jid)}\n*[👤] USUARIO:* https://wa.me/${user.jid.split('@')[0]}\n*[⭐] XP:* ${user.xp}\n*[💫] NIVEL:* ${nivel}\n`;
    }).join('\n');

    conn.reply(m.chat, text, m);
};

handler.help = ['topxp'];
handler.tags = ['xp'];
handler.command = ['top'];

export default handler;
