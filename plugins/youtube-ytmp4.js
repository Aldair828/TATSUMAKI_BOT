let handler = async (m, { conn, text, command }) => {
    if (command === 'codigo') {
        let amount = parseInt(text.trim());

        if (isNaN(amount) || amount <= 0) {
            return conn.reply(m.chat, 'Por favor, ingrese una cantidad válida de créditos.', m);
        }

        let code = Math.random().toString(36).substring(2, 10).toUpperCase();

        if (!global.db.data.codes) global.db.data.codes = {};
        global.db.data.codes[code] = { credits: amount, claimedBy: [] };

        conn.reply(m.chat, `Código generado: ${code}\nEste código puede ser canjeado por ${amount} créditos.`, m);

    } else if (command === 'canjear') {
        let code = text.trim().toUpperCase();

        if (!code) {
            return conn.reply(m.chat, 'Por favor, ingrese un código para canjear.', m);
        }

        let codesDB = global.db.data.codes || {};
        let user = global.db.data.users[m.sender];

        if (!codesDB[code]) {
            return conn.reply(m.chat, 'Código no válido.', m);
        }

        if (codesDB[code].claimedBy.includes(m.sender)) {
            return conn.reply(m.chat, 'Ya has canjeado este código.', m);
        }

        if (codesDB[code].claimedBy.length >= 5) {
            return conn.reply(m.chat, 'Este código fue agotado completamente... Espero que el creador ponga otro código.', m);
        }

        user.limit += codesDB[code].credits;
        codesDB[code].claimedBy.push(m.sender);

        let remaining = 5 - codesDB[code].claimedBy.length;

        conn.reply(m.chat, `Has canjeado el código con éxito. Has recibido ${codesDB[code].credits} créditos.\nQuedan ${remaining} vacantes para canjear el código.`, m);
    }
}

handler.help = ['codigo <cantidad de créditos>', 'canjear <código>'];
handler.tags = ['owner', 'economia'];
handler.command = /^(codigo|canjear)$/i;
handler.rowner = true; // Solo el owner puede usar el comando `codigo`, pero cualquier usuario puede usar `canjear`

export default handler;
