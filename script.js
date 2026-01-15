import { getNextColor } from "./data/color.js";

const canvas = document.getElementById('tetris');
const ctx = canvas.getContext("2d");
let dropCounter = 0;
let dropInterval = 300;
let lastTime = 0;
let gameover = false;

let bgmusic = new Audio("sounds/1.28 Toby Fox - DELTARUNE Chapter 2 OST - 28 Acid Tunnel of Love.flac");
bgmusic.loop = true;
let musicstart = false;
let gameovermusic = false;
const SHAPES = {
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    O: [
        [1, 1],
        [1, 1]
    ],
    T: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    J: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    L: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ]
};

const ROWS = 20;
const COLS = 10;

function randomShape() {
    const keys = Object.keys(SHAPES);
    const randkey = keys[Math.floor((Math.random() * keys.length))];
    return SHAPES[randkey];
}

document.addEventListener("keydown", event => {
    if (!musicstart) {
        bgmusic.play();
        musicstart = true;
    }
    if (event.key === 'ArrowLeft') {
        playerMove(-1);
    }
    if (event.key === 'ArrowRight') {
        playerMove(1);
    }
    if (event.key === 'ArrowDown') {
        dropCounter = 0;
        playerDrop();
    }
    if (event.key === 'x' || event.key === 'X') {
        rotateRight();
    }
    if (event.key === 'z' || event.key === 'Z') {
        rotateLeft();
    }
})

function rotateRight() {
    let prev = JSON.parse(JSON.stringify(player.matrix));
    for (let y = 0; y < player.matrix.length; y++) {
        for (let x = 0; x < y; x++) {
            [player.matrix[x][y], player.matrix[y][x]] = [player.matrix[y][x], player.matrix[x][y]];
        }
    }
    player.matrix.forEach(row => row.reverse());
    if (collide(board, player)) {
        player.matrix = prev;
    }
}

function rotateLeft() {
    let prev = JSON.parse(JSON.stringify(player.matrix));

    for (let y = 0; y < player.matrix.length; y++) {
        for (let x = 0; x < y; x++) {
            [player.matrix[x][y], player.matrix[y][x]] = [player.matrix[y][x], player.matrix[x][y]];
        }
    }
    player.matrix.reverse();

    if (collide(board, player)) {
        player.matrix = prev;
    }
}

function clearline() {
    const sound_object = new Audio("sounds/achievement-video-game-type-1-230515.mp3");
    let linecleared = 0;
    for (let y = board.length - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== 0)) {
            board.splice(y, 1);
            board.unshift(Array(COLS).fill(0));
            linecleared++;
            y++;
            sound_object.play();
        }
    }
    return linecleared;
}

function createPiece() {
    const matrix = randomShape();
    return {
        matrix,
        x: Math.floor((COLS) / 2) - Math.floor(matrix[0].length / 2),
        y: 0,
        color: getNextColor()
    };
}

const player = createPiece();

function playerMove(dir) {
    player.x = player.x + dir;
    if (collide(board, player)) {
        player.x -= dir;
    }
}

function update(time = 0) {
    if (gameover) {
        if (!gameovermusic) {
            bgmusic.pause();
            bgmusic = new Audio("sounds/31 - Darkness Falls.flac");
            bgmusic.loop = true;
            bgmusic.play();
            gameovermusic = true;
        }
        return;
    }
    const deltatime = time - lastTime;
    dropCounter = dropCounter + deltatime;
    lastTime = time;
    if (dropCounter > dropInterval) {
        playerDrop();
        dropCounter = 0;
    }
    draw();
    requestAnimationFrame(update);
}

ctx.scale(20, 20);

function createBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

const board = createBoard();

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value != 0) {
                ctx.fillStyle = offset.color;
                ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

function drawBoard() {
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                ctx.fillStyle = value;
                ctx.fillRect(x, y, 1, 1);
            }
        });
    });
}


function draw() {
    ctx.clearRect(0, 0, COLS, ROWS);
    drawBoard();
    drawMatrix(player.matrix, player);
}

function playerDrop() {
    player.y++;
    if (collide(board, player)) {
        player.y--;
        merge(board, player);
        let rows_scored = clearline();
        Object.assign(player, createPiece());
        if (collide(board, player)) {
            gameover = true;
        }
    }
}

function collide(board, player) {
    const matrix = player.matrix;
    const offsetx = player.x;
    const offsety = player.y;
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] !== 0) {
                const boardRow = board[y + offsety];
                const boardCell = boardRow && boardRow[x + offsetx];
                if (boardCell !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

function merge(board, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value != 0) {
                board[y + player.y][x + player.x] = player.color;
            }
        });
    });
}

update();