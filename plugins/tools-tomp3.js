let handler = async (m, { conn }) => {
    // Texto formateado
    let mensaje = `
      𝘼𝘿𝙈𝙄𝙉𝙄𝙎𝙏𝙍𝘼𝘾𝙄𝙊́𝙉  𝘼𝙉𝙄𝙈𝘼𝙏𝙍𝙄𝙓  🐦‍🔥

    𝘾𝙍𝙀𝘼𝘿𝙊𝙍: https://wa.me/+51925015528 [ 𝘼𝙇𝘿𝘼𝙄𝙍 ]

    𝘾𝙊𝙉𝙎𝙐𝙇𝙏𝘼𝙍 𝘼 𝘾𝙐𝘼𝙇𝙌𝙐𝙄𝙀𝙍𝘼 𝘿𝙀 𝙇𝙊𝙎 𝙉𝙐́𝙈𝙀𝙍𝙊𝙎 𝙋𝘼𝙍𝘼 𝙈𝘼́𝙎 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝘾𝙄𝙊́𝙉 𝘿𝙀𝙇 𝘽𝙊𝙏 🐦‍🔥
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
