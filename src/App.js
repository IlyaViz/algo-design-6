import { useEffect, useReducer, useState } from "react"
import { checkWin, getOpponentColor } from "./utils"
import Robot from "./Robot"


const App = () => {
  const colors = ['w', 'b']

  const [myColor] = useState(() => colors[Math.floor(Math.random() * colors.length)])
  const [messageText, setMessageText] = useState(myColor == 'w' ? "You are playing with WHITE checkers" : "You are playing with BLACK checkers")
  const [liftedCheckerPos, setLiftedCheckerPos] = useState(null)
  const [difficulty, setDifficulty] = useState(localStorage.getItem('difficulty') ? parseInt(localStorage.getItem('difficulty')) : 1)
  const [gameIsActive, setGameIsActive] = useState(true)
  const [isMyMove, setIsMyMove] = useState(true)
  const [board, setBoard] = useState([
    ['', 'w', '', 'w', ''],
    ['', '', 'b', '', ''],
    ['', '', '', '', ''],
    ['', '', 'w', '', ''],
    ['', 'b', '', 'b', ''],
  ])

  useEffect(() => {
    localStorage.setItem('difficulty', difficulty)
  }, [difficulty])

  const onCellClick = async (row, col) => {
    if (!gameIsActive) {
      return
    }

    if (!isMyMove) {
      return
    }

    if (isMyChecker(row, col)) {
      setLiftedCheckerPos([row, col])
    } else if (liftedCheckerPos != null && moveIsPossible(liftedCheckerPos[0], liftedCheckerPos[1], row, col)) {
      myMove(liftedCheckerPos[0], liftedCheckerPos[1], row, col)

      if (checkWin(board) != null) {
        setMessageText("You won. Reload page to play again")
        setGameIsActive(false)
        return
      }

      setMessageText("Computer is thinking")

      setTimeout(() => {
        robotMove()

        if (checkWin(board) != null) {
          setMessageText("Robot won. Reload page to play again")
          setGameIsActive(false)
          return
        }

        setMessageText("You can move now")
      }, 100)
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
    setIsMyMove(false)
  }

  const robotMove = () => {
    const robotColor = getOpponentColor(myColor)

    const [fromRow, fromCol, toRow, toCol] = Robot.getNextMove(board, robotColor, difficulty)
    placeChecker(fromRow, fromCol, toRow, toCol)

    setIsMyMove(true)
  }

  const placeChecker = (fromRow, fromCol, toRow, toCol) => {
    const tempBoard = board
    const temp = board[fromRow][fromCol]

    tempBoard[fromRow][fromCol] = tempBoard[toRow][toCol]
    tempBoard[toRow][toCol] = temp

    setBoard(tempBoard)
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
                  onClick={() => { onCellClick(rowIndex, colIndex) }}
                >

                  {col == 'b' && <img src="black.png" alt="black piece" />}
                  {col == 'w' && <img src="white.png" alt="white piece" />}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <label htmlFor="easy">Easy difficulty</label>
      <input name="difficulty" type="radio" id="easy" checked={difficulty == 1} onChange={() => { setDifficulty(1) }}></input>

      <label htmlFor="medium">Medium difficulty</label>
      <input name="difficulty" type="radio" id="medium" checked={difficulty == 2} onChange={() => { setDifficulty(2) }}></input>

      <label htmlFor="hard">Hard difficulty</label>
      <input name="difficulty" type="radio" id="hard" checked={difficulty == 3} onChange={() => { setDifficulty(3) }}></input>

      <h1 className="text-lime-500 text-5xl">
        {messageText}
      </h1>
    </div>

  )
}

export default App
