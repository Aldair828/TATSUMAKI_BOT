// Mapeo de rangos y beneficios
const rangos = {
    '🥉 BRONCE': { multiplicador: 2 },
    '🥈 PLATA': { multiplicador: 3 },
    '🥇 ORO': { multiplicador: 4 },
    '💎 DIAMANTE': { multiplicador: 5 },
    '🃏 MAESTRO': { multiplicador: 6 },
    '💮 LEYENDA': { multiplicador: 7 },
};

let handlerComprar = async (m, { conn, args }) => {
    let user = global.db.data.users[m.sender];
    if (!args[0] || isNaN(args[0])) {
        return conn.reply(m.chat, 'Por favor, ingresa el nombre del rango que deseas comprar.', m);
    }

    let rango = args[0].toUpperCase();
    if (!Object.keys(rangos).includes(rango)) {
        return conn.reply(m.chat, 'Rango no válido. Usa el comando `.tienda` para ver los rangos disponibles.', m);
    }

    let costo = 100; // Ejemplo de costo para todos los rangos
    if (user.limit < costo) {
        return conn.reply(m.chat, 'No tienes suficientes créditos para comprar este rango.', m);
    }

    user.limit -= costo;
    user.rango = rango;
    conn.reply(m.chat, `¡Felicidades! Has comprado el rango ${rango}.`, m);
}

let handlerTienda = async (m, { conn }) => {
    let mensaje = '🛒 **TIENDA DE RANGOS**\n\n';
    for (let [rango, beneficios] of Object.entries(rangos)) {
        mensaje += `*${rango}*\nBeneficio: Multiplicador de ${beneficios.multiplicador}x en juegos\nCosto: 100 créditos\n\n`;
    }
    conn.reply(m.chat, mensaje, m);
}

handlerComprar.help = ['comprar [rango]'];
handlerComprar.tags = ['shop'];
handlerComprar.command = /^comprar$/i;
handlerComprar.register = true;

handlerTienda.help = ['tienda'];
handlerTienda.tags = ['shop'];
handlerTienda.command = /^tienda$/i;
handlerTienda.register = true;

export { handlerComprar, handlerTienda };
