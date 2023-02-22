import { Coordinate, DirectionInstruction, DIRECTIONS, Instruction, OFFSETS, SerializedCoordinate } from '../types'

export class Coordinates {
  public static isEqual(a: Coordinate, b: Coordinate) {
    return a[0] === b[0] && a[1] === b[1]
  }

  public static offset(source: Coordinate, target: Coordinate): Coordinate {
    return [target[0] - source[0], target[1] - source[1]]
  }

  public static serialize(coordinate: Coordinate): SerializedCoordinate {
    return coordinate.join(',') as SerializedCoordinate
  }

  public static deserialize(arg: SerializedCoordinate): Coordinate {
    return arg.split(',').map((e) => Number(e)) as Coordinate
  }

  public static manhattanDistance(a: Coordinate, b: Coordinate) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])
  }

  public static getCoordinateFromOffset(
    source: Coordinate,
    offset: (typeof OFFSETS)[keyof typeof OFFSETS]
  ): Coordinate {
    return [NaN, NaN].map((_, i) => source[i] + offset[i]) as Coordinate
  }

  public static getCoordinateFromInstruction(source: Coordinate, instruction: DirectionInstruction): Coordinate {
    return this.getCoordinateFromOffset(source, OFFSETS[instruction])
  }

  public static getInstructionFromCoordinates(source: Coordinate, target: Coordinate): Instruction {
    return DIRECTIONS[this.serialize(this.offset(source, target))]
  }
}
