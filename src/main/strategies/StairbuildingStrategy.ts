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
    /**
     * Victory condition
     */
    if (this.staircase.topLevel === this._grid.goalLevel) {
      this._stacker.switchGameState(GameState.END)
      return this._stacker.doNothing()
    }
    /**
     * Place and stack new bottom stair.
     */
    if (!this.staircase.buildFlag) {
      if (!this.staircase.extendedFlag) {
        // Move to neighbor of previous bottom stair that is traversable and isn't already part of the staircase.
        for (const move of this.expand({
          excludeVisited: false,
          checkTraversability: true,
        })) {
          const { successor, instruction } = move
          if (this.staircase.stairs.has(Coordinates.serialize(successor))) continue
          this._stacker.position = successor
          // Add new bottom stair to ascendingPath.
          this.staircase.extend(move)
          // If new bottom stair cell level is 0, find new block.
          if (this._grid.gridMap.get(Coordinates.serialize(successor))?.level === 0) {
            this._stacker.switchGameState(GameState.RETRIEVE_BLOCK)
          }
          return instruction
        }
        throw new Error('No room for new bottom step.')
        // fill new bottom stair with loaded block
      } else {
        console.log('Stairbuilder - new bottom step:', this._stacker.position)
        this.staircase.buildFlag = true
        this.staircase.extendedFlag = false
        this.staircase.topLevel++
        return this._stacker.unload()
      }
    } else {
      if (!this.staircase.descendFlag) {
        if (this.staircase.currentLevel < this.staircase.targetLevel) {
          const { successor, instruction } = this.staircase.ascendingPath[this.staircase.currentLevel]
          this.staircase.currentLevel++
          this._stacker.position = successor
          this._stacker.switchGameState(GameState.RETRIEVE_BLOCK)
          return instruction
        } else if (this.staircase.currentLevel === this.staircase.targetLevel) {
          this.staircase.descendFlag = true
          this.staircase.targetLevel++
          return this._stacker.unload()
        } else
          throw new Error(
            `Invalid state (ascending): ${this.staircase.currentLevel} ${this.staircase.targetLevel}  ${this.staircase.topLevel}`
          )
      } else {
        if (this.staircase.currentLevel > 0) {
          this.staircase.currentLevel--
          return this.prev()
        } else if (this.staircase.targetLevel < this.staircase.topLevel) {
          this.staircase.descendFlag = false
          this._stacker.switchGameState(GameState.RETRIEVE_BLOCK)
          return this._stacker.doNothing()
        } else if (this.staircase.targetLevel === this.staircase.topLevel) {
          console.log('Stairbuilder - new level built:', this.staircase.topLevel)
          this.staircase.buildFlag = false
          this.staircase.descendFlag = false
          this.staircase.targetLevel = 2
          this._stacker.switchGameState(GameState.BUILD_STAIRCASE)
          return this._stacker.doNothing()
        } else
          throw new Error(
            `Invalid state (descending): ${this.staircase.currentLevel} ${this.staircase.targetLevel} ${this.staircase.topLevel}`
          )
      }
    }
  }
}
