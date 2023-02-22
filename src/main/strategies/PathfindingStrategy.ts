import { Grid, Stacker } from '../models'
import { Cell, CellType, GameState, Move, NEIGHBORS, ReverseInstruction, SerializedCoordinate, Trace } from '../types'
import { Coordinates } from '../utils'

export abstract class PathfindingStrategy {
  protected readonly _stacker: Stacker
  protected readonly _grid: Grid
  protected readonly _visited = new Set<SerializedCoordinate>()
  protected readonly _pathStack: Trace[] = []

  constructor(stacker: Stacker) {
    this._stacker = stacker
    this._grid = this._stacker.grid
  }

  protected prev() {
    const trace = this._pathStack.pop()
    if (!trace) {
      console.log('Pathfinder - Path stack empty.')
      return this._stacker.doNothing()
    }
    const { predecessor, instruction } = trace
    this._stacker.position = predecessor
    return ReverseInstruction[instruction]
  }

  /**
   * Scans four-directional neighbor nodes and updates `Grid.gridMap` `Grid.closestBlocks`.
   *
   * Initializes `Grid.isGoalFound`, `Grid.goal`, `Grid.goalLevel`, `Grid.closestBlocks`, `Staircase`.
   *
   * @returns Collection of `Moves` to traversable successor nodes.
   */
  protected expand({
    excludeVisited,
    updateBlocks,
    maxLevel,
    checkTraversability,
  }: {
    excludeVisited?: boolean
    updateBlocks?: boolean
    maxLevel?: number
    checkTraversability?: boolean
  }) {
    const validMoves: Move[] = []
    for (const neighbor of NEIGHBORS) {
      const { type, level } = this._stacker.cell?.[neighbor] ?? {
        type: CellType.WALL,
        level: +Infinity,
      }
      const neighborCoordinate = Coordinates.getCoordinateFromInstruction(this._stacker.position, neighbor)
      this._grid.addToMap(neighborCoordinate, { type, level })
      if (excludeVisited !== false) {
        if (this._visited.has(Coordinates.serialize(neighborCoordinate))) continue
      }
      if (level > (maxLevel ?? +Infinity)) continue
      if (checkTraversability === true) {
        if (!this.isTraversable(level)) continue
      }
      switch (type) {
        case CellType.EMPTY:
          validMoves.push({
            successor: neighborCoordinate,
            instruction: neighbor,
          })
          break
        case CellType.BLOCK:
          if (level <= 1) {
            validMoves.push({
              successor: neighborCoordinate,
              instruction: neighbor,
            })
            if (updateBlocks !== false) {
              this._grid.updateClosestBlocks(neighborCoordinate)
            }
          }
          break
        case CellType.WALL:
          break
        case CellType.GOLD:
          if (this._stacker.gameState === GameState.FIND_GOAL) {
            this._grid.onGoalFound(neighborCoordinate, level, this._stacker)
          }
          break
        default:
          throw new Error('Unknown or invalid cell type')
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
}
