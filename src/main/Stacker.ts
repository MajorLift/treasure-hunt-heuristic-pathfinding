import '../minitroll.png'

import { BacktrackingStrategy } from './BacktrackingStrategy'
import { Coordinate, Coordinates, SerializedCoordinate } from './Coordinates'
import { Grid } from './Grid'
import {
    Cell, CellType, CurrentCell, DEFAULT_GOAL_LEVEL, DIRECTIONS, Instruction, Move, NEIGHBORS,
    ReverseInstruction
} from './types'

export class Stacker {
    private _grid: Grid = new Grid()
    private _position: Coordinate = [0, 0]
    private _cell?: CurrentCell
    private _isLoaded: boolean = false
    private _isGoalFound: boolean = false
    private _pathStack: Move[] = []
    private _strategy?: BacktrackingStrategy | null

    constructor() {}

    get position() {
        return this._position
    }
    set position(coordinate: Coordinate) {
        this._position = coordinate
    }

    get cell() {
        return this._cell
    }

    get grid() {
        return this._grid
    }

    public turn = (currentCell: CurrentCell): Instruction => {
        this._cell = currentCell
        if (!!this._strategy) {
            this._strategy = new BacktrackingStrategy(this)
        }
        if (this._isGoalFound) {
            this._pathStack.splice(0, this._pathStack.length - 1)
            this._strategy = null
            return this.revert()
        }
        return this._strategy?.generateMove() ?? Instruction.UNLOAD
    }

    public findBlockAndRetrieve() {
        const block = this._grid.closestBlocks?.dequeue()
    }

    public revert() {
        if (!this._pathStack.length) return Instruction.UNLOAD
        const { coordinate: prevCoordinate, instruction } = this._pathStack.pop()!
        this._position = prevCoordinate!
        return ReverseInstruction[instruction!]
    }

    public isNeighborAccessible(neighbor: Cell): boolean
    public isNeighborAccessible(neighborLevel: number): boolean
    public isNeighborAccessible(arg: Cell | number) {
        let neighborLevel = 0
        if (typeof arg === 'number') neighborLevel = arg
        else {
            if (arg.type === CellType.WALL) return false
            neighborLevel = arg.level
        }
        return Math.abs(this._cell?.level ?? 0 - neighborLevel) <= 1
    }

    public updateGrid(cell: Cell, coordinate: Coordinate) {
        this._grid.addToMap(cell, coordinate)
    }

    public pushToPathStack(move: Move) {
        this._pathStack.push(move)
    }

    public setGoalFound() {
        if (this._isGoalFound) throw new Error('Goal cell has already been found.')
        this._isGoalFound = true
    }

    public static reversePath(path: Instruction[]) {
        return path.map((e) => ReverseInstruction[e]).reverse()
    }
}

// @ts-ignore
globalthis._Stacker = Stacker // gives `challenge.js` access to `Stacker` class
