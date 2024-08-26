let handler = async (m, { conn }) => {
    // Verifica si el usuario tiene un tiempo de espera activo
    let user = global.db.data.users[m.sender];
    let tiempoActual = new Date().getTime();
    let tiempoRestante = user.lastCofre ? (user.lastCofre + 20 * 60 * 1000) - tiempoActual : 0;

    if (tiempoRestante > 0) {
        let minutosRestantes = Math.floor(tiempoRestante / 60000);
        let segundosRestantes = Math.floor((tiempoRestante % 60000) / 1000);
        return conn.reply(m.chat, `Debes esperar ${minutosRestantes} minutos y ${segundosRestantes} segundos antes de abrir otro cofre.`, m);
    }

    // Contador global para determinar cuándo se debe ganar el moño
    global.moñoCounter = global.moñoCounter || 0;
    global.moñoCounter += 1;

    // Lista de animales con sus emojis y créditos
    const animales = [
        { emoji: '🐶', creditos: 1 },
        { emoji: '🐱', creditos: 2 },
        { emoji: '🐭', creditos: 3 },
        { emoji: '🦊', creditos: 4 },
        { emoji: '🐻', creditos: 1 },
        { emoji: '🐼', creditos: 2 },
        { emoji: '🐨', creditos: 3 }
    ];

    // Función para determinar el premio
    function seleccionarPremio() {
        if (global.moñoCounter >= 60) {
            global.moñoCounter = 0; // Reiniciar el contador después de ganar el moño
            return { emoji: '🎀', creditos: 500 };
        } else {
            const randomIndex = Math.floor(Math.random() * animales.length);
            return animales[randomIndex];
        }
    }

    // Selección del premio
    let premio = seleccionarPremio();
    let mensaje;
    
    if (premio.emoji === '🎀') {
        user.limit += premio.creditos; // Agregar 500 créditos al perfil del usuario
        mensaje = `ENHORABUENAAAAA te ganaste el moño 🎀\n\n¡Has ganado 500 créditos que han sido agregados a tu cuenta!\n\nTus créditos han sido actualizados.`;
    } else {
        user.limit += premio.creditos; // Agregar créditos al perfil del usuario
        mensaje = `¡Has ganado ${premio.emoji}! Has obtenido ${premio.creditos} crédito${premio.creditos > 1 ? 's' : ''}. Tus créditos han sido actualizados.`;
    }

    // Actualizar el tiempo de la última apertura del cofre
    user.lastCofre = tiempoActual;

    // Enviar el mensaje con el resultado
    await conn.reply(m.chat, mensaje, m);
}

handler.help = ['cofre'];
handler.tags = ['game'];
handler.command = /^cofre$/i;
handler.register = true;

export default handler;
