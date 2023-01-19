// (c) Gurdev singh
/*jshint esversion: 6 */
// global variables
let ctx;
let gameCharacter;
let maze;

function setup() {
    let x, y, h, w, shapeColor;
    let mazeExitBottom, mazeExitTop, mazeCellWidth, mazeCellHeight, currentMazeCellCol, currentMazeCellRow, moveStep;
    'use strict';
    const MAZE_ROWS = 10;
    const MAZE_COLS = 10;
    // setting the event handlers

    // set an event handler for all input boxes and select box (any element that has the class 'inValue')
    document.querySelectorAll('.inValue').forEach(function (item) {
        item.addEventListener('change', drawOnCanvas);
    });
    // set an event handler for all buttons (any button that has the class 'moveBtn')
    document.querySelectorAll('.moveBtn').forEach(function (item) {
        item.addEventListener('click', moveBtnClick);
    });

    document.getElementById('drawingBox1').addEventListener('keydown', canvasKeyDown);
    shapeColor = '#aaaaff';
    moveStep = mazeCellHeight;

    //the maze object:
    maze = new Maze();
    //-->generate method for 2d array
    maze.generate(10, 10);
    //-->show on canvas --black boxes
    ctx = getCanvasContext('drawingBox1');
    maze.draw(ctx);

    //the variables:
    w = maze.mazeCellWidth;
    h = maze.mazeCellHeight;
    x = maze.mazeExitBottom * w;
    y = (maze.matrix.length - 1) * maze.mazeCellHeight;
    //call draw from constructor:
    gameCharacter = new CharConstructor(x, y, w, h, drawHappyMonster, shapeColor);
    gameCharacter.draw(ctx, maze);
    gameCharacter.shapeToBeDrawn(ctx, maze);

}
function drawMaze(ctx, maze) {
    'use strict';
    const MAZE_BLOCK_COLOR = '#000';
    const MAZE_PATH_COLOR = 'lightcyan';
    let cellColor;

    maze.mazeCellWidth = ctx.canvas.width / maze.matrix[0].length;
    maze.mazeCellHeight = ctx.canvas.height / maze.matrix.length;

    for (let row = 0; row < maze.matrix.length; row++) {
        for (var col = 0; col < maze.matrix[row].length; col++) {
            cellColor = maze.matrix[row][col] === 0 ? MAZE_BLOCK_COLOR : MAZE_PATH_COLOR;
            drawRectangle(ctx, col * maze.mazeCellWidth, row * maze.mazeCellHeight, maze.mazeCellWidth, maze.mazeCellHeight, cellColor, cellColor, 0);
        }
    }
}

function moveBtnClick(e) {
    let direction = e.currentTarget.id;

    if ((direction === 'N' && maze.matrix[maze.currentMazeCellRow - 1][maze.currentMazeCellCol] === 1) ||
        (direction === 'S' && maze.matrix[maze.currentMazeCellRow + 1][maze.currentMazeCellCol] === 1) ||
        (direction === 'E' && maze.matrix[maze.currentMazeCellRow][maze.currentMazeCellCol + 1] === 1) ||
        (direction === 'W' && maze.matrix[maze.currentMazeCellRow][maze.currentMazeCellCol - 1] === 1) ||
        (direction === 'NW' && maze.matrix[maze.currentMazeCellRow - 1][maze.currentMazeCellCol - 1] === 1) ||
        (direction === 'NE' && maze.matrix[maze.currentMazeCellRow - 1][maze.currentMazeCellCol + 1] === 1) ||
        (direction === 'SE' && maze.matrix[maze.currentMazeCellRow + 1][maze.currentMazeCellCol + 1] === 1) ||
        (direction === 'SW' && maze.matrix[maze.currentMazeCellRow + 1][maze.currentMazeCellCol - 1] === 1)) {

        gameCharacter.move(ctx, direction);
    }
}

function canvasKeyDown(e) {
    'use strict';

    let direction;

    e.preventDefault();

    switch (e.code) {
        case 'ArrowUp':
            if (e.shiftKey)
                direction = 'NW';
            else if (e.ctrlKey)
                direction = 'NE';
            else
                direction = 'N';
            break;
        case 'ArrowDown':
            if (e.shiftKey)
                direction = 'SW';
            else if (e.ctrlKey)
                direction = 'SE';
            else
                direction = 'S';
            break;
        case 'ArrowLeft':
            direction = 'W';
            break;
        case 'ArrowRight':
            direction = 'E';
            break;
        default:
            if (e.shiftKey && e.ctrlKey && e.altKey) {
                direction = 'C';
            }
            break;
    }
    if ((direction === 'N' && maze.matrix[maze.currentMazeCellRow - 1][maze.currentMazeCellCol] === 1) ||
        (direction === 'S' && maze.matrix[maze.currentMazeCellRow + 1][maze.currentMazeCellCol] === 1) ||
        (direction === 'E' && maze.matrix[maze.currentMazeCellRow][maze.currentMazeCellCol + 1] === 1) ||
        (direction === 'W' && maze.matrix[maze.currentMazeCellRow][maze.currentMazeCellCol - 1] === 1) ||
        (direction === 'NW' && maze.matrix[maze.currentMazeCellRow - 1][maze.currentMazeCellCol - 1] === 1) ||
        (direction === 'NE' && maze.matrix[maze.currentMazeCellRow - 1][maze.currentMazeCellCol + 1] === 1) ||
        (direction === 'SE' && maze.matrix[maze.currentMazeCellRow + 1][maze.currentMazeCellCol + 1] === 1) ||
        (direction === 'SW' && maze.matrix[maze.currentMazeCellRow + 1][maze.currentMazeCellCol - 1] === 1)) {

        gameCharacter.move(ctx, direction);
    }
}
//The constructor for maze object:
function Maze() {
    //stores an array 
    this.matrix;
    //all properties:
    this.mazeCellWidth;
    this.mazeCellHeight;
    this.currentMazeCellRow;
    this.currentMazeCellCol;
    this.mazeExitBottom;
    this.mazeExitTop;

    //create a method: //annonymous function -->generate Maze:
    this.generate = function (rows, cols) 
    {
        let row, col, randDir;
        this.matrix = new Array(rows);
        for (let i = 0; i < rows; i++) 
        {
            this.matrix[i] = new Array(cols);
            this.matrix[i].fill(0);
        }
        /* this.matrix = [
                [0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
                [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
                [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
                [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
                [0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
                [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 1, 1, 1, 0]
            ];
            mazeExitBottom = 8;
            */
        row = rows - 1;
        col = Math.floor(Math.random() * cols);
        this.mazeExitBottom = col;
        this.matrix[row][col] = 1;
        do
         {
            randDir = Math.floor(Math.random() * 5);
            switch (randDir)
             {
                case 0:
                    col--;
                    if (col < 0)
                        col = 0;
                    break;
                case 1:
                    if (row >= 1)
                        this.matrix[row - 1][col] = 1;
                    row--;
                    col--;
                    if (row < 0)
                        row = 0;
                    if (col < 0)
                        col = 0;
                    break;
                case 2:
                    row--;
                    if (row < 0)
                        row = 0;
                    break;
                case 3:
                    if (row >= 1)
                        this.matrix[row - 1][col] = 1;
                    row--;
                    col++;
                    if (row < 0)
                        row = 0;
                    if (col >= cols)
                        col = cols - 1;
                    break;
                case 4:
                    col++;
                    if (col >= cols)
                        col = cols - 1;
                    break;

            }
            this.matrix[row][col] = 1;
        } while (row > 0);

        this.mazeExitTop = col;
    };
    //create a draw :
    this.draw = function (ctx, maze) {
        'use strict';
        const MAZE_BLOCK_COLOR = '#000';
        const MAZE_PATH_COLOR = 'lightcyan';
        let cellColor;

        this.mazeCellWidth = ctx.canvas.width / this.matrix[0].length;
        this.mazeCellHeight = ctx.canvas.height / this.matrix.length;

        for (let row = 0; row < this.matrix.length; row++) {
            for (var col = 0; col < this.matrix[row].length; col++) {
                cellColor = this.matrix[row][col] === 0 ? MAZE_BLOCK_COLOR : MAZE_PATH_COLOR;
                drawRectangle(ctx, col * this.mazeCellWidth, row * this.mazeCellHeight, this.mazeCellWidth, this.mazeCellHeight, cellColor, cellColor, 0);
            }
        }
    };
}
function CharConstructor(x, y, w, h, theShape, shapeColor) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.moveStep = maze.mazeCellHeight;
    this.shapeColor = shapeColor;
    this.draw = function (ctx, maze) {
        maze.currentMazeCellCol = Math.round(this.x / maze.mazeCellWidth);
        maze.currentMazeCellRow = Math.round(this.y / maze.mazeCellWidth);
        if (maze.currentMazeCellRow < maze.matrix.length) {
            drawHappyMonster(ctx, this.x, this.y, this.w, this.h, this.shapeColor);
            ctx.canvas.focus();
        }

    };
    this.shapeToBeDrawn = function (ctx, maze) {

        maze.currentMazeCellCol = Math.round(this.x / maze.mazeCellWidth);
        maze.currentMazeCellRow = Math.round(this.y / maze.mazeCellWidth);
        if (maze.currentMazeCellRow < maze.matrix.length) {
            drawHappyMonster(ctx, this.x, this.y, this.w, this.h, this.shapeColor);
            ctx.canvas.focus();
        }
    };
    this.move = function (ctx, direction) {
        "use strict";
        ctx.clearRect(this.x, this.y, this.w, this.h);
        switch (direction) {
            case 'NW':
                this.x -= this.moveStep;
                this.y -= this.moveStep;
                if (this.x < 0)
                    this.x = 0;
                if (this.y < 0)
                    this.y = 0;
                break;
            case 'N':
                this.y -= this.moveStep;
                if (this.y < 0)
                    this.y = 0;
                break;
            case 'NE':
                this.x += this.moveStep;
                this.y -= this.moveStep;
                if (this.x > ctx.canvas.width - this.w)
                    this.x = ctx.canvas.width - this.w;
                if (this.y < 0)
                    this.y = 0;
                break;
            case 'W':
                this.x -= this.moveStep;
                if (this.x < 0)
                    this.x = 0;
                break;
            case 'E':
                this.x += this.moveStep;
                if (this.x > ctx.canvas.width - this.w)
                    this.x = ctx.canvas.width - this.w;
                break;
            case 'SW':
                this.x -= this.moveStep;
                this.y += this.moveStep;
                if (this.x < 0)
                    this.x = 0;
                if (this.y > ctx.canvas.height - this.h)
                    this.y = ctx.canvas.height - this.h;
                break;
            case 'S':
                this.y += this.moveStep;
                if (this.y > ctx.canvas.height - this.h)
                    this.y = ctx.canvas.height - this.h;
                break;
            case 'SE':
                this.x += this.moveStep;
                this.y += this.moveStep;
                if (this.x > ctx.canvas.width - w)
                    this.x = ctx.canvas.width - w;
                if (this.y > ctx.canvas.height - h)
                    this.y = ctx.canvas.height - h;
                break;
            case 'C':
                this.x = (ctx.canvas.width - this.w) / 2;    // setting the x to the center of the canvas horizontally
                this.y = (ctx.canvas.height - this.h) / 2;   // setting the y to the center of the canvas vertically
                break;
            default:
                alert("Undefined direction!");
        }
        this.shapeToBeDrawn(ctx, maze);
    };
}