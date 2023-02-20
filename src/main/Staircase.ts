import { Coordinate, Instruction, Move } from './types'

export class Staircase {
  public readonly goal: Coordinate
  public readonly height: number
  public readonly top: Coordinate
  private _bottom: Coordinate
  private _bottomUpdateCount = 0
  public readonly ascendingPath: Instruction[] = []
  public readonly descendingPath: Instruction[] = []

  get bottom() {
    return this._bottom
  }
  get bottomUpdateCount() {
    return this._bottomUpdateCount
  }

  constructor(goal: Coordinate, height: number, top: Coordinate, bottom?: Coordinate) {
    this.goal = goal
    this.height = height
    this.top = top
    this._bottom = bottom ?? top
  }

  public updateBottom(move: Move): void {
    const { successor: bottom, instruction } = move
    this._bottom = bottom
    this.descendingPath.push(instruction)
    this._bottomUpdateCount++
  }
}
