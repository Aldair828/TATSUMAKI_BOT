let handler = async (m, { conn, args, usedPrefix, command }) => {
    let chat = global.db.data.chats[m.chat] || {};
    let user = global.db.data.users[m.sender] || {};

    // Inicializar advertencias si no existen
    if (!user.warnings) user.warnings = 0;

    if (command === 'destacar') {
        if (!args.length) {
            return m.reply(`Uso: ${usedPrefix}destacar <mensaje>\nEjemplo: ${usedPrefix}destacar Bienvenido al grupo!`);
        }

        let mensaje = args.join(' ');
        let destacado = `
*🔖 MENSAJE DESTACADO 🔖*

${mensaje}
        `.trim();

        // Fijar el mensaje destacado en el grupo
        await conn.sendMessage(m.chat, { text: destacado, mentions: [m.sender] }, { quoted: m });
    } else if (command === 'anuncio') {
        if (!args.length) {
            return m.reply(`Uso: ${usedPrefix}anuncio <mensaje>\nEjemplo: ${usedPrefix}anuncio No olviden el evento de esta noche.`);
        }

        let mensaje = args.join(' ');
        let anuncio = `
📢 *ANUNCIO IMPORTANTE* 📢

${mensaje}
        `.trim();

        await conn.reply(m.chat, anuncio, m);
    } else if (command === 'warn') {
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
    }

    // Guardar los cambios en la base de datos
    global.db.data.users[m.sender] = user;
};

handler.help = ['destacar <mensaje>', 'anuncio <mensaje>', 'warn <usuario> <mensaje>'];
handler.tags = ['group'];
handler.command = ['destacar', 'anuncio', 'warn'];

export default handler;
