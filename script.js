import { getNextColor } from "./data/color.js";

const canvas=document.getElementById('tetris');
const ctx=canvas.getContext("2d");
let dropCounter=0;
let dropInterval=300;
let lastTime=0;

document.addEventListener("keydown",event=>{
    if(event.key==='ArrowLeft'){
        playerMove(-1);
    }
    if(event.key==='ArrowRight'){
        playerMove(1);
    }
    if(event.key==='ArrowDown'){
        dropCounter=0;
        playerDrop();
    }
})

function createPiece()
{
    return {
        matrix: [[1,1],[1,1]],
        x: 4,
        y: 0,
        color: getNextColor()
    };
}

const player=createPiece();

function playerMove(dir){
    player.x=player.x+dir;
    if(collide(board,player)){
        player.x-=dir;
    }
}

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

function drawMatrix(matrix,offset)
{
    matrix.forEach((row,y)=>{
        row.forEach((value,x)=>{
            if(value!=0){
                ctx.fillStyle=offset.color;
                ctx.fillRect(x+offset.x,y+offset.y,1,1);
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


function draw(){
    ctx.clearRect(0,0,COLS,ROWS);
    drawBoard();
    drawMatrix(player.matrix,player);
}

function playerDrop(){
    player.y++;
    if(collide(board,player)){
        player.y--;
        merge(board,player);
        Object.assign(player,createPiece());
    }
}

function collide(board,player){
    const matrix=player.matrix;
    const offsetx=player.x;
    const offsety=player.y;
    for(let y=0;y<matrix.length;y++){
        for(let x=0;x<matrix[y].length;x++){
            if(matrix[y][x]!==0){
                const boardRow=board[y+offsety];
                const boardCell=boardRow&&boardRow[x+offsetx];
                if(boardCell!==0){
                    return true;
                }
            }
        }
    }
    return false;
}

function merge(board,player){
    player.matrix.forEach((row,y)=>{
        row.forEach((value,x)=>{
            if(value!=0){
                board[y+player.y][x+player.x]=player.color;
            }
        });
    });
}

update();