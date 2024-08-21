import { getRandomInt } from '../lib/utils.js'; // Asegúrate de tener una función que genere números aleatorios

let handler = async (m, { conn, usedPrefix }) => {
    const animals = [
        { emoji: '🐶', credits: 1 },
        { emoji: '🐱', credits: 3 },
        { emoji: '🐭', credits: 1 },
        { emoji: '🦊', credits: 3 },
        { emoji: '🐻', credits: 1 },
        { emoji: '🐼', credits: 3 },
        { emoji: '🐨', credits: 1 }
    ];

    // Probabilidad de moño 🎀 (1% de probabilidad, o 1 en 100)
    const probabilityOfBow = 0.01; // 1%

    let user = global.db.data.users[m.sender];
    let prize;
    let creditsGained;
    let message;

    // Determinar si se gana el moño o un animal
    if (Math.random() < probabilityOfBow) {
        prize = '🎀';
        message = `ENHORABUENAAAAA te ganaste el moño 🎀\n\nPuedes reclamar 500 créditos a este número: +51 925 015 528\n\n¿Qué esperas?`;
    } else {
        const randomIndex = getRandomInt(0, animals.length - 1);
        prize = animals[randomIndex].emoji;
        creditsGained = animals[randomIndex].credits;
        user.limit += creditsGained; // Agregar créditos al perfil del usuario
        message = `¡Has ganado ${prize}! Has obtenido ${creditsGained} crédito${creditsGained > 1 ? 's' : ''}. Tus créditos han sido actualizados.`;
    }

    // Enviar el resultado al usuario
    conn.reply(m.chat, message, m);
}

handler.help = ['cofre'];
handler.tags = ['fun'];
handler.command = /^cofre$/i;

export default handler;
