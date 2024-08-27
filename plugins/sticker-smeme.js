// Juego Adivina
let handlerAdivina = async (m, { conn, args }) => {
    let user = global.db.data.users[m.sender];
    let numeroAleatorio = Math.floor(Math.random() * 10) + 1;
    let numeroUsuario = parseInt(args[0]);

    if (!numeroUsuario || numeroUsuario < 1 || numeroUsuario > 10) {
        return conn.reply(m.chat, 'Por favor, ingresa un número entre 1 y 10.', m);
    }

    if (numeroUsuario === numeroAleatorio) {
        let xpGanado = 50;
        user.xp = (user.xp || 0) + xpGanado;
        conn.reply(m.chat, `¡Correcto! Has ganado ${xpGanado} XP.`, m);
    } else {
        conn.reply(m.chat, `Incorrecto. El número correcto era ${numeroAleatorio}.`, m);
    }
};

// Juego PPT (Piedra, Papel, Tijeras)
let handlerPpt = async (m, { conn, args }) => {
    let user = global.db.data.users[m.sender];
    let opciones = ['piedra', 'papel', 'tijeras'];
    let eleccionUsuario = args[0]?.toLowerCase();
    let eleccionBot = opciones[Math.floor(Math.random() * opciones.length)];

    if (!opciones.includes(eleccionUsuario)) {
        return conn.reply(m.chat, 'Por favor, elige entre piedra, papel o tijeras.', m);
    }

    let resultado;
    if (eleccionUsuario === eleccionBot) {
        resultado = 'Empate';
    } else if (
        (eleccionUsuario === 'piedra' && eleccionBot === 'tijeras') ||
        (eleccionUsuario === 'papel' && eleccionBot === 'piedra') ||
        (eleccionUsuario === 'tijeras' && eleccionBot === 'papel')
    ) {
        let xpGanado = 30;
        user.xp = (user.xp || 0) + xpGanado;
        resultado = `¡Ganaste! Has ganado ${xpGanado} XP.`;
    } else {
        resultado = 'Perdiste. Mejor suerte la próxima vez.';
    }

    conn.reply(m.chat, `El bot eligió: ${eleccionBot}\n${resultado}`, m);
};

// Comando XP
let handlerXp = async (m, { conn }) => {
    let user = global.db.data.users[m.sender];
    let xp = user.xp || 0;

    // Calcula el nivel en función del XP
    let niveles = [
        { nivel: 1, xpNecesario: 150 },
        { nivel: 2, xpNecesario: 300 },
        { nivel: 3, xpNecesario: 600 },
        { nivel: 4, xpNecesario: 1200 },
        { nivel: 5, xpNecesario: 2400 },
        { nivel: 6, xpNecesario: 4800 },
        { nivel: 7, xpNecesario: 9600 },
        { nivel: 8, xpNecesario: 19200 },
        { nivel: 9, xpNecesario: 38400 },
        { nivel: 10, xpNecesario: 76800 }
    ];

    let nivelActual = niveles.reduce((acc, curr) => xp >= curr.xpNecesario ? curr.nivel : acc, 0);
    let xpParaSiguienteNivel = niveles.find(n => n.nivel === nivelActual + 1)?.xpNecesario || 'Máximo nivel alcanzado';
    let xpRestante = xpParaSiguienteNivel === 'Máximo nivel alcanzado' ? 0 : xpParaSiguienteNivel - xp;

    let mensaje = `🌟 *Tu XP*: ${xp}\n` +
                  `🎯 *Nivel actual*: ${nivelActual}\n` +
                  `🔮 *XP para el siguiente nivel*: ${xpParaSiguienteNivel}\n` +
                  `📈 *XP restante para subir*: ${xpRestante}`;

    conn.reply(m.chat, mensaje, m);
};

// Exportar los handlers
handlerAdivina.help = ['adivina'];
handlerAdivina.tags = ['game'];
handlerAdivina.command = /^adivina$/i;
handlerAdivina.register = true;

handlerPpt.help = ['ppt'];
handlerPpt.tags = ['game'];
handlerPpt.command = /^ppt$/i;
handlerPpt.register = true;

handlerXp.help = ['xp'];
handlerXp.tags = ['info'];
handlerXp.command = /^xp$/i;
handlerXp.register = true;

export { handlerAdivina, handlerPpt, handlerXp };
