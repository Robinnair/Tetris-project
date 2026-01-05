import { getNextColor } from "./data/color.js";

const canvas=document.getElementById('tetris');
const ctx=canvas.getContext("2d");

ctx.scale(20,20);

const ROWS=20;
const COLS=10;

function createBoard()
{
    return Array.from({length:ROWS},()=>Array(COLS).fill(0));
}

const board=createBoard();
board[19][5]=1;

function drawBoard()
{
    ctx.clearRect(0,0,COLS,ROWS);
    board.forEach((row,y)=>{
    row.forEach((value,x)=>{
        if(value!==0){
            ctx.fillStyle='cyan';
            ctx.fillRect(x,y,1,1);
        }
    });
});
}

drawBoard();