let handler = async (m, { conn }) => {
    let users = Object.entries(global.db.data.users)
        .map(([key, value]) => ({
            id: key,
            xp: value.xp,
            nivel: calcularNivel(value.xp),
        }))
        .filter(user => user.xp > 0)
        .sort((a, b) => b.xp - a.xp)
        .slice(0, 29); // Mostrar los primeros 29 usuarios

    let texto = '*🏆 TOP XP 🏆*\n\n';

    users.forEach((user, index) => {
        texto += `${index + 1})\n*[👤] USUARIO:* https://wa.me/${user.id.split('@')[0]}\n*[💫] NIVEL:* ${user.nivel}\n\n`;
    });

    await conn.reply(m.chat, texto.trim(), m);
}

handler.help = ['topxp'];
handler.tags = ['xp'];
handler.command = ['topxp'];

export default handler;

// Función para calcular el nivel basado en la XP
function calcularNivel(xp) {
    const niveles = [150, 300, 600, 1200, 2400, 4800, 9600, 19200, 38400, 76800];
    let nivel = 0;
    for (let i = 0; i < niveles.length; i++) {
        if (xp >= niveles[i]) {
            nivel = i + 1;
        } else {
            break;
        }
    }
    return nivel;
}
