export let state

// reset state to start position
export function reset () {
  state = [
    Array.from({ length: 3 }, (_, i) => ({
      owner: 0,
      piece: i
    })),
    Array.from({ length: 3 }, () => null),
    Array.from({ length: 3 }, (_, i) => ({
      owner: 1,
      piece: i
    }))
  ]
}
reset() // initial reset

let lastOwner // last owner who moved a piece

// moves a piece
// 0: left hit, 1: forward, 2: right hit
export function move (action, owner, piece) {
  const pieceState = {
    owner,
    piece
  }

  const rowIndex = state.findIndex((row) => row.map((piece) => JSON.stringify(piece)).includes(JSON.stringify(pieceState)))
  if (rowIndex === -1) return { done: false }

  const columnIndex = state[rowIndex].map((piece) => JSON.stringify(piece)).indexOf(JSON.stringify(pieceState))

  let done = false
  switch (action) {
    case 0: {
      const rowChange = owner ? -1 : 1
      const columnChange = owner ? -1 : 1
      if (!state[rowIndex + rowChange]) return { done: false }

      if (state[rowIndex + rowChange][columnIndex + columnChange]?.owner == !owner) {
        state[rowIndex + rowChange][columnIndex + columnChange] = state[rowIndex][columnIndex]
        state[rowIndex][columnIndex] = null
        done = true
      }

      break
    }
    case 1: {
      const rowChange = owner ? -1 : 1
      if (!state[rowIndex + rowChange]) return { done: false }

      if (!state[rowIndex + rowChange][columnIndex]) {
        state[rowIndex + rowChange][columnIndex] = state[rowIndex][columnIndex]
        state[rowIndex][columnIndex] = null
        done = true
      }

      break
    }
    case 2: {
      const rowChange = owner ? -1 : 1
      const columnChange = owner ? 1 : -1
      if (!state[rowIndex + rowChange]) return { done: false }

      if (state[rowIndex + rowChange][columnIndex + columnChange]?.owner == !owner) {
        state[rowIndex + rowChange][columnIndex + columnChange] = state[rowIndex][columnIndex]
        state[rowIndex][columnIndex] = null
        done = true
      }

      break
    }
  }

  if (done) lastOwner = owner
  return { done }
}

// check if game is finished and if so, get winner
export function result () {
  let winner

  // scenario: no more pieces of player
  const owners = state.flat(1).map((piece) => piece?.owner)
  if (!owners.includes(0)) winner = 1
  if (!owners.includes(1)) winner = 0

  // scenario: player reached other side
  if (state[0].map((piece) => piece?.owner).includes(1)) winner = 1
  if (state[2].map((piece) => piece?.owner).includes(0)) winner = 0

  // scenario: no more possible actions
  // try every move from next mover (1 - lastOwner: flips)
  const oldState = JSON.parse(JSON.stringify(state))
  let possible = false
  for (let action = 0; action < 3; action += 1) {
    for (let piece = 0; piece < 3; piece += 1) {
      if (move(action, 1 - lastOwner, piece).done) possible = true
      state = JSON.parse(JSON.stringify(oldState)) // reset state
    }
  }
  if (!possible) winner = lastOwner

  return {
    done: typeof winner === 'number',
    winner
  }
}

// static state variables
export const actions = 3 * 3 // 3 actions (see move function) per piece

// find all possible states by looping through states by
// doing all moves at a state and repeating with the new states
export const states = (() => {
  const possible = []

  function moves (oldState, oldOwner) {
    for (let action = 0; action < actions; action += 1) {
      state = JSON.parse(JSON.stringify(oldState))
      if (!possible.map((possibleState) => JSON.stringify(possibleState)).includes(JSON.stringify(state))) possible.push(state)

      /**
       * 0: left hit, 1st piece
       * 1 forward, "
       * 2 right hit, "
       * 3 left hit, 2nd piece
       * 4 forward, "
       * ...
       */
      const { done } = move(action % 3, oldOwner, Math.floor(action / 3))
      if (!done) continue
      if (!result().done) moves(state, 1 - oldOwner)
    }
  }

  reset()
  moves(state, 0)

  return possible
})()
