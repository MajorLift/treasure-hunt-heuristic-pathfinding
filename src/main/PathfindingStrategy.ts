import { Grid } from './Grid'
import { Stacker } from './Stacker'
import {
  Cell,
  CellType,
  DIRECTIONS,
  GameState,
  Move,
  NEIGHBORS,
  ReverseInstruction,
  SerializedCoordinate,
  Trace,
} from './types'
import { Coordinates } from './utils'

export abstract class PathfindingStrategy {
  protected readonly _stacker: Stacker
  protected readonly _grid: Grid
  protected readonly _visited = new Set<SerializedCoordinate>()
  protected readonly _pathStack: Trace[] = []

  constructor(stacker: Stacker) {
    this._stacker = stacker
    this._grid = this._stacker.grid
  }

  /**
   * Updates Strategy.visited, Strategy.pathStack, Grid.closestBlocks
   * @returns void
   */
  protected exploreNeighbors() {
    const validMoves: Move[] = []
    for (const neighbor of NEIGHBORS) {
      const { type, level } = this._stacker.cell?.[neighbor] ?? {
        type: CellType.WALL,
        level: 0,
      }
      const neighborCoordinate = Coordinates.getCoordinateByOffset(this._stacker.position, DIRECTIONS[neighbor])
      this._grid.addToMap(neighborCoordinate, { type, level })
      if (this._visited.has(Coordinates.serialize(neighborCoordinate))) continue
      switch (type) {
        case CellType.EMPTY:
          validMoves.push({
            successor: neighborCoordinate,
            instruction: neighbor,
          })
          break
        case CellType.BLOCK:
          if (level !== undefined && this.isTraversable(level)) {
            validMoves.push({
              successor: neighborCoordinate,
              instruction: neighbor,
            })
            if (this._stacker.gameState > GameState.FIND_GOAL) {
              // TODO: implement staircase building logic -> block cells become empty once visited
              // TODO: -> restore logic for updating closest blocks
              // if (!this._visited.has(Coordinates.serialize(neighborCoordinate))) {
              //     this._grid.updateClosestBlocks(neighborCoordinate)
              // }
            }
          }
          break
        case CellType.WALL:
          break
        case CellType.GOLD:
          if (this._stacker.gameState === GameState.FIND_GOAL) {
            this._grid.onGoalFound(neighborCoordinate, level, this._stacker.position)
            this._stacker.progressGameState()
          }
          break
        default:
          throw new Error('unknown or invalid cell type')
      }
    }
    return validMoves
  }

  protected isTraversable(neighbor: Cell): boolean
  protected isTraversable(neighborLevel: number): boolean
  protected isTraversable(arg: Cell | number) {
    let neighborLevel = 0
    if (typeof arg === 'number') neighborLevel = arg
    else {
      if (arg.type === CellType.WALL) return false
      neighborLevel = arg.level
    }
    return Math.abs(this._stacker.cell?.level ?? 0 - neighborLevel) <= 1
  }

  public retrace() {
    if (!this._pathStack.length) return this._stacker.doNothing()
    const { predecessor, instruction } = this._pathStack.pop()!
    this._stacker.position = predecessor
    return ReverseInstruction[instruction]
  }
}
