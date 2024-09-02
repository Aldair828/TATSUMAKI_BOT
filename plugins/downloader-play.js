let handler = async (m, { conn, args, usedPrefix, command }) => {
    let chat = global.db.data.chats[m.chat] || {};
    let user = global.db.data.users[m.sender] || {};

    // Inicializar advertencias si no existen
    if (!user.warnings) user.warnings = 0;

    if (command === 'warn') {
        if (!args.length) {
            return m.reply(`Uso: ${usedPrefix}warn <usuario> <mensaje>\nEjemplo: ${usedPrefix}warn @usuario Comportamiento inapropiado.`);
        }

        let usuario = args[0];
        let mensaje = args.slice(1).join(' ');

        // Asegurarse de que el ID de usuario esté en formato correcto
        usuario = usuario.replace('@', '');

        // Incrementar el contador de advertencias del usuario
        let warnedUser = global.db.data.users[usuario] || {};
        if (!warnedUser.warnings) warnedUser.warnings = 0;
        warnedUser.warnings++;

        let warning = `
⚠️ *ADVERTENCIA* ⚠️

${usuario}, ${mensaje}

*🔔 Advertencias: ${warnedUser.warnings} de 3*
        `.trim();

        await conn.reply(m.chat, warning, m);

        // Verificar si el usuario ha alcanzado el límite de advertencias
        if (warnedUser.warnings >= 3) {
            await conn.groupParticipantsUpdate(m.chat, [usuario], 'remove');
            await conn.reply(m.chat, `🚫 ${usuario} ha sido eliminado del grupo por recibir 3 advertencias.`, m);
            warnedUser.warnings = 0; // Restablecer el contador de advertencias
        }
    } else if (command === 'topactivos') {
        let topActivos = Object.entries(global.db.data.users)
            .filter(([key, userData]) => userData.xp > 0)
            .sort((a, b) => b[1].xp - a[1].xp)
            .slice(0, 10)
            .map(([key, userData], index) => {
                return `${index + 1}. ${key} - XP: ${userData.xp}`;
            })
            .join('\n');

        let mensaje = `
*📈 TOP 10 ACTIVOS 📈*

${topActivos || 'No hay usuarios activos.'}
        `.trim();

        await conn.reply(m.chat, mensaje, m);
    }

    // Guardar los cambios en la base de datos
    global.db.data.users[m.sender] = user;
    global.db.data.users[usuario] = warnedUser;
};

handler.help = ['warn <usuario> <mensaje>', 'topactivos'];
handler.tags = ['group'];
handler.command = ['warn', 'topactivos'];

export default handler;
