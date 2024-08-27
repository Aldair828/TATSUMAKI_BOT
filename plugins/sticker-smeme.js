let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender];

    // Inicializar XP si no existe
    if (!user.xp) user.xp = 0;

    // Niveles y XP requerido para cada nivel
    const niveles = [150, 300, 600, 1200, 2400, 4800, 9600, 19200, 38400, 76800];
    let xp = user.xp;
    let nivel = 0;
    let xpParaSiguienteNivel = 0;

    // Calcular el nivel actual y el XP faltante para el siguiente nivel
    for (let i = 0; i < niveles.length; i++) {
        if (xp >= niveles[i]) {
            nivel = i + 1;
        } else {
            xpParaSiguienteNivel = niveles[i] - xp;
            break;
        }
    }

    // Si el usuario ya está en el nivel máximo
    let siguienteNivel = nivel < niveles.length ? nivel + 1 : "Máximo";
    let textoSiguienteNivel = nivel < niveles.length ? `Nivel ${siguienteNivel} (${xpParaSiguienteNivel} XP restantes)` : "N/A";

    if (command === 'xp') {
        // Formato de la respuesta
        let mensaje = `
╔══════✮❁•°♛°•❁✮ ═════╗

  𝐂𝐀𝐑𝐓𝐄𝐑𝐀 𝐃𝐄 @${m.sender.split('@')[0]}

*⭐ XP ➩* ${xp}
*💫 NIVEL ➩* ${nivel}
*🌹SIGUIENTE NIVEL ➩* ${textoSiguienteNivel}

JUEGA LOS SIGUIENTES JUEGOS PARA GANAR XP 

.adivina  adivina un número del 1 al 100
.ppt  escoje piedra papel o tijera 
╚══════✮❁•°❀°•❁✮══════╝
        `.trim();

        // Enviar respuesta con texto e imagen
        await conn.sendFile(m.chat, 'https://telegra.ph/file/9c80900ea18e0a13443ad.jpg', '', mensaje, m, {
            mentions: [m.sender]
        });
    } else if (command === 'ppt') {
        // Juego de Piedra, Papel o Tijera
        let opciones = ['piedra', 'papel', 'tijera'];
        let eleccionUsuario = args[0]?.toLowerCase();
        if (!opciones.includes(eleccionUsuario)) return m.reply(`Elige una opción válida: piedra, papel o tijera.`);

        let eleccionBot = opciones[Math.floor(Math.random() * opciones.length)];
        let resultado;

        if (eleccionUsuario === eleccionBot) {
            resultado = `Empate. Ambos eligieron ${eleccionBot}.`;
        } else if (
            (eleccionUsuario === 'piedra' && eleccionBot === 'tijera') ||
            (eleccionUsuario === 'papel' && eleccionBot === 'piedra') ||
            (eleccionUsuario === 'tijera' && eleccionBot === 'papel')
        ) {
            let xpGanado = Math.floor(Math.random() * 41) + 60; // XP entre 60 y 100
            user.xp += xpGanado;
            resultado = `¡Ganaste! Elegiste ${eleccionUsuario} y el bot eligió ${eleccionBot}. Has ganado ${xpGanado} XP.`;
        } else {
            resultado = `Perdiste. Elegiste ${eleccionUsuario} y el bot eligió ${eleccionBot}.`;
        }

        // Enviar resultado sin imagen
        await conn.reply(m.chat, resultado, m);
    } else if (command === 'adivina') {
        // Juego de Adivinar el Número
        let numero = Math.floor(Math.random() * 100) + 1;
        let adivinanza = parseInt(args[0]);
        if (isNaN(adivinanza) || adivinanza < 1 || adivinanza > 100) return m.reply(`Adivina un número entre 1 y 100.`);

        if (adivinanza === numero) {
            let xpGanado = 500; // XP fijo de 500
            user.xp += xpGanado;
            await conn.reply(m.chat, `¡Felicidades! Adivinaste el número correcto ${numero}. Has ganado ${xpGanado} XP.`, m);
        } else {
            await conn.reply(m.chat, `Lo siento, el número era ${numero}. Inténtalo de nuevo.`, m);
        }
    } else if (command === 'pregunta') {
        // Juego de Preguntas y Respuestas
        const preguntas = [
            { pregunta: "¿Cuál es el planeta más cercano al sol?", respuesta: "mercurio" },
            { pregunta: "¿Quién pintó la Mona Lisa?", respuesta: "leonardo da vinci" },
            { pregunta: "¿Cuál es la capital de Francia?", respuesta: "parís" },
            { pregunta: "¿Qué gas es necesario para que haya combustión?", respuesta: "oxígeno" },
            { pregunta: "¿Cuál es el río más largo del mundo?", respuesta: "amazonas" },
            { pregunta: "¿Qué instrumento musical tiene 88 teclas?", respuesta: "piano" },
            { pregunta: "¿En qué continente se encuentra Egipto?", respuesta: "áfrica" },
            { pregunta: "¿Cuál es el animal más rápido del mundo?", respuesta: "guepardo" },
            { pregunta: "¿Cuál es el elemento químico con el símbolo O?", respuesta: "oxígeno" },
            { pregunta: "¿Quién escribió 'Cien años de soledad'?", respuesta: "gabriel garcía márquez" },
            { pregunta: "¿En qué año llegó el hombre a la luna?", respuesta: "1969" },
            { pregunta: "¿Cuál es el océano más grande del mundo?", respuesta: "pacífico" },
            { pregunta: "¿Qué vitamina se obtiene de la exposición al sol?", respuesta: "vitamina d" },
            { pregunta: "¿Cuál es el país más grande del mundo?", respuesta: "rusia" },
            { pregunta: "¿Cuál es la capital de Japón?", respuesta: "tokio" },
            { pregunta: "¿Quién es conocido como el padre de la teoría de la relatividad?", respuesta: "albert einstein" },
            { pregunta: "¿Cuál es el metal más liviano?", respuesta: "litio" },
            { pregunta: "¿Qué país es famoso por sus pirámides?", respuesta: "egipto" },
            { pregunta: "¿En qué continente se encuentra la Amazonia?", respuesta: "américa del sur" },
            { pregunta: "¿Cuál es el deporte más popular del mundo?", respuesta: "fútbol" }
        ];

        // Verificar si la pregunta ya ha sido hecha
        if (!user.preguntaActual) {
            let indicePregunta = Math.floor(Math.random() * preguntas.length);
            user.preguntaActual = preguntas[indicePregunta];
            return conn.reply(m.chat, `Pregunta: ${user.preguntaActual.pregunta}`, m);
        } else {
            let respuestaUsuario = args.join(' ').trim().toLowerCase();

            if (respuestaUsuario === user.preguntaActual.respuesta) {
                let xpGanado = Math.floor(Math.random() * 41) + 60; // XP entre 60 y 100
                user.xp += xpGanado;
                delete user.preguntaActual;
                return conn.reply(m.chat, `¡Correcto! La respuesta es ${respuestaUsuario}. Has ganado ${xpGanado} XP.`, m);
            } else {
                return conn.reply(m.chat, `Incorrecto. Inténtalo de nuevo.`, m);
            }
        }
    }
};

handler.help = ['ppt <piedra/papel/tijera>', 'adivina <número>', 'xp', 'pregunta'];
handler.tags = ['game'];
handler.command = ['ppt', 'adivina', 'xp', 'pregunta'];

export default handler;
