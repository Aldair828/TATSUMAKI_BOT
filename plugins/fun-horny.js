let handler = async (m, { conn, text }) => {
    let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender;
    let stages = [
        `Analizando a @${who.split("@")[0]} █▒▒▒▒▒▒▒▒▒10%`,
        `Analizando a @${who.split("@")[0]} ████▒▒▒▒▒▒30%`,
        `Analizando a @${who.split("@")[0]} █████▒▒▒▒▒50%`,
        `Analizando a @${who.split("@")[0]} ████████▒▒80%`,
        `Analizando a @${who.split("@")[0]} ██████████100%`
    ];

    let nro = Math.floor(Math.random() * 101); // Genera un porcentaje aleatorio del 0 al 100

    let finalMessage = `USUARIO ANALIZADO\n\nLos cálculos han arrojado que @${who.split("@")[0]} es ${nro}% Pajero 😏💦.`;

    let msg = await conn.reply(m.chat, stages[0], m, { mentions: [who] });

    for (let i = 1; i < stages.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2 segundos antes de editar
        await conn.updateMessage(m.chat, { id: msg.id, text: stages[i], mentions: [who] });
    }

    await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2 segundos antes de mostrar el resultado final
    await conn.updateMessage(m.chat, { id: msg.id, text: finalMessage, mentions: [who] });
}

handler.help = ['pajero @usuario'];
handler.tags = ['fun'];
handler.command = /^(pajero)$/i;

handler.group = true; // Solo se puede usar en grupos

export default handler;
