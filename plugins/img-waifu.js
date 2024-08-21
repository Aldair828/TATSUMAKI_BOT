import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, args }) => {
    try {
        let user = global.db.data.users[m.sender];
        
        // Verificar si el usuario está registrado
        if (!user.registered) {
            conn.reply(m.chat, 'Por favor, regístrate usando el comando `.reg nombre.edad` antes de usar este comando.', m);
            return;
        }

        // Comando para comprar una waifu
        if (command === 'comprarwaifu') {
            let res = await fetch('https://api.waifu.pics/sfw/waifu');
            if (!res.ok) return;
            let json = await res.json();
            if (!json.url) return;

            let waifuPrice = obtenerPrecioAleatorio(); // Precio aleatorio de 10, 15, o 20 créditos

            if (user.limit < waifuPrice) {
                conn.reply(m.chat, `No tienes suficientes créditos para comprar esta waifu. Necesitas ${waifuPrice} créditos.`, m);
                return;
            }

            user.limit -= waifuPrice;
            user.waifus = user.waifus || [];
            user.waifus.push({ url: json.url, precio: waifuPrice }); // Almacenar la waifu con el precio en la base de datos del usuario

            conn.sendFile(m.chat, json.url, 'thumbnail.jpg', `Has comprado una waifu por ${waifuPrice} créditos.`, m);
        }

        // Comando para vender una waifu con precio especificado
        if (command === 'venderwaifu') {
            if (args.length < 2) {
                conn.reply(m.chat, 'Uso correcto: `.venderwaifu [número] [cantidad]`', m);
                return;
            }

            let waifuIndex = parseInt(args[0]) - 1;
            let precioVenta = parseInt(args[1]);

            if (!user.waifus || user.waifus.length === 0) {
                conn.reply(m.chat, 'No tienes waifus para vender.', m);
                return;
            }

            if (waifuIndex < 0 || waifuIndex >= user.waifus.length) {
                conn.reply(m.chat, 'Elige una waifu válida para vender.', m);
                return;
            }

            if (![5, 10, 15, 30].includes(precioVenta)) {
                conn.reply(m.chat, 'El precio de venta debe ser 5, 10, 15, o 30 créditos.', m);
                return;
            }

            let probabilidad = determinarProbabilidad(precioVenta); // Determinar la probabilidad de venta

            if (Math.random() * 100 <= probabilidad) {
                user.limit += precioVenta;
                user.waifus.splice(waifuIndex, 1); // Eliminar la waifu de la lista del usuario
                conn.reply(m.chat, `¡Venta exitosa! Has vendido una waifu por ${precioVenta} créditos.`, m);
            } else {
                conn.reply(m.chat, `Lo siento, no pudiste vender la waifu esta vez. Inténtalo de nuevo más tarde.`, m);
            }
        }

        // Comando para mostrar las waifus que tiene el usuario
        if (command === 'miswaifus') {
            if (!user.waifus || user.waifus.length === 0) {
                conn.reply(m.chat, 'No tienes waifus. Compra una con el comando `.comprarwaifu`.', m);
                return;
            }

            let waifuList = user.waifus.map((waifu, i) => `${i + 1}. ${waifu.url} (Comprada por ${waifu.precio} créditos)`).join('\n');
            conn.reply(m.chat, `Estas son tus waifus:\n\n${waifuList}\n\nUsa \`.venderwaifu [número] [cantidad]\` para vender una waifu.`, m);
        }

        // Comando para mostrar la tienda de waifus
        if (command === 'tiendawaifu') {
            let allUsers = Object.entries(global.db.data.users)
                .filter(([jid, user]) => user.waifus && user.waifus.length > 0);

            if (allUsers.length === 0) {
                conn.reply(m.chat, 'No hay waifus en la tienda actualmente. Compra una usando `.comprarwaifu`.', m);
                return;
            }

            let str = '▂▃▄▅▆▇█▓▒░ 𝐓𝐈𝐄𝐍𝐃𝐀 𝐖𝐀𝐈𝐅𝐔 ░▒▓█▇▆▅▄▃▂\n\n';

            allUsers.forEach(([jid, user]) => {
                user.waifus.forEach((waifu, index) => {
                    str += `*[👤] 𝚄𝚂𝚄𝙰𝚁𝙸𝙾:* ${conn.getName(jid)}\n*[📱] 𝙽𝚄𝙼𝙴𝚁𝙾:* https://wa.me/${jid.split('@')[0]}\n*[💰] 𝙿𝚁𝙴𝙲𝙸𝙾:* ${waifu.precio} créditos\n*[🔗] 𝚄𝚁𝙻:* ${waifu.url}\n\n`;
                });
            });

            conn.reply(m.chat, str.trim(), m);
        }

    } catch (e) {
        console.log(e);
        conn.reply(m.chat, 'Hubo un error al procesar tu solicitud.', m);
    }
};

// Función para obtener un precio aleatorio de compra (10, 15, o 20 créditos)
function obtenerPrecioAleatorio() {
    const precios = [10, 15, 20];
    return precios[Math.floor(Math.random() * precios.length)];
}

// Función para determinar la probabilidad de venta según el precio
function determinarProbabilidad(precio) {
    switch (precio) {
        case 5:
        case 6:
        case 7:
            return 90;
        case 8:
        case 9:
        case 10:
        case 11:
        case 12:
        case 13:
        case 14:
            return 80;
        case 15:
            return 70;
        case 16:
            return 60;
        case 17:
            return 50;
        case 18:
            return 40;
        case 19:
            return 30;
        case 30:
            return 5;
        default:
            return 0; // Sin probabilidad
    }
}

handler.help = ['comprarwaifu', 'venderwaifu [número] [cantidad]', 'miswaifus', 'tiendawaifu'];
handler.tags = ['img', 'econ'];
handler.command = /^(comprarwaifu|venderwaifu|miswaifus|tiendawaifu)$/i;
handler.register = true;

export default handler;
