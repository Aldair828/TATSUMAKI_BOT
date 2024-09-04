import Scraper from "@SumiFX/Scraper";

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply('🍭 Ingresa el nombre de la imágen que estás buscando.\n\n`Ejemplo:`\n' + `> *${usedPrefix + command}* Sumi Sakurasawa Icons`);

    // Lista de palabras prohibidas
    const prohibitedWords = [
        "culo", "culos", "tetas", "teta", "desnuda", "hentai", 
        "porno", "zoofilia", "cp", "pornografía", "zoo", 
        "sexo", "gore"
    ];

    // Verificar si la búsqueda contiene alguna palabra prohibida
    if (prohibitedWords.some(word => text.toLowerCase().includes(word))) {
        return m.reply('❌ Esta palabra está prohibida, el bot no puede buscar ese contenido.');
    }

    try {
        let { dl_url } = await Scraper.GoogleImage(text);
        await conn.sendFile(m.chat, dl_url, 'thumbnail.jpg', null, m);
    } catch {
        m.reply('⚠️ Hubo un error al intentar realizar la búsqueda.');
    }
}

handler.help = ['imagen <búsqueda>'];
handler.tags = ['img'];
handler.command = ['image', 'gimage', 'imagen'];
handler.register = true;
//handler.limit = 1;

export default handler;
