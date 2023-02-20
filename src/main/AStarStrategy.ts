import { MinPriorityQueue } from '@datastructures-js/priority-queue'

import { IPathfindingStrategy } from './interfaces'
import { PathfindingStrategy } from './PathfindingStrategy'
import { Stacker } from './Stacker'
import { Coordinate, Move, SerializedCoordinate } from './types'
import { Coordinates } from './utils'

export class AStarStrategy extends PathfindingStrategy implements IPathfindingStrategy {
    private _start: Coordinate
    private _target: Coordinate
    private readonly _gScore = new Map<SerializedCoordinate, number>()
    private readonly _fScore = new Map<SerializedCoordinate, number>()
    private readonly _openSet = new MinPriorityQueue<{ fScore: number; move: Move }>((node) => node.fScore)
    private _isTargetReached = false

    constructor(stacker: Stacker, target: Coordinate) {
        super(stacker)
        this._start = this._stacker.position
        this._target = target
        this._gScore.set(Coordinates.serialize(this._start), 0)
        this._fScore.set(Coordinates.serialize(this._start), Coordinates.manhattanDistance(this._start, this._target))
    }

    public next() {
        if (this._isTargetReached) {
            if (Coordinates.isEqual(this._stacker.position, this._start)) {
                this._stacker.unplugStrategy()
                // return this._stacker.unloadBlock()
            }
            return this.retrace()
        } else {
            if (Coordinates.isEqual(this._stacker.position, this._target)) {
                console.log('target found:', this._target, 'start:', this._start)
                this._isTargetReached = true
                // return this._stacker.loadBlock()
                // return this.retrace()
            } else {
                const moves = this.exploreNeighbors()
                for (const { successor, instruction } of moves) {
                    const [currentPosition, nextPosition] = [
                        Coordinates.serialize(this._stacker.position),
                        Coordinates.serialize(successor),
                    ]
                    const tentativeGScore = (this._gScore.get(currentPosition) ?? +Infinity) + 1
                    if (tentativeGScore < (this._gScore.get(nextPosition) ?? +Infinity)) {
                        this._gScore.set(nextPosition, tentativeGScore)
                        const fScore = tentativeGScore + Coordinates.manhattanDistance(successor, this._target)
                        this._fScore.set(nextPosition, fScore)
                        this._openSet.enqueue({
                            fScore,
                            move: { successor, instruction },
                        })
                    }
                }
                if (!this._openSet.isEmpty()) {
                    const { successor, instruction } = this._openSet.dequeue().move
                    this._visited.add(Coordinates.serialize(successor))
                    this._pathStack.push({ predecessor: this._stacker.position, instruction })
                    this._stacker.position = successor
                    return instruction
                }
                return this._stacker.doNothing()
            }
        }
    }
}
