import { IPathfindingStrategy } from '../interfaces'
import { Stacker, Staircase } from '../models'
import { GameState } from '../types'
import { Coordinates } from '../utils'
import { PathfindingStrategy } from './PathfindingStrategy'

export class StairbuildingStrategy extends PathfindingStrategy implements IPathfindingStrategy {
  private readonly staircase: Staircase

  constructor(stacker: Stacker) {
    super(stacker)
    if (!this._grid.staircase) throw new Error('Staircase is uninitialized.')
    this.staircase = this._grid.staircase
  }

  public next() {
    if (!this.staircase.buildFlag) {
      for (const move of this.expand({ excludeVisited: false, updateBlocks: true })) {
        const { successor, instruction } = move
        if (this.staircase.stairs.has(Coordinates.serialize(successor))) continue
        this.staircase.buildFlag = true
        this._stacker.position = successor
        this.staircase.extend(move)
        this._stacker.switchGameState(GameState.RETRIEVE_BLOCK)
        return instruction
      }
      throw new Error('Stairbuilder - no room left to extend')
    } else {
      if (!this.staircase.descendFlag) {
        console.log(
          'Stairbuilder -',
          this.staircase.currentLevel,
          'target:',
          this.staircase.targetLevel,
          'top:',
          this.staircase.topLevel
        )
        if (this.staircase.currentLevel < this.staircase.targetLevel) {
          const { successor, instruction } = this.staircase.ascendingPath[this.staircase.currentLevel++]
          this._stacker.position = successor
          return instruction
        } else if (this.staircase.currentLevel === this.staircase.targetLevel) {
          this.staircase.descendFlag = true
          this.staircase.targetLevel++
          return this._stacker.unload()
        } else
          throw new Error(`Stairbuilder - Invalid state: ${this.staircase.currentLevel} ${this.staircase.targetLevel}`)
      } else {
        if (this.staircase.targetLevel === this.staircase.topLevel && this.staircase.currentLevel === 0) {
          this.staircase.buildFlag = false
          this.staircase.descendFlag = false
          this.staircase.targetLevel = 1
          this.staircase.topLevel++
          if (this.staircase.topLevel === this._grid.goalLevel) {
            this._stacker.switchGameState(GameState.END)
            // return this._stacker.doNothing()
          }
        } else if (this.staircase.currentLevel > 0) {
          this.staircase.currentLevel--
          return this.prev()
        } else if (this.staircase.currentLevel === 0) {
          this.staircase.descendFlag = false
        } else
          throw new Error(
            `Stairbuilder - Invalid state: ${this.staircase.currentLevel} ${this.staircase.targetLevel} ${this.staircase.topLevel}`
          )
      }
    }
  }
}
