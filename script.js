var origBoard;
const humanPlayer='O';
const aiPlayer='X';
const winCombos = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

const cells = document.querySelectorAll('.cell');
startGame();

function startGame(){
  document.querySelector('.endGame').style.display ='none';
  origBoard = Array.from(Array(9).keys());
  for(var i=0; i<cells.length; i++){
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', turnClick, false);
  }
}
function turnClick(square){
  if(typeof origBoard[square.target.id] === 'number'){
    turn(square.target.id, humanPlayer);
    if(!checkTie()){
      turn(bestSpot(), aiPlayer);
    }
  }
}

function turn(squareId, player){
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(origBoard, player);
  if(gameWon){
    gameOver(gameWon);
  }
}

function checkWin(board, player){
  let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
  let gameWon = null;
  for(let [index, win] of winCombos.entries()){
    if(win.every(elem => plays.indexOf(elem) > -1)){
      gameWon = {index: index, player: player};
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for(let index of winCombos[gameWon.index]){
    document.getElementById(index).style.backgroundColor =
      gameWon.player === humanPlayer ? "green": "red";

    for(var i=0; i<cells.length; i++){
      cells[i].removeEventListener('click', turnClick, false);
    }
  }
  declareWinner(gameWon.player === humanPlayer ? 'You Win!' : 'You lose');
}

function emptySquares(){
  return origBoard.filter(s => typeof s === 'number');
}

function bestSpot(){
  return minMax(origBoard, aiPlayer).index;
}

function checkTie(){
  if(emptySquares().length === 0){
    for(var i=0; i<cells.length; i++){
      cells[i].style.backgroundColor = 'blue';
      cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner('Tie Game');
    return true;
  }
  return false;
}

function declareWinner(winner){
  document.querySelector('.endGame').style.display = 'block';
  document.querySelector('.endGame .text').innerText = winner;
}

function minMax(newBoard, player){
  const availableSpots = emptySquares(newBoard);

  if(checkWin(newBoard, aiPlayer)){
    return{score: 10};
  } else if(checkWin(newBoard, player)){
    return {score: -10};
  } else if (availableSpots.length === 0){
    return {score: 0};
  }

  const moves = [];
  for(var i = 0; i < availableSpots.length; i++){
    const move ={};
    move.index = newBoard[availableSpots[i]];
    newBoard[availableSpots[i]] = player;

    let result;
    if(player === aiPlayer){
      result = minMax(newBoard, humanPlayer);
      move.score = result.score;
    } else {
      result = minMax(newBoard, aiPlayer);
      move.score = result.score;
    }
    newBoard[availableSpots[i]] = move.index;
    moves.push(move)
  }
  let bestMove;
  if(player === aiPlayer){
    let bestScore = -10000;
    for(var i=0; i<moves.length; i++){
      if(bestScore < moves[i].score){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for(var i=0; i<moves.length; i++){
      if(bestScore > moves[i].score){
        bestScore = moves[i].score
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
