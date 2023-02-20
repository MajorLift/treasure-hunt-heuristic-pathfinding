import { IPathfindingStrategy } from './interfaces'
import { PathfindingStrategy } from './PathfindingStrategy'
import { Stacker } from './Stacker'
import { Instruction, Move, SerializedCoordinate } from './types'
import { Coordinates } from './utils'

export class BacktrackingStrategy extends PathfindingStrategy implements IPathfindingStrategy {
  private _cellSuccessorsMap = new Map<SerializedCoordinate, Move[]>()

  constructor(stacker: Stacker) {
    super(stacker)
  }

  public next(): Instruction {
    const currentPosition = Coordinates.serialize(this._stacker.position)
    if (!this._cellSuccessorsMap.has(currentPosition)) {
      this._cellSuccessorsMap.set(currentPosition, this.exploreNeighbors())
    }
    if (this._cellSuccessorsMap.get(currentPosition)?.length) {
      const { successor, instruction } = this._cellSuccessorsMap.get(currentPosition)!.pop()!
      this._visited.add(Coordinates.serialize(successor))
      this._pathStack.push({ predecessor: this._stacker.position, instruction })
      this._stacker.position = successor
      return instruction
    }
    return this.retrace()
  }
}
