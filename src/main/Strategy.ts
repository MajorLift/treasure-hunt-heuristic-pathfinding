import { Grid } from './Grid'
import { Stacker } from './Stacker'
import { CellType, DEFAULT_GOAL_LEVEL, DIRECTIONS, Move, NEIGHBORS } from './types'
import { Coordinates, SerializedCoordinate } from './utils/Coordinates'

export abstract class Strategy {
    protected readonly _stacker: Stacker
    protected readonly _grid: Grid
    protected readonly _visited: Set<SerializedCoordinate> = new Set()

    constructor(stacker: Stacker) {
        this._stacker = stacker
        this._grid = this._stacker.grid
    }

    protected exploreNeighbors() {
        const validMoves: Move[] = []
        for (const neighbor of NEIGHBORS) {
            const { type, level } = this._stacker.cell?.[neighbor] ?? {}
            const neighborCoordinate = Coordinates.getCoordinateByOffset(this._stacker.position, DIRECTIONS[neighbor])
            this._grid.addToMap({ type: type ?? CellType.WALL, level: level ?? 0 }, neighborCoordinate)
            if (this._visited.has(Coordinates.serialize(neighborCoordinate))) continue
            switch (type) {
                case CellType.EMPTY:
                    validMoves.push({ successor: neighborCoordinate, instruction: neighbor })
                    break
                case CellType.BLOCK:
                    if (level !== undefined && this._stacker.isTraversable(level)) {
                        validMoves.push({ successor: neighborCoordinate, instruction: neighbor })
                        if (this._stacker.isGoalFound) this._grid.updateClosestBlocks(neighborCoordinate)
                    }
                    break
                case CellType.WALL:
                    break
                case CellType.GOLD:
                    if (!this._stacker.isGoalFound) {
                        this._grid.onGoalFound(this._stacker.position, neighborCoordinate, level ?? DEFAULT_GOAL_LEVEL)
                        this._stacker.setGoalFound()
                    }
                    break
                default:
                    throw new Error('unknown or invalid cell type')
            }
        }
        return validMoves
    }
}
