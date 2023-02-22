import { MinPriorityQueue } from '@datastructures-js/priority-queue'

import { IPathfindingStrategy } from '../interfaces'
import { Stacker } from '../models'
import { Coordinate, GameState, Move, SerializedCoordinate } from '../types'
import { Coordinates } from '../utils'
import { PathfindingStrategy } from './PathfindingStrategy'

export class AStarStrategy extends PathfindingStrategy implements IPathfindingStrategy {
  private _start: Coordinate
  private _target: Coordinate
  private _isTargetReached = false
  private readonly _gScore = new Map<SerializedCoordinate, number>()
  private readonly _fScore = new Map<SerializedCoordinate, number>()
  private readonly _openSet = new MinPriorityQueue<{
    fScore: number
    move: Move
  }>((node) => node.fScore)

  constructor(stacker: Stacker, target: Coordinate) {
    super(stacker)
    this._start = this._stacker.position
    this._target = target
    this._gScore.set(Coordinates.serialize(this._start), 0)
    this._fScore.set(Coordinates.serialize(this._start), Coordinates.manhattanDistance(this._start, this._target))
  }

  public next() {
    if (!this._isTargetReached) {
      /**
       * 0) Start cell already has a block.
       */
      if (Coordinates.isEqual(this._start, this._target)) {
        this._stacker.switchGameState(GameState.BUILD_STAIRCASE)
        return this._stacker.doNothing()
      }
      /**
       * 2) Arrived at target. Load block.
       */
      if (Coordinates.isEqual(this._stacker.position, this._target)) {
        console.log(
          'AStar Pathfinder - ',
          'Target block found:',
          this._target,
          'fScore',
          this._fScore.get(Coordinates.serialize(this._target)),
          'heuristic:',
          Coordinates.manhattanDistance(this._start, this._target),
          'Starting point:',
          this._start
        )
        this._isTargetReached = true
        return this._stacker.load()
        /**
         * 1) A* pathfinding from start to target.
         */
      } else {
        for (const move of this.expand({ excludeVisited: false })) {
          const { successor } = move
          const [currentPosition, nextPosition] = [
            Coordinates.serialize(this._stacker.position),
            Coordinates.serialize(successor),
          ]
          const tentativeGScore = (this._gScore.get(currentPosition) ?? +Infinity) + 1
          if (tentativeGScore < (this._gScore.get(nextPosition) ?? +Infinity)) {
            this._gScore.set(nextPosition, tentativeGScore)
            const fScore = tentativeGScore + Coordinates.manhattanDistance(successor, this._target)
            this._fScore.set(nextPosition, fScore)
            this._openSet.enqueue({ fScore, move })
          }
        }
        if (!this._openSet.isEmpty()) {
          const { successor, instruction } = this._openSet.dequeue().move
          this._visited.add(Coordinates.serialize(successor))
          this._pathStack.push({
            predecessor: this._stacker.position,
            instruction,
          })
          this._stacker.position = successor
          return instruction
        }
        throw new Error(
          `AStar failed (empty open set) - 
            start: ${Coordinates.serialize(this._start)}, 
            target: ${Coordinates.serialize(this._target)}`
        )
      }
    } else {
      /**
       * 3) Retrace steps from target back to start.
       */
      if (!Coordinates.isEqual(this._stacker.position, this._start)) {
        return this.prev()
      }
      /**
       * 4) Returned to start. Switch to stair-building strategy.
       */
      this._stacker.switchGameState(GameState.BUILD_STAIRCASE)
      return this._stacker.unload()
    }
  }
}
