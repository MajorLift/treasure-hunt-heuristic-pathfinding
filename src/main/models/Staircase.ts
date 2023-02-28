import { Coordinate, Move, ReverseInstruction, SerializedCoordinate } from '../types'
import { Coordinates } from '../utils'
import { Stacker } from './'

export class Staircase {
  private readonly stacker: Stacker
  public readonly top: Coordinate
  public topLevel: number
  public bottom: Coordinate
  public stairs: Set<SerializedCoordinate>
  public readonly ascendingPath: Move[]
  public targetLevel = 2
  public currentStep = 1
  public descendFlag = false
  public extendedFlag = false
  public buildFlag = false

  constructor(stacker: Stacker) {
    this.stacker = stacker
    this.top = stacker.position
    this.topLevel = stacker.cell?.level ?? 0
    this.bottom = this.top
    this.stairs = new Set()
    this.stairs.add(Coordinates.serialize(this.top))
    this.ascendingPath = []
  }

  public extend(move: Move) {
    const { successor, instruction } = move
    this.bottom = successor
    this.stairs.add(Coordinates.serialize(successor))
    this.ascendingPath.unshift({
      successor: this.stacker.position,
      instruction: ReverseInstruction[instruction],
    })
    console.log('Staircase - New bottom step found', successor, this.ascendingPath)
  }
}
