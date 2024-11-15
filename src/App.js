import { useState } from "react";
import Robot from "./Robot"

const App = () => {
  const colors = ['w', 'b']

  const [myColor] = useState(() => colors[Math.floor(Math.random() * colors.length)]);
  const [messageText, setMessageText] = useState('')
  const [liftedCheckerPos, setLiftedCheckerPos] = useState(null)
  const [difficulty, setDifficulty] = useState(1)
  const [board, setBoard] = useState([
    ['', 'w', '', 'w', ''],
    ['', '', 'b', '', ''],
    ['', '', '', '', ''],
    ['', '', 'w', '', ''],
    ['', 'b', '', 'b', ''],
  ])

  const onCellClick = (row, col) => {
    console.log(difficulty)
    if (isMyChecker(row, col)) {
      setLiftedCheckerPos([row, col])
    } else if (liftedCheckerPos != null && moveIsPossible(liftedCheckerPos[0], liftedCheckerPos[1], row, col)) {
      myMove(liftedCheckerPos[0], liftedCheckerPos[1], row, col)
    }
  }

  const moveIsPossible = (fromRow, fromCol, toRow, toCol) => {
    if (toRow >= 0 && toRow < board.length && toCol >= 0 && toCol < board[0].length) {
      if (Math.abs(toRow - fromRow) <= 1 && Math.abs(toCol - fromCol) <= 1) {
        if (!isChecker(toRow, toCol)) {
          return true
        }
      }
    }

    return false
  }

  const isChecker = (row, col) => {
    return colors.includes(board[row][col])
  }

  const isMyChecker = (row, col) => {
    return board[row][col] == myColor
  }

  const myMove = (fromRow, fromCol, toRow, toCol) => {
    placeChecker(fromRow, fromCol, toRow, toCol)
    setLiftedCheckerPos(null)

    if (checkWin()) {
      setMessageText("You won")
      resetBoard()
    }
  }

  const robotMove = () => {
    /*
    setMessageText("Computer is thinking")

    [fromRow, fromCol, toRow, toCol] = Robot.move(difficulty)

    placeChecker(fromRow, fromCol, toRow, toCol)

    setMessageText('')

    if (checkWin()) {
      setMessageText("Enemy won")
      resetBoard()
    }
    */
  }

  const placeChecker = (fromRow, fromCol, toRow, toCol) => {
    var tempBoard = board
    var temp = board[fromRow][fromCol]

    tempBoard[fromRow][fromCol] = tempBoard[toRow][toCol]
    tempBoard[toRow][toCol] = temp

    setBoard(tempBoard)
  }

  const checkWin = () => {
    const hasWinningLine = (color, row1, col1, row2, col2, row3, col3) => {
      return (
        board[row1][col1] === color &&
        board[row2][col2] === color &&
        board[row3][col3] === color
      );
    };

    // Check all rows
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col <= board[row].length - 3; col++) {
        if (hasWinningLine('w', row, col, row, col + 1, row, col + 2) ||
          hasWinningLine('b', row, col, row, col + 1, row, col + 2)) {
          setMessageText(`${board[row][col]} wins!`);
          return true;
        }
      }
    }

    // Check all columns
    for (let col = 0; col < board[0].length; col++) {
      for (let row = 0; row <= board.length - 3; row++) {
        if (hasWinningLine('w', row, col, row + 1, col, row + 2, col) ||
          hasWinningLine('b', row, col, row + 1, col, row + 2, col)) {
          setMessageText(`${board[row][col]} wins!`);
          return true;
        }
      }
    }

    // Check diagonals (top-left to bottom-right)
    for (let row = 0; row <= board.length - 3; row++) {
      for (let col = 0; col <= board[row].length - 3; col++) {
        if (hasWinningLine('w', row, col, row + 1, col + 1, row + 2, col + 2) ||
          hasWinningLine('b', row, col, row + 1, col + 1, row + 2, col + 2)) {
          setMessageText(`${board[row][col]} wins!`);
          return true;
        }
      }
    }

    // Check diagonals (bottom-left to top-right)
    for (let row = 2; row < board.length; row++) {
      for (let col = 0; col <= board[row].length - 3; col++) {
        if (hasWinningLine('w', row, col, row - 1, col + 1, row - 2, col + 2) ||
          hasWinningLine('b', row, col, row - 1, col + 1, row - 2, col + 2)) {
          setMessageText(`${board[row][col]} wins!`);
          return true;
        }
      }
    }

    return false;
  }

  const resetBoard = () => {
    setBoard([
      ['', 'w', '', 'w', ''],
      ['', '', 'b', '', ''],
      ['', '', '', '', ''],
      ['', '', 'w', '', ''],
      ['', 'b', '', 'b', ''],
    ])
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <table className="border-collapse border border-slate-500">
        <thead>
          <tr>
            <th className="bg-blue-600 border border-slate-500"></th>

            {['A', 'B', 'C', 'D', 'E'].map((col) => (
              <th key={col} className="bg-blue-600 border border-slate-500">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {board.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <th className="bg-blue-600 border border-slate-500">{rowIndex + 1}</th>

              {row.map((col, colIndex) => (
                <td
                  key={`${rowIndex}-${colIndex}`}
                  className={`size-24 border 'border-slate-500' ${liftedCheckerPos != null && rowIndex == liftedCheckerPos[0] && colIndex == liftedCheckerPos[1] ? 'bg-blue-400' : 'bg-blue-300'}`}
                  onClick={() => { onCellClick(rowIndex, colIndex); }}
                >

                  {col === 'b' && <img src="black.png" alt="black piece" />}
                  {col === 'w' && <img src="white.png" alt="white piece" />}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <label htmlFor="easy">Easy difficulty</label>
      <input name="difficulty" type="radio" id="easy" onChange={() => { setDifficulty(1) }}></input>

      <label htmlFor="medium">Medium difficulty</label>
      <input name="difficulty" type="radio" id="medium" onChange={() => { setDifficulty(2) }}></input>

      <label htmlFor="hard">Hard difficulty</label>
      <input name="difficulty" type="radio" id="hard" onChange={() => { setDifficulty(3) }}></input>

      <h1 className="text-lime-500 text-5xl">
        {messageText}
      </h1>
    </div>

  );
}

export default App;
