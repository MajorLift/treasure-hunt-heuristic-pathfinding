import { CurrentCell, GameState, Instruction } from '../types'

export interface IPathfindingStrategy {
  next(): Instruction
  retrace(): Instruction
}

export interface IStacker {
  turn: (arg: CurrentCell) => Instruction
  progressGameState: (arg?: GameState) => void
  doNothing: () => Instruction.LOAD | Instruction.UNLOAD
}
