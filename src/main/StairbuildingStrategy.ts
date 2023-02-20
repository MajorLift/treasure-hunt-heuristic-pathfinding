import { IPathfindingStrategy } from './interfaces'
import { PathfindingStrategy } from './PathfindingStrategy'
import { Stacker } from './Stacker'
import { Staircase } from './Staircase'

export class StairbuildingStrategy extends PathfindingStrategy implements IPathfindingStrategy {
  private readonly _staircase: Staircase

  constructor(stacker: Stacker, staircase: Staircase) {
    super(stacker)
    this._staircase = staircase
  }

  public next() {}
}
