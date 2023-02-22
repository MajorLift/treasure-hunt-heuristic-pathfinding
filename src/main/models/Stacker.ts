import '../../../static/minitroll.png'

import { IPathfindingStrategy, IStacker } from '../interfaces'
import { AStarStrategy, BacktrackingStrategy } from '../strategies'
import { Coordinate, CurrentCell, GameState, Instruction } from '../types'
import { Coordinates } from '../utils'
import { Grid } from './'

export class Stacker implements IStacker {
  private readonly _grid: Grid = new Grid()
  private _position: Coordinate = [0, 0]
  private _cell?: CurrentCell
  private _isLoaded = false
  private _gameState: GameState = GameState.FIND_GOAL
  private _strategy?: IPathfindingStrategy | null
  private _turnCount = 1

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
    console.log('Turn:', this._turnCount++, this._position, this._cell, this._strategy)
    this._cell = currentCell
    if (!this._strategy) {
      let nextTargetBlock
      switch (this._gameState) {
        case GameState.FIND_GOAL:
          this.activateStrategy(new BacktrackingStrategy(this))
          break
        case GameState.RETRIEVE_BLOCK:
          nextTargetBlock = this._grid.closestBlocks?.pop()
          /**
           * TODO: FIX (edge case) - If game starts at a cell neighboring the goal node, `Grid.closestBlocks` never gets populated.
           */
          if (!nextTargetBlock) throw new Error('Out of blocks to retrieve.')
          this.activateStrategy(new AStarStrategy(this, nextTargetBlock))
          break
        case GameState.BUILD_STAIRCASE:
          // this.activateStrategy(new StairbuildingStrategy(this))
          break
        case GameState.END:
          if (Coordinates.isEqual(this._position, this._grid.goal ?? [NaN, NaN])) {
            alert('YOU WIN!')
          } else {
            alert('GAME OVER.')
          }
          break
        default:
          throw new Error('Invalid game state')
      }
    }
    return this._strategy?.next() ?? this.doNothing()
  }

  public load() {
    if (!this._isLoaded) {
      console.log('Stacker - Loads block:', this._position)
    }
    this._isLoaded = true
    return Instruction.LOAD as const
  }

  public unload() {
    if (this._isLoaded) {
      console.log('Stacker - Unloads block:', this._position)
    }
    this._isLoaded = false
    this._strategy = null
    return Instruction.UNLOAD as const
  }

  public doNothing() {
    console.log('Stacker - Skip turn:', this._position)
    this._turnCount--
    return this._isLoaded ? Instruction.LOAD : Instruction.UNLOAD
  }

  public switchGameState(state: GameState) {
    this.deactivateStrategy()
    this._gameState = state
    console.log('Stacker - New game state:', this.gameState)
  }

  private activateStrategy(strategy: IPathfindingStrategy) {
    this._strategy = strategy
    console.log('Stacker - Activating:', this._strategy)
  }

  private deactivateStrategy() {
    console.log('Stacker - Deactivating:', this._strategy)
    this._strategy = null
  }
}

// @ts-expect-error - grants Stacker module access to `challenge.js`.
globalThis.Stacker = Stacker
