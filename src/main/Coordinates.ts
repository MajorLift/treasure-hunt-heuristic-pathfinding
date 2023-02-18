import { DIRECTIONS } from './types'

export type Coordinate = [x: number, y: number]
export type SerializedCoordinate = `${number},${number}`

export class Coordinates {
    public static serialize = (coordinate: Coordinate) => {
        return coordinate.join(',') as SerializedCoordinate
    }

    public static deserialize = (arg: SerializedCoordinate) => {
        return arg.split(',').map((e) => Number(e)) as Coordinate
    }

    public static manhattanDistance(a: Coordinate, b: Coordinate) {
        return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])
    }

    public static getCoordinateByOffset(
        source: Coordinate,
        offset: typeof DIRECTIONS[keyof typeof DIRECTIONS] | Coordinate
    ): Coordinate {
        return [0, 0].map((_, i) => source[i] + offset[i]) as Coordinate
    }
}
