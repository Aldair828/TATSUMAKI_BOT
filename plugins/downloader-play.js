import fetch from 'node-fetch';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
import axios from 'axios';
import { youtubedl, youtubedlv2 } from '@bochilteam/scraper';

const handler = async (m, { conn, command, args, text, usedPrefix }) => {
    if (!text) throw `Por favor, ingresa el nombre de la canción.\n*Ejemplo: ${usedPrefix + command} Billie Eilish - Bellyache*`;
    
    try { 
        // Buscar la canción en YouTube
        const yt_play = await search(args.join(' '));
        const song = yt_play[0];  // Seleccionar la primera canción en los resultados

        // Construir el mensaje de respuesta con la información de la canción
        const info = `*𓆩 𓃠 𓆪 ✧═══ INFORMACIÓN DE LA CANCIÓN ═══✧ 𓆩 𓃠 𓆪*

        • *Título:* ${song.title}
        • *Subido hace:* ${song.ago}
        • *Duración:* ${secondString(song.duration.seconds)}
        • *Vistas:* ${MilesNumber(song.views)}
        • *Autor:* ${song.author.name}
        • *Enlace:* ${song.url}`.trim();

        // Enviar mensaje con información y botón
        await conn.sendButton(m.chat, '🎶 Canción Encontrada 🎶', info, song.thumbnail, [['Descargar Audio 🎧', `${usedPrefix}yta ${song.url}`], ['Descargar Video 🎥', `${usedPrefix}ytv ${song.url}`]], m);

        // Crear lista de opciones de descarga
        let listSections = [];             
        listSections.push({
            title: '📡 TIPOS DE DESCARGAS',
            rows: [
                { title: "Descargar Audio (Opción 1)", rowId: `${usedPrefix}yta ${song.url}` },
                { title: "Descargar Audio DOC", rowId: `${usedPrefix}ytmp3doc ${song.url}` },
                { title: "Descargar Video (Opción 1)", rowId: `${usedPrefix}ytv ${song.url}` },
                { title: "Descargar Video DOC", rowId: `${usedPrefix}ytmp4doc ${song.url}` }
            ]
        });

        // Enviar la lista de opciones
        await conn.sendList(m.chat, `Elige cómo deseas descargar *${text}*`, 'Opciones de Descarga', 'Elige una opción:', listSections, m);

    } catch (e) {
        // Manejo de errores
        await conn.reply(m.chat, `Hubo un error al procesar tu solicitud. Inténtalo nuevamente.`, m);
        console.error(e);
    }
}

handler.command = ['play', 'play2', 'play3', 'play4'];
export default handler;

// Función para buscar canciones en YouTube
async function search(query, options = {}) {
    const search = await yts.search({ query, hl: 'es', gl: 'ES', ...options });
    return search.videos;
}

// Función para formatear números grandes con puntos
function MilesNumber(number) {
    const exp = /(\d)(?=(\d{3})+(?!\d))/g;
    const rep = '$1.';
    const arr = number.toString().split('.');
    arr[0] = arr[0].replace(exp, rep);
    return arr[1] ? arr.join('.') : arr[0];
}

// Función para convertir segundos en un formato legible (días, horas, minutos, segundos)
function secondString(seconds) {
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const dDisplay = d > 0 ? d + (d == 1 ? ' día, ' : ' días, ') : '';
    const hDisplay = h > 0 ? h + (h == 1 ? ' hora, ' : ' horas, ') : '';
    const mDisplay = m > 0 ? m + (m == 1 ? ' minuto, ' : ' minutos, ') : '';
    const sDisplay = s > 0 ? s + (s == 1 ? ' segundo' : ' segundos') : '';
    return dDisplay + hDisplay + mDisplay + sDisplay;
}
