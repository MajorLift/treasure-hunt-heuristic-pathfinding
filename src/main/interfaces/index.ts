import { Cell, CurrentCell, GameState, Instruction } from '../types'

export interface IStrategy {
    next(): Instruction
}

export interface IStacker {
    turn: (arg: CurrentCell) => Instruction
    progressGameState: (arg: GameState) => void
    doNothing: () => Instruction.LOAD | Instruction.UNLOAD
    revert: () => Instruction
    isTraversible: (arg: Cell | number) => boolean
}
