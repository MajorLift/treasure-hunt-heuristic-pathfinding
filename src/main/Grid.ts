import { MinPriorityQueue } from '@datastructures-js/priority-queue'

import { Staircase } from './Staircase'
import { Cell, CellType } from './types'
import { DEFAULT_GOAL_LEVEL } from './types/index'
import { Coordinate, Coordinates, SerializedCoordinate } from './utils/Coordinates'

export type GridMap = Map<SerializedCoordinate, Cell>

export class Grid {
    gridMap: GridMap
    closestBlocks?: MinPriorityQueue<Coordinate>
    goal?: Coordinate
    goalLevel?: number = DEFAULT_GOAL_LEVEL
    staircase?: Staircase

    constructor() {
        this.gridMap = new Map().set([0, 0], { type: CellType.EMPTY, level: 0 })
    }

    public addToMap(cell: Cell, coordinate: Coordinate) {
        this.gridMap.set(Coordinates.serialize(coordinate), cell)
    }

    public updateClosestBlocks(coordinate: Coordinate) {
        this.closestBlocks?.enqueue(coordinate)
    }

    public onGoalFound(topStair: Coordinate, goal: Coordinate, goalLevel: number) {
        this.goal = goal
        this.goalLevel = goalLevel
        this.staircase = new Staircase(this.goalLevel, topStair)
        this.populateClosestBlocks()
    }

    private populateClosestBlocks() {
        this.closestBlocks = new MinPriorityQueue<Coordinate>((target: Coordinate) =>
            Coordinates.manhattanDistance(this.staircase?.bottom ?? [0, 0], target)
        )
        for (const [coordinateString, cell] of this.gridMap) {
            if (cell.type === CellType.BLOCK) this.closestBlocks.enqueue(Coordinates.deserialize(coordinateString))
        }
    }
}
