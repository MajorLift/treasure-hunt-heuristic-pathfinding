import { Coordinates, SerializedCoordinate } from './Coordinates'
import { Stacker } from './Stacker'
import { CellType, DEFAULT_GOAL_LEVEL, DIRECTIONS, Move, NEIGHBORS } from './types'

export class BacktrackingStrategy {
    private _stacker: Stacker
    private _visited: Set<SerializedCoordinate> = new Set()
    private _cellMoves: Map<SerializedCoordinate, Move[]> = new Map()

    constructor(stacker: Stacker) {
        this._stacker = stacker
    }

    public generateMove() {
        const serializedCurrentPosition = Coordinates.serialize(this._stacker.position)
        if (!this._cellMoves.has(serializedCurrentPosition)) {
            this._cellMoves.set(serializedCurrentPosition, this.getMoves())
        }
        if (this._cellMoves.get(serializedCurrentPosition)?.length) {
            const { coordinate, instruction } = this._cellMoves.get(serializedCurrentPosition)!.pop()!
            this._visited.add(Coordinates.serialize(coordinate))
            this._stacker.pushToPathStack({ coordinate: this._stacker.position, instruction })
            this._stacker.position = coordinate
            return instruction
        }
        return this._stacker.revert()
    }

    private getMoves = (): Move[] => {
        const validMoves: Move[] = []
        for (const neighbor of NEIGHBORS) {
            const { type, level } = this._stacker.cell?.[neighbor] ?? {}
            const neighborCoordinate = Coordinates.getCoordinateByOffset(this._stacker.position, DIRECTIONS[neighbor])
            this._stacker.updateGrid({ type: type ?? CellType.WALL, level: level ?? 0 }, neighborCoordinate)
            if (this._visited.has(Coordinates.serialize(neighborCoordinate))) continue
            switch (type) {
                case CellType.EMPTY:
                    validMoves.push({ coordinate: neighborCoordinate, instruction: neighbor })
                    break
                case CellType.BLOCK:
                    if (level !== undefined && this._stacker.isNeighborAccessible(level)) {
                        validMoves.push({ coordinate: neighborCoordinate, instruction: neighbor })
                    }
                    break
                case CellType.WALL:
                    break
                case CellType.GOLD:
                    this._stacker.grid.onGoalFound(
                        this._stacker.position,
                        neighborCoordinate,
                        level ?? DEFAULT_GOAL_LEVEL
                    )
                    this._stacker.setGoalFound()
                    break
                default:
                    throw new Error('unknown or invalid cell type')
            }
        }
        return validMoves
    }
}
