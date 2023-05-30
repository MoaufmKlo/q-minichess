import { table } from 'table'
import { state } from './state.js'

// logs game with training statistics
export function log () {
  const owners = state.map((row) => row.map((piece) => piece?.owner))
  console.clear()
  console.log(table([
    ...owners.map((row) => row.map((piece) => piece === 0 ? '\u2592\u2592' : piece === 1 ? '\u2593\u2593' : '')),
    [
      'Avg. timestamps per episode',,
      ''
    ],
    [
      'Avg. penalties per episode',,
      ''
    ]
  ], {
    columnDefault: {
      width: 15
    },
    spanningCells: [
      {
        col: 0,
        row: 3,
        colSpan: 2
      },
      {
        col: 0,
        row: 4,
        colSpan: 2
      }
    ]
  }))
}

// logs only game
export function logGame () {
  const owners = state.map((row) => row.map((piece) => piece?.owner))
  console.clear()
  console.log(table(owners.map((row) => row.map((piece) => piece === 0 ? '\u2592\u2592' : piece === 1 ? '\u2593\u2593' : '')), {
    columnDefault: {
      width: 15
    }
  }))
}
