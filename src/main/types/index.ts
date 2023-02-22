import { Coordinates } from '../utils'

export enum GameState {
  FIND_GOAL = 'find goal',
  RETRIEVE_BLOCK = 'retrieve block',
  BUILD_STAIRCASE = 'build staircase',
  END = 'end',
}

export type Coordinate = [row: number, col: number]

export type SerializedCoordinate = `${number},${number}`

export enum Instruction {
  LEFT = 'left',
  UP = 'up',
  RIGHT = 'right',
  DOWN = 'down',
  LOAD = 'pickup',
  UNLOAD = 'drop',
}

export const ReverseInstruction = {
  [Instruction.LEFT]: Instruction.RIGHT,
  [Instruction.RIGHT]: Instruction.LEFT,
  [Instruction.UP]: Instruction.DOWN,
  [Instruction.DOWN]: Instruction.UP,
  [Instruction.LOAD]: Instruction.UNLOAD,
  [Instruction.UNLOAD]: Instruction.LOAD,
} as const

export const NEIGHBORS = [Instruction.LEFT, Instruction.UP, Instruction.RIGHT, Instruction.DOWN] as const

export type DirectionInstruction = (typeof NEIGHBORS)[number]

export const OFFSETS = {
  [Instruction.LEFT]: [0, -1],
  [Instruction.UP]: [-1, 0],
  [Instruction.RIGHT]: [0, +1],
  [Instruction.DOWN]: [+1, 0],
} as const

export const DIRECTIONS = {
  [Coordinates.serialize([0, -1])]: Instruction.LEFT,
  [Coordinates.serialize([-1, 0])]: Instruction.UP,
  [Coordinates.serialize([0, +1])]: Instruction.RIGHT,
  [Coordinates.serialize([+1, 0])]: Instruction.DOWN,
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

export type Trace = {
  predecessor: Coordinate
  instruction: Instruction
}

export type Move = {
  successor: Coordinate
  instruction: Instruction
}
