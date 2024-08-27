let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender];

    // Inicializar XP si no existe
    if (!user.xp) user.xp = 0;

    // Niveles y XP requerido para cada nivel
    const niveles = [150, 300, 600, 1200, 2400, 4800, 9600, 19200, 38400, 76800];
    let xp = user.xp;
    let nivel = 0;
    let xpParaSiguienteNivel = 0;

    // Calcular el nivel actual y el XP faltante para el siguiente nivel
    for (let i = 0; i < niveles.length; i++) {
        if (xp >= niveles[i]) {
            nivel = i + 1;
        } else {
            xpParaSiguienteNivel = niveles[i] - xp;
            break;
        }
    }

    // Si el usuario ya está en el nivel máximo
    let siguienteNivel = nivel < niveles.length ? nivel + 1 : "Máximo";
    let textoSiguienteNivel = nivel < niveles.length ? `Nivel ${siguienteNivel} (${xpParaSiguienteNivel} XP restantes)` : "N/A";

    if (command === 'xp') {
        // Formato de la respuesta
        let mensaje = `
╔══════✮❁•°♛°•❁✮ ═════╗

  𝐂𝐀𝐑𝐓𝐄𝐑𝐀 𝐃𝐄 @${m.sender.split('@')[0]}

*⭐ XP ➩* ${xp}
*💫 NIVEL ➩* ${nivel}
*🌹SIGUIENTE NIVEL ➩* ${textoSiguienteNivel}

JUEGA LOS SIGUIENTES JUEGOS PARA GANAR XP 

.adivina  adivina un número del 1 al 100
.ppt  escoje piedra papel o tijera 

se agregará más juegos de XP 

╚══════✮❁•°❀°•❁✮══════╝
        `.trim();

        // Enviar respuesta con texto e imagen
        await conn.sendFile(m.chat, 'https://telegra.ph/file/9c80900ea18e0a13443ad.jpg', '', mensaje, m, {
            mentions: [m.sender]
        });
    } else if (command === 'ppt') {
        // Juego de Piedra, Papel o Tijera
        let opciones = ['piedra', 'papel', 'tijera'];
        let eleccionUsuario = args[0]?.toLowerCase();
        if (!opciones.includes(eleccionUsuario)) return m.reply(`Elige una opción válida: piedra, papel o tijera.`);

        let eleccionBot = opciones[Math.floor(Math.random() * opciones.length)];
        let resultado;

        if (eleccionUsuario === eleccionBot) {
            resultado = `Empate. Ambos eligieron ${eleccionBot}.`;
        } else if (
            (eleccionUsuario === 'piedra' && eleccionBot === 'tijera') ||
            (eleccionUsuario === 'papel' && eleccionBot === 'piedra') ||
            (eleccionUsuario === 'tijera' && eleccionBot === 'papel')
        ) {
            let xpGanado = Math.floor(Math.random() * 41) + 60; // XP entre 60 y 100
            user.xp += xpGanado;
            resultado = `¡Ganaste! Elegiste ${eleccionUsuario} y el bot eligió ${eleccionBot}. Has ganado ${xpGanado} XP.`;
        } else {
            resultado = `Perdiste. Elegiste ${eleccionUsuario} y el bot eligió ${eleccionBot}.`;
        }

        // Enviar resultado sin imagen
        await conn.reply(m.chat, resultado, m);
    } else if (command === 'adivina') {
        // Juego de Adivinar el Número
        let numero = Math.floor(Math.random() * 100) + 1;
        let adivinanza = parseInt(args[0]);
        if (isNaN(adivinanza) || adivinanza < 1 || adivinanza > 100) return m.reply(`Adivina un número entre 1 y 100.`);

        if (adivinanza === numero) {
            let xpGanado = 500; // XP fijo de 500
            user.xp += xpGanado;
            await conn.reply(m.chat, `¡Felicidades! Adivinaste el número correcto ${numero}. Has ganado ${xpGanado} XP.`, m);
        } else {
            await conn.reply(m.chat, `Lo siento, el número era ${numero}. Inténtalo de nuevo.`, m);
        }
    } else if (command === 'agregarxp') {
        // Agregar XP
        let usuarioObjetivo = m.mentionedJid[0];
        let cantidad = parseInt(args[1]);

        if (!usuarioObjetivo || isNaN(cantidad)) return m.reply('Debes mencionar a un usuario válido y especificar una cantidad de XP.');

        let usuario = global.db.data.users[usuarioObjetivo];
        usuario.xp = (usuario.xp || 0) + cantidad;

        m.reply(`Se han añadido ${cantidad} XP a @${usuarioObjetivo.split('@')[0]}.`, null, { mentions: [usuarioObjetivo] });
    } else if (command === 'quitarxp') {
        // Quitar XP
        let usuarioObjetivo = m.mentionedJid[0];
        let cantidad = parseInt(args[1]);

        if (!usuarioObjetivo || isNaN(cantidad)) return m.reply('Debes mencionar a un usuario válido y especificar una cantidad de XP.');

        let usuario = global.db.data.users[usuarioObjetivo];
        usuario.xp = Math.max((usuario.xp || 0) - cantidad, 0);

        m.reply(`Se han quitado ${cantidad} XP a @${usuarioObjetivo.split('@')[0]}.`, null, { mentions: [usuarioObjetivo] });
    }
};

handler.help = ['ppt <piedra/papel/tijera>', 'adivina <número>', 'xp', 'agregarxp @user cantidad', 'quitarxp @user cantidad'];
handler.tags = ['game'];
handler.command = ['ppt', 'adivina', 'xp', 'agregarxp', 'quitarxp'];

export default handler;
