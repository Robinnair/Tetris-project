import { getNextColor } from "./data/color.js";

const canvas=document.getElementById('tetris');
const ctx=canvas.getContext("2d");
let dropCounter=0;
let dropInterval=300;
let lastTime=0;

function update(time=0){
    const deltatime=time-lastTime;
    dropCounter=dropCounter+deltatime;
    lastTime=time;
    if(dropCounter>dropInterval){
        playerDrop();
        dropCounter=0;
    }
    draw();
    requestAnimationFrame(update);
}

ctx.scale(20,20);

const ROWS=20;
const COLS=10;

function createBoard()
{
    return Array.from({length:ROWS},()=>Array(COLS).fill(0));
}

const board=createBoard();
board[19][5]=1;

function createPiece()
{
    return {
        matrix: [[1,1],[1,1]],
        x: 4,
        y: 0,
    };
}

const player=createPiece();

function drawMatrix(matrix,offset)
{
    matrix.forEach((row,y)=>{
        row.forEach((value,x)=>{
            if(value!=0){
                ctx.fillStyle="cyan";
                ctx.fillRect(x+offset.x,y+offset.y,1,1);
            }
        });
    });
}

function draw(){
    ctx.clearRect(0,0,COLS,ROWS);
    drawMatrix(board,{x:0,y:0});
    drawMatrix(player.matrix,player);
}

function playerDrop(){
    player.y++;
    draw();
}

update();