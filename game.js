/* game.js

This code handles the game elements and interactions on game.html. 
Most of your work will be here!
*/

/***INITIALIZING VARIABLES AND OBJECTS***/
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var grid = 40;
var count = 0;
var snake = {
  x: 160, 
  y: 160,
  x_step: grid, //snake velocity. moves one grid length every frame in either the x or y direction
  y_step: 0,
  cells: [],  //an array that keeps track of all grids the snake body occupies
  currentLength: 4, //current length of the snake. grows when eating an apple. 
  color : "white"
};


/* TO DO: create apple object below */
var apple = {
  x: 0,
  y: 0,
  color : "white"
}

/* Global Variable keeps track of apples eaten*/
var appleCount = 0;

/* Keep track of Game Level*/
var previousLength
var lengthDifference
var level = 1

/* Keep track of Speed*/
var speed = 16;

/* Keep track of Hi Score*/
var hiScoreContainer;

function hiScore() {
  window.name = appleCount;
  var x = "Hi-score: " + window.name;
  document.getElementById("score").innerHTML = x;
}


/***MAIN FUNCTIONS***/

/* start the game */
requestAnimationFrame(snakeSquadLoop);

/* Listen to keyboard events to move the snake */
document.addEventListener('keydown', function(e) {
  // prevent snake from backtracking on itself by checking that it's 
  // not already moving on the same axis (pressing left while moving
  // left won't do anything, and pressing right while moving left
  // shouldn't let you collide with your own body)

  // left arrow key
  if (e.which === 37 && snake.x_step === 0) {
    snake.x_step = -grid;
    snake.y_step = 0;
  }
  // up arrow key
  else if (e.which === 38 && snake.y_step === 0) {
    snake.y_step = -grid;
    snake.x_step = 0;
  }
  // right arrow key
  else if (e.which === 39 && snake.x_step === 0) {
    snake.x_step = grid;
    snake.y_step = 0;
  }
  // down arrow key
  else if (e.which === 40 && snake.y_step === 0) {
    snake.y_step = grid;
    snake.x_step = 0;
  }
});

/***HELPER FUNCTIONS***/

/*snakeSquadLoop: This is the main code that is run each time the game loops*/
function snakeSquadLoop() {
  requestAnimationFrame(snakeSquadLoop);
  // if count < 16, then keep looping. Don't animate until you get to the 16th frame. This controls the speed of the animation.
  if (count < speed) {
    count++;
    return;
  }
  //Otherwise, it's time to animate. 
  count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);
  /*TO DO:which functions do we need to run for this game to work, and in what order?*/
  

  calculateSnakeMove();
  drawApple();
  drawSnake();
  
}

function calculateSnakeMove(){
  // move snake by its velocity
  snake.x += snake.x_step;
  snake.y += snake.y_step;

  // wrap snake position horizontally on edge of screen
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }
  // wrap snake position vertically on edge of screen
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }
  // keep track of where snake has been. front of the array is always the head
  snake.cells.unshift({x: snake.x, y: snake.y});

  // remove cells as we move away from them
  if (snake.cells.length > snake.currentLength) {
    snake.cells.pop();
  }
}

/*drawApple
uses context functions to fill the cell at apple.x and apple.y with apple.color 
*/
function drawApple(){
  /* TO DO */
  //https://www.w3schools.com/tags/canvas_rect.asp
  context.beginPath();
  context.fillRect(apple.x, apple.y, 30, 30); // Draw Filled-Rectangle (x,y,pixel-width,pixel-height)
  context.fillStyle = apple.color
  context.fill();
  context.stroke();
  
}


/*drawSnake
For each cell of the snake, fill in the grid at the location (cell.x, cell.y) with the snake.color 
If the cell is the first cell in the array, use the drawCellWithBitmoji function to draw that cell as the user's bitmoji 
*/
function drawSnake(){
  /* TO DO */
  //console.log(snake.currentLength); 
  var i
  for(i = 0; i < snake.cells.length; i++) {
    //snake.cells.length 
    //console.log(snake.cells[i]);
    //console.log(snake.cells[i].x);
    //console.log(snake.cells[i].y);
    var appleTouched 
    if(i == 0){
      drawCellWithBitmoji(snake.cells[i]);
      appleTouched = snakeTouchesApple(i);
      
      //console.log("Passed i is: " + i);
    }
    else {
      //https://www.w3schools.com/tags/canvas_rect.asp
      context.beginPath();
      context.fillRect(snake.cells[i].x,snake.cells[i].y, 30, 30); // Draw Filled-Rectangle (x,y,pixel-width,pixel-height)
      context.fillStyle = snake.color
      context.fill();
      context.stroke();
      
    }
    //console.log(i);
    
  }
  console.log(appleTouched);
  if(appleTouched){
      lengthenSnakeByOne();
    
      previousLength = snake.currentLength - 1
      lengthDifference = snake.currentLength - previousLength
      
    
      randomlyGenerateApple();
      appleCount += 1;
      document.getElementById("apples").innerHTML = "Apples: " + appleCount;
      /*Update Level*/
      if(snake.currentLength > 4){
        //storedLength = currentLength - 1
        //lengthDifference = currentLength - storedLength;
        console.log("Snake Length = " + snake.currentLength);
        console.log("Stored Length = " + previousLength);
        console.log("Length Difference = " + lengthDifference);
        
        if((appleCount % 5) == 0){
          console.log("////////////////////////////////////");
          
          //storedLength = currentLength;
          level += 1
          speed -= 2;
          document.getElementById("level").innerHTML = "Level: " + level;
        }
      }
      
  }
  checkCrashItself();
}

/*drawCellWithBitmoji
Takes a cell (with an x and y property) and fills the cell with a bitmoji instead of a square
*/
function drawCellWithBitmoji(cell){
  var avatar_url = localStorage.getItem('avatarurl');
  document.getElementById('avatar').src = avatar_url;
  context.drawImage(document.getElementById('avatar'),0, 0, 200, 200, cell.x, cell.y, grid, grid);
}

/*snakeTouchesApple
checks if any cell in the snake is at the same x and y location of the apple
returns true (the snake is eating the apple) or false (the snake is not eating the apple)
*/
function snakeTouchesApple(coordinatePair){
  /* TO DO */
  
  //console.log("funcionando");
  //console.log("Received i is: " + coordinatePair);
  
  if(apple.x == snake.cells[coordinatePair].x && apple.y == snake.cells[coordinatePair].y) {
    
    //apple.color = "yellow";
    return true;
  }
  else {
    
    return false;
  }
  
}

/*lengthenSnakeByOne
increments the currentLength property of the snake object by one to show that the snake has eaten an apple
*/
function lengthenSnakeByOne(){
  snake.currentLength = snake.currentLength + 1;
}

/*randomlyGenerateApple
uses getRandomInt to generate a new x and y location for the apple within the grid
this function does not draw the apple itself, it only stores the new locations in the apple object
*/
function randomlyGenerateApple(){
  apple.x = getRandomInt(0, 15) * grid;
  apple.y = getRandomInt(0, 15) * grid;
}

/*checkCrashItself
checks if any cell in the snake is at the same x and y location of the any other cell of the snake
returns true (the snake crashed into itself) or false (the snake is not crashing) 
*/
function checkCrashItself(){
  /* TO DO */
  var z;
  var k;
  var crashDetected = false; //delete
  for(z =0 ;z < snake.cells.length;z++){ //Cycle through ordered pairs (Xi,Yi)
    
    for(k =0 ;k < snake.cells.length;k++) {
      
      if(z != k){
        
        if(snake.cells[z].x == snake.cells[k].x && snake.cells[z].y == snake.cells[k].y){
          //endGame();
          crashDetected = true; //delete
        }
      }
      
    }
    
  }
  if (crashDetected){
    endGame();
    crashDetected = false; 
  }
}

/*endGame
displays an alert and reloads the page
*/
function endGame(){
  alert("GAME OVER");
  hiScore();
  document.location.reload();
}

/*getRandomInt
takes a mininum and maximum integer
returns a whole number randomly in that range, inclusive of the mininum and maximum
see https://stackoverflow.com/a/1527820/2124254
*/
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
