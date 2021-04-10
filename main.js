const cvs = document.getElementById('box');
const ctx = cvs.getContext('2d');

const cvs2 = document.getElementById('box2');
const ctx2 = cvs2.getContext('2d');

// Music of all game
let full_row = new Audio();
full_row.src = "audio/full_row.mp3";

let themeMusic = new Audio();
themeMusic.src = "audio/Tetris.mp3";

let gameOverSound = new Audio();
gameOverSound.src = "audio/game_over.mp3";

const row = 20;
const column = col = 10;
const unit = 35;
const vacant = 'white';

var score = 0;

// Draw a square
function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * unit, y * unit, unit, unit);

    ctx.strokeStyle = 'black';
    ctx.strokeRect(x * unit, y * unit, unit, unit);
}

// Draw a square
function drawSquare2(x, y, color) {
    ctx2.fillStyle = color;
    ctx2.fillRect(x * unit, y * unit, unit, unit);

    ctx2.strokeStyle = 'black';
    ctx2.strokeRect(x * unit, y * unit, unit, unit);
}

// Creat the table
var table = [];
for (var r = 0; r < row; r++) {
    table[r] = [];
    for (var c = 0; c < col; c++) {
        table[r][c] = vacant;
    }
}

// Creat the table2
var table2 = [];
for (var r = 0; r < row; r++) {
    table2[r] = [];
    for (var c = 0; c < col; c++) {
        table2[r][c] = vacant;
    }
}

// Draw the table
function drawTable() {
    for (var r = 0; r < row; r++) {
        for (var c = 0; c < col; c++) {
            drawSquare(c, r, table[r][c]);
        }
    }
}

drawTable();

// Draw the table2
function drawTable2() {
    for (var r = 0; r < row; r++) {
        for (var c = 0; c < col; c++) {
            drawSquare2(c, r, table2[r][c]);
        }
    }
}

drawTable2();

// The pieces and their own colors

const PIECES = [L, J, S, Z, T, I, O, U];
const COLORS = ['red', 'green', 'yellow', 'blue', 'purple', 'gray', '#e1b53a', '#1d3655', '#a6c55d', '#003f7d', '#ea8a7a', 'brown'];

// Random piece and their own color
function randomPieceAndColor() {
    var randomPIECES = Math.floor(Math.random() * PIECES.length);
    var randomCOLORS = Math.floor(Math.random() * COLORS.length);
    return new piece(PIECES[randomPIECES], COLORS[randomCOLORS]);
}

var p = randomPieceAndColor();
var p2 = randomPieceAndColor();

// The Object Piece
function piece(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;

    this.stateOfTetromino = 0; // We start form the first state
    this.activeTetromino = this.tetromino[this.stateOfTetromino];

    // Init the coordinates of tetrominos   
    this.x = 4;
    this.y = -2;
}

// Fill function
piece.prototype.fill = function (color) {
    for (var r = 0; r < this.activeTetromino.length; r++) {
        for (var c = 0; c < this.activeTetromino.length; c++) {
            if (this.activeTetromino[r][c] === 1) {
                drawSquare(this.x + c, this.y + r, color);
            }
        }
    }
}

//Fill2 function
piece.prototype.fill2 = function (color) {
    for (var r = 0; r < this.activeTetromino.length; r++) {
        for (var c = 0; c < this.activeTetromino.length; c++) {
            if (this.activeTetromino[r][c] === 1) {
                drawSquare2(c, r, color);
            }
        }
    }
}

// Draw (or undraw) a tetromino
piece.prototype.draw = function () {
    this.fill(this.color);
}

piece.prototype.undraw = function () {
    this.fill(vacant);
}

//Draw2 (or undraw2) a tetromino
piece.prototype.draw2 = function () {
    this.fill2(this.color);
}

piece.prototype.undraw2 = function () {
    this.fill2(vacant);
}

// Collision function
piece.prototype.collision = function (x, y, tetromino) {
    for (var r = 0; r < tetromino.length; r++) {
        for (var c = 0; c < tetromino.length; c++) {
            // Skip white squares
            if (tetromino[r][c] === 0) {
                continue;
            }

            // New coordinates of tetromino affer moveing
            var newx = this.x + c + x;
            var newy = this.y + r + y;

            // Conditions
            if (newx < 0 || newx >= col || newy >= row) {
                return true;
            }

            //
            if (newy < 0) {
                continue;
            }
            // if there is a locked tetromino already in place
            if (table[newy][newx] != vacant) {
                return true;
            }
        }
    }
    return false;
}

// Lock function
piece.prototype.lock = function () {
    // Lock
    for (var r = 0; r < this.activeTetromino.length; r++) {
        for (var c = 0; c < this.activeTetromino.length; c++) {
            // Skip white  squares
            if (this.activeTetromino[r][c] === 0) {
                continue;
            }

            // Game over
            if (this.y + r < 0) {
                gameOverSound.play();
                alert('Game Over');
                // Stop game
                gameOver = true;
                break;
            }

            // Lock the tetromino
            table[this.y + r][this.x + c] = this.color;
        }
    }

    // Remove full rows
    for (var r = 0; r < row; r++) {
        var rowfull = true;
        for (var c = 0; c < col; c++) {
            rowfull = rowfull && (table[r][c] != vacant);
        }

        if (rowfull === true) {
            full_row.play();
            // Move down all rows above
            for (var y = r; y > 1; y--) {
                for (var c = 0; c < col; c++) {
                    table[y][c] = table[y - 1][c];
                }
            }
            // Because the row 0 has not any rows above
            for (var c = 0; c < col; c++) {
                table[0][c] = vacant;
            }
            score += 10;
        }
    }
    // Update table affer remove
    drawTable();
    document.getElementById('score').innerHTML = 'SCORE: ' + score;
}

// Move tetromino
piece.prototype.Left = function () {
    if (!this.collision(-1, 0, this.activeTetromino)) {
        this.undraw();
        this.x--;
        this.draw();
    }
}

piece.prototype.Right = function () {
    if (!this.collision(1, 0, this.activeTetromino)) {
        this.undraw();
        this.x++;
        this.draw();
    }
}

piece.prototype.Down = function () {
    if (!this.collision(0, 1, this.activeTetromino)) {
        this.undraw();
        this.y++;
        this.draw();
    }
    else {
        // Lock the tetromino and roll another one
        this.lock();
        p2.undraw2();
        p = p2;
        p2 = randomPieceAndColor();
        p2.draw2();
    }
}

// Rotate tetromino
piece.prototype.Rotate = function () {
    var nextTetromino = this.tetromino[(this.stateOfTetromino + 1) % this.tetromino.length];
    var kick = 0;

    if (this.collision(0, 0, nextTetromino)) {
        if (this.x > col / 2) {
            // It is the right wall
            kick = -1; // We need to move the tetromino to left
        }
        else {
            //It is the left wall
            kick = 1;//We need to move the tetromino to right
        }
    }

    if (!this.collision(kick, 0, nextTetromino)) {
        this.undraw();
        this.x += kick;
        this.stateOfTetromino = (this.stateOfTetromino + 1) % this.tetromino.length;
        this.activeTetromino = this.tetromino[this.stateOfTetromino];
        this.draw();
    }
}

// Control tetromino
document.addEventListener('keydown', control);

function control(event) {
    if (event.keyCode === 37) {
        p.Left();
    }
    else if (event.keyCode === 38) {
        p.Rotate();
    }
    else if (event.keyCode === 39) {
        p.Right();
    }
    else if (event.keyCode === 40) {
        p.Down();
    }
}

// Drop the tetromino every 1s

var dropStart = Date.now();
var gameOver = false;
var level = 1000;
function drop() {
    var present = Date.now();
    var delta = present - dropStart;
    if (delta > level) {
        p.Down();
        dropStart = Date.now();
    }

    if (!gameOver) {
        requestAnimationFrame(drop);
    }

}

// Start game
p2.draw2();
drop();