import { getNextColor } from "./data/color.js";
import { score } from "./data/score.js"
const canvas = document.getElementById('tetris');
const ctx = canvas.getContext("2d");
let dropCounter = 0;
let dropInterval = 300;
let lastTime = 0;
let gameover = false;
let score_num = 0;
let gamestart = false;
let currentAIMove = null;
let bgmusic = new Audio("sounds/1.28 Toby Fox - DELTARUNE Chapter 2 OST - 28 Acid Tunnel of Love.flac");

let max=JSON.parse(localStorage.getItem('high_score'))||0;
document.querySelector('.highest_scoresection').innerHTML=`High score: ${max}`;
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

const startBtn = document.querySelector(".start-button");


startBtn.addEventListener("click", start);

function start() {
    if (gamestart) return;

    gamestart = true;
    gameover = false;
    lastTime = 0;
    dropCounter = 0;
    startBtn.style.display = "none";
    currentAIMove = findBestMove(board, player);
    update();
}



function update(time = 0) {
    if (!gamestart) {
        return;
    }
    if (gameover) {
        if (!gameovermusic) {
            bgmusic.pause();
            bgmusic = new Audio("sounds/31 - Darkness Falls.flac");
            bgmusic.loop = true;
            bgmusic.play();
            gameovermusic = true;
            document.querySelector(".bottom-text").innerHTML = "You lose, will you try again? reload to retry";
        }
        return;
    }
    const deltatime = time - lastTime;
    dropCounter = dropCounter + deltatime;
    lastTime = time;

    if (gamestart && !gameover && currentAIMove) 
    {
        applyBestMove(currentAIMove);
    }
    
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

function updateScore(index) {

    score_num = score_num + score[index-1];
    console.log(`max: ${max}`);
    if(max<score_num){
        max=score_num;
        localStorage.setItem('high_score',JSON.stringify(max));
        console.log(`max: ${max}`);
        document.querySelector('.highest_scoresection').innerHTML=`High score: ${max}`;
    }
}

function playerDrop() {
    player.y++;
    if (collide(board, player)) {
        player.y--;
        merge(board, player);
        let rows_scored = clearline();
        if (rows_scored !== 0) {
            updateScore(rows_scored);
            document.querySelector('.scoresection').innerHTML = `score: ${score_num}`;
        }
        Object.assign(player, createPiece());
        currentAIMove = findBestMove(board, player);
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


//AI FUNCTIONS LOGIC:
function cloneBoard(board) {
    return board.map(row=>row.slice());
}


function clonePlayer(player)
{
    return {
        x:player.x,
        y:player.y,
        color:player.color,
        matrix:player.matrix.map(row=>(row.slice()))
    };
}

function simulateDrop(board,player){
    while(!collide(board,player)){
        player.y++;
    }
    player.y--;
    merge(board,player);
    for(let y=board.length-1;y>=0;y--){
        if(board[y].every(cell=>(cell!==0))){
            board.splice(y,1);
            board.unshift(Array(COLS).fill(0));
            y++;
        }
    }
}

function evaluateBoard(board) {
    const heights = Array(COLS).fill(0);
    const { heights: h, holes } = height_and_holes(board, heights);

    const aggregate_height = h.reduce((a, b) => a + b, 0);

    let bumpiness = 0;
    for (let i = 0; i < COLS - 1; i++) {
        bumpiness += Math.abs(h[i] - h[i + 1]);
    }

    let linecleared = 0;
    for (let y = 0; y < ROWS; y++) {
        if (board[y].every(cell => cell !== 0)) {
            linecleared++;
        }
    }

    return (
        -0.51 * aggregate_height
        -0.36 * holes
        -0.18 * bumpiness
        +0.76 * linecleared
    );
}


function height_and_holes(board,heights){
    let holes=0;
    for(let x=0;x<COLS;x++){
        let blockfound=false;
        for(let y=0;y<ROWS;y++){
            if(board[y][x]!==0){
                if(!blockfound){
                    heights[x]=ROWS-y;
                    blockfound=true;
                }
                else if(blockfound){
                    holes++;
                }
            }
        }
    }
    return {heights,holes};
}

function findBestMove(board, player) {
    let bestScore = -Infinity;
    let bestMove = null;

    for (let r = 0; r < 4; r++) {
        const testPlayer = clonePlayer(player);

        for (let i = 0; i < r; i++) {
            rotateMatrixRight(testPlayer.matrix);
        }

        for (let x = -5; x < COLS + 5; x++) {
            const simPlayer = clonePlayer(testPlayer);
            simPlayer.x = x;
            simPlayer.y = 0;

            if (collide(board, simPlayer)) continue;

            const simBoard = cloneBoard(board);

            simulateDrop(simBoard, simPlayer);
            const score = evaluateBoard(simBoard);

            if (score > bestScore) {
                bestScore = score;
                bestMove = { x, rotation: r };
            }
        }
    }

    return bestMove;
}

function applyBestMove(bestMove) {
    if (!bestMove) return;

    if (bestMove.rotation > 0) {
        rotateRight();
        bestMove.rotation--;
        return;
    }

    if (player.x < bestMove.x) {
        playerMove(1);
    } else if (player.x > bestMove.x) {
        playerMove(-1);
    } else {
        playerDrop();
    }
}

function rotateMatrixRight(matrix){
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < y; x++) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    matrix.forEach(row => row.reverse());
}

update();