let handler = async (m, { conn }) => {
    let users = Object.entries(global.db.data.users)
        .filter(([jid, user]) => user.registered)
        .sort(([, a], [, b]) => b.limit - a.limit)
        .slice(0, 29); // Top 29 usuarios

    let str = 'PUEDES PEDIR UN PRÉSTAMO CON EL COMANDO .prestamo\n\nSi usted tiene dinero en el banco y no lo ha retirado, no va a salir en el top porque son créditos guardados\n\n▂▃▄▅▆▇█▓▒░ 𝐓𝐎𝐏 👑 ░▒▓█▇▆▅▄▃▂\n\n';

    users.forEach(([jid, user], index) => {
        let rank;
        if (user.limit >= 1700) rank = '6';
        else if (user.limit >= 1200) rank = '5;
        else if (user.limit >= 700) rank = '4';
        else if (user.limit >= 300) rank = '3';
        else if (user.limit >= 100) rank = '2';
        else rank = '1';

        str += `${index + 1})\n*[👤] 𝚄𝚂𝚄𝙰𝚁𝙸𝙾:* ${conn.getName(jid)}\n*[📱] 𝙽𝚄𝙼𝙴𝚁𝙾:* https://wa.me/${jid.split('@')[0]}\n*[💸] 𝙲𝚁𝙴́𝙳𝙸𝚃𝙾𝚂:* ${user.limit}\n*[🔱] 𝚁𝙰𝙽𝙶𝙾:* ${rank}\n\n`;
    });

    let imageUrl = 'https://telegra.ph/file/13e6e5f9038ad6cc9b3f1.jpg'; // Reemplaza este enlace con el de tu imagen
    conn.sendFile(m.chat, imageUrl, 'topcreditos.jpg', str.trim(), m);
}

handler.help = ['topcreditos'];
handler.tags = ['econ'];
handler.command = /^topcreditos$/i;

export default handler;
