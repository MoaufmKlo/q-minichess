import { log } from './log.js'
import { actions, reset, result, state, step } from './state.js'
import { writeFile } from 'fs/promises'

// hyperparameters
const episodes = 5000
const learningRate = 0.1
const discountFactor = 0.4
const exploration = 0.2

const epochs = []
const rewards = []

// q-learning algorithm
// explained in depth at https://en.wikipedia.org/wiki/Q-learning#Algorithm

// empty matrix, filled with states through training
const matrix = {}

const start = new Date()
for (let episode = 0; episode < episodes; episode += 1) {
  reset()

  const stats = {
    epochs: 0,
    reward: 0
  }

  while (!result().done) {
    const currentState = JSON.parse(JSON.stringify(state))

    const ensureMatrix = () => matrix[JSON.stringify(state)] = matrix[JSON.stringify(state)] ? matrix[JSON.stringify(state)] : Array.from({ length: actions }, () => 0)

    ensureMatrix()
    const highestQ = () => matrix[JSON.stringify(state)].indexOf(Math.max(...matrix[JSON.stringify(state)]))

    // explore (random action) or exploit (take highest learned Q)
    let action
    if (Math.random() < exploration) action = Math.round(Math.random() * actions - 1)
    else action = highestQ()

    let reward = step(action).reward
    const done = result()
    if (done.winner === 1) reward -= 6 // penalty if game was lost
    else if (done.winner === 0) reward += 6

    const currentQ = matrix[JSON.stringify(currentState)][action]
    ensureMatrix()
    const nextQ = highestQ() // highest learned Q for next state

    const newQ = (1 - learningRate) * currentQ + learningRate * (reward + discountFactor * nextQ)
    matrix[JSON.stringify(currentState)][action] = newQ

    stats.epochs += 1
    stats.reward += reward
  }

  epochs.push(stats.epochs)
  rewards.push(stats.reward)
  if (episode % 100 === 0) {
    log({
      episode,
      episodes,
      states: Object.keys(matrix).length,
      epochs,
      rewards,
      ms: new Date() - start
    })
    await writeFile('./matrix.json', JSON.stringify(matrix, null, 4))
  }
}

await writeFile('./matrix.json', JSON.stringify(matrix, null, 4))
