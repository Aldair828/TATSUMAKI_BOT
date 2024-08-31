let handler = async (m, { conn, text }) => {
    let user = global.db.data.users[m.sender];
    
    // Verificar si el usuario tiene la edad registrada
    if (!user || !user.age) {
        return conn.reply(m.chat, 'Primero debes registrar tu edad. Usa el comando .registro para hacerlo.', m);
    }

    // Verificar la edad del usuario
    if (user.age < 18) {
        return conn.reply(m.chat, 'Lo siento, necesitas tener al menos 18 años para acceder a este contenido.', m);
    }

    const menuTexto = `
        *𝗠𝗘𝗡𝗨́ +𝟭𝟴*

        ➤ *.porno* - Videos de contenido adulto.
        ➤ *.tetas* - Videos de chicas mostrando los pechos.
        ➤ *.culos* - Videos de chicas mostrando sus traseros.
        ➤ *.tiktokxxx* - Videos eróticos de TikTok.

        *Advertencia:* Este contenido es solo para mayores de 18 años.
    `;

    // URL de la imagen que acompañará el menú
    const imagenUrl = 'https://telegra.ph/file/52e2af520b8beecd7ff81.jpg'; // Reemplaza con una URL válida

    await conn.sendMessage(m.chat, { image: { url: imagenUrl }, caption: menuTexto }, { quoted: m });
};

handler.help = ['+18'];
handler.tags = ['adult'];
handler.command = /^(\+18|menu18|adultmenu)$/i;
handler.group = false; // Solo disponible en chats individuales

// Comandos específicos para contenido +18
const videosPorno = [
    'https://telegra.ph/file/6a1c45e25e74d23f54fd6.mp4',
    
];

const videosTetas = [
    'https://telegra.ph/file/6498488852cdb8a5b5982.mp4',
    'https://telegra.ph/file/56737f3161c6b6ce7b9e3.mp4', 
];

const videosCulos = [
    'https://telegra.ph/file/282c57ebfe59b2973074d.mp4',
    'https://telegra.ph/file/12ef38e068c0b28f8bace.mp4',
    
];

const videosTikTokXXX = [
    'https://link/video1.mp4',
    'https://link/video2.mp4',
    'https://link/video3.mp4',
    'https://link/video4.mp4',
    'https://link/video5.mp4',
    'https://link/video6.mp4',
];

let videoHandler = async (m, { conn, command }) => {
    let user = global.db.data.users[m.sender];

    // Verificar si el usuario tiene la edad registrada
    if (!user || !user.age) {
        return conn.reply(m.chat, 'Primero debes registrar tu edad. Usa el comando .registro para hacerlo.', m);
    }

    // Verificar la edad del usuario
    if (user.age < 18) {
        return conn.reply(m.chat, 'Lo siento, necesitas tener al menos 18 años para acceder a este contenido.', m);
    }

    let videos;
    switch (command) {
        case 'porno':
            videos = videosPorno;
            break;
        case 'tetas':
            videos = videosTetas;
            break;
        case 'culos':
            videos = videosCulos;
            break;
        case 'tiktokxxx':
            videos = videosTikTokXXX;
            break;
        default:
            return;
    }

    // Seleccionar un video aleatorio
    const video = videos[Math.floor(Math.random() * videos.length)];
    await conn.sendFile(m.chat, video, 'video.mp4', 'Disfruta tu video.', m);
};

handler.command = ['porno', 'tetas', 'culos', 'tiktokxxx'];
export { handler, videoHandler };
