import { Coordinate, SerializedCoordinate } from './Coordinates'
import { Cell, CellType } from './types'

export type GridMap = Map<SerializedCoordinate, Cell>

export interface IGrid {
    origin: Coordinate
    goal?: Coordinate
    goalLevel?: number
    gridMap: GridMap
    // blocksByDist: MinPriorityQueue<Coordinate>
    addToMap: (cell: Cell, coordinate: Coordinate) => void
    changeOfBasis: (newOrigin: Coordinate) => void
}

export class Grid {
    origin: Coordinate // start cell or bottom stair
    goal?: Coordinate // top stair
    goalLevel?: number
    gridMap: GridMap
    // blocksByDist: MinPriorityQueue<Coordinate>

    constructor() {
        this.origin = [0, 0]
        this.gridMap = new Map().set([0, 0], { type: CellType.EMPTY, level: 0 })
        // this.blocksByDist = new MinPriorityQueue<Coordinate>((target: Coordinate) => Grid.manhattanDist(this.origin, target))
    }

    changeOfBasis(newOrigin: Coordinate): void {}
}
