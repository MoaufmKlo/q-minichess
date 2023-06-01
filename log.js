import { table } from 'table'
import { state } from './state.js'
import humanizeDuration from 'humanize-duration'

// logs game with training statistics
export function log ({ episode, episodes, states, epochs, rewards, ms }) {
  const owners = state.map((row) => row.map((piece) => piece?.owner))
  console.clear()
  console.log(table([
    ...owners.map((row) => row.map((piece) => piece === 0 ? '\u2592\u2592' : piece === 1 ? '\u2593\u2593' : '')),
    [
      'Episodes',,
      `${episode}/${episodes} (${states} states)`
    ],
    [
      'Avg. epochs per episode',,
      `${epochs.reduce((sum, a) => sum + a) / epochs.length}`.substring(0, 15)
    ],
    [
      'Avg. rewards per episode',,
      `${rewards.reduce((sum, a) => sum + a) / rewards.length}`.substring(0, 15)
    ],
    [
      'Time left',,
      `${humanizeDuration(ms / episode * episodes - ms, { maxDecimalPoints: 0 })} (total ${humanizeDuration(ms / episode * episodes, { maxDecimalPoints: 0 })})`
    ]
  ], {
    columnDefault: {
      width: 20
    },
    columns: {
      2: {
        width: 40
      }
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
      },
      {
        col: 0,
        row: 5,
        colSpan: 2
      },
      {
        col: 0,
        row: 6,
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
