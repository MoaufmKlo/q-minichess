import { state, move, result, reset } from './state.js'
import { log } from './log.js'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

while (!result().done) {
  reset()
  log()
  await delay(1500)

  let previousState = JSON.parse(JSON.stringify(state))
  for (let i = 0; i < 10; i += 1) {
    while (JSON.stringify(previousState) === JSON.stringify(state)) move(Math.round(Math.random() * 2), 0, Math.round(Math.random() * 2))
    previousState = JSON.parse(JSON.stringify(state))

    log()
    await delay(1500)

    if (result().done) {
      console.log(result())
      process.exit(1)
    }

    while (JSON.stringify(previousState) === JSON.stringify(state)) move(Math.round(Math.random() * 2), 1, Math.round(Math.random() * 2))
    previousState = JSON.parse(JSON.stringify(state))

    log()
    await delay(1500)

    if (result().done) {
      console.log(result())
      process.exit(1)
    }
  }
}
