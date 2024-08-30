let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender];
    let rangos = {
        bronce: { costo: 5000, multiplicador: 2, image: 'https://telegra.ph/file/fe711151a05b2c875ce4a.jpg' },
        plata: { costo: 10000, multiplicador: 3, image: 'https://telegra.ph/file/21acf238f453992a88690.jpg' },
        oro: { costo: 50000, multiplicador: 4, image: 'https://telegra.ph/file/d7cb0259f13d9342590a3.jpg' },
        diamante: { costo: 100000, multiplicador: 5, image: 'https://telegra.ph/file/b5f0262a27d074da6b1a9.jpg' },
        maestro: { costo: 5000000, multiplicador: 6, image: 'https://telegra.ph/file/6d6e37c5a1cf65ad55608.jpg' },
        leyenda: { costo: 100000000, multiplicador: 7, image: 'https://telegra.ph/file/b999330af58e361d89abc.jpg' },
    };

    let isVip = global.prems.includes(m.sender.split('@')[0]); // Verificar si el usuario es VIP

    if (command === 'tienda') {
        let message = '🏬 *Tienda de Rangos* 🏬\n\nLos rangos te benefician en los juegos, los premios se multiplican según el rango que tienes 🌐\n\nEjemplo: .comprar leyenda\n\n';
        for (let [rango, data] of Object.entries(rangos)) {
            let costoFinal = isVip ? data.costo / 2 : data.costo;
            message += `*${rango.charAt(0).toUpperCase() + rango.slice(1)}*\nCosto: ${costoFinal} créditos${isVip ? ' (VIP Descuento aplicado)' : ''}\nMultiplicador: ${data.multiplicador}x\n\n`;
        }
        await conn.sendFile(m.chat, 'https://telegra.ph/file/945915106cf6da013691c.jpg', '', message, m);
    } else if (command === 'comprar') {
        if (!args[0]) return m.reply(`Por favor, especifica el rango que deseas comprar. Ejemplo: *${usedPrefix}${command} bronce*`);

        let rangoSeleccionado = args[0].toLowerCase();

        if (!rangos[rangoSeleccionado]) return m.reply(`Rango no válido. Los rangos disponibles son: ${Object.keys(rangos).join(', ')}`);

        let rango = rangos[rangoSeleccionado];
        let costoFinal = isVip ? rango.costo / 2 : rango.costo;

        if (user.limit < costoFinal) return m.reply('No tienes suficientes créditos para comprar este rango.\n\n.tienda  para ver los precios de los rangos ');

        user.limit -= costoFinal;
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
