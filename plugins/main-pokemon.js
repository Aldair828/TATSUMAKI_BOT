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
        let precioCompra = determinarPrecioCompra(stats); // Determinar el precio de compra según el poder
        let precioVenta = determinarPrecioVenta(stats); // Determinar el precio de venta según el poder
        let imagen = pokemon.sprites.other['official-artwork'].front_default; // Obtener la URL de la imagen

        // Mostrar las estadísticas, el precio de compra y la imagen del Pokémon
        if (command === 'pokemon') {
            let estadisticas = pokemon.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`).join('\n');
            let mensaje = `
*Pokémon:* ${pokemon.name}
*Poder Total:* ${stats}
*Precio de Compra:* ${precioCompra} créditos
*Precio de Venta:* ${precioVenta} créditos

*Estadísticas:*
${estadisticas}

Usa \`.comprarpokemon ${pokemonName}\` para comprar este Pokémon.
            `;
            conn.sendFile(m.chat, imagen, `${pokemon.name}.jpg`, mensaje, m);
        }

        // Comprar el Pokémon
        if (command === 'comprarpokemon') {
            if (user.limit < precioCompra) {
                conn.reply(m.chat, `No tienes suficientes créditos para comprar a ${pokemonName}. Necesitas ${precioCompra} créditos.`, m);
                return;
            }

            user.limit -= precioCompra;
            user.pokemons = user.pokemons || [];
            user.pokemons.push({
                nombre: pokemonName,
                poder: stats,
                precioCompra: precioCompra,
                precioVenta: precioVenta,
                imagen: imagen
            }); // Almacenar el Pokémon en la base de datos del usuario

            conn.reply(m.chat, `¡Has comprado a ${pokemonName} por ${precioCompra} créditos!\n\n .mipokemon para ver tus Pokémones.\n\n .venderpokemon nombre del pokemon para vender tus Pokémones`, m);
        }

        // Mostrar los Pokémon que tiene el usuario
        if (command === 'mipokemon') {
            if (!user.pokemons || user.pokemons.length === 0) {
                conn.reply(m.chat, 'No tienes Pokémones. Compra uno con el comando `.comprarpokemon [nombre]`.', m);
                return;
            }

            let pokemonList = user.pokemons.map((p, i) => `${i + 1}. *${p.nombre}* (Poder: ${p.poder}, Precio de Venta: ${p.precioVenta} créditos)`).join('\n');
            conn.reply(m.chat, `Estos son tus Pokémones:\n\n${pokemonList}\n\nUsa \`.venderpokemon [número]\` para vender un Pokémon.`, m);
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

// Función para determinar el precio de compra según el poder del Pokémon
function determinarPrecioCompra(poder) {
    return 50 + Math.floor(poder / 50) * 50;
}

// Función para determinar el precio de venta según el poder del Pokémon
function determinarPrecioVenta(poder) {
    return 60 + Math.floor(poder / 50) * 60;
}

handler.help = ['pokemon [nombre]', 'comprarpokemon [nombre]', 'mipokemon', 'venderpokemon [nombre]'];
handler.tags = ['pokemon', 'econ'];
handler.command = /^(pokemon|comprarpokemon|mipokemon|venderpokemon)$/i;
handler.register = true;

export default handler;
