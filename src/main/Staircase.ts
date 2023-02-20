import { Coordinate, Move, ReverseInstruction } from './types'

export class Staircase {
  public readonly top: Coordinate
  public readonly ascendingPath: Move[] = []

  constructor(top: Coordinate) {
    this.top = top
  }

  public extend(move: Move): void {
    const { successor, instruction } = move
    this.ascendingPath.unshift({ successor, instruction: ReverseInstruction[instruction] })
  }
}
