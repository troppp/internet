// dir array pending moves credit goes to sflanker

const cellSize = 20;
const rows = 30; // rows >= 10
const cols = 30; // cols >= 10
let speed = 12.5;
const amountOfSquaresToGrowBy = 2;
let linethickness = 2;

const canvasWidth = cols * cellSize;
const canvasHeight = rows * cellSize;

const LEFT = new p5.Vector(-1, 0);
const RIGHT = new p5.Vector(1, 0);
const UP = new p5.Vector(0, -1);
const DOWN = new p5.Vector(0, 1);

const INIT = 1;
const PLAYING = 2;
const PAUSED = 3;
const GAME_OVER = 4;

let phase = INIT;

let snake = [];
let dir;
let apple = [];
let eaten;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  initGameState();
  frameRate(speed);
  randomcoloronce()
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
  background("beige");
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
  stroke(1)
  if (phase === GAME_OVER) {
    for (let i = 0; i <= snake.length - 1; i++) {
      fill(random(200,255), random(0,100), random(20,150), 255);
      strokeWeight(linethickness)
      square(snake[i].x, snake[i].y, cellSize);
    }
    textSize(cellSize * 1.6);
    strokeWeight(5)
    fill("red")
    text("L, press r", cols * cellSize / 2 - cellSize * 3, rows * cellSize / 2);
  }
  if (phase === PLAYING) {
    for (let i = 0; i <= snake.length - 1; i++) {
      fill("green");
      strokeWeight(linethickness)
      square(snake[i].x, snake[i].y, cellSize);
    }
  }
  if (phase === INIT) {
    for (let i = 0; i <= snake.length - 1; i++) {
      fill("green");
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
  stroke(1)
  strokeWeight(linethickness);
  fill("red");
  square(apple[0].x, apple[0].y, cellSize);
}

// EVENTS //////////////////////////////////////////////////

let pendingMovement = [];
function keyPressed() {
  // discord server: 530329504766361610  discord user: 672554516624703500
  // he had a similar pause code which I used to implement my own similar pause code below.
  if (keyCode === 82) {
    phase = INIT;
  }
  if (keyCode === 32) {
    if (phase === PLAYING) {
      phase = PAUSED;
    } else if (phase === PAUSED) {
      phase = PLAYING;
    } else if (phase === INIT) {
      phase = PLAYING;
    }
  }
  if (phase === PLAYING) {
    if (keyCode === RIGHT_ARROW) {
      // console.log('▶');
      if (dir === LEFT) {
      } else {
        pendingMovement.push(RIGHT);
        dir = RIGHT;
      }
    }
    if (keyCode === LEFT_ARROW) {
      // console.log('◀');
      if (dir === RIGHT) {
      } else {
        pendingMovement.push(LEFT);
        dir = LEFT;
      }
    }
    if (keyCode === UP_ARROW) {
      // console.log('▲');
      if (dir === DOWN) {
      } else {
        pendingMovement.push(UP);
        dir = UP;
      }
    }
    if (keyCode === DOWN_ARROW) {
      // console.log('▼');
      if (dir === UP) {
      } else {
        pendingMovement.push(DOWN);
        dir = DOWN;
      }
    }
  }
}

function mousePressed() {
  if (phase === INIT) {
    phase = PLAYING;
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
function checkCollisions() {
  for (let i = 0; i <= snake.length - 2; i++) {
    if (snake[snake.length - 1].equals(snake[i])) {
      phase = GAME_OVER;
    }
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
