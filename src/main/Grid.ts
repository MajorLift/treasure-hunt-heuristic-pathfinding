import { MinPriorityQueue } from '@datastructures-js/priority-queue'

import { Staircase } from './Staircase'
import { Cell, CellType, Coordinate, DEFAULT_GOAL_LEVEL, SerializedCoordinate } from './types'
import { Coordinates } from './utils'

export class Grid {
  public readonly gridMap = new Map<SerializedCoordinate, Cell>()
  private _closestBlocks?: MinPriorityQueue<Coordinate>
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

  public onGoalFound(goal: Coordinate, goalLevel: number, topStair: Coordinate) {
    this._goal = goal
    this._goalLevel = goalLevel
    this._staircase = new Staircase(goal, goalLevel, topStair)
    this._closestBlocks = new MinPriorityQueue<Coordinate>((target: Coordinate) =>
      Coordinates.manhattanDistance(goal, target)
    )
    for (const [coordinateString, cell] of this.gridMap) {
      if (cell.type === CellType.BLOCK) {
        this._closestBlocks.enqueue(Coordinates.deserialize(coordinateString))
      }
    }
    console.log('goal:', this.goal, 'goal level:', this.goalLevel, 'top stair:', this._staircase.top)
  }
}
