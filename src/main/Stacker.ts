import '../minitroll.png'

import { AStarStrategy } from './AStarStrategy'
import { BacktrackingStrategy } from './BacktrackingStrategy'
import { Grid } from './Grid'
import { IStacker } from './interfaces'
import {
    Cell, CellType, CurrentCell, GameState, Instruction, ReverseInstruction, StrategyType, Trace
} from './types'
import { Coordinate } from './utils/Coordinates'

export class Stacker implements IStacker {
    private readonly _grid: Grid = new Grid()
    private _position: Coordinate = [0, 0]
    private _cell?: CurrentCell
    private _isLoaded: boolean = false
    private _isGoalFound: boolean = false
    private _isStaircaseFoundationBuilt: boolean = false
    private _isGoalTraversed: boolean = false
    private readonly _pathStack: Trace[] = []
    private _strategy?: StrategyType | null

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

    get pathStack() {
        return this._pathStack
    }

    get isGoalFound() {
        return this._isGoalFound
    }

    public progressGameState(newState: GameState) {}

    public turn(currentCell: CurrentCell) {
        this._cell = currentCell
        if (!this._strategy) {
            if (!this._isGoalFound) this._strategy = new BacktrackingStrategy(this)
            else if (!this._isStaircaseFoundationBuilt) this._strategy = new AStarStrategy(this)
            else {
            }
        }
        if (this._isGoalFound) {
            this._pathStack.splice(0, this._pathStack.length - 1)
            this._strategy = null
            return this.revert()
        }
        return this._strategy?.next() ?? this.doNothing()
    }

    public doNothing() {
        return this._isLoaded ? Instruction.LOAD : Instruction.UNLOAD
    }

    public revert() {
        if (!this._pathStack.length) return this.doNothing()
        const { predecessor, instruction } = this._pathStack.pop()!
        this._position = predecessor
        return ReverseInstruction[instruction]
    }

    public isTraversable(neighbor: Cell): boolean
    public isTraversable(neighborLevel: number): boolean
    public isTraversable(arg: Cell | number) {
        let neighborLevel = 0
        if (typeof arg === 'number') neighborLevel = arg
        else {
            if (arg.type === CellType.WALL) return false
            neighborLevel = arg.level
        }
        return Math.abs(this._cell?.level ?? 0 - neighborLevel) <= 1
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
globalThis.Stacker = Stacker
