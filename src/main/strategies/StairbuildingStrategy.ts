import { IPathfindingStrategy } from '../interfaces'
import { Stacker, Staircase } from '../models'
import { GameState } from '../types'
import { Coordinates } from '../utils'
import { PathfindingStrategy } from './PathfindingStrategy'

export class StairbuildingStrategy extends PathfindingStrategy implements IPathfindingStrategy {
  private _staircase: Staircase
  constructor(stacker: Stacker) {
    super(stacker)
    if (this._grid.staircase === undefined) throw new Error('Staircase is uninitialized.')
    this._staircase = this._grid.staircase
  }

  next() {
    // console.log(
    //   'Stairbuilder - ',
    //   'current:',
    //   this._staircase.currentStep,
    //   'target:',
    //   this._staircase.targetLevel,
    //   'top:',
    //   this._staircase.topLevel
    // )
    if (this._grid.goal === undefined) throw new Error('Goal not found.')
    /**
     * Victory condition
     */
    if (this._stacker.cell?.level === this._grid.goalLevel - 1) {
      this._stacker.switchGameState(GameState.END)
      return Coordinates.getInstructionFromCoordinates(this._stacker.position, this._grid.goal)
    }
    if (!this._staircase.buildFlag) {
      /** FInd cell to install new bottom step */
      if (!this._staircase.extendedFlag) {
        const nextBottomStep = this.expand({
          excludeVisited: false,
          checkTraversability: true,
        })
          .filter(({ successor }) => !this._staircase.stairs.has(Coordinates.serialize(successor)))
          .sort(
            (a, b) =>
              Coordinates.manhattanDistance(this._grid.goal!, a.successor) -
              Coordinates.manhattanDistance(this._grid.goal!, b.successor)
          )
          .shift()
        const { successor, instruction } = nextBottomStep ?? {}
        if (nextBottomStep === undefined || successor === undefined || instruction === undefined)
          throw new Error('No room for new bottom step.')
        this._staircase.extend(nextBottomStep)
        this._staircase.extendedFlag = true
        this._pathStack.push({ predecessor: this._stacker.position, instruction })
        this._stacker.position = successor
        return instruction
        /** Retrieve block and stack new bottom step */
      } else {
        if (this._stacker.cell?.level === 0) {
          this._stacker.switchGameState(GameState.RETRIEVE_BLOCK)
        }
        this._staircase.currentStep = 1
        this._staircase.targetLevel = 2
        this._staircase.topLevel++
        this._staircase.buildFlag = true
        console.log('Stairbuilder - new bottom step installed', this._stacker.position)
        return this._stacker.doNothing()
      }
    } else {
      if (!this._staircase.descendFlag) {
        /** While current step is less than target level, ascend stairs */
        if (this._staircase.currentStep < this._staircase.targetLevel) {
          const { successor, instruction } = this._staircase.ascendingPath[this._staircase.currentStep++ - 1]
          console.log('Stairbuilder - Ascend:', successor)
          this._pathStack.push({ predecessor: this._stacker.position, instruction })
          this._stacker.position = successor
          return instruction
          /** when arrived at target level, unload block */
        } else if (this._staircase.currentStep === this._staircase.targetLevel) {
          this._staircase.descendFlag = true
          this._stacker.switchGameState(GameState.RETRIEVE_BLOCK)
          console.log(
            'Stairbuilder - building level:',
            this._stacker.position,
            this._staircase.currentStep,
            this._staircase.targetLevel
          )
          return this._stacker.doNothing()
        } else throw new Error(`Invalid current step: ${this._staircase.currentStep} ${this._staircase.targetLevel}`)
      } else {
        /** Arrived at bottom step: start ascending to new target */
        if (Coordinates.isEqual(this._stacker.position, this._staircase.bottom)) {
          this._staircase.descendFlag = false
          if (this._staircase.targetLevel === this._staircase.topLevel) {
            this._staircase.extendedFlag = false
            this._staircase.buildFlag = false
          }
          this._staircase.targetLevel++
          return this._stacker.doNothing()
          /** Descend from target level to bottom step */
        } else {
          if (this._stacker.cell?.level === this._staircase.targetLevel) {
            console.log(
              'Stairbuilder - level built:',
              this._stacker.position,
              this._staircase.targetLevel,
              this._staircase.topLevel
            )
            this._stacker.switchGameState(GameState.RETRIEVE_BLOCK)
            return this._stacker.doNothing()
          }
          return this.prev()
        }
      }
    }
  }
}
