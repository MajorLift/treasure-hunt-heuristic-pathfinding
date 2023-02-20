import { IPathfindingStrategy } from './interfaces'
import { PathfindingStrategy } from './PathfindingStrategy'
import { Stacker } from './Stacker'
import { Staircase } from './Staircase'
import { GameState, StairbuilderMode } from './types'
import { Coordinates } from './utils'

export class StairbuildingStrategy extends PathfindingStrategy implements IPathfindingStrategy {
  private readonly _staircase: Staircase
  private mode: StairbuilderMode = 0
  private ascendingIdx = 0
  private previousLevel = 0

  constructor(stacker: Stacker) {
    super(stacker)
    if (!this._grid.staircase) throw new Error('Staircase is uninitialized.')
    this._staircase = this._grid.staircase
  }

  public next() {
    const { level } = this._stacker.cell ?? {}
    if (level === undefined) throw new Error('Stairbuilder - current cell not found.')

    switch (this.mode) {
      case StairbuilderMode.EXTEND:
        if (!this._stacker.isLoaded) {
          console.log('Stacker is unloaded')
          this._stacker.switchGameState(GameState.RETRIEVE_BLOCK)
          return this._stacker.doNothing()
        }
        /**
         * Stacker is loaded with block.
         * If current cell's level is 1, move to neighbor of level 0 or 1.
         * If current cell's level is 0, unload and retrieve new block.
         * Staircase is extended until the cell where block was unloaded.
         */
        if (level === 1) {
          const move = this.expand().pop()
          if (!move) throw new Error('Stair cannot be extended.')
          this._staircase.extend(move)
          this._stacker.position = move.successor
          return move.instruction
        }
        if (level === 0) {
          this.toggleMode()
          this._stacker.switchGameState(GameState.RETRIEVE_BLOCK)
          return this._stacker.unload()
        }
        break
      case StairbuilderMode.ADD_LEVEL:
        /**
         * Stacker is loaded. Ascend staircase and unload.
         */
        if (this._stacker.isLoaded) {
          const { successor, instruction } = this._staircase.ascendingPath[this.ascendingIdx++]
          if (level === this.previousLevel) {
            return this._stacker.unload()
          }
          this.previousLevel = level
          this._stacker.position = successor
          return instruction
        } else {
          /**
           * Victory condition.
           */
          if (this._stacker.position === this._staircase.top && level === this._grid.goalLevel - 1) {
            for (const { successor, instruction } of this.expand()) {
              if (Coordinates.isEqual(successor, this._grid.goal ?? [+Infinity, +Infinity])) {
                this._stacker.switchGameState()
                return instruction
              }
            }
            break
          }
          /**
           * Stacker is unloaded. Descend staircase.
           */
          if (this._pathStack.length) return this.prev()
          else {
            this.ascendingIdx = 0
            this.toggleMode()
            this._stacker.switchGameState(GameState.RETRIEVE_BLOCK)
            return this._stacker.doNothing()
          }
        }
      default:
        throw new Error('Invalid Stairbuilder mode.')
    }
    this._stacker.switchGameState(GameState.END)
    return this._stacker.doNothing()
  }

  private toggleMode() {
    this.mode = Number(!this.mode)
    console.log('Stairbuilder mode:', this.mode)
  }
}
