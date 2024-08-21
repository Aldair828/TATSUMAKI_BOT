import fetch from 'node-fetch';
import Timeout from 'await-timeout';

let handler = async (m, { conn, args }) => {
    try {
        let user = global.db.data.users[m.sender];

        // Verificar si el usuario está registrado
        if (!user.registered) {
            conn.reply(m.chat, 'Por favor, regístrate usando el comando `.reg nombre.edad` antes de usar este comando.', m);
            return;
        }

        // Verificar si el usuario ha ingresado una cantidad de créditos
        let apuesta = parseInt(args[0]);
        if (!apuesta || apuesta <= 0) {
            conn.reply(m.chat, 'Debes ingresar una cantidad válida de créditos para apostar.', m);
            return;
        }

        if (user.limit < apuesta) {
            conn.reply(m.chat, `No tienes suficientes créditos para apostar ${apuesta} créditos.`, m);
            return;
        }

        // Obtener un acertijo aleatorio de la API
        let res = await fetch('https://opentdb.com/api.php?amount=1&type=boolean');
        if (!res.ok) return;
        let json = await res.json();
        let pregunta = json.results[0].question;
        let respuesta = json.results[0].correct_answer.toLowerCase();

        // Enviar la pregunta al usuario
        conn.reply(m.chat, `🔮 Apuesta: ${apuesta} créditos\n\nResponde correctamente el siguiente acertijo en 30 segundos:\n\n${pregunta}`, m);

        // Esperar la respuesta del usuario
        let isCorrect = false;

        conn.on('chat-update', async (chat) => {
            if (!chat.hasNewMessage) return;
            if (chat.key.remoteJid !== m.chat) return;
            let msg = chat.messages.all()[0];
            let text = msg.message.conversation.toLowerCase();

            if (text === respuesta) {
                isCorrect = true;
                user.limit += apuesta; // Duplicar la apuesta ganada
                conn.reply(m.chat, `¡Correcto! Has ganado ${apuesta} créditos.`, m);
            }
        });

        // Esperar 30 segundos antes de finalizar
        await Timeout.set(30000);

        if (!isCorrect) {
            user.limit -= apuesta; // Perder la apuesta
            conn.reply(m.chat, `⏱️ Se acabó el tiempo. Has perdido ${apuesta} créditos.`, m);
        }

    } catch (e) {
        console.log(e);
        conn.reply(m.chat, 'Hubo un error al procesar tu solicitud.', m);
    }
};

handler.help = ['acertijo [cantidad de créditos]'];
handler.tags = ['games', 'econ'];
handler.command = /^(acertijo)$/i;
handler.register = true;

export default handler;
