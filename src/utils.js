export const checkWin = (board) => {
    const lines = getLines(board)

    for (const line of lines) {
        if (line.every(cell => cell == 'w')) {
            return 'w' // White wins
        }

        if (line.every(cell => cell == 'b')) {
            return 'b' // Black wins
        }
    }

    return null
}

export const getLines = (board) => {
    const lines = []

    // Горизонтальні лінії
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col <= board[row].length - 3; col++) {
            lines.push([board[row][col], board[row][col + 1], board[row][col + 2]])
        }
    }

    // Вертикальні лінії
    for (let col = 0; col < board[0].length; col++) {
        for (let row = 0; row <= board.length - 3; row++) {
            lines.push([board[row][col], board[row + 1][col], board[row + 2][col]])
        }
    }

    // Діагоналі (\)
    for (let row = 0; row <= board.length - 3; row++) {
        for (let col = 0; col <= board[row].length - 3; col++) {
            lines.push([board[row][col], board[row + 1][col + 1], board[row + 2][col + 2]])
        }
    }

    // Діагоналі (/)
    for (let row = 0; row <= board.length - 3; row++) {
        for (let col = 2; col < board[row].length; col++) {
            lines.push([board[row][col], board[row + 1][col - 1], board[row + 2][col - 2]])
        }
    }

    return lines
}

export const getOpponentColor = (color) => {
    return color == 'w' ? 'b' : 'w'
}