let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender];
    let rangos = {
        bronce: { costo: 300, multiplicador: 2, image: 'https://example.com/bronce.jpg' },
        plata: { costo: 600, multiplicador: 3, image: 'https://example.com/plata.jpg' },
        oro: { costo: 1200, multiplicador: 4, image: 'https://example.com/oro.jpg' },
        diamante: { costo: 2400, multiplicador: 5, image: 'https://example.com/diamante.jpg' },
        maestro: { costo: 4800, multiplicador: 6, image: 'https://example.com/maestro.jpg' },
        leyenda: { costo: 9600, multiplicador: 7, image: 'https://example.com/leyenda.jpg' },
    };

    if (command === 'tienda') {
        let message = '🏬 *Tienda de Rangos* 🏬\n\n';
        for (let [rango, data] of Object.entries(rangos)) {
            message += `*${rango.charAt(0).toUpperCase() + rango.slice(1)}*\nCosto: ${data.costo} créditos\nMultiplicador: ${data.multiplicador}x\n\n`;
        }
        await conn.sendFile(m.chat, 'https://example.com/tienda.jpg', '', message, m);
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
    }
};

handler.help = ['tienda', 'comprar <rango>'];
handler.tags = ['economy'];
handler.command = ['tienda', 'comprar'];

export default handler;
