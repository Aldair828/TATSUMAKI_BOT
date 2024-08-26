import { createHash } from 'crypto';
import PhoneNumber from 'awesome-phonenumber';
import fetch from 'node-fetch';

// Comando .tienda
let tiendaHandler = async (m, { conn }) => {
    let tienda = `
*🏆 TIENDA DE RANGOS 🏆*

🥉 *Bronce* - 100 créditos
   Beneficio: Duplica las recompensas en juegos.
   
🥈 *Plata* - 300 créditos
   Beneficio: Triplica las recompensas en juegos.

🥇 *Oro* - 700 créditos
   Beneficio: Cuadruplica las recompensas en juegos.

💎 *Diamante* - 1200 créditos
   Beneficio: Quintuplica las recompensas en juegos.

🃏 *Maestro* - 1700 créditos
   Beneficio: Sextuplica las recompensas en juegos.

💮 *Leyenda* - 3000 créditos
   Beneficio: Septuplica las recompensas en juegos.

_Usa el comando .comprar [rango] para adquirir un rango._
`;

    await conn.reply(m.chat, tienda.trim(), m);
}

tiendaHandler.help = ['tienda'];
tiendaHandler.tags = ['shop'];
tiendaHandler.command = /^tienda$/i;
tiendaHandler.register = true;

// Comando .comprar
let comprarHandler = async (m, { conn, args }) => {
    let user = global.db.data.users[m.sender];
    let rango = args[0] ? args[0].toLowerCase() : '';

    const rangos = {
        bronce: { precio: 100, multiplicador: 2 },
        plata: { precio: 300, multiplicador: 3 },
        oro: { precio: 700, multiplicador: 4 },
        diamante: { precio: 1200, multiplicador: 5 },
        maestro: { precio: 1700, multiplicador: 6 },
        leyenda: { precio: 3000, multiplicador: 7 }
    };

    if (!rangos[rango]) {
        return conn.reply(m.chat, 'Por favor, elige un rango válido para comprar. Usa .tienda para ver los rangos disponibles.', m);
    }

    let { precio, multiplicador } = rangos[rango];

    if (user.limit < precio) {
        return conn.reply(m.chat, `No tienes suficientes créditos para comprar el rango ${rango}. Necesitas ${precio} créditos.`, m);
    }

    user.limit -= precio;
    user.rango = rango;
    user.multiplicador = multiplicador;

    conn.reply(m.chat, `¡Felicidades! Has comprado el rango *${rango}* y ahora tus recompensas en juegos se multiplican por ${multiplicador}.`, m);
}

comprarHandler.help = ['comprar [rango]'];
comprarHandler.tags = ['shop'];
comprarHandler.command = /^comprar$/i;
comprarHandler.register = true;

// Comando cazar
let cazarHandler = async (m, { conn }) => {
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

    // Suma de los créditos capturados con el multiplicador del rango
    let totalCreditos = capturados.reduce((total, animal) => total + animal.creditos, 0) * (user.multiplicador || 1);
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

cazarHandler.help = ['cazar'];
cazarHandler.tags = ['game'];
cazarHandler.command = /^cazar$/i;
cazarHandler.register = true;

// Exportar handlers
export { tiendaHandler, comprarHandler, cazarHandler };
