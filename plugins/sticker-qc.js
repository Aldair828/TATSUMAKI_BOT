let handler = async (m, { conn }) => {
    // Obtener todos los usuarios y mapear a un formato más sencillo
    let users = Object.entries(global.db.data.users).map(([key, value]) => {
        return { ...value, id: key, xp: value.xp || 0 }; // Asegurarse de que xp esté definido
    });

    // Ordenar a los usuarios por XP en orden descendente
    users.sort((a, b) => b.xp - a.xp);

    // Definir los niveles de XP
    let niveles = [150, 300, 600, 1200, 2400, 4800, 9600, 19200, 38400, 76800];

    // Crear el mensaje para los 29 usuarios con más XP
    let top = users.slice(0, 29).map((user, index) => {
        let nivel = 0;
        for (let i = 0; i < niveles.length; i++) {
            if (user.xp >= niveles[i]) {
                nivel = i + 1;
            } else {
                break;
            }
        }
        return `\n${index + 1})\n*[💮] NOMBRE:* ${user.name || "Usuario desconocido"}\n*[👤] USUARIO:* https://wa.me/${user.id.split('@')[0]}\n*[⭐] XP:* ${user.xp}\n*[💫] NIVEL:* ${nivel}`;
    }).join('\n');

    // Enviar el mensaje al chat
    let mensaje = `🏆 *TOP XP* 🏆\n${top}`;
    await conn.reply(m.chat, mensaje, m);
};

handler.help = ['topxp'];
handler.tags = ['xp'];
handler.command = ['topxp', 'top'];

export default handler;
