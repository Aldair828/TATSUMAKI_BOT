let games = {};
let currentPlayer = null; // Variable para almacenar al jugador actual

const createBoard = (rows, cols, numMines) => {
    let board = Array.from({ length: rows }, () => Array(cols).fill(0));
    let mines = numMines;
    while (mines > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        if (board[r][c] === 0) {
            board[r][c] = -1;
            mines--;
        }
    }
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] === -1) continue;
            let count = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (r + i >= 0 && r + i < rows && c + j >= 0 && c + j < cols && board[r + i][c + j] === -1) {
                        count++;
                    }
                }
            }
            board[r][c] = count;
        }
    }
    return board;
};

const displayBoard = (board, revealed) => {
    return board.map((row, r) => row.map((cell, c) => {
        let key = `${r},${c}`;
        if (revealed[key]) {
            return cell === -1 ? '💣' : cell === 0 ? ' ' : cell;
        } else {
            return '🟢';
        }
    }).join('')).join('\n');
};

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = m.sender;
    let [action, choice] = args;
    let boardSize = 5; // Tablero 5x5
    let numMines = 5;  // Número de minas

    if (action === 'start') {
        if (currentPlayer && currentPlayer !== user) {
            return m.reply('⚠️ ALGUIEN ESTÁ JUGANDO. ESPERE SU TURNO.');
        }

        if (games[user]) {
            return m.reply('🔍 Ya tienes un juego en curso. Responde con el número de la casilla que quieres descubrir.');
        }

        currentPlayer = user;
        games[user] = { 
            board: createBoard(boardSize, boardSize, numMines), 
            revealed: {}, 
            gameOver: false 
        };

        let boardDisplay = displayBoard(games[user].board, games[user].revealed);
        return m.reply(`🎮 *Buscaminas* - Tablero:\n\n${boardDisplay}\n\n📝 Responde con el número de la casilla en formato (fila,columna) para descubrir.`);
    }

    if (!games[user]) {
        return m.reply('⚠️ No hay un juego activo. Usa `.minas start` para comenzar un nuevo juego.');
    }

    if (games[user].gameOver) {
        return m.reply('⚠️ El juego ha terminado. Usa `.minas start` para comenzar un nuevo juego.');
    }

    let [row, col] = choice.split(',').map(Number);

    if (isNaN(row) || isNaN(col) || row < 0 || row >= boardSize || col < 0 || col >= boardSize) {
        return m.reply('✋ Las coordenadas deben estar dentro del tablero.');
    }

    let selectedCell = `${row},${col}`;
    if (games[user].revealed[selectedCell]) {
        return m.reply('❗ Esta casilla ya ha sido revelada.');
    }

    if (games[user].board[row][col] === -1) {
        games[user].gameOver = true;
        let boardDisplay = displayBoard(games[user].board, games[user].revealed);
        await conn.reply(m.chat, `💥 ¡Explosión! Has tocado una mina. Has perdido el juego.\n\n${boardDisplay}`, m);
        delete games[user];
        currentPlayer = null; // Resetea el jugador actual
        return;
    }

    games[user].revealed[selectedCell] = true;
    let boardDisplay = displayBoard(games[user].board, games[user].revealed);
    await conn.reply(m.chat, `🔍 Has revelado la casilla (${row},${col}).\n\n${boardDisplay}`, m);
}

handler.help = ['minas [start|(fila,columna)]']
handler.tags = ['game']
handler.command = ['minas']
handler.register = true
handler.group = false 
export default handler;
