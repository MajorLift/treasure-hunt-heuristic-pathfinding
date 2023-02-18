import { MinPriorityQueue } from '@datastructures-js/priority-queue'

import { Coordinate, Coordinates, SerializedCoordinate } from './Coordinates'
import { Staircase } from './Staircase'
import { Cell, CellType } from './types'

export type GridMap = Map<SerializedCoordinate, Cell>

export class Grid {
    gridMap: GridMap
    goal?: Coordinate
    goalLevel?: number
    staircase?: Staircase
    closestBlocks?: MinPriorityQueue<Coordinate>

    constructor() {
        this.gridMap = new Map().set([0, 0], { type: CellType.EMPTY, level: 0 })
    }

    public addToMap(cell: Cell, coordinate: Coordinate) {
        this.gridMap.set(Coordinates.serialize(coordinate), cell)
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
        // console.log(this.closestBlocks)
    }
}
