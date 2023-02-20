import '../minitroll.png'

import { AStarStrategy } from './AStarStrategy'
import { BacktrackingStrategy } from './BacktrackingStrategy'
import { Grid } from './Grid'
import { IPathfindingStrategy, IStacker } from './interfaces'
import { StairbuildingStrategy } from './StairbuildingStrategy'
import { Coordinate, CurrentCell, GameState, Instruction } from './types'
import { Coordinates } from './utils'

export class Stacker implements IStacker {
  private readonly _grid: Grid = new Grid()
  private _position: Coordinate = [0, 0]
  private _cell?: CurrentCell
  private _isLoaded = false
  private _gameState: GameState = 0
  private _strategy?: IPathfindingStrategy | null

  get grid() {
    return this._grid
  }
  get position() {
    return this._position
  }
  set position(coordinate: Coordinate) {
    this._position = coordinate
  }
  get cell() {
    return this._cell
  }
  get isLoaded() {
    return this._isLoaded
  }
  get gameState() {
    return this._gameState
  }

  public turn(currentCell: CurrentCell) {
    console.log('Current cell:', this._position, this._cell)
    this._cell = currentCell
    if (!this._strategy) {
      let nextTargetBlock
      switch (this._gameState) {
        case GameState.FIND_GOAL:
          this.activateStrategy(new BacktrackingStrategy(this))
          break
        case GameState.RETRIEVE_BLOCK:
          nextTargetBlock = this._grid.closestBlocks?.pop()
          if (!nextTargetBlock) throw new Error('Out of blocks to retrieve.')
          console.log('Next target block:', nextTargetBlock)
          this.activateStrategy(new AStarStrategy(this, nextTargetBlock))
          break
        case GameState.BUILD_STAIRCASE:
          this.activateStrategy(new StairbuildingStrategy(this))
          break
        case GameState.END:
          if (Coordinates.isEqual(this._position, this._grid.goal ?? [NaN, NaN])) {
            alert('YOU WIN! All your base are belong to you.')
          } else {
            alert('GAME OVER')
          }
          break
        default:
          throw new Error('Invalid game state')
      }
    }
    return this._strategy?.next() ?? this.doNothing()
  }

  public load() {
    console.log('Stacker loads block:', this._position)
    this._isLoaded = true
    return Instruction.LOAD as const
  }

  public unload() {
    console.log('Stacker unloads block:', this._position)
    this._isLoaded = false
    this._strategy = null
    return Instruction.UNLOAD as const
  }

  public doNothing() {
    console.log('Do nothing at:', this._position)
    return this._isLoaded ? Instruction.LOAD : Instruction.UNLOAD
  }

  public switchGameState(state?: GameState) {
    if (state === undefined) this._gameState++
    else this._gameState = state
    console.log('New game state:', this.gameState)
    this.deactivateStrategy()
  }

  private activateStrategy(strategy: IPathfindingStrategy) {
    this._strategy = strategy
    console.log('Activating strategy:', this._strategy)
  }

  private deactivateStrategy() {
    console.log('Deactivating strategy:', this._strategy)
    this._strategy = null
  }
}

// @ts-expect-error - grants Stacker module access to `challenge.js`.
globalThis.Stacker = Stacker
