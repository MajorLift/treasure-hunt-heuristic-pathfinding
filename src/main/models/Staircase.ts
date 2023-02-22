import { Coordinate, Move, ReverseInstruction, SerializedCoordinate } from '../types'
import { Coordinates } from '../utils'
import { Stacker } from './'

export class Staircase {
  private readonly stacker: Stacker
  public readonly top: Coordinate
  public bottom: Coordinate
  public stairs = new Set<SerializedCoordinate>()
  public readonly ascendingPath: Move[] = []
  public topLevel = 2
  public targetLevel = 1
  public currentLevel = 0
  public descendFlag = false
  public extendedFlag = false
  public buildFlag = false

  constructor(stacker: Stacker) {
    this.stacker = stacker
    this.top = stacker.position
    this.bottom = this.top
    this.stairs.add(Coordinates.serialize(this.top))
  }

  public extend(move: Move) {
    const { successor, instruction } = move
    this.extendedFlag = true
    this.bottom = successor
    this.stairs.add(Coordinates.serialize(successor))
    this.ascendingPath.unshift({ successor: this.stacker.position, instruction: ReverseInstruction[instruction] })
  }
}
