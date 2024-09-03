let handler = async (m, { conn }) => {
    let chat = await conn.groupMetadata(m.chat);
    let groupName = chat.subject;
    let groupDesc = chat.desc;
    let participants = chat.participants.length;
    let owner = chat.owner ? '@' + chat.owner.split('@')[0] : 'Desconocido';

    let info = `
    *🔹 Información del Grupo 🔹*

    ➤ *Nombre del Grupo:* ${groupName}
    ➤ *Descripción:* ${groupDesc || 'Sin descripción'}
    ➤ *Número de Participantes:* ${participants}
    ➤ *Creador del Grupo:* ${owner}
    `;

    conn.reply(m.chat, info, m, { mentions: [chat.owner] });
};

handler.help = ['infogrupo'];
handler.tags = ['group'];
handler.command = /^infogrupo$/i;
handler.group = true; // Solo funcionará en grupos
handler.admin = false; // No requiere ser admin

export default handler;
