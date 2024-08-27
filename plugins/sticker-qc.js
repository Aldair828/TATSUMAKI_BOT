let handler = async (m, { conn }) => {
    // Definir los niveles y la XP requerida para cada nivel
    const niveles = [150, 300, 600, 1200, 2400, 4800, 9600, 19200, 38400, 76800];
    
    let usuarios = Object.entries(global.db.data.users).map(([id, data]) => {
        // Calcular el nivel actual según la XP del usuario
        let xp = data.xp || 0;
        let nivel = 0;
        for (let i = 0; i < niveles.length; i++) {
            if (xp >= niveles[i]) nivel = i + 1;
            else break;
        }

        return {
            id,
            xp,
            nivel
        };
    }).sort((a, b) => b.xp - a.xp).slice(0, 29); // Ordenar por XP y tomar los primeros 29

    let mensaje = `🏆 *TOP XP* 🏆\n\n`;
    for (let i = 0; i < usuarios.length; i++) {
        let user = usuarios[i];
        mensaje += `${i + 1}. *USUARIO:* https://wa.me/${user.id.split('@')[0]}\n`;
        mensaje += `*NIVEL:* ${user.nivel}\n\n`;
    }

    // Mencionar a los usuarios
    await conn.reply(m.chat, mensaje, m, {
        mentions: usuarios.map(u => u.id)
    });
};

handler.help = ['topxp'];
handler.tags = ['xp'];
handler.command = ['topxp'];

export default handler;
