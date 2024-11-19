import { checkWin, getOpponentColor } from "./utils"


class Robot {
    static DISTANCE_SCORE = 1

    static getNextMove(board, color, difficulty, maximizingPlayer = true) {
        return this._alphaBeta(board, color, Math.pow(2, difficulty), maximizingPlayer, -Infinity, Infinity)[1]
    }

    static _alphaBeta(board, color, depth, maximizingPlayer, alpha, beta) {
        if (checkWin(board) != null) {
            return [maximizingPlayer ? -Infinity : Infinity, null]
        }
        
        if (depth == 0) {
            return [this._evaluateBoard(board, color), null]
        }

        const opponentColor = getOpponentColor(color)
        const childBoards = this._getChildBoardsWithMoves(board, color)
        let bestMove = childBoards[0][1]

        if (maximizingPlayer) {
            let maxEval = -Infinity

            for (const [childBoard, move] of childBoards) {
                const [evalN, _] = this._alphaBeta(childBoard, opponentColor, depth - 1, false, alpha, beta)

                if (evalN > maxEval) {
                    maxEval = evalN
                    bestMove = move
                }

                alpha = Math.max(alpha, evalN)

                if (beta <= alpha) {
                    break
                }
            }

            return [maxEval, bestMove]
        } else {
            let minEval = Infinity

            for (const [childBoard, move] of childBoards) {
                const [evalN, _] = this._alphaBeta(childBoard, opponentColor, depth - 1, true, alpha, beta)

                if (evalN < minEval) {
                    minEval = evalN
                    bestMove = move
                }

                beta = Math.min(beta, evalN)

                if (beta <= alpha) {
                    break
                }
            }

            return [minEval, bestMove]
        }
    }    

    static _getChildBoardsWithMoves(board, color) {
        const directions = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [-1, 1], [1, -1]]
        const childBoards = []

        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (board[row][col] == color) {
                    for (const [dRow, dCol] of directions) {
                        const newRow = row + dRow
                        const newCol = col + dCol

                        if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board[row].length && board[newRow][newCol] == '') {
                            const childBoard = board.map(row => row.slice())
                            childBoard[newRow][newCol] = color
                            childBoard[row][col] = ''

                            childBoards.push([childBoard, [row, col, newRow, newCol]])
                        }
                    }
                }
            }
        }

        return childBoards
    }

    static _evaluateBoard(board, color) {
        const positions = this._getCheckerPositions(board, color)
        let score = 0

        for (let i = 0; i < positions.length - 1; i++) { // Fixed distance calculation
            score -= this._getDistance(positions[i], positions[i + 1]) * this.DISTANCE_SCORE
        }

        return score
    }

    static _getDistance(position1, position2) {
        const x1 = position1[0]
        const y1 = position1[1]
        const x2 = position2[0]
        const y2 = position2[1]

        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    }

    static _getCheckerPositions(board, color) {
        const positions = []

        for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
            for (let colIndex = 0; colIndex < board[0].length; colIndex++) {
                if (board[rowIndex][colIndex] == color) {
                    positions.push([rowIndex, colIndex])
                }
            }
        }

        return positions
    }
}

export default Robot