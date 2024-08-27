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

╚══════✮❁•°❀°•❁✮══════╝
        `.trim();

        // Enviar respuesta
        await conn.reply(m.chat, mensaje, m, {
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

        await conn.reply(m.chat, resultado, m);
    } else if (command === 'adivina') {
        // Juego de Adivinar el Número
        let numero = Math.floor(Math.random() * 100) + 1;
        let adivinanza = parseInt(args[0]);
        if (isNaN(adivinanza) || adivinanza < 1 || adivinanza > 100) return m.reply(`Adivina un número entre 1 y 100.`);

        if (adivinanza === numero) {
            let xpGanado = Math.floor(Math.random() * 41) + 60; // XP entre 60 y 100
            user.xp += xpGanado;
            await conn.reply(m.chat, `¡Felicidades! Adivinaste el número correcto ${numero}. Has ganado ${xpGanado} XP.`, m);
        } else {
            await conn.reply(m.chat, `Lo siento, el número era ${numero}. Inténtalo de nuevo.`, m);
        }
    }
};

handler.help = ['ppt <piedra/papel/tijera>', 'adivina <número>'];
handler.tags = ['game'];
handler.command = ['ppt', 'adivina', 'xp'];

export default handler;
