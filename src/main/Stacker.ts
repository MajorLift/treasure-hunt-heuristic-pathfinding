import '../minitroll.png'

import { AStarStrategy } from './AStarStrategy'
import { BacktrackingStrategy } from './BacktrackingStrategy'
import { Grid } from './Grid'
import { IPathfindingStrategy, IStacker } from './interfaces'
import { Coordinate, CurrentCell, GameState, Instruction } from './types'

export class Stacker implements IStacker {
  private readonly _grid: Grid = new Grid()
  private _position: Coordinate = [0, 0]
  private _cell?: CurrentCell
  private _isLoaded = false
  private _gameState: GameState = 0
  private _strategy?: IPathfindingStrategy | null

  get position() {
    return this._position
  }

  set position(coordinate: Coordinate) {
    this._position = coordinate
  }

  get cell() {
    return this._cell
  }

  get grid() {
    return this._grid
  }

  get gameState() {
    return this._gameState
  }

  public turn(currentCell: CurrentCell) {
    console.log('curr:', this._position, 'strategy:', this._strategy)
    this._cell = currentCell
    if (!this._strategy) {
      let nextTargetBlock
      switch (this._gameState) {
        case GameState.FIND_GOAL:
          this._strategy = new BacktrackingStrategy(this)
          break
        case GameState.BUILD_FOUNDATION:
          nextTargetBlock = this._grid.closestBlocks!.pop()
          console.log('next target:', nextTargetBlock)
          this._strategy = new AStarStrategy(this, nextTargetBlock)
          break
        case GameState.BUILD_STAIRCASE:
          break
        case GameState.END:
          break
        default:
          throw new Error('Invalid game state')
      }
    }
    return this._strategy?.next() ?? this.doNothing()
  }

  public loadBlock() {
    console.log('stacker - load', this._position)
    this._isLoaded = true
    return Instruction.LOAD
  }

  public unloadBlock() {
    console.log('stacker - unload', this._position)
    this._isLoaded = false
    this._strategy = null
    return Instruction.UNLOAD
  }

  public doNothing() {
    console.log('stacker - do nothing', this._position)
    return this._isLoaded ? Instruction.LOAD : Instruction.UNLOAD
  }

  public progressGameState(state?: GameState) {
    if (state === undefined) this._gameState++
    else this._gameState = state
    console.log('gameState:', this.gameState)
    this.unplugStrategy()
  }

  public unplugStrategy() {
    console.log('deactivating strategy:', this._strategy)
    this._strategy = null
  }
}

// @ts-expect-error - makes Stacker module accessible from `challenge.js`.
globalThis.Stacker = Stacker
