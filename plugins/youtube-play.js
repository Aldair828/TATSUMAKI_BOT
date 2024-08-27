let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender];

    // Inicializar el tiempo de VIP y XP si no existe
    if (!user.vipTime) user.vipTime = 0;
    if (!user.xp) user.xp = 0;
    if (!user.lastVip) user.lastVip = Date.now();

    const preciosVip = {
        1: 1000,
        2: 3000,
        3: 6000,
        4: 9000,
        5: 12000,
        6: 15000,
        7: 18000,
        8: 21000,
        9: 24000,
        10: 27000,
        11: 30000,
        12: 33000,
        13: 36000,
        14: 39000,
        15: 42000,
        16: 45000,
        17: 48000,
        24: 50000
    };

    if (command === 'comprarvip') {
        let horas = parseInt(args[0]);

        if (!horas || !preciosVip[horas]) {
            return m.reply(`Uso: ${usedPrefix}comprarvip <horas>\nHoras disponibles: ${Object.keys(preciosVip).join(', ')}`);
        }

        let costo = preciosVip[horas];

        if (user.xp < costo) {
            return m.reply(`No tienes suficiente XP. Necesitas ${costo} XP para comprar ${horas} horas de VIP.`);
        }

        user.xp -= costo;
        user.vipTime += horas * 3600000; // Convertir horas a milisegundos
        user.lastVip = Date.now();

        m.reply(`Has comprado ${horas} horas de VIP. ¡Disfruta de tus créditos ilimitados!`);
    } else if (command === 'vip') {
        let tiempoRestante = user.vipTime - (Date.now() - user.lastVip);
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
3 horas VIP ➩ 6000 XP
4 horas VIP ➩ 9000 XP
5 horas VIP ➩ 12000 XP
6 horas VIP ➩ 15000 XP
7 horas VIP ➩ 18000 XP
8 horas VIP ➩ 21000 XP
9 horas VIP ➩ 24000 XP
10 horas VIP ➩ 27000 XP
11 horas VIP ➩ 30000 XP
12 horas VIP ➩ 33000 XP
13 horas VIP ➩ 36000 XP
14 horas VIP ➩ 39000 XP
15 horas VIP ➩ 42000 XP
16 horas VIP ➩ 45000 XP
17 horas VIP ➩ 48000 XP
24 horas VIP ➩ 50000 XP

Compra usando: ${usedPrefix}comprarvip <horas>

.vip  para ver si eres usuario vip 

beneficios de ser vip - PUEDES TRANSFERIR HASTA 500 CRÉDITOS A CUALQUIER USUARIO AUNQUE NO TENGAS CRÉDITOS 
        `.trim();

        await conn.reply(m.chat, tienda, m);
    }
};

handler.help = ['comprarvip <horas>', 'vip', 'tiendavip'];
handler.tags = ['vip'];
handler.command = ['comprarvip', 'vip', 'tiendavip'];

export default handler;
