let handler = async (m, { conn, usedPrefix, command, text }) => {
    let user = global.db.data.users[m.sender];

    // Verificar si el usuario está en el rango "Plata"
    if (user.limit < 100 || user.limit >= 300) {
        return conn.reply(m.chat, 'Este comando puede ser usado llegando al top plata', m);
    }

    // Tabla de préstamos y tiempos de pago
    const prestamos = {
        100: 2 * 60 * 60 * 1000, // 2 horas
        300: 3 * 60 * 60 * 1000, // 3 horas
        600: 4 * 60 * 60 * 1000, // 4 horas
        1200: 5 * 60 * 60 * 1000, // 5 horas
        2400: 6 * 60 * 60 * 1000, // 6 horas
        4800: 7 * 60 * 60 * 1000, // 7 horas
    };

    // Verificar el monto del préstamo
    let monto = parseInt(text);
    if (!prestamos[monto]) {
        return conn.reply(m.chat, `Por favor elige una cantidad válida para el préstamo: ${Object.keys(prestamos).join(', ')}`, m);
    }

    // Verificar si ya tiene un préstamo pendiente
    if (user.prestamo && user.prestamo.monto > 0) {
        return conn.reply(m.chat, 'Ya tienes un préstamo pendiente. Debes pagarlo antes de solicitar otro.', m);
    }

    // Asignar el préstamo al usuario
    user.limit += monto;
    user.prestamo = {
        monto: monto,
        fechaPago: Date.now() + prestamos[monto]
    };

    conn.reply(m.chat, `Has recibido un préstamo de ${monto} créditos. Debes pagarlo en ${prestamos[monto] / (60 * 60 * 1000)} horas.`, m);

    // Configurar el temporizador para verificar el pago del préstamo
    setTimeout(() => {
        if (user.prestamo.monto > 0) {
            conn.reply(m.chat, `@${m.sender.split('@')[0]} usted no pagó su préstamo en el tiempo indicado, los créditos que gane se les descontará gracias...`, null, { mentions: [m.sender] });

            // Iniciar el descuento automático de los créditos ganados
            user.prestamo.descuentoActivo = true;
        }
    }, prestamos[monto]);
}

// Interceptar las ganancias del usuario para descontar el préstamo si es necesario
let handlerCreditInterceptor = async (user, creditsGained) => {
    if (user.prestamo && user.prestamo.descuentoActivo) {
        if (creditsGained >= user.prestamo.monto) {
            user.limit += (creditsGained - user.prestamo.monto); // Restar el monto del préstamo y dejar el resto
            user.prestamo = {}; // Borrar el préstamo
        } else {
            user.prestamo.monto -= creditsGained; // Restar del monto del préstamo
        }
    } else {
        user.limit += creditsGained; // Si no hay descuento activo, simplemente agregar los créditos ganados
    }
};

handler.help = ['prestamo <cantidad>'];
handler.tags = ['econ'];
handler.command = /^prestamo$/i;
handler.group = true;
handler.register = true;

export default handler;
