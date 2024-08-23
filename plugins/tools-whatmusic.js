const pokemonList = {
  comunes: [
    { name: 'Pidgey', credits: 15, image: 'URL_DE_LA_IMAGEN_Pidgey' },
    { name: 'Rattata', credits: 15, image: 'URL_DE_LA_IMAGEN_Rattata' },
    { name: 'Zubat', credits: 15, image: 'URL_DE_LA_IMAGEN_Zubat' },
    { name: 'Magikarp', credits: 15, image: 'URL_DE_LA_IMAGEN_Magikarp' },
    { name: 'Psyduck', credits: 15, image: 'URL_DE_LA_IMAGEN_Psyduck' },
    { name: 'Caterpie', credits: 15, image: 'URL_DE_LA_IMAGEN_Caterpie' },
    { name: 'Weedle', credits: 15, image: 'URL_DE_LA_IMAGEN_Weedle' },
    { name: 'Jigglypuff', credits: 15, image: 'URL_DE_LA_IMAGEN_Jigglypuff' },
    { name: 'Spearow', credits: 15, image: 'URL_DE_LA_IMAGEN_Spearow' },
    { name: 'Paras', credits: 15, image: 'URL_DE_LA_IMAGEN_Paras' }
  ],
  raros: [
    { name: 'Pikachu', credits: 30, image: 'URL_DE_LA_IMAGEN_Pikachu' },
    { name: 'Meowth', credits: 30, image: 'URL_DE_LA_IMAGEN_Meowth' },
    { name: 'Eevee', credits: 30, image: 'URL_DE_LA_IMAGEN_Eevee' },
    { name: 'Vulpix', credits: 30, image: 'URL_DE_LA_IMAGEN_Vulpix' },
    { name: 'Growlithe', credits: 30, image: 'URL_DE_LA_IMAGEN_Growlithe' },
    { name: 'Abra', credits: 30, image: 'URL_DE_LA_IMAGEN_Abra' },
    { name: 'Machop', credits: 30, image: 'URL_DE_LA_IMAGEN_Machop' },
    { name: 'Bellsprout', credits: 30, image: 'URL_DE_LA_IMAGEN_Bellsprout' },
    { name: 'Geodude', credits: 30, image: 'URL_DE_LA_IMAGEN_Geodude' },
    { name: 'Magnemite', credits: 30, image: 'URL_DE_LA_IMAGEN_Magnemite' }
  ],
  miticos: [
    { name: 'Mew', credits: 60, image: 'URL_DE_LA_IMAGEN_Mew' },
    { name: 'Celebi', credits: 60, image: 'URL_DE_LA_IMAGEN_Celebi' },
    { name: 'Jirachi', credits: 60, image: 'URL_DE_LA_IMAGEN_Jirachi' },
    { name: 'Deoxys', credits: 60, image: 'URL_DE_LA_IMAGEN_Deoxys' },
    { name: 'Darkrai', credits: 60, image: 'URL_DE_LA_IMAGEN_Darkrai' },
    { name: 'Shaymin', credits: 60, image: 'URL_DE_LA_IMAGEN_Shaymin' },
    { name: 'Victini', credits: 60, image: 'URL_DE_LA_IMAGEN_Victini' },
    { name: 'Keldeo', credits: 60, image: 'URL_DE_LA_IMAGEN_Keldeo' },
    { name: 'Meloetta', credits: 60, image: 'URL_DE_LA_IMAGEN_Meloetta' },
    { name: 'Hoopa', credits: 60, image: 'URL_DE_LA_IMAGEN_Hoopa' }
  ],
  legendarios: [
    { name: 'Mewtwo', credits: 120, image: 'URL_DE_LA_IMAGEN_Mewtwo' },
    { name: 'Zapdos', credits: 120, image: 'URL_DE_LA_IMAGEN_Zapdos' },
    { name: 'Moltres', credits: 120, image: 'URL_DE_LA_IMAGEN_Moltres' },
    { name: 'Articuno', credits: 120, image: 'URL_DE_LA_IMAGEN_Articuno' },
    { name: 'Lugia', credits: 120, image: 'URL_DE_LA_IMAGEN_Lugia' },
    { name: 'Ho-Oh', credits: 120, image: 'URL_DE_LA_IMAGEN_Ho-Oh' },
    { name: 'Rayquaza', credits: 120, image: 'URL_DE_LA_IMAGEN_Rayquaza' },
    { name: 'Kyogre', credits: 120, image: 'URL_DE_LA_IMAGEN_Kyogre' },
    { name: 'Groudon', credits: 120, image: 'URL_DE_LA_IMAGEN_Groudon' },
    { name: 'Dialga', credits: 120, image: 'URL_DE_LA_IMAGEN_Dialga' }
  ]
}

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]
  
  if (user.pokemon) {
    return m.reply('Ya tienes un Pokémon. Libéralo primero usando .soltarpokemon para capturar otro.')
  }

  let categories = ['comunes', 'raros', 'miticos', 'legendarios']
  let categoryWeights = [60, 25, 10, 5] // Probabilidades ajustadas: 60% Común, 25% Raro, 10% Mítico, 5% Legendario
  let category = categories[getWeightedRandomIndex(categoryWeights)]

  let pokemon = pokemonList[category][Math.floor(Math.random() * pokemonList[category].length)]
  user.pokemon = pokemon

  let message = `¡HAS GANADO A ${pokemon.name}!\n\nAHORA TENDRÁS ${pokemon.credits} CRÉDITOS DIARIOS GRATIS CON SOLO RECLAMARLO. Usa .premiopokemon para reclamar tus créditos diarios.`
  await conn.sendFile(m.chat, pokemon.image, '', message, m)
}

handler.help = ['pokemon']
handler.tags = ['pokemon']
handler.command = ['pokemon']
handler.register = true
export default handler

let premiopokemon = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]
  
  if (!user.pokemon) {
    return m.reply('No tienes ningún Pokémon. Usa .pokemon para capturar uno.')
  }

  let today = new Date().toISOString().slice(0, 10)
  
  if (user.lastClaim === today) {
    return m.reply('Ya has reclamado tus créditos hoy. Vuelve mañana.')
  }

  user.limit += user.pokemon.credits
  user.lastClaim = today
  m.reply(`Has reclamado ${user.pokemon.credits} créditos de tu ${user.pokemon.name} hoy.`)
}

premiopokemon.help = ['premiopokemon']
premiopokemon.tags = ['pokemon']
premiopokemon.command = ['premiopokemon']
premiopokemon.register = true
export { premiopokemon }

let soltarpokemon = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]
  
  if (!user.pokemon) {
    return m.reply('No tienes ningún Pokémon para liberar.')
  }

  if (user.limit < 50) {
    return m.reply('No tienes suficientes créditos para liberar a tu Pokémon. Necesitas 50 créditos.')
  }

  user.limit -= 50
  user.pokemon = null
  user.lastClaim = null
  m.reply('Has liberado a tu Pokémon. Ahora puedes capturar otro usando .pokemon.')
}

soltarpokemon.help = ['soltarpokemon']
soltarpokemon.tags = ['pokemon']
soltarpokemon.command = ['soltarpokemon']
soltarpokemon.register = true
export { soltarpokemon }

let toppokemones = async (m, { conn }) => {
  let message = '*Lista de Pokemones por Rareza*\n\n'

  for (let category in pokemonList) {
    message += `*${category.toUpperCase()}*\n`
    pokemonList[category].forEach(p => {
      message += `- ${p.name} (${p.credits} créditos diarios)\n`
    })
    message += '\n'
  }

  m.reply(message.trim())
}

toppokemones.help = ['toppokemones']
toppokemones.tags = ['pokemon']
toppokemones.command = ['toppokemones']
toppokemones.register = true
export { toppokemones }

function getWeightedRandomIndex(weights) {
  let totalWeight = weights.reduce((total, weight) => total + weight, 0)
  let random = Math.random() * totalWeight
  for (let i = 0; i < weights.length; i++) {
    if (random < weights[i]) return i
    random -= weights[i];
  }
  return -1; // Esto no debería suceder si los pesos están bien configurados.
}
