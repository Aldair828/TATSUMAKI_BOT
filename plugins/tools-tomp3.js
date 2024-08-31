let handler = async (m, { conn }) => {
    // Texto formateado
    let mensaje = `
      𝘼𝘿𝙈𝙄𝙉𝙄𝙎𝙏𝙍𝘼𝘾𝙄𝙊́𝙉  𝘼𝙉𝙄𝙈𝘼𝙏𝙍𝙄𝙓  🐦‍🔥

    𝘾𝙍𝙀𝘼𝘿𝙊𝙍: https://wa.me/+51925015528 [ 𝘼𝙇𝘿𝘼𝙄𝙍 ]
    `.trim();

    // URL de la imagen
    let imagenURL = 'https://telegra.ph/file/f97a9c79892c0bbf766da.jpg';

    // Enviar mensaje con la imagen
    await conn.sendFile(m.chat, imagenURL, '', mensaje, m);
};

handler.help = ['administración'];
handler.tags = ['info'];
handler.command = /^administración$/i;

export default handler;
