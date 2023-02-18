export type Coordinate = [x: number, y: number]
export type SerializedCoordinate = `${number},${number}`

export class Coordinates {
    public static serialize = (coordinate: Coordinate) => {
        return coordinate.join(',') as SerializedCoordinate
    }
    public static deserialize = (arg: SerializedCoordinate) => {
        return arg.split(',')
    }
    public static manhattanDistance(a: Coordinate, b: Coordinate) {
        return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])
    }
}
