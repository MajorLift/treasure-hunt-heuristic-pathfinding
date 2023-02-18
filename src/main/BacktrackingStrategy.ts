import { IStrategy } from './interfaces'
import { Stacker } from './Stacker'
import { Strategy } from './Strategy'
import { Move } from './types'
import { Coordinates, SerializedCoordinate } from './utils/Coordinates'

export class BacktrackingStrategy extends Strategy implements IStrategy {
    private _cellSuccessorsMap: Map<SerializedCoordinate, Move[]> = new Map()

    constructor(stacker: Stacker) {
        super(stacker)
    }

    public next() {
        const serializedCurrentPosition = Coordinates.serialize(this._stacker.position)
        if (!this._cellSuccessorsMap.has(serializedCurrentPosition)) {
            this._cellSuccessorsMap.set(serializedCurrentPosition, this.exploreNeighbors())
        }
        if (this._cellSuccessorsMap.get(serializedCurrentPosition)?.length) {
            const { successor, instruction } = this._cellSuccessorsMap.get(serializedCurrentPosition)!.pop()!
            this._visited.add(Coordinates.serialize(successor))
            this._stacker.pathStack.push({ predecessor: this._stacker.position, instruction })
            this._stacker.position = successor
            return instruction
        }
        return this._stacker.revert()
    }
}
