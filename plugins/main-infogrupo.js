let handler = async (m, { conn }) => {
    // Obtener metadata del grupo
    let chat = await conn.groupMetadata(m.chat);
    let groupName = chat.subject;
    let groupDesc = chat.desc;
    let participants = chat.participants.length;
    let owner = chat.owner ? '@' + chat.owner.split('@')[0] : 'Desconocido';
    let groupCreation = new Date(chat.creation * 1000).toLocaleString("es-ES", { timeZone: "UTC", hour12: false }); // Fecha de creación

    // Verificar si el bot es administrador
    let botIsAdmin = chat.participants.find(p => p.id === conn.user.jid)?.admin;
    let groupInviteCode;
    let groupLink;

    if (botIsAdmin) {
        // Obtener el enlace del grupo si el bot es admin
        groupInviteCode = await conn.groupInviteCode(m.chat);
        groupLink = `https://chat.whatsapp.com/${groupInviteCode}`;
    } else {
        groupLink = 'El bot no es administrador';
    }

    // Obtener la imagen del grupo
    let groupPic;
    try {
        groupPic = await conn.profilePictureUrl(m.chat, 'image');
    } catch (e) {
        groupPic = 'https://telegra.ph/file/c345415a52ae870fb68cc.jpg'; // URL de la imagen de respaldo
    }

    // Información del grupo
    let info = `
*🔹 Información del Grupo 🔹*

➤ *Nombre del Grupo:* ${groupName}

➤ *Descripción:* ${groupDesc || 'Sin descripción'}

➤ *Número de Participantes:* ${participants}

➤ *Creador del Grupo:* ${owner}

➤ *Fecha de Creación:* ${groupCreation}

➤ *Enlace del Grupo:* ${groupLink}
    `;

    // Enviar el mensaje con la imagen del grupo o la imagen de respaldo
    conn.sendFile(m.chat, groupPic, 'group.jpg', info, m, { mentions: [chat.owner] });
};

handler.help = ['infogrupo'];
handler.tags = ['group'];
handler.command = /^infogrupo$/i;
handler.group = true; // Solo funcionará en grupos
handler.admin = false; // No requiere ser admin

export default handler;
