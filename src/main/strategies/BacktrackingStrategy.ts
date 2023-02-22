import { IPathfindingStrategy } from '../interfaces'
import { Stacker } from '../models'
import { GameState, Instruction, Move, SerializedCoordinate } from '../types'
import { Coordinates } from '../utils'
import { PathfindingStrategy } from './PathfindingStrategy'

export class BacktrackingStrategy extends PathfindingStrategy implements IPathfindingStrategy {
  private readonly _successors = new Map<SerializedCoordinate, Move[]>()

  constructor(stacker: Stacker) {
    super(stacker)
  }

  public next(): Instruction {
    /**
     * 4) Found goal node. Correct for overshoot by backtracking one step.
     */
    if (this._grid.isGoalFound) {
      this._stacker.switchGameState(GameState.RETRIEVE_BLOCK)
      return this.prev()
    }
    const currentPosition = Coordinates.serialize(this._stacker.position)
    /**
     * 1) If current node is unvisited, get neighbor node info and store in successors map.
     */
    if (!this._successors.has(currentPosition)) {
      this._successors.set(currentPosition, this.expand({ updateBlocks: false }))
    }
    const currentSuccessors = this._successors.get(currentPosition) ?? []
    const { successor, instruction } = currentSuccessors.pop() ?? {}
    /**
     * 3) If current node has no traversable successors, backtrack.
     */
    if (successor === undefined || instruction === undefined) return this.prev()
    /**
     * 2) Randomly select and explore a traversable successor. (uninformed search)
     */
    this._visited.add(Coordinates.serialize(successor))
    this._pathStack.push({ predecessor: this._stacker.position, instruction })
    this._stacker.position = successor
    return instruction
  }
}
