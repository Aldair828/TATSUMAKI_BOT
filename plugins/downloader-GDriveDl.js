let games = {};

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

const displayBoard = (board, reveal) => {
    return board.map(row => row.map(cell => {
        if (reveal[cell] === true) {
            return cell === -1 ? '💣' : cell === 0 ? ' ' : cell;
        } else {
            return '🟢';
        }
    }).join(' ')).join('\n');
};

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let [opponent, row, col] = args;
    let user = m.sender;
    let opponentId = conn.parseMention(opponent)[0];

    if (!opponent || row === undefined || col === undefined) {
        return m.reply(`✋ Usa el formato correcto: > ${usedPrefix + command} <@usuario> <fila> <columna>`);
    }

    row = parseInt(row);
    col = parseInt(col);

    if (!games[user]) games[user] = { board: createBoard(5, 5, 5), revealed: {} };
    if (!games[opponentId]) games[opponentId] = { board: createBoard(5, 5, 5), revealed: {} };

    let currentGame = games[user];
    let opponentGame = games[opponentId];

    if (currentGame.revealed[`${row},${col}`]) {
        return m.reply('❗ Esta casilla ya ha sido revelada.');
    }

    if (currentGame.board[row][col] === -1) {
        m.reply(`💥 ¡Explosión! Has tocado una mina. Has perdido el juego.`);
        delete games[user];
        delete games[opponentId];
        return;
    }

    currentGame.revealed[`${row},${col}`] = true;

    let boardDisplay = displayBoard(currentGame.board, currentGame.revealed);
    let opponentBoardDisplay = displayBoard(opponentGame.board, opponentGame.revealed);

    await conn.reply(m.chat, `🕵️‍♂️ *Tu Tablero:*\n\n${boardDisplay}`, m);
    await conn.reply(m.chat, `🕵️‍♂️ *Tablero de ${await conn.getName(opponentId)}:*\n\n${opponentBoardDisplay}`, m);

    m.reply(`🔎 Has revelado la casilla [${row}, ${col}].`);
};

handler.help = ['minas <@usuario> <fila> <columna>']
handler.tags = ['game']
handler.command = ['minas']
handler.register = true
handler.group = false 
export default handler;
