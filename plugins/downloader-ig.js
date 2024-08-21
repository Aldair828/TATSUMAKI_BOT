let handler = async (m, { conn, usedPrefix, command, text }) => {
    let user = global.db.data.users[m.sender];

    // Inicializar el registro de préstamos si no existe
    if (!global.db.data.prestamos) global.db.data.prestamos = [];

    // Tabla de préstamos y tiempos de pago
    const prestamos = {
        100: { tiempo: 2 * 60 * 60 * 1000, maxUsuarios: Infinity }, // Todos los usuarios pueden pedirlo
        300: { tiempo: 3 * 60 * 60 * 1000, maxUsuarios: Infinity }, // Todos los usuarios pueden pedirlo
        600: { tiempo: 4 * 60 * 60 * 1000, maxUsuarios: 10 }, // 10 personas pueden pedirlo
        1200: { tiempo: 5 * 60 * 60 * 1000, maxUsuarios: 5 }, // 5 personas pueden pedirlo
        2400: { tiempo: 6 * 60 * 60 * 1000, maxUsuarios: 3 }, // 3 personas pueden pedirlo
        4800: { tiempo: 7 * 60 * 60 * 1000, maxUsuarios: 2 }, // 2 personas pueden pedirlo
    };

    // Comando .prestamo
    if (command === 'prestamo') {
        // Verificar si el usuario está en el rango "Plata"
        if (user.limit < 20 || user.limit >= 300) {
            return conn.reply(m.chat, 'Este comando puede ser usado pasando los 20 créditos.', m);
        }

        // Verificar el monto del préstamo
        let monto = parseInt(text);
        if (!prestamos[monto]) {
            return conn.reply(m.chat, 
                `Por favor elige una cantidad válida para el préstamo\n\n` +
                `Estos son los préstamos disponibles:\n` +
                `100  =  tiempo a pagar 2 horas\n` +
                `300  =  tiempo a pagar 3 horas\n` +
                `600  =  tiempo a pagar 4 horas\n` +
                `1200  =  tiempo a pagar 5 horas\n` +
                `2400  =  tiempo a pagar 6 horas\n` +
                `4800  =  tiempo a pagar 7 horas\n\n Ejemplo: .prestamo 100`, m);
        }

        // Verificar el número de usuarios que ya tienen el préstamo solicitado
        let usuariosConPrestamo = global.db.data.prestamos.filter(p => p.monto === monto).length;
        if (usuariosConPrestamo >= prestamos[monto].maxUsuarios) {
            return conn.reply(m.chat, 'Las vacantes para este préstamo están llenas, espera a que alguien pague su préstamo para pedir uno. Gracias...', m);
        }

        // Verificar si ya tiene un préstamo pendiente
        if (user.prestamo && user.prestamo.monto > 0) {
            return conn.reply(m.chat, 'Ya tienes un préstamo pendiente. Debes pagarlo antes de solicitar otro.', m);
        }

        // Asignar el préstamo al usuario
        user.limit += monto;
        user.prestamo = {
            monto: monto,
            fechaPago: Date.now() + prestamos[monto].tiempo,
            descuentoActivo: false
        };

        // Registrar el préstamo en la base de datos
        global.db.data.prestamos.push({ usuario: m.sender, monto: monto });

        conn.reply(m.chat, `Has recibido un préstamo de ${monto} créditos. Debes pagarlo en ${prestamos[monto].tiempo / (60 * 60 * 1000)} horas.\n\n.pagar < cantidad > para pagar el préstamo`, m);

        // Configurar el temporizador para verificar el pago del préstamo
        setTimeout(() => {
            if (user.prestamo.monto > 0) {
                conn.reply(m.chat, `@${m.sender.split('@')[0]} usted no pagó su préstamo en el tiempo indicado, los créditos que gane se les descontarán. Gracias...`, null, { mentions: [m.sender] });

                // Iniciar el descuento automático de los créditos ganados
                user.prestamo.descuentoActivo = true;

                // Eliminar el préstamo del registro
                global.db.data.prestamos = global.db.data.prestamos.filter(p => p.usuario !== m.sender || p.monto !== user.prestamo.monto);
            }
        }, prestamos[monto].tiempo);
    }

    // Comando .pagar
    else if (command === 'pagar') {
        let cantidad = parseInt(text);

        if (!user.prestamo || user.prestamo.monto <= 0) {
            return conn.reply(m.chat, 'No tienes préstamos pendientes por pagar.', m);
        }

        if (isNaN(cantidad) || cantidad <= 0) {
            return conn.reply(m.chat, `Uso: ${usedPrefix}${command} <cantidad>\n\nTu deuda actual es de ${user.prestamo.monto} créditos.`, m);
        }

        if (user.limit < cantidad) {
            return conn.reply(m.chat, `No tienes suficientes créditos para pagar esa cantidad. Necesitas ${user.prestamo.monto} créditos para saldar tu deuda.`, m);
        }

        // Pagar la deuda
        if (cantidad >= user.prestamo.monto) {
            user.limit -= user.prestamo.monto;
            user.prestamo = {}; // Eliminar el préstamo

            // Eliminar el préstamo del registro
            global.db.data.prestamos = global.db.data.prestamos.filter(p => p.usuario !== m.sender || p.monto !== user.prestamo.monto);

            conn.reply(m.chat, 'Su préstamo fue pagado con éxito. No tiene deudas.', m);
        } else {
            user.limit -= cantidad;
            user.prestamo.monto -= cantidad;
            
            conn.reply(`Has pagado ${cantidad} créditos. Tu deuda restante es de ${user.prestamo.monto} créditos.`, m);
        }
    }
}

// Interceptar las ganancias del usuario para descontar el préstamo si es necesario
let handlerCreditInterceptor = async (user, creditsGained) => {
    if (user.prestamo && user.prestamo.descuentoActivo) {
        if (creditsGained >= user.prestamo.monto) {
            user.limit += (creditsGained - user.prestamo.monto); // Restar el monto del préstamo y dejar el resto
            user.prestamo = {}; // Borrar el préstamo

            // Eliminar el préstamo del registro
            global.db.data.prestamos = global.db.data.prestamos.filter(p => p.usuario !== user.id || p.monto !== user.prestamo.monto);
        } else {
            user.prestamo.monto -= creditsGained; // Restar del monto del préstamo
        }
    } else {
        user.limit += creditsGained; // Si no hay descuento activo, simplemente agregar los créditos ganados
    }
};

handler.help = ['prestamo <cantidad>', 'pagar <cantidad>'];
handler.tags = ['econ'];
handler.command = /^prestamo|pagar$/i;
handler.group = true;
handler.register = true;

export default handler;
