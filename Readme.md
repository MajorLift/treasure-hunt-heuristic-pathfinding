# Setup
* If you don't have it already, install `npm` on your machine [link](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
* `npm install`
    * (This installs Typescript package dependency)
* `npm run build`
    * (This runs compiler in watch mode which auto recompiles whenever you save)
* `npm run start`
    * (This opens browser with the challenge that runs your compiled code)

# Instructions
## Summary:
Your job is to write the brain of a treasure troll. This troll will start on a randomly generated map with scattered obstacles and stackable blocks. Somewhere on the field, there is a tower, atop which rests a golden treasure. To attain this treasure, your troll must stack blocks and build a staircase. The object is to write a clean and understandable solution that finds the treasure in as few moves as possible.

## Testing
You can learn the game mechanics with the [challenge.html](./src/challenge.html) testing engine (open file in your browser and use the arrow keys). The testing engine will automatically pull the file [solution.ts](./src/solution.ts) for automated testing purposes. This will be very helpful later on.

## Implementation
To defeat the challenge you must implement the Stacker class (an initial Stacker Class can be found in [solution.ts](./src/solution.ts)). The Stacker class only has one required method, `turn`. The simulator will call your turn method once each turn, passing in the JSON object `currentCell`, containing information about the current cell your treasure troll is on, and the four surrounding cells.

```
currentCell = {
    left: {type: someValue, level: someValue},
    up: {type: someValue, level: someValue},
    right: {type: someValue, level: someValue},
    down: {type: someValue, level: someValue},
    type: someValue,
    level: someValue
}
```

There are three types of tiles on the map. All are traversable except walls.
```
enum CellType {
    EMPTY,
    WALL,
    BLOCK,
    GOLD,
}
```

All tiles also have an associated non-negative integer level (elevation off the ground). Empty cells are always at ground zero. Your troll can only move up or down by one level at a time.

Your turn method must then return a string representing one of six possible actions.
```
enum Instruction {
    LEFT = 'left',
    UP = 'up',
    RIGHT = 'right',
    DOWN = 'down',
    PICKUP = 'pickup',
    DROP = 'drop',
}
```

The simulator will only count a turn if the action you specified was legal. So if you try to pickup a non-existent block, it simply won't do anything.

You can begin writing your solution in [solution.ts](./src/solution.ts)
