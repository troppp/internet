// dir array pending moves credit goes to sflanker
  // discord server: 530329504766361610  discord user: 672554516624703500

let cellSize = 13.5;
let rows = 48; // rows >= 10
let cols = 58; // cols >= 10
let speed = 18.5;
let amountOfSquaresToGrowBy = 8;
let linethickness = 1;

let canvasWidth = cols * cellSize;
let canvasHeight = rows * cellSize;

const LEFT = new p5.Vector(-1, 0);
const RIGHT = new p5.Vector(1, 0);
const UP = new p5.Vector(0, -1);
const DOWN = new p5.Vector(0, 1);

const INIT = 1;
const PLAYING = 2;
const PAUSED = 3;
const GAME_OVER = 4;

let phase = INIT;

// config
let randomcolors = "FALSE";
let wallCollision = "TRUE";
let snakeCollision = "TRUE";

let snake = [];
let dir;
let apple = [];
let eaten;
// let speedSlider;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  initGameState();
  frameRate(speed);
  randomcoloronce()
  // console.log(speed)
}

function initGameState() {
  snake = [
    new p5.Vector(cellSize * 4, cellSize * 4),
    new p5.Vector(cellSize * + 4 + cellSize, cellSize * 4),
    new p5.Vector(cellSize * + 4 + cellSize * 2, cellSize * +4),
  ];
  dir = RIGHT;
  eaten = 0;
  apple = [new p5.Vector(4 * cellSize, 6 * cellSize)];
}

function randomApplePosition() {
  apple.pop();
  apple.push(
    new p5.Vector(
      round(random(0, cols - 1)) * cellSize,
      round(random(0, rows - 1)) * cellSize
    )
  );

  for (let i = 0; i <= snake.length - 1; i++) {
    if (apple[0].x === snake[i].x && apple[0].y === snake[i].y) {
      randomApplePosition();
    }
  }
}

// MAIN DRAW LOOP //////////////////////////////////////////

function draw() {
    if (randomcolors === "TRUE") {
          background(randomcolorb[0].x, randomcolorb[0].y, randomcolorb[0].z, randomcolorb[1]);
        } else if (randomcolors === "FALSE") {
          background("beige")
        }
  drawGrid();
  moveSnake();
  drawApple();
  drawSnake();
  drawSnakeEyes();
  checkApple();
  checkCollisions();
}

// HELPER DRAW FUNCTIONS ///////////////////////////////////

function drawGrid() {
   noStroke();
  for (let i = 0; i < cols; i++) {
    strokeWeight(1);
    line(i * cellSize, 0, i * cellSize, canvasHeight);
  }
  for (let i = 0; i < rows; i++) {
    strokeWeight(1);
    line(0, i * cellSize, canvasWidth, i * cellSize);
  }
}

function drawSnakeEyes() {
  if (dir === RIGHT) {
    fill("red");
    circle(
      snake[snake.length - 1].x + (cellSize / 4) * 3,
      snake[snake.length - 1].y + cellSize / 4,
      cellSize / 4
    );
    circle(
      snake[snake.length - 1].x + (cellSize / 4) * 3,
      snake[snake.length - 1].y + (cellSize / 4) * 3,
      cellSize / 4
    );
  }
  if (dir === LEFT) {
    fill("red");
    circle(
      snake[snake.length - 1].x + cellSize / 4,
      snake[snake.length - 1].y + cellSize / 4,
      cellSize / 4
    );
    circle(
      snake[snake.length - 1].x + cellSize / 4,
      snake[snake.length - 1].y + (cellSize / 4) * 3,
      cellSize / 4
    );
  }
  if (dir === UP) {
    fill("red");
    circle(
      snake[snake.length - 1].x + cellSize / 4,
      snake[snake.length - 1].y + cellSize / 4,
      cellSize / 4
    );
    circle(
      snake[snake.length - 1].x + (cellSize / 4) * 3,
      snake[snake.length - 1].y + cellSize / 4,
      cellSize / 4
    );
  }
  if (dir === DOWN) {
    fill("red");
    circle(
      snake[snake.length - 1].x + cellSize / 4,
      snake[snake.length - 1].y + (cellSize / 4) * 3,
      cellSize / 4
    );
    circle(
      snake[snake.length - 1].x + (cellSize / 4) * 3,
      snake[snake.length - 1].y + (cellSize / 4) * 3,
      cellSize / 4
    );
  }
}

function drawSnake() {
  stroke(1);
  if (phase === GAME_OVER) {
    for (let i = 0; i <= snake.length - 1; i++) {
      fill(random(200,255), random(0,100), random(20,150), 255);
      strokeWeight(linethickness)
      square(snake[i].x, snake[i].y, cellSize);
    }
    textSize(cellSize * 4);
    fill("red")
    strokeWeight(5)
    text("L, press r", cols * cellSize / 2 - 75, rows * cellSize / 2);
  }
  if (phase === PLAYING) {
    for (let i = 0; i <= snake.length - 1; i++) {
        if (randomcolors === "TRUE") {
          fill(randomcolor2[0].x, randomcolor2[0].y, randomcolor2[0].z, randomcolor2[1]);
        } else if (randomcolors === "FALSE") {
          fill("green")
        }
      strokeWeight(linethickness)
      square(snake[i].x, snake[i].y, cellSize);
    }
  }
  if (phase === INIT) {
    for (let i = 0; i <= snake.length - 1; i++) {
        if (randomcolors === "TRUE") {
          fill(randomcolor2[0].x, randomcolor2[0].y, randomcolor2[0].z, randomcolor2[1]);
        } else if (randomcolors === "FALSE") {
          fill("green")
        }
      strokeWeight(linethickness)
      square(snake[i].x, snake[i].y, cellSize);
    }
  }
  if (phase === PAUSED) {
    for (let i = 0; i <= snake.length - 1; i++) {
      fill(random(230,255), random(190,240), 0, 255);
      strokeWeight(linethickness)
      square(snake[i].x, snake[i].y, cellSize);
    }
  }
  strokeWeight(1)
  fill("darkblue");
  textSize(15);
  text(eaten * amountOfSquaresToGrowBy + 3, canvasWidth - 35, canvasHeight - 30);
}

let randomcolor = [];
let randomcolor2 = [];
let randomcolorb = [];
function randomcoloronce() {
    randomcolor.pop()
    randomcolor.pop()
    randomcolor.push(new p5.Vector(random(255), random(255), random(255)))
    randomcolor.push(255)
    randomcolor2.pop()
    randomcolor2.pop()
    randomcolor2.push(new p5.Vector(random(100,255), random(175,255), random(100,255)))
    randomcolor2.push(255)
    randomcolorb.pop()
    randomcolorb.pop()
    randomcolorb.push(new p5.Vector(random(200,255), random(200,255), random(200,255)))
    randomcolorb.push(255)
}

function drawApple() {
  stroke(linethickness);
    if (randomcolors === "TRUE") {
     fill(randomcolor[0].x, randomcolor[0].y, randomcolor[0].z, randomcolor[1]);;
     } else if (randomcolors === "FALSE") {
       fill("red")
     }
  strokeWeight(linethickness)
  square(apple[0].x, apple[0].y, cellSize);
}

// EVENTS //////////////////////////////////////////////////

let pendingMovement = [];
function keyPressed() {
  // discord server: 530329504766361610  discord user: 672554516624703500
  // he had a similar pause code which I used to implement my own similar pause code below.
  if (keyCode === 82) {
    randomcoloronce()
    phase = INIT;
  }
  if (keyCode === 32) {
    if (phase === PLAYING) {
      //speedSliderLog()
      phase = PAUSED;
    } else if (phase === PAUSED) {
      //speedSliderLog()
      phase = PLAYING;
    }
  }
  if (phase === INIT) {
    if (keyCode === RIGHT_ARROW | keyCode === UP_ARROW | keyCode === DOWN_ARROW | keyCode === 68 | keyCode === 65 | keyCode === 87 | keyCode === 87) {
    phase = PLAYING
    }
  }
  if (phase === PLAYING) {
    if (keyCode === RIGHT_ARROW | keyCode === 68) {
      // console.log('▶');
      if (dir === LEFT) {
      } else {
        pendingMovement.push(RIGHT);
        dir = RIGHT;
      }
    }
    if (keyCode === LEFT_ARROW | keyCode === 65) {
      // console.log('◀');
      if (dir === RIGHT) {
      } else {
        pendingMovement.push(LEFT);
        dir = LEFT;
      }
    }
    if (keyCode === UP_ARROW | keyCode === 87) {
      // console.log('▲');
      if (dir === DOWN) {
      } else {
        pendingMovement.push(UP);
        dir = UP;
      }
    }
    if (keyCode === DOWN_ARROW | keyCode === 83) {
      // console.log('▼');
      if (dir === UP) {
      } else {
        pendingMovement.push(DOWN);
        dir = DOWN;
      }
    }
  }
}

// HELPER CHECKS AND UPDATES ///////////////////////////////

function moveSnake() {
  if (phase === INIT) {
    initGameState();
  }
  if (phase === PLAYING) {
    let nextDir = pendingMovement.length > 0 ? pendingMovement.shift() : dir;
    if (nextDir === RIGHT) {
      snake.shift();
      snake.push(
        new p5.Vector(
          snake[snake.length - 1].x + cellSize,
          snake[snake.length - 1].y
        )
      );
    }
    if (nextDir === LEFT) {
      snake.shift();
      snake.push(
        new p5.Vector(
          snake[snake.length - 1].x - cellSize,
          snake[snake.length - 1].y
        )
      );
    }
    if (nextDir === DOWN) {
      snake.shift();
      snake.push(
        new p5.Vector(
          snake[snake.length - 1].x,
          snake[snake.length - 1].y + cellSize
        )
      );
    }
    if (nextDir === UP) {
      snake.shift();
      snake.push(
        new p5.Vector(
          snake[snake.length - 1].x,
          snake[snake.length - 1].y - cellSize
        )
      );
    }
  }
}

function checkCollisions() { // teleport through walls
if (snakeCollision === "TRUE") {
    for (let i = 0; i <= snake.length - 2; i++) {
    if (snake[snake.length - 1].equals(snake[i])) {
      phase = GAME_OVER;
    }
  }
}

if (wallCollision === "TRUE") {
  for (let i = 0; i <= snake.length - 2; i++) {
  }
  if (snake[snake.length - 1].x < -0.001) {
    phase = GAME_OVER;
  }
  if (snake[snake.length - 1].y < -0.001) {
    phase = GAME_OVER;
  }
  if (snake[snake.length - 1].x >= canvasWidth) {
    phase = GAME_OVER;
  }
  if (snake[snake.length - 1].y >= canvasHeight) {
    phase = GAME_OVER;
  }
}

if (wallCollision === "FALSE") {
  for (let i = 0; i <= snake.length - 2; i++) {
  if (snake[snake.length - 1].x < -0.001) { // left wall
    snake.pop();
      snake.push(
        new p5.Vector(
          canvasWidth - cellSize,
          snake[snake.length - 1].y
        )
      );
  }
  if (snake[snake.length - 1].y < -0.001) { // roof
    snake.pop();
      snake.push(
        new p5.Vector(
          snake[snake.length - 1].x,
          canvasHeight - cellSize
        )
      )
  }
  if (snake[snake.length - 1].x >= canvasWidth) { // right wall
      snake.pop();
      snake.push(
        new p5.Vector(
          0,
          snake[snake.length - 1].y
        )
      );
  }
  if (snake[snake.length - 1].y >= canvasHeight) { // bottom roof
      snake.pop();
      snake.push(
        new p5.Vector(
          snake[snake.length - 1].x,
          0
        )
      )
  }
  }
  }
}

function growsnake(x) {
    for (let i = 0; i < x; i++)
        snake.unshift(new p5.Vector(snake[0].x, snake[0].y));
}

function checkApple() {
  if (snake[snake.length - 1].equals(apple[0])) {
    growsnake(amountOfSquaresToGrowBy)
    randomcoloronce()
    randomApplePosition();
    eaten = eaten + 1;
  }
}

// CONIFG FUNCTIONS KEKEKEK
function cb1() {
  // Get the checkbox
  var cb1 = document.getElementById("cb1");
  // Get the output text
  var text = document.getElementById("text");
  if (cb1.checked == true){
      setrandomcolorstrue()
  } else {
      setrandomcolorsfalse()
  }
}

function setrandomcolorstrue() {
  clear()
  randomcolors = "TRUE";
  phase = INIT;
  setup();
}

function setrandomcolorsfalse() {
  clear()
  randomcolors = "FALSE";
  phase = INIT;
  setup();
}

// -------- cb2
function cb2() {
  // Get the checkbox
  var cb2 = document.getElementById("cb2");
  // Get the output text
  var text = document.getElementById("text");
  if (cb2.checked == true){
      setwCtrue()
  } else {
      setwCfalse()
  }
}

function setwCtrue() {
  clear()
  wallCollision = "TRUE";
  phase = INIT;
  setup();
}

function setwCfalse() {
  clear()
  wallCollision = "FALSE";
  phase = INIT;
  setup();
}

//------- cb3
function cb3() {
  // Get the checkbox
  var cb3 = document.getElementById("cb3");
  // Get the output text
  var text = document.getElementById("text");
  if (cb3.checked == true){
      setsCtrue()
  } else {
      setsCfalse()
  }
}

function setsCtrue() {
  clear()
  snakeCollision = "TRUE";
  phase = INIT;
  setup();
}

function setsCfalse() {
  clear()
  snakeCollision = "FALSE";
  phase = INIT;
  setup();
}

function updateSpeed(speedSlid) {
     speed = parseInt(speedSlid);
     frameRate(speed);
     console.log(speedSlid)
}

let scaleNum
function updateCellSize(scale) {
     clear()
     scaleNum = parseInt(scale)
     cellSize = scaleNum
     canvasWidth = cols * cellSize;
     canvasHeight = rows * cellSize;
     phase = INIT;
     setup();
}

function updateRows(rowsnew){
    clear()
    rows = parseInt(rowsnew)
    canvasWidth = cols * cellSize;
    canvasHeight = rows * cellSize;
    phase = INIT;
    setup();
}

function updateCols(colsnew){
    clear()
    cols = parseInt(colsnew)
    canvasWidth = cols * cellSize;
    canvasHeight = rows * cellSize;
    phase = INIT;
    setup();
}

function updateGrowth(Growth){
    amountOfSquaresToGrowBy = parseInt(Growth)
}