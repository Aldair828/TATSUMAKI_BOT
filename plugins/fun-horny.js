let analyzeUser = async (m, { conn, text, command }) => {
    let mentionedJid = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : null;
    
    if (!mentionedJid) {
        return conn.reply(m.chat, `Uso correcto: ${usedPrefix}${command} @usuario`, m);
    }

    let user = mentionedJid;
    let stages = [
        `Analizando a @${user.split('@')[0]} █▒▒▒▒▒▒▒▒▒10%`,
        `Analizando a @${user.split('@')[0]} ████▒▒▒▒▒▒30%`,
        `Analizando a @${user.split('@')[0]} █████▒▒▒▒▒50%`,
        `Analizando a @${user.split('@')[0]} ████████▒▒80%`,
        `Analizando a @${user.split('@')[0]} ██████████100%`
    ];

    let result = Math.floor(Math.random() * 101); // Genera un porcentaje aleatorio del 0 al 100

    let finalMessage = `USUARIO ANALIZADO\n\nLos cálculos han arrojado que @${user.split('@')[0]} es *${result}%* ${command === 'pajero' ? 'pajero' : 'puta'} 😏💦\n\n➤ WAOS`;

    let msg = await conn.reply(m.chat, stages[0], m);

    for (let i = 1; i < stages.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2 segundos antes de editar
        await conn.updateMessage(m.chat, { id: msg.id, text: stages[i] });
    }

    await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2 segundos antes de mostrar el resultado final
    await conn.updateMessage(m.chat, { id: msg.id, text: finalMessage });
}

handler.pajero = async (m, opts) => analyzeUser(m, { ...opts, command: 'pajero' });
handler.puta = async (m, opts) => analyzeUser(m, { ...opts, command: 'puta' });

handler.help = ['pajero @usuario', 'puta @usuario'];
handler.tags = ['fun'];
handler.command = /^(pajero|puta)$/i;
handler.rowner = false; // Cualquier usuario puede usar estos comandos

export default handler;
