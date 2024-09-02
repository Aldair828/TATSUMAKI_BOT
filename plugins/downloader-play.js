module.exports = function(bot) {
  
  // Comando .destacar
  bot.on('message_create', async (msg) => {
    if (msg.body.startsWith('.destacar')) {
        const mensaje = msg.body.slice(10).trim();
        if (mensaje) {
            const destacado = `🔖 *MENSAJE DESTACADO* 🔖\n\n${mensaje}`;
            await bot.sendMessage(msg.from, destacado);
        } else {
            await bot.sendMessage(msg.from, '❗ *Error*: Debes proporcionar un mensaje para destacar.');
        }
    }
  });

  // Comando .anuncio
  bot.on('message_create', async (msg) => {
    if (msg.body.startsWith('.anuncio')) {
        const anuncio = msg.body.slice(9).trim();
        if (anuncio) {
            const anuncioFinal = `📢 *ANUNCIO IMPORTANTE* 📢\n\n${anuncio}`;
            await bot.sendMessage(msg.from, anuncioFinal);
        } else {
            await bot.sendMessage(msg.from, '❗ *Error*: Debes proporcionar un mensaje para el anuncio.');
        }
    }
  });

  // Comando .warn
  bot.on('message_create', async (msg) => {
    if (msg.body.startsWith('.warn')) {
        const args = msg.body.split(' ');
        const userMention = args[1];
        const reason = args.slice(2).join(' ');

        if (userMention) {
            const warnedUser = msg.mentionedIds[0];
            const warningMessage = `⚠️ *ADVERTENCIA* ⚠️\n\n@${warnedUser.user}, has sido advertido por:\n\n*Razón:* ${reason || "Comportamiento inapropiado"}`;

            await bot.sendMessage(msg.from, warningMessage, { mentions: [warnedUser] });
        } else {
            await bot.sendMessage(msg.from, '❗ *Error*: Debes mencionar a un usuario para advertir y, opcionalmente, proporcionar una razón.');
        }
    }
  });
};
