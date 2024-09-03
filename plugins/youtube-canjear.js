let handler = async (m, { conn, text }) => {
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

handler.help = ['canjear <código>'];
handler.tags = ['economia'];
handler.command = /^canjear$/i;
handler.rowner = false; // Cualquier usuario puede usar este comando

export default handler;
