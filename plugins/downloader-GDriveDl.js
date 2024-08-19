let handler = async (m, { conn }) => {
    const consejos = [
        {
            autor: 'ALDAIR',
            texto: 'DEJALA IR, TAL VEZ NO FUE FELIZ CONTIGO PERO CON OTRO SI LO HARÁ'
        },
        {
            autor: 'ALDAIR',
            texto: 'PARA EL QUE SEGUIR PELEANDO POR UNA MUJER QUE HIZO PERDER TODO'
        },
        {
            autor: 'ALDAIR',
            texto: 'QUIÉRETE, VALÓRATE TAL VEZ PARA ELLA NO ERES LO SUFICIENTE PERO PARA OTRA SI LO SERÁS'
        }
    ];

    const videos = [
        'https://telegra.ph/file/621bec5d60a335133bca9.mp4',
        'https://telegra.ph/file/5fe2cc44044ed6bae64a7.mp4',
        'https://telegra.ph/file/e20cbc5e138898fe2da20.mp4',
        'https://telegra.ph/file/2835e814a4497a8fdfb9a.mp4',
        'https://telegra.ph/file/3c77dbe1ea67383c7f531.mp4'
    ];

    // Selecciona un consejo aleatorio
    let randomIndex = Math.floor(Math.random() * consejos.length);
    let consejo = consejos[randomIndex];

    // Selecciona un vídeo aleatorio
    let videoIndex = Math.floor(Math.random() * videos.length);
    let videoUrl = videos[videoIndex];

    const consejoMessage = `*AUTOR:* ${consejo.autor}\n*CONSEJO:* ${consejo.texto}\n\nAquí tienes un vídeo relacionado:`;

    // Envía el mensaje con el consejo y el vídeo
    await conn.sendMessage(m.chat, { 
        video: { url: videoUrl }, 
        caption: consejoMessage 
    }, { quoted: m });
}

handler.help = ['consejo']
handler.tags = ['info']
handler.command = ['consejo']
handler.register = true
handler.group = false 
export default handler;
