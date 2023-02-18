import { IStrategy } from './interfaces'
import { Stacker } from './Stacker'
import { Strategy } from './Strategy'
import { Coordinate } from './utils/Coordinates'

export class AStarStrategy extends Strategy implements IStrategy {
    private _start: Coordinate
    private _target?: Coordinate
    private _heuristic: number = +Infinity
    private _fScore: number = +Infinity
    private _gScore: number = +Infinity
    private _isTargetReached: boolean = false

    constructor(stacker: Stacker) {
        super(stacker)
        this._start = stacker.position
    }

    public next() {
        if (!this._grid.closestBlocks || this._grid.closestBlocks.isEmpty()) return this._stacker.doNothing()
        const moves = this.exploreNeighbors()
        for (const { successor, instruction } of moves) {
            
        }
        return this.findPath(this._grid.closestBlocks.dequeue())
    }

    private findPath(target: Coordinate) {
        this._target = target
    }
}
