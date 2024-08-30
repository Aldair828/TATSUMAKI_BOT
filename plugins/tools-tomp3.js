let handler = async (m, { conn, args }) => {
    let user = global.db.data.users[m.sender];

    // Verificar si el usuario tiene una mascota
    if (!user.pet) {
        return conn.reply(m.chat, `No tienes una mascota. Usa .comprarmascota para obtener una.`, m);
    }

    // Comando para alimentar a la mascota
    if (args[0] === 'alimentar') {
        const costoAlimentacion = 100;

        // Verificar si el usuario tiene suficientes créditos
        if (user.limit < costoAlimentacion) {
            return conn.reply(m.chat, `No tienes suficientes créditos para alimentar a tu mascota. Necesitas ${costoAlimentacion} créditos.`, m);
        }

        // Alimentar a la mascota y otorgar el bono
        user.limit -= costoAlimentacion;
        user.petFood += costoAlimentacion;
        user.petBonus = 2;  // Bono de x2 créditos
        user.petLastFed = Date.now();  // Registrar la última vez que fue alimentada

        return conn.reply(m.chat, `Has alimentado a tu mascota con ${costoAlimentacion} créditos. Obtendrás un bono de x2 créditos durante 24 horas.`, m);
    }

    // Comando para mostrar el estado de la mascota
    if (args[0] === 'estado') {
        let tiempoRestante = 24 - Math.floor((Date.now() - user.petLastFed) / (1000 * 60 * 60));  // Horas restantes
        tiempoRestante = tiempoRestante > 0 ? tiempoRestante : 0;

        return conn.reply(m.chat, `Estado de tu mascota:\n\n` +
            `🦴 Alimentación: ${user.petFood} créditos\n` +
            `🎁 Bono: x${user.petBonus}\n` +
            `⏳ Tiempo restante del bono: ${tiempoRestante} horas`, m);
    }

    // Comando para comprar una mascota
    if (args[0] === 'comprarmascota') {
        if (user.pet) {
            return conn.reply(m.chat, `Ya tienes una mascota.`, m);
        }

        user.pet = true;
        user.petFood = 0;
        user.petBonus = 1;
        user.petLastFed = Date.now();

        return conn.reply(m.chat, `¡Felicidades! Has comprado una mascota. Alimenta a tu mascota con créditos para obtener bonos.`, m);
    }

    // Comando de uso incorrecto
    return conn.reply(m.chat, `Uso incorrecto del comando. Usa:\n\n` +
        `.mascota alimentar - Para alimentar a tu mascota con 100 créditos\n` +
        `.mascota estado - Para ver el estado de tu mascota\n` +
        `.mascota comprarmascota - Para comprar una mascota`, m);
};

handler.help = ['mascota <alimentar/estado/comprarmascota>'];
handler.tags = ['econ'];
handler.command = /^mascota$/i;
handler.group = true;

export default handler;
