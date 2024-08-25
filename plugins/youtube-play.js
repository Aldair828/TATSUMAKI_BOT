let userTickets = {};
let ticketCounter = 1;
let ticketPrice = 10; // Precio por boleto
let premios = [1000, 600, 300]; // Premios para los 3 primeros lugares
let sorteofunActive = false; // Indica si el sorteo está activo
let totalBoletosComprados = 0;
let sorteoProgramado;

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender];

    // Comprar boletos
    if (command === 'loteria') {
        if (!args[0]) return m.reply('🍭 Ingresa la cantidad de *boletos* que deseas comprar.\n\n`Ejemplo:`\n' + `> *${usedPrefix + command}* 5`);
        if (isNaN(args[0])) return m.reply('🍭 Ingresa una cantidad válida de *boletos*.\n\n`Ejemplo:`\n' + `> *${usedPrefix + command}* 5`);

        let cantidad = parseInt(args[0]);
        let cost = ticketPrice * cantidad;

        if (user.limit < cost) return m.reply('❌ No tienes suficientes *Créditos* para comprar esta cantidad de boletos.');

        user.limit -= cost; // Restar el costo de los boletos a los créditos del usuario

        if (!userTickets[m.sender]) userTickets[m.sender] = [];
        for (let i = 0; i < cantidad; i++) {
            userTickets[m.sender].push(ticketCounter);
            ticketCounter++;
        }

        totalBoletosComprados += cantidad;

        if (totalBoletosComprados >= 10 && !sorteofunActive) {
            sorteofunActive = true;
            sorteoProgramado = setTimeout(() => iniciarSorteo(m, conn), 4 * 60 * 60 * 1000); // 4 horas
            m.reply("🎉 Se han comprado 10 boletos. ¡El sorteo se realizará en 4 horas!");
        }

        return m.reply(`🎟️ Has comprado ${cantidad} boletos. ¡Buena suerte, ${m.sender.split('@')[0]}!`);
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
        if (sorteofunActive) {
            let tiempoRestante = sorteoProgramado - Date.now();
            let horas = Math.floor(tiempoRestante / (60 * 60 * 1000));
            let minutos = Math.floor((tiempoRestante % (60 * 60 * 1000)) / (60 * 1000));
            return m.reply(`🎰 El sorteo se realizará en ${horas} horas y ${minutos} minutos.`);
        } else {
            return m.reply(`🎰 Se han comprado ${totalBoletosComprados} boletos. El sorteo se realizará automáticamente cuando se hayan comprado 10 boletos.`);
        }
    }
};

// Función para iniciar el sorteo
async function iniciarSorteo(m, conn) {
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
    totalBoletosComprados = 0;
    sorteofunActive = false;
}

handler.help = ['loteria <cantidad de boletos>', 'mistickets', 'sorteo'];
handler.tags = ['game'];
handler.command = ['loteria', 'mistickets', 'sorteo'];

export default handler;
