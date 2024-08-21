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

            let waifuPrice = obtenerPrecioAleatorio(); // Precio aleatorio de 10, 15, o 20 créditos

            if (user.limit < waifuPrice) {
                conn.reply(m.chat, `No tienes suficientes créditos para comprar esta waifu. Necesitas ${waifuPrice} créditos.`, m);
                return;
            }

            user.limit -= waifuPrice;
            user.waifus = user.waifus || [];
            user.waifus.push(json.url); // Almacenar la URL de la waifu en la base de datos del usuario

            conn.sendFile(m.chat, json.url, 'thumbnail.jpg', `Has comprado una waifu por ${waifuPrice} créditos.\n\n .miswaifus  Para ver tus waifus\n\n .venderwaifu número de la waifu   Para vender tus waifus `, m);
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

            let sellPrice = determinarPrecio(); // Determinar el precio de venta basado en la probabilidad
            let probabilidad = determinarProbabilidad(sellPrice); // Determinar la probabilidad de venta

            if (Math.random() * 100 <= probabilidad) {
                user.limit += sellPrice;
                user.waifus.splice(waifuIndex, 1); // Eliminar la waifu de la lista del usuario
                conn.reply(m.chat, `¡Venta exitosa! Has vendido una waifu por ${sellPrice} créditos.`, m);
            } else {
                conn.reply(m.chat, `Lo siento, no pudiste vender la waifu esta vez. Inténtalo de nuevo más tarde.`, m);
            }
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

// Función para obtener un precio aleatorio de compra (10, 15, o 20 créditos)
function obtenerPrecioAleatorio() {
    const precios = [10, 15, 20];
    return precios[Math.floor(Math.random() * precios.length)];
}

// Función para determinar el precio de venta basado en probabilidades
function determinarPrecio() {
    const precios = [5, 10, 15, 30];
    const probabilidades = [0.45, 0.30, 0.20, 0.05];
    let random = Math.random();
    let acumulado = 0;

    for (let i = 0; i < precios.length; i++) {
        acumulado += probabilidades[i];
        if (random <= acumulado) {
            return precios[i];
        }
    }

    return precios[0]; // Por defecto
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

handler.help = ['comprarwaifu', 'venderwaifu [número]', 'miswaifus'];
handler.tags = ['img', 'econ'];
handler.command = /^(comprarwaifu|venderwaifu|miswaifus)$/i;
handler.register = true;

export default handler;
