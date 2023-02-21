import { Coordinate, Move, ReverseInstruction, SerializedCoordinate } from '../types'
import { Coordinates } from '../utils'
import { Stacker } from './'

export class Staircase {
  public readonly top: Coordinate
  public bottom: Coordinate
  public topLevel = 1
  public bottomLevel: number
  public readonly ascendingPath: Move[] = []
  public stairs = new Set<SerializedCoordinate>()
  public targetLevel = 0
  public currentLevel = 0
  public descendFlag = false
  public buildFlag = false

  constructor(stacker: Stacker) {
    const [coordinate, level] = [stacker.position, stacker.cell?.level ?? 0]
    this.top = coordinate
    this.bottom = coordinate
    this.topLevel = level
    this.bottomLevel = level
    this.stairs.add(Coordinates.serialize(this.top))
  }

  public extend(move: Move): void {
    const { successor, instruction } = move
    console.log('Staircase - new bottom step:', successor)
    this.bottom = successor
    this.stairs.add(Coordinates.serialize(successor))
    this.ascendingPath.unshift({ successor, instruction: ReverseInstruction[instruction] })
  }
}
