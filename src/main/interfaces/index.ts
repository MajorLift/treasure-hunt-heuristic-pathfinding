import { CurrentCell, GameState, Instruction } from '../types'

export interface IPathfindingStrategy {
  next(): Instruction
}

export interface IStacker {
  turn: (arg: CurrentCell) => Instruction
  doNothing: () => Instruction.LOAD | Instruction.UNLOAD
  load: () => Instruction.LOAD
  unload: () => Instruction.UNLOAD
  switchGameState: (arg?: GameState) => void
}
