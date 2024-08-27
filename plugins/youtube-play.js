let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender];

    // Inicializar el tiempo de VIP y XP si no existe
    if (!user.vipTime) user.vipTime = 0;
    if (!user.xp) user.xp = 0;

    const precios = {
        1: 1000,
        2: 3000,
        4: 6000,
        8: 12000,
        12: 20000,
        24: 35000
    };

    if (command === 'comprarvip') {
        let horas = parseInt(args[0]);

        if (!horas || !precios[horas]) {
            return m.reply(`Uso: ${usedPrefix}comprarvip <horas>\nHoras disponibles: 1, 2, 4, 8, 12, 24`);
        }

        let costo = precios[horas];

        if (user.xp < costo) {
            return m.reply(`No tienes suficiente XP. Necesitas ${costo} XP para comprar ${horas} horas de VIP.`);
        }

        user.xp -= costo;
        user.vipTime += horas * 3600000; // Convertir horas a milisegundos

        m.reply(`Has comprado ${horas} horas de VIP. ¡Disfruta de tus créditos ilimitados!`);
    } else if (command === 'vip') {
        let tiempoRestante = user.vipTime - (Date.now() - user.lastVip || 0);
        if (tiempoRestante <= 0) tiempoRestante = 0;

        let horasRestantes = Math.floor(tiempoRestante / 3600000);
        let minutosRestantes = Math.floor((tiempoRestante % 3600000) / 60000);

        let mensaje = `
╔═══════════════════════╗
║      ESTADO VIP       ║
╚═══════════════════════╝

*🌟 Tiempo VIP restante:* ${horasRestantes} horas y ${minutosRestantes} minutos
*⭐ XP disponible:* ${user.xp}

¡Disfruta de tus créditos ilimitados mientras dure tu VIP!

        `.trim();

        await conn.sendFile(m.chat, 'https://telegra.ph/file/af3239e6dfd32fd12c766.jpg', '', mensaje, m);
    } else if (command === 'tiendavip') {
        let tienda = `
╔═══════════════════════╗
║      TIENDA VIP       ║
╚═══════════════════════╝

1 hora VIP ➩ 1000 XP
2 horas VIP ➩ 3000 XP
4 horas VIP ➩ 6000 XP
8 horas VIP ➩ 12000 XP
12 horas VIP ➩ 20000 XP
24 horas VIP ➩ 35000 XP

Compra usando: ${usedPrefix}comprarvip <horas>
        `.trim();

        await conn.reply(m.chat, tienda, m);
    }
};

handler.help = ['comprarvip <horas>', 'vip', 'tiendavip'];
handler.tags = ['vip'];
handler.command = ['comprarvip', 'vip', 'tiendavip'];

export default handler;
``
