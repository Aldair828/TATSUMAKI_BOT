// Comando .topcreditos
let handler = async (m, { conn }) => {
    let users = Object.entries(global.db.data.users)
        .filter(([jid, user]) => user.registered)
        .sort(([, a], [, b]) => b.creditos - a.creditos)
        .slice(0, 50); // Top 50 usuarios

    let str = '▂▃▄▅▆▇█▓▒░ 𝐓𝐎𝐏 👑 ░▒▓█▇▆▅▄▃▂\n\n';

    users.forEach(([jid, user], index) => {
        let rank;
        if (user.creditos >= 1700) rank = '💮 LEYENDA';
        else if (user.creditos >= 1200) rank = '🃏 MAESTRO';
        else if (user.creditos >= 700) rank = '💎 DIAMANTE';
        else if (user.creditos >= 300) rank = '🥇 ORO';
        else if (user.creditos >= 100) rank = '🥈 PLATA';
        else rank = '🥉 BRONCE';

        str += `${index + 1})\n*[👤] 𝚄𝚂𝚄𝙰𝚁𝙸𝙾:* ${conn.getName(jid)}\n*[📱] 𝙽𝚄𝙼𝙴𝚁𝙾:* https://wa.me/${jid.split('@')[0]}\n*[💸] 𝙲𝚁𝙴́𝙳𝙸𝚃𝙾𝚂:* ${limit}\n*[🔱] 𝚁𝙰𝙽𝙶𝙾:* ${rank}\n\n`;
    });

    conn.reply(m.chat, str.trim(), m);
}

handler.help = ['topcreditos'];
handler.tags = ['econ'];
handler.command = /^topcreditos$/i;

export default handler;
