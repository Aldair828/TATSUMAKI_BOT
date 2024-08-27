let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    const ruletaresultado = "https://telegra.ph/file/7624c2a550413e515da80.jpg";

    let amount = parseInt(args[0]);
    let color = args[1]?.toLowerCase();
    if (args.length < 2 || !color) throw `Error, ingrese el monto y el color rojo o negro. Ejemplo: .ruleta 10 rojo`;

    let user = global.db.data.users[m.sender];

    // Verificar tiempo de espera
    let lastRuletaTime = user.lastRuletaTime || 0;
    let now = new Date().getTime();
    let tiempoRestante = (300000 - (now - lastRuletaTime)) / 1000; // 300000 ms = 5 minutos

    if (tiempoRestante > 0) throw `Por favor espera ${tiempoRestante.toFixed(0)} segundos antes de volver a jugar.`;

    let colores = ['rojo', 'negro'];
    let colour = colores[Math.floor(Math.random() * colores.length)];

    if (isNaN(amount) || amount < 10) throw `Para jugar tienes que apostar 10 💎.`;
    if (!colores.includes(color)) throw 'Debes escoger un color válido: rojo o negro';
    if (user.limit < amount) throw `¡No tienes suficientes créditos para apostar! Tienes ${user.limit} pero necesitas al menos ${amount} 💎.`;

    // Obtener el multiplicador según el rango del usuario
    let multiplicador = 1;
    let rangoMensaje = '';
    if (user.rango) {
        switch (user.rango) {
            case 'bronce':
                multiplicador = 2;
                break;
            case 'plata':
                multiplicador = 3;
                break;
            case 'oro':
                multiplicador = 4;
                break;
            case 'diamante':
                multiplicador = 5;
                break;
            case 'maestro':
                multiplicador = 6;
                break;
            case 'leyenda':
                multiplicador = 7;
                break;
            default:
                multiplicador = 1;
        }
        rangoMensaje = `\n\n𝚃𝙸𝙴𝙽𝙴 𝚁𝙰𝙽𝙶𝙾: ${user.rango.charAt(0).toUpperCase() + user.rango.slice(1)}`;
    }

    let result = '';
    if (colour == color) {
        let amountWithMultiplier = amount * multiplicador;
        user.limit += amountWithMultiplier;
        result = `*[ 𝙿𝚁𝚄𝙴𝙱𝙰 𝚃𝚄 𝚂𝚄𝙴𝚁𝚃𝙴 ]*\n\n` +
                 `*𝙻𝙰 𝚁𝚄𝙻𝙴𝚃𝙰 𝙿𝙰𝚁𝙾 𝙴𝙽 𝙴𝙻 𝙲𝙾𝙻𝙾𝚁:* ${colour == 'rojo' ? '🔴' : '⚫'}${rangoMensaje}\n\n` +
                 `*𝚄𝚂𝚃𝙴𝙳 𝙶𝙰𝙽𝙾:* ${amountWithMultiplier} 💎\n` +
                 `*CREDITOS:* ${user.limit}`; +
                 `*DEBE ESPERAR 5 MINUTOS PARA VOLVER A JUGAR`
    } else {
        user.limit -= amount;
        result = `*[ 𝙿𝚁𝚄𝙴𝙱𝙰 𝚃𝚄 𝚂𝚄𝙴𝚁𝚃𝙴 ]*\n\n` +
                 `*𝙻𝙰 𝚁𝚄𝙻𝙴𝚃𝙰 𝙿𝙰𝚁𝙾 𝙴𝙽 𝙴𝙻 𝙲𝙾𝙻𝙾𝚁:* ${colour == 'rojo' ? '🔴' : '⚫'}\n\n` +
                 `*𝚄𝚂𝚃𝙴𝙳 𝙿𝙴𝚁𝙳𝙸𝙾:* ${amount} 💎\n` +
                 `*CREDITOS:* ${user.limit}`;
    }

    // Actualizar el tiempo del último uso
    user.lastRuletaTime = now;

    conn.sendMessage(m.chat, { image: { url: ruletaresultado }, caption: result }, { quoted: m });
};

handler.help = ['ruleta apuesta/color'];
handler.tags = ['game'];
handler.command = ['ruleta', 'rt'];

export default handler;
