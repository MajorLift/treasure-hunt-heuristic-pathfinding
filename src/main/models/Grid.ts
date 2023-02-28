import { MinPriorityQueue } from '@datastructures-js/priority-queue'

import { Cell, CellType, Coordinate, DEFAULT_GOAL_LEVEL, SerializedCoordinate } from '../types'
import { Coordinates } from '../utils'
import { Stacker, Staircase } from './'

export class Grid {
  public readonly gridMap
  private _closestBlocksPQ?: MinPriorityQueue<Coordinate>
  private _closestBlocksSet?: Set<SerializedCoordinate>
  private _isGoalFound = false
  private _goal?: Coordinate
  private _goalLevel = DEFAULT_GOAL_LEVEL
  private _staircase?: Staircase

  constructor() {
    this.gridMap = new Map<SerializedCoordinate, Cell>()
    this.gridMap.set(Coordinates.serialize([0, 0]), {
      type: CellType.EMPTY,
      level: 0,
    })
  }

  get closestBlocksPQ() {
    return this._closestBlocksPQ
  }
  get isGoalFound() {
    return this._isGoalFound
  }
  get goal() {
    return this._goal
  }
  get goalLevel() {
    return this._goalLevel
  }
  get staircase() {
    return this._staircase
  }

  public addToMap(coordinate: Coordinate, cell: Cell) {
    this.gridMap.set(Coordinates.serialize(coordinate), cell)
  }

  public updateClosestBlocks(coordinate: Coordinate) {
    if (this._closestBlocksSet?.has(Coordinates.serialize(coordinate))) {
      this.closestBlocksPQ?.enqueue(coordinate)
      console.log('Grid - closest blocks updated:', coordinate, this.closestBlocksPQ)
    }
  }

  public getLevelFromCoordinate(coordinate: Coordinate) {
    if (this.gridMap.get(Coordinates.serialize(coordinate)) === undefined)
      throw new Error('Coordinate not found in grid map.')
    return this.gridMap.get(Coordinates.serialize(coordinate))!.level
  }

  public onGoalFound(goal: Coordinate, goalLevel: number, stacker: Stacker) {
    this._isGoalFound = true
    this._goal = goal
    this._goalLevel = goalLevel
    this._staircase = new Staircase(stacker)
    this._closestBlocksPQ = new MinPriorityQueue<Coordinate>((target: Coordinate) =>
      Coordinates.manhattanDistance(goal, target)
    )
    for (const [coordinateString, cell] of this.gridMap) {
      if (cell.type === CellType.BLOCK) {
        this._closestBlocksPQ.enqueue(Coordinates.deserialize(coordinateString))
        this._closestBlocksSet?.add(coordinateString)
      }
    }
    console.log(
      'Grid (goal found) -',
      'goal:',
      this.goal,
      'goal level:',
      this.goalLevel,
      'top stair:',
      this._staircase.top
    )
  }
}
