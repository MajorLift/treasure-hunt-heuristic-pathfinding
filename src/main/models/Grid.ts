import { MinPriorityQueue } from '@datastructures-js/priority-queue'

import { Cell, CellType, Coordinate, DEFAULT_GOAL_LEVEL, SerializedCoordinate } from '../types'
import { Coordinates } from '../utils'
import { Stacker, Staircase } from './'

export class Grid {
  public readonly gridMap = new Map<SerializedCoordinate, Cell>()
  private _closestBlocks?: MinPriorityQueue<Coordinate>
  private _isGoalFound = false
  private _goal?: Coordinate
  private _goalLevel = DEFAULT_GOAL_LEVEL
  private _staircase?: Staircase

  constructor() {
    this.gridMap.set(Coordinates.serialize([0, 0]), {
      type: CellType.EMPTY,
      level: 0,
    })
  }

  get closestBlocks() {
    return this._closestBlocks
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
    this.closestBlocks?.enqueue(coordinate)
  }

  public onGoalFound(goal: Coordinate, goalLevel: number, stacker: Stacker) {
    this._isGoalFound = true
    this._goal = goal
    this._goalLevel = goalLevel
    this._staircase = new Staircase(stacker)
    this._closestBlocks = new MinPriorityQueue<Coordinate>((target: Coordinate) =>
      Coordinates.manhattanDistance(goal, target)
    )
    for (const [coordinateString, cell] of this.gridMap) {
      if (cell.type === CellType.BLOCK) {
        this._closestBlocks.enqueue(Coordinates.deserialize(coordinateString))
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
