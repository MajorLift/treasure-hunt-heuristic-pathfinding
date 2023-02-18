import { Coordinate } from './Coordinates'

export enum Instruction {
    LEFT = 'left',
    UP = 'up',
    RIGHT = 'right',
    DOWN = 'down',
    LOAD = 'pickup',
    UNLOAD = 'drop',
}

export const InstructionReverse = {
    [Instruction.LEFT]: Instruction.RIGHT,
    [Instruction.RIGHT]: Instruction.LEFT,
    [Instruction.UP]: Instruction.DOWN,
    [Instruction.DOWN]: Instruction.UP,
    [Instruction.LOAD]: Instruction.UNLOAD,
    [Instruction.UNLOAD]: Instruction.LOAD,
} as const

export const NEIGHBORS = [Instruction.LEFT, Instruction.UP, Instruction.RIGHT, Instruction.DOWN] as const

export const DIRECTIONS = {
    [Instruction.LEFT]: [0, -1],
    [Instruction.UP]: [-1, 0],
    [Instruction.RIGHT]: [0, +1],
    [Instruction.DOWN]: [+1, 0],
} as const

export const DEFAULT_GOAL_LEVEL = 8

export enum CellType {
    EMPTY,
    WALL,
    BLOCK,
    GOLD,
}

export interface Cell {
    type: CellType
    level: number
}

export interface CurrentCell extends Cell {
    left: Cell
    up: Cell
    right: Cell
    down: Cell
}

export type Move = [Coordinate, Instruction]
