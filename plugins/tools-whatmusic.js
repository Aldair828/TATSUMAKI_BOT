import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = global.db.data.users[m.sender];
    if (command === 'pokemon') {
        if (user.pokemon) return m.reply(`¡Ya tienes un Pokémon! Usa el comando *${usedPrefix}soltarpokemon* para liberarlo.`);

        // Definir los Pokémon por rareza
        const comunes = [
            { name: 'Pikachu', image: 'https://telegra.ph/file/6ac8ef7ec24986ad4785d.jpg' },
            { name: 'Eevee', image: 'https://telegra.ph/file/71e395a44f2824166f04c.jpg' },
            { name: 'Bulbasaur', image: 'https://telegra.ph/file/c3fe08a153c494758b622.jpg' },
            { name: 'Charmander', image: 'https://telegra.ph/file/6863ea1e46b7707fff13c.jpg' },
            { name: 'Squirtle', image: 'https://telegra.ph/file/d9a4c95297b1b15f09336.jpg' },
        ];

        const raros = [
            { name: 'Gengar', image: 'https://telegra.ph/file/f2b979918361d9edf44b8.jpg' },
            { name: 'Jolteon', image: 'https://telegra.ph/file/98152ea136b083880b148.jpg' },
            { name: 'Dragonair', image: 'https://telegra.ph/file/c8a076c41511900520e38.jpg' },
            { name: 'Gyarados', image: 'https://telegra.ph/file/a8c98c518684846e4b965.jpg' },
            { name: 'Lapras', image: 'https://telegra.ph/file/be9de8153d067917a96ba.jpg' },
        ];

        const miticos = [
            { name: 'Mew', image: 'https://telegra.ph/file/e61493e7403964fd89be4.jpg' },
            { name: 'Celebi', image: 'https://telegra.ph/file/5636eacb57fa069969b93.jpg' },
            { name: 'Jirachi', image: 'https://telegra.ph/file/314d32958fcb03f2b4d36.jpg' },
            { name: 'Deoxys', image: 'https://telegra.ph/file/4a32fd5baad0a26de6352.jpg' },
            { name: 'Manaphy', image: 'https://telegra.ph/file/6f1e4daefc56fe9057728.jpg' },
        ];

        const legendarios = [
            { name: 'Zapdos', image: 'https://telegra.ph/file/e0b6dfac56aef3ddba644.jpg' },
            { name: 'Moltres', image: 'https://telegra.ph/file/add5ecc5e0e47a7cbc1a9.jpg' },
            { name: 'Articuno', image: 'https://telegra.ph/file/3fa3b0ae7e7cabc6e3071.jpg' },
            { name: 'Mewtwo', image: 'https://telegra.ph/file/510b07a4719495069509f.jpg' },
            { name: 'Rayquaza', image: 'https://telegra.ph/file/b4cdf2a5111919ad4a8ae.jpg' },
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
