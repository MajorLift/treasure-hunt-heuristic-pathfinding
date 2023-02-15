enum Instruction {
    LEFT = 'left',
    UP = 'up',
    RIGHT = 'right',
    DOWN = 'down',
    PICKUP = 'pickup',
    DROP = 'drop',
}

enum CellType {
    EMPTY,
    WALL,
    BLOCK,
    GOLD,
}

interface Cell {
    type: CellType;
    level: number;
}

interface CurrentCell extends Cell {
    left: Cell;
    up: Cell;
    right: Cell;
    down: Cell;
}

export class Stacker {
    // Replace this with your own wizardry
    turn = (currentCell: CurrentCell): Instruction => {
        // Pick an action randomly
        var random = Math.random() * 6 >> 0;

        switch (random) {
            case 0:
                return Instruction.LEFT;
            case 1:
                return Instruction.UP;
            case 2:
                return Instruction.RIGHT;
            case 3:
                return Instruction.DOWN;
            case 4:
                return Instruction.PICKUP;
            case 5:
            default:
                return Instruction.DROP;
        }
    };

    // More wizardry here
}
