let userTickets = {};
let ticketCounter = 1;
let ticketPrice = 10; // Precio por boleto
let premios = [1000, 600, 300]; // Premios para los 3 primeros lugares
let sorteofunActive = false; // Indica si el sorteo está activo

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender];

    // Comprar boletos
    if (command === 'loteria') {
        if (!args[0]) return m.reply('🍭 Ingresa la cantidad de *boletos* que deseas comprar.\n\n`Ejemplo:`\n' + `> *${usedPrefix + command}* 5`);
        if (isNaN(args[0])) return m.reply('🍭 Ingresa una cantidad válida de *boletos*.\n\n`Ejemplo:`\n' + `> *${usedPrefix + command}* 5`);

        let cantidad = parseInt(args[0]);
        let cost = ticketPrice * cantidad;

        if (user.limit < cost) return m.reply('❌ No tienes suficientes *Creditos* para comprar esta cantidad de boletos.');

        user.limit -= cost;

        if (!userTickets[m.sender]) userTickets[m.sender] = [];
        for (let i = 0; i < cantidad; i++) {
            userTickets[m.sender].push(ticketCounter);
            ticketCounter++;
        }

        return m.reply(`🎟️ Has comprado ${cantidad} boletos. Buena suerte, ${m.sender.split('@')[0]}!`);
    }

    // Ver boletos
    if (command === 'mistickets') {
        if (!userTickets[m.sender] || userTickets[m.sender].length === 0) {
            return m.reply("ℹ️ Aún no has comprado boletos para la lotería.");
        }

        let boletos = userTickets[m.sender].map(t => `#${t}`).join(', ');
        return m.reply(`Tienes ${userTickets[m.sender].length} boletos: ${boletos}.`);
    }

    // Información del sorteo
    if (command === 'sorteo') {
        return m.reply(`🎰 El sorteo se realiza manualmente por el owner del bot usando el comando *${usedPrefix}sorteofun*. ¡Compra boletos antes de que el sorteo inicie!`);
    }

    // Iniciar el sorteo (solo el owner puede ejecutar esto)
    if (command === 'sorteofun') {
        if (!isOwner(m.sender)) return m.reply("❌ Solo el owner del bot puede iniciar el sorteo.");
        if (sorteofunActive) return m.reply("❌ El sorteo ya está en curso.");

        sorteofunActive = true;

        if (!Object.keys(userTickets).length) {
            sorteofunActive = false;
            return m.reply("❌ No hubo boletos vendidos, la lotería se cancela.");
        }

        let allTickets = Object.entries(userTickets).flatMap(([user, tickets]) => tickets.map(ticket => ({ user, ticket })));
        let winners = [];

        while (winners.length < 3 && allTickets.length > 0) {
            let winner = allTickets.splice(Math.floor(Math.random() * allTickets.length), 1)[0];
            if (!winners.some(w => w.user === winner.user)) {
                winners.push(winner);
            }
        }

        for (let i = 0; i < winners.length; i++) {
            global.db.data.users[winners[i].user].limit += premios[i];
            await conn.reply(m.chat, `🎉 ¡Felicidades <@${winners[i].user}>, has ganado *${premios[i]}* créditos por quedar en el lugar ${i + 1} en la lotería!`, m);
        }

        // Reiniciar la lotería
        ticketCounter = 1;
        userTickets = {};
        sorteofunActive = false;
    }
};

handler.help = ['loteria <cantidad de boletos>', 'mistickets', 'sorteo', 'sorteofun'];
handler.tags = ['game'];
handler.command = ['loteria', 'mistickets', 'sorteo', 'sorteofun'];

export default handler;

// Función para verificar si el usuario es el owner del bot
function isOwner(sender) {
    const ownerNumber = ['1234567890@s.whatsapp.net']; // Reemplaza con el número de teléfono del owner
    return ownerNumber.includes(sender);
}
