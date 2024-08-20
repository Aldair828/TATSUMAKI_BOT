let handler = async (m, { conn }) => {
    // Lista de animales con sus emojis, créditos y probabilidades
    const animales = [
        { emoji: '🦊', nombre: 'Zorro', creditos: 2, probabilidad: 10 },
        { emoji: '🐗', nombre: 'Jabalí', creditos: 3, probabilidad: 5 },
        { emoji: '🐷', nombre: 'Cerdo', creditos: 1, probabilidad: 20 },
        { emoji: '🐔', nombre: 'Pollo', creditos: 1, probabilidad: 20 },
        { emoji: '🦆', nombre: 'Pato', creditos: 1, probabilidad: 20 },
        { emoji: '🐦', nombre: 'Pájaro', creditos: 1, probabilidad: 20 },
        { emoji: '🐵', nombre: 'Mono', creditos: 2, probabilidad: 10 },
        { emoji: '🐘', nombre: 'Elefante', creditos: 5, probabilidad: 3 },
        { emoji: '🐮', nombre: 'Vaca', creditos: 2, probabilidad: 10 },
        { emoji: '🐯', nombre: 'Tigre', creditos: 4, probabilidad: 4 },
        { emoji: '🐭', nombre: 'Ratón', creditos: 1, probabilidad: 20 },
        { emoji: '🐴', nombre: 'Caballo', creditos: 3, probabilidad: 5 },
        { emoji: '🐧', nombre: 'Pingüino', creditos: 3, probabilidad: 5 }
    ];

    // Función para seleccionar animales aleatoriamente según la probabilidad
    function seleccionarAnimal() {
        let totalProbabilidad = animales.reduce((total, animal) => total + animal.probabilidad, 0);
        let random = Math.floor(Math.random() * totalProbabilidad);
        for (let animal of animales) {
            if (random < animal.probabilidad) {
                return animal;
            }
            random -= animal.probabilidad;
        }
    }

    // Selección aleatoria de 3 animales
    let capturados = [];
    for (let i = 0; i < 3; i++) {
        capturados.push(seleccionarAnimal());
    }

    // Suma de los créditos capturados
    let totalCreditos = capturados.reduce((total, animal) => total + animal.creditos, 0);
    let mensajeCaptura = `Cazaste:\n\n${capturados.map(a => `${a.emoji}`).join(' + ')}\n\n`;

    // Muestra los animales capturados y sus créditos
    mensajeCaptura += capturados.map(a => `${a.nombre} ${a.emoji} ${a.creditos} crédito${a.creditos > 1 ? 's' : ''}`).join('\n') + '\n\n';
    mensajeCaptura += `Desea reclamar lo capturado? Si / No`;

    // Envío del mensaje con las opciones
    await conn.reply(m.chat, mensajeCaptura, m);

    // Esperar la respuesta del usuario
    const filter = response => {
        return ['si', 'no'].includes(response.text.toLowerCase());
    };

    // Recibir respuesta
    conn.on('chat-update', async (chatUpdate) => {
        let response = chatUpdate.messages && chatUpdate.messages[0];
        if (!response) return;

        if (response.key.fromMe || response.sender !== m.sender) return;

        let text = response.message.conversation.toLowerCase();

        if (text === 'si') {
            global.db.data.users[m.sender].limit += totalCreditos;
            conn.reply(m.chat, `¡Felicidades! Has reclamado ${totalCreditos} créditos.`, m);
        } else if (text === 'no') {
            conn.reply(m.chat, `Los animales fueron liberados.`, m);
        }
    });
}

handler.help = ['cazar']
handler.tags = ['game']
handler.command = /^cazar$/i
handler.register = true

export default handler
