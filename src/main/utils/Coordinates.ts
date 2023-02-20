import { Coordinate, DIRECTIONS, SerializedCoordinate } from '../types'

export class Coordinates {
    public static isEqual(a: Coordinate, b: Coordinate) {
        return a[0] === b[0] && a[1] === b[1]
    }

    public static serialize(coordinate: Coordinate) {
        return coordinate.join(',') as SerializedCoordinate
    }

    public static deserialize(arg: SerializedCoordinate) {
        return arg.split(',').map((e) => Number(e)) as Coordinate
    }

    public static manhattanDistance(a: Coordinate, b: Coordinate) {
        return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])
    }

    public static getCoordinateByOffset(
        source: Coordinate,
        offset: (typeof DIRECTIONS)[keyof typeof DIRECTIONS] | Coordinate
    ) {
        return [0, 0].map((_, i) => source[i] + offset[i]) as Coordinate
    }
}
