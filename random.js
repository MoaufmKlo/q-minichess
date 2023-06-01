import { move, result, reset } from './state.js'
import { logGame } from './log.js'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
async function randomMove (owner) {
  while (true) if (move(Math.round(Math.random() * 2), owner, Math.round(Math.random() * 2)).done) break
  logGame()
  await delay(1500)

  if (result().done) {
    console.log(result())
    process.exit(1)
  }
}

while (!result().done) {
  reset()
  logGame()
  await delay(1500)

  for (let move = 0; move < 10; move += 1) {
    await randomMove(0)
    await randomMove(1)
  }
}
