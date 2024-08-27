let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender];
    
    // Manejo de comando .xp
    if (command === 'xp') {
        const niveles = [150, 300, 600, 1200, 2400, 4800, 9600, 19200, 38400, 76800];
        let xp = user.xp || 0;
        let nivel = 0;
        
        for (let i = 0; i < niveles.length; i++) {
            if (xp >= niveles[i]) {
                nivel = i + 1;
            } else {
                break;
            }
        }
        
        let message = `🌟 Tu XP actual es: ${xp}\n` +
                      `🔺 Nivel: ${nivel}`;
        
        conn.reply(m.chat, message, m);
    }
    
    // Juego .adivina
    else if (command === 'adivina') {
        if (!args[0]) return m.reply(`Por favor, elige un número entre 1 y 10. Ejemplo: *${usedPrefix}${command} 5*`);
        
        let eleccionUsuario = parseInt(args[0]);
        if (isNaN(eleccionUsuario) || eleccionUsuario < 1 || eleccionUsuario > 10) return m.reply('Número inválido. Debes elegir un número entre 1 y 10.');
        
        let numeroAleatorio = Math.floor(Math.random() * 10) + 1;
        if (eleccionUsuario === numeroAleatorio) {
            user.xp += 100; // Ganar 100 XP por acertar
            conn.reply(m.chat, `🎉 ¡Felicidades! Adivinaste el número ${numeroAleatorio}. Has ganado 100 XP.`, m);
        } else {
            conn.reply(m.chat, `❌ No acertaste. El número era ${numeroAleatorio}. ¡Inténtalo de nuevo!`, m);
        }
    }
    
    // Juego .ppt
    else if (command === 'ppt') {
        if (!args[0]) return m.reply(`Por favor, elige piedra, papel o tijera. Ejemplo: *${usedPrefix}${command} piedra*`);
        
        let opciones = ['piedra', 'papel', 'tijera'];
        let eleccionUsuario = args[0].toLowerCase();
        if (!opciones.includes(eleccionUsuario)) return m.reply('Opción inválida. Debes elegir entre piedra, papel o tijera.');
        
        let eleccionBot = opciones[Math.floor(Math.random() * opciones.length)];
        
        let resultado = '';
        if (eleccionUsuario === eleccionBot) {
            resultado = '¡Empate!';
        } else if ((eleccionUsuario === 'piedra' && eleccionBot === 'tijera') ||
                   (eleccionUsuario === 'papel' && eleccionBot === 'piedra') ||
                   (eleccionUsuario === 'tijera' && eleccionBot === 'papel')) {
            resultado = '¡Ganaste!';
            user.xp += 50; // Ganar 50 XP por ganar
        } else {
            resultado = '¡Perdiste!';
        }
        
        conn.reply(m.chat, `Tú elegiste: ${eleccionUsuario}\nYo elegí: ${eleccionBot}\n\n${resultado}`, m);
    }
};

handler.help = ['xp', 'adivina <número>', 'ppt <piedra/papel/tijera>'];
handler.tags = ['game', 'xp'];
handler.command = ['xp', 'adivina', 'ppt'];

export default handler;
