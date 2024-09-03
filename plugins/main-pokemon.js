import fetch from 'node-fetch';

let handler = async (m, { conn, args, command }) => {
    try {
        let user = global.db.data.users[m.sender];
        
        // Verificar si el usuario está registrado
        if (!user.registered) {
            conn.reply(m.chat, 'Por favor, regístrate usando el comando `.reg nombre.edad` antes de usar este comando.', m);
            return;
        }

        if (!args[0]) {
            conn.reply(m.chat, 'Por favor, proporciona el nombre de un Pokémon. Ejemplo: `.pokemon Pikachu`.', m);
            return;
        }

        let pokemonName = args[0].toLowerCase();
        let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        if (!res.ok) {
            conn.reply(m.chat, `No se pudo encontrar información para el Pokémon: ${pokemonName}.`, m);
            return;
        }

        let pokemon = await res.json();
        let stats = calcularPoder(pokemon.stats); // Calcular el poder del Pokémon
        let precio = determinarPrecioPorPoder(stats); // Determinar el precio según el poder

        // Mostrar las estadísticas y el precio del Pokémon
        if (command === 'pokemon') {
            let estadisticas = pokemon.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`).join('\n');
            let mensaje = `
*Pokémon:* ${pokemon.name}
*Poder Total:* ${stats}
*Precio:* ${precio} créditos

*Estadísticas:*
${estadisticas}

Usa \`.comprarpokemon ${pokemonName}\` para comprar este Pokémon.
            `;
            conn.reply(m.chat, mensaje, m);
        }

        // Comprar el Pokémon
        if (command === 'comprarpokemon') {
            if (user.limit < precio) {
                conn.reply(m.chat, `No tienes suficientes créditos para comprar a ${pokemonName}. Necesitas ${precio} créditos.`, m);
                return;
            }

            user.limit -= precio;
            user.pokemons = user.pokemons || [];
            user.pokemons.push({
                nombre: pokemonName,
                poder: stats,
                precio: precio
            }); // Almacenar el Pokémon en la base de datos del usuario

            conn.reply(m.chat, `¡Has comprado a ${pokemonName} por ${precio} créditos!\n\n .mispokemons para ver tus Pokémones.\n\n .venderpokemon nombre del pokemon para vender tus Pokémones`, m);
        }

    } catch (e) {
        console.log(e);
        conn.reply(m.chat, 'Hubo un error al procesar tu solicitud.', m);
    }
};

// Función para calcular el poder total de un Pokémon basado en sus estadísticas
function calcularPoder(stats) {
    return stats.reduce((total, stat) => total + stat.base_stat, 0);
}

// Función para determinar el precio según el poder del Pokémon
function determinarPrecioPorPoder(poder) {
    if (poder < 300) return 10;
    if (poder < 450) return 20;
    if (poder < 600) return 40;
    if (poder < 750) return 60;
    return 100; // Pokémon muy poderoso
}

handler.help = ['pokemon [nombre]', 'comprarpokemon [nombre]', 'mispokemons', 'venderpokemon [nombre]'];
handler.tags = ['pokemon', 'econ'];
handler.command = /^(pokemon|comprarpokemon|mispokemons|venderpokemon)$/i;
handler.register = true;

export default handler;
