let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender];
    let rangos = {
        bronce: { costo: 300, multiplicador: 2, image: 'https://telegra.ph/file/863e80e02b440834ff5eb.jpg' },
        plata: { costo: 600, multiplicador: 3, image: 'https://telegra.ph/file/c58cdeb2117bc86f38fe8.jpg' },
        oro: { costo: 1200, multiplicador: 4, image: 'https://telegra.ph/file/364a71a80bbe8a30c89b8.jpg' },
        diamante: { costo: 2400, multiplicador: 5, image: 'https://telegra.ph/file/b5f0262a27d074da6b1a9.jpg' },
        maestro: { costo: 4800, multiplicador: 6, image: 'https://telegra.ph/file/6d6e37c5a1cf65ad55608.jpg' },
        leyenda: { costo: 9600, multiplicador: 7, image: 'https://telegra.ph/file/b999330af58e361d89abc.jpg' },
    };

    if (command === 'tienda') {
        let message = '🏬 *Tienda de Rangos* 🏬\n\n';
        for (let [rango, data] of Object.entries(rangos)) {
            message += `*${rango.charAt(0).toUpperCase() + rango.slice(1)}*\nCosto: ${data.costo} créditos\nMultiplicador: ${data.multiplicador}x\n\nLos rangos te benefician en juegos, los premios de múltiplican segun el rango que tienes 🌐`;
        }
        await conn.sendFile(m.chat, 'https://telegra.ph/file/596927b96d010bb6a0f86.jpg', '', message, m);
    } else if (command === 'comprar') {
        if (!args[0]) return m.reply(`Por favor, especifica el rango que deseas comprar. Ejemplo: *${usedPrefix}${command} bronce*`);

        let rangoSeleccionado = args[0].toLowerCase();

        if (!rangos[rangoSeleccionado]) return m.reply(`Rango no válido. Los rangos disponibles son: ${Object.keys(rangos).join(', ')}`);

        let rango = rangos[rangoSeleccionado];

        if (user.limit < rango.costo) return m.reply('No tienes suficientes créditos para comprar este rango.');

        user.limit -= rango.costo;
        user.rango = rangoSeleccionado;
        user.multiplicador = rango.multiplicador;

        let message = `🎉 ¡Felicidades! Ahora tienes el rango *${rangoSeleccionado.charAt(0).toUpperCase() + rangoSeleccionado.slice(1)}*.\nTus premios ahora se multiplicarán por *${rango.multiplicador}x* en los juegos.`;
        await conn.sendFile(m.chat, rango.image, '', message, m);
    } else if (command === 'mirango') {
        if (!user.rango || !rangos[user.rango]) return m.reply('No tienes ningún rango actualmente.');
        
        let rango = rangos[user.rango];
        let message = `🌟 Tu rango actual es *${user.rango.charAt(0).toUpperCase() + user.rango.slice(1)}*.\nMultiplicador de premios: *${rango.multiplicador}x*`;
        await conn.sendFile(m.chat, rango.image, '', message, m);
    }
};

handler.help = ['tienda', 'comprar <rango>', 'mirango'];
handler.tags = ['economy'];
handler.command = ['tienda', 'comprar', 'mirango'];

export default handler;
