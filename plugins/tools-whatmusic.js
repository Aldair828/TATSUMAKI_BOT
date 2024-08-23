import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender];
    if (command === 'pokemon') {
        if (user.pokemon) return m.reply(`¡Ya tienes un Pokémon! Usa el comando *${usedPrefix}soltarpokemon* para liberarlo.`);

        // Definir los Pokémon por rareza
        const comunes = [
            { name: 'Pikachu', image: 'https://example.com/pikachu.png' },
            { name: 'Eevee', image: 'https://example.com/eevee.png' },
            { name: 'Bulbasaur', image: 'https://example.com/bulbasaur.png' },
            { name: 'Charmander', image: 'https://example.com/charmander.png' },
            { name: 'Squirtle', image: 'https://example.com/squirtle.png' },
        ];

        const raros = [
            { name: 'Gengar', image: 'https://example.com/gengar.png' },
            { name: 'Jolteon', image: 'https://example.com/jolteon.png' },
            { name: 'Dragonair', image: 'https://example.com/dragonair.png' },
            { name: 'Gyarados', image: 'https://example.com/gyarados.png' },
            { name: 'Lapras', image: 'https://example.com/lapras.png' },
        ];

        const miticos = [
            { name: 'Mew', image: 'https://example.com/mew.png' },
            { name: 'Celebi', image: 'https://example.com/celebi.png' },
            { name: 'Jirachi', image: 'https://example.com/jirachi.png' },
            { name: 'Deoxys', image: 'https://example.com/deoxys.png' },
            { name: 'Manaphy', image: 'https://example.com/manaphy.png' },
        ];

        const legendarios = [
            { name: 'Zapdos', image: 'https://example.com/zapdos.png' },
            { name: 'Moltres', image: 'https://example.com/moltres.png' },
            { name: 'Articuno', image: 'https://example.com/articuno.png' },
            { name: 'Mewtwo', image: 'https://example.com/mewtwo.png' },
            { name: 'Rayquaza', image: 'https://example.com/rayquaza.png' },
        ];

        // Definir probabilidades
        const probabilidadComunes = 50; // 50% de probabilidad
        const probabilidadRaros = 30; // 30% de probabilidad
        const probabilidadMiticos = 15; // 15% de probabilidad
        const probabilidadLegendarios = 5; // 5% de probabilidad

        // Seleccionar Pokémon basado en probabilidad
        let pokemon;
        let random = Math.random() * 100;
        if (random < probabilidadLegendarios) {
            pokemon = legendarios[Math.floor(Math.random() * legendarios.length)];
            user.pokemonType = 'Legendario';
            user.dailyCredits = 120;
        } else if (random < probabilidadMiticos + probabilidadLegendarios) {
            pokemon = miticos[Math.floor(Math.random() * miticos.length)];
            user.pokemonType = 'Mítico';
            user.dailyCredits = 60;
        } else if (random < probabilidadRaros + probabilidadMiticos + probabilidadLegendarios) {
            pokemon = raros[Math.floor(Math.random() * raros.length)];
            user.pokemonType = 'Raro';
            user.dailyCredits = 30;
        } else {
            pokemon = comunes[Math.floor(Math.random() * comunes.length)];
            user.pokemonType = 'Común';
            user.dailyCredits = 15;
        }

        user.pokemon = pokemon.name;
        let message = `🎉 ¡Has ganado a ${pokemon.name}!\n\n`;
        message += `🔹 Tipo: ${user.pokemonType}\n`;
        message += `💵 Créditos diarios: ${user.dailyCredits} créditos\n\n`;
        message += `Usa *${usedPrefix}premiopokemon* para reclamar tus créditos diarios.`;

        await conn.sendFile(m.chat, pokemon.image, '', message, m);
    } else if (command === 'premiopokemon') {
        if (!user.pokemon) return m.reply('No tienes un Pokémon actualmente.');
        if (user.lastClaim && new Date() - user.lastClaim < 86400000) return m.reply('Ya has reclamado tus créditos diarios hoy.');

        user.lastClaim = new Date();
        user.limit += user.dailyCredits;
        return m.reply(`Has reclamado ${user.dailyCredits} créditos de tu Pokémon ${user.pokemon}.`);
    } else if (command === 'toppokemones') {
        let topMessage = '📜 *Lista de Pokémon por rareza* 📜\n\n';
        topMessage += '⭐️ *Comunes*\n';
        comunes.forEach(p => topMessage += `- ${p.name}\n`);
        topMessage += '\n🌟 *Raros*\n';
        raros.forEach(p => topMessage += `- ${p.name}\n`);
        topMessage += '\n✨ *Míticos*\n';
        miticos.forEach(p => topMessage += `- ${p.name}\n`);
        topMessage += '\n💫 *Legendarios*\n';
        legendarios.forEach(p => topMessage += `- ${p.name}\n`);
        return m.reply(topMessage);
    } else if (command === 'soltarpokemon') {
        if (!user.pokemon) return m.reply('No tienes un Pokémon para liberar.');
        
        user.limit += 50; // Créditos al liberar
        let pokemonLiberado = user.pokemon;
        user.pokemon = null;
        user.pokemonType = null;
        user.dailyCredits = 0;
        user.lastClaim = null;
        return m.reply(`Has liberado a ${pokemonLiberado} y recibido 50 créditos.`);
    }
};

handler.command = ['pokemon', 'premiopokemon', 'toppokemones', 'soltarpokemon'];
export default handler;
