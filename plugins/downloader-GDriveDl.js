let handler = async (m, { conn }) => {
    // Verifica si el usuario tiene un tiempo de espera activo
    let user = global.db.data.users[m.sender];
    let tiempoActual = new Date().getTime();
    let tiempoRestante = user.lastCaza ? (user.lastCaza + 30 * 60 * 1000) - tiempoActual : 0;

    if (tiempoRestante > 0) {
        let minutosRestantes = Math.floor(tiempoRestante / 60000);
        let segundosRestantes = Math.floor((tiempoRestante % 60000) / 1000);
        return conn.reply(m.chat, `Debes esperar ${minutosRestantes} minutos y ${segundosRestantes} segundos antes de cazar de nuevo.`, m);
    }

    // Lista de animales con sus emojis, créditos y probabilidades
    const animales = [
        { emoji: '🦊', nombre: 'Zorro', creditos: 2, probabilidad: 10 },
        { emoji: '🐗', nombre: 'Jabalí', creditos: 3, probabilidad: 5 },
        { emoji: '🐷', nombre: 'Cerdo', creditos: 1, probabilidad: 20 },
        { emoji: '🐔', nombre: 'Pollo', creditos: 1, probabilidad: 20 },
        { emoji: '🦆', nombre: 'Pato', creditos: 1, probabilidad: 20 },
        { emoji: '🐦', nombre: 'Pájaro', creditos: 1, probabilidad: 20 },
        { emoji: '🐵', nombre: 'Mono', creditos: 2, probabilidad: 10 },
        { emoji: '🐘', nombre: 'Elefante', creditos: 5, probabilidad: 3 },
        { emoji: '🐮', nombre: 'Vaca', creditos: 2, probabilidad: 10 },
        { emoji: '🐯', nombre: 'Tigre', creditos: 4, probabilidad: 4 },
        { emoji: '🐭', nombre: 'Ratón', creditos: 1, probabilidad: 20 },
        { emoji: '🐴', nombre: 'Caballo', creditos: 3, probabilidad: 5 },
        { emoji: '🐧', nombre: 'Pingüino', creditos: 3, probabilidad: 5 }
    ];

    // Función para seleccionar animales aleatoriamente según la probabilidad
    function seleccionarAnimal() {
        let totalProbabilidad = animales.reduce((total, animal) => total + animal.probabilidad, 0);
        let random = Math.floor(Math.random() * totalProbabilidad);
        for (let animal of animales) {
            if (random < animal.probabilidad) {
                return animal;
            }
            random -= animal.probabilidad;
        }
    }

    // Selección aleatoria de 3 animales
    let capturados = [];
    for (let i = 0; i < 3; i++) {
        capturados.push(seleccionarAnimal());
    }

    // Suma de los créditos capturados
    let totalCreditos = capturados.reduce((total, animal) => total + animal.creditos, 0);
    let mensajeCaptura = `Cazaste:\n\n${capturados.map(a => `${a.emoji}`).join(' + ')}\n\n`;

    // Muestra los animales capturados y sus créditos
    mensajeCaptura += capturados.map(a => `${a.nombre} ${a.emoji} ${a.creditos} crédito${a.creditos > 1 ? 's' : ''}`).join('\n') + '\n\n';
    mensajeCaptura += `¡Has ganado ${totalCreditos} crédito${totalCreditos > 1 ? 's' : ''}!`;

    // Sumar los créditos al usuario
    user.limit += totalCreditos;

    // Actualizar el tiempo de la última caza
    user.lastCaza = tiempoActual;

    // Enviar el mensaje con la captura
    await conn.reply(m.chat, mensajeCaptura, m);
}

handler.help = ['cazar'];
handler.tags = ['game'];
handler.command = /^cazar$/i;
handler.register = true;

export default handler;
