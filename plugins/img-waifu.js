import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, args }) => {
    try {
        let user = global.db.data.users[m.sender];
        
        // Verificar si el usuario está registrado
        if (!user.registered) {
            conn.reply(m.chat, 'Por favor, regístrate usando el comando `.reg nombre.edad` antes de usar este comando.', m);
            return;
        }

        // Verificar el comando de compra
        if (command === 'comprarwaifu') {
            let res = await fetch('https://api.waifu.pics/sfw/waifu');
            if (!res.ok) return;
            let json = await res.json();
            if (!json.url) return;

            let waifuPrice = 10; // Precio fijo para cada waifu

            if (user.limit < waifuPrice) {
                conn.reply(m.chat, `No tienes suficientes créditos para comprar esta waifu. Necesitas ${waifuPrice} créditos.`, m);
                return;
            }

            user.limit -= waifuPrice;
            user.waifus = user.waifus || [];
            user.waifus.push(json.url); // Almacenar la URL de la waifu en la base de datos del usuario

            conn.sendFile(m.chat, json.url, 'thumbnail.jpg', `Has comprado una waifu por ${waifuPrice} créditos.`, m);
        }

        // Verificar el comando de venta
        if (command === 'venderwaifu') {
            let waifuIndex = parseInt(args[0]) - 1;

            if (!user.waifus || user.waifus.length === 0) {
                conn.reply(m.chat, 'No tienes waifus para vender.', m);
                return;
            }

            if (waifuIndex < 0 || waifuIndex >= user.waifus.length) {
                conn.reply(m.chat, 'Elige una waifu válida para vender.', m);
                return;
            }

            let waifuUrl = user.waifus[waifuIndex];
            let sellPrice = 5; // Precio de venta fijo para cada waifu
            user.limit += sellPrice;

            user.waifus.splice(waifuIndex, 1); // Eliminar la waifu de la lista del usuario

            conn.reply(m.chat, `Has vendido una waifu y has ganado ${sellPrice} créditos.`, m);
        }

        // Mostrar las waifus que tiene el usuario
        if (command === 'miswaifus') {
            if (!user.waifus || user.waifus.length === 0) {
                conn.reply(m.chat, 'No tienes waifus. Compra una con el comando `.comprarwaifu`.', m);
                return;
            }

            let waifuList = user.waifus.map((url, i) => `${i + 1}. ${url}`).join('\n');
            conn.reply(m.chat, `Estas son tus waifus:\n\n${waifuList}\n\nUsa \`.venderwaifu [número]\` para vender una waifu.`, m);
        }

    } catch (e) {
        console.log(e);
        conn.reply(m.chat, 'Hubo un error al procesar tu solicitud.', m);
    }
};

handler.help = ['comprarwaifu', 'venderwaifu [número]', 'miswaifus'];
handler.tags = ['img', 'econ'];
handler.command = /^(comprarwaifu|venderwaifu|miswaifus)$/i;
handler.register = true;

export default handler;
