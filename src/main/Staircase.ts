import { Instruction, Move } from './types'
import { Coordinate } from './utils/Coordinates'

export class Staircase {
    height: number
    top: Coordinate
    bottom: Coordinate
    bottomUpdateCount: number = 0
    ascendingPath: Instruction[]
    descendingPath: Instruction[]

    constructor(height: number, top: Coordinate, bottom?: Coordinate) {
        this.height = height
        this.top = top
        this.bottom = bottom ?? top
        this.ascendingPath = []
        this.descendingPath = []
    }

    public updateBottom(move: Move) {
        const { successor: bottom, instruction } = move
        this.bottom = bottom
        this.descendingPath.push(instruction)
        this.bottomUpdateCount++
    }
}
