import '../minitroll.png'

import { MinPriorityQueue } from '@datastructures-js/priority-queue'

import { Coordinate, Coordinates, SerializedCoordinate } from './Coordinates'
import { Grid, GridMap } from './Grid'
import {
    Cell, CellType, CurrentCell, DEFAULT_GOAL_LEVEL, DIRECTIONS, Instruction, InstructionReverse,
    Move, NEIGHBORS
} from './types'

export class Stacker {
    private grid: Grid
    private position: Coordinate
    private cell?: CurrentCell
    private isLoaded: boolean
    private isGoalFound: boolean
    private routeStack: Move[]
    private visited: Set<SerializedCoordinate>
    private cellMoves: Map<SerializedCoordinate, Move[]>

    constructor() {
        this.position = [0, 0]
        this.grid = new Grid()
        this.isLoaded = false
        this.isGoalFound = false
        this.routeStack = []
        this.visited = new Set()
        this.cellMoves = new Map()
    }

    public turn = (currentCell: CurrentCell): Instruction => {
        console.log(this.grid.gridMap)
        this.cell = currentCell
        if (this.isGoalFound) return this.undoMove()
        return this.backtrackStrategy()
    }

    public backtrackStrategy() {
        const serializedCurrentPosition = Coordinates.serialize(this.position)
        if (!this.cellMoves.has(serializedCurrentPosition)) {
            this.cellMoves.set(serializedCurrentPosition, this.getMoves())
        }
        if (this.cellMoves.get(serializedCurrentPosition)?.length) {
            const [coordinate, instruction] = this.cellMoves
                .get(serializedCurrentPosition)!
                .pop()!
            this.visited.add(Coordinates.serialize(coordinate))
            this.routeStack.push([this.position, instruction])
            this.position = coordinate
            return instruction
        }
        return this.undoMove()
    }

    private undoMove() {
        if (!this.routeStack.length) return Instruction.UNLOAD
        const [prevCoordinate, instruction] = this.routeStack.pop()!
        this.position = prevCoordinate!
        if (this.isGoalFound) this.routeStack.splice(0, this.routeStack.length)
        return InstructionReverse[instruction!]
    }

    private getMoves = (): Move[] => {
        const validMoves: Move[] = []
        for (const neighbor of NEIGHBORS) {
            const { type, level } = this.cell?.[neighbor] ?? {}
            const neighborCoordinate = this.getNeighborCoordinate(
                DIRECTIONS[neighbor]
            )
            this.updateGrid(
                { type: type ?? CellType.WALL, level: level ?? 0 },
                neighborCoordinate
            )
            if (this.visited.has(Coordinates.serialize(neighborCoordinate)))
                continue
            switch (type) {
                case CellType.EMPTY:
                    validMoves.push([neighborCoordinate, neighbor])
                    break
                case CellType.BLOCK:
                    if (
                        level !== undefined &&
                        this.isNeighborAccessible(level)
                    ) {
                        validMoves.push([neighborCoordinate, neighbor])
                    }
                    break
                case CellType.WALL:
                    break
                case CellType.GOLD:
                    this.grid.goal = neighborCoordinate
                    this.grid.goalLevel = level ?? DEFAULT_GOAL_LEVEL
                    this.isGoalFound = true
                    break
                default:
                    throw new Error('unknown or invalid cell type')
            }
        }
        return validMoves
    }

    private getNeighborCoordinate(
        offset: typeof DIRECTIONS[keyof typeof DIRECTIONS]
    ): Coordinate {
        return [0, 0].map((_, i) => this.position[i] + offset[i]) as Coordinate
    }

    private isNeighborAccessible(neighbor: Cell): boolean
    private isNeighborAccessible(neighborLevel: number): boolean
    private isNeighborAccessible(arg: Cell | number) {
        let neighborLevel = 0
        if (typeof arg === 'number') neighborLevel = arg
        else {
            if (arg.type === CellType.WALL) return false
            neighborLevel = arg.level
        }
        return Math.abs(this.cell?.level ?? 0 - neighborLevel) <= 1
    }

    private updateGrid(cell: Cell, coordinate: Coordinate) {
        this.grid.gridMap.set(Coordinates.serialize(coordinate), cell)
        // if (this.isGoalFound) this.grid.blocksByDist.enqueue(coordinate)
    }
}

// @ts-ignore
globalThis.Stacker = Stacker
