import readline from 'readline'
import matrix from './matrix.json' assert { type: 'json' }
import { actions, move, reset, result, state } from './state.js'
import { logGame } from './log.js'

// try ideal moves until a possible one is found
function moveOpponent () {
  const matrixActions = (matrix[JSON.stringify(state)] || Array.from({ length: actions }, () => 0))

  let done = false
  while (!done) {
    const action = matrixActions.indexOf(Math.max(...matrixActions))
    done = move(action % 3, 1, Math.floor(action / 3)).done // see state for action documentation
    matrixActions[action] = -Infinity
  }
}

console.log('q-minichess: Press r to reset, press 0-8 to move a piece.')

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
process.stdin.on('keypress', async (_, key) => {
  if (key?.ctrl && key.name === 'c') return process.stdin.pause()

  if (key.name === 'r') {
    reset()
    logGame()
  } else if (!isNaN(key.name)) {
    const action = Number(key.name)
    const done = move(action % 3, 0, Math.floor(action / 3)).done // see state for action documentation
    logGame()

    // check if game is done
    if (result().winner === 0) {
      await delay(1500)
      console.log(`You won (winner: ${result().winner})!\nPress r to reset.`)
      return
    }

    // move opponent if player moved
    if (done) {
      await delay(1000)
      moveOpponent()
      logGame()

      // check if game is done
      if (result().winner === 1) {
        await delay(1500)
        console.log(`You lost (winner: ${result().winner})!\nPress r to reset.`)
      }
    }
  }
})

readline.emitKeypressEvents(process.stdin)
process.stdin.setRawMode(true)
