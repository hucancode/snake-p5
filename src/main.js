import p5 from "p5";
// ------------------- P5.js Setup -------------------
const WIDTH = 800;
const HEIGHT = 600;
const SCALE = 20; // Size of each grid cell

class Snake {
  constructor() {
    this.body = [{ x: 10, y: 10 }, {x: 10, y: 9}, {x: 10, y: 8},{x: 10, y: 7}];
    this.xdir = 1;
    this.ydir = 0;
    this.grow = false;
  }

  setDir(x, y) {
    // Prevent reversing
    if (this.body.length > 1) {
      if (this.xdir === -x && this.ydir === -y) return;
    }
    this.xdir = x;
    this.ydir = y;
    console.log("Direction set to:", x, y);
  }

  update() {
    let newX = this.body[0].x + this.xdir;
    let newY = this.body[0].y + this.ydir;
    // Wrap around walls (playable area is x: 1..maxX-1, y: 1..maxY-1)
    const maxX = (WIDTH / SCALE) - 1;
    const maxY = (HEIGHT / SCALE) - 1;
    if (newX < 1) newX = maxX - 1;
    else if (newX > maxX - 1) newX = 1;
    if (newY < 1) newY = maxY - 1;
    else if (newY > maxY - 1) newY = 1;
    const head = {
      x: newX,
      y: newY
    };
    this.body.unshift(head);
    if (!this.grow) {
      this.body.pop();
    } else {
      this.grow = false;
    }
  }

  eat(pos) {
    if (this.body[0].x === pos.x && this.body[0].y === pos.y) {
      this.grow = true;
      return true;
    }
    return false;
  }

  checkCollision() {
    const head = this.body[0];
    // Only self collision
    for (let i = 1; i < this.body.length; i++) {
      if (head.x === this.body[i].x && head.y === this.body[i].y) {
        return true;
      }
    }
    return false;
  }

  draw(p) {
    p.fill(0, 200, 0);
    for (const part of this.body) {
      p.rect(part.x * SCALE, part.y * SCALE, SCALE, SCALE);
    }
  }
}

let snake = new Snake();
let food;
let score = 0;


function randomFood() {
  // Food should not spawn on the wall
  return {
    x: Math.floor(Math.random() * ((WIDTH / SCALE) - 2)) + 1,
    y: Math.floor(Math.random() * ((HEIGHT / SCALE) - 2)) + 1,
  };
}

const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(WIDTH, HEIGHT);
    p.frameRate(10);
    food = randomFood();
    score = 0;
  };

  p.draw = () => {
    p.background(255);

    // Draw walls
    p.fill(100);
    // Top wall
    p.rect(0, 0, WIDTH, SCALE);
    // Bottom wall
    p.rect(0, HEIGHT - SCALE, WIDTH, SCALE);
    // Left wall
    p.rect(0, 0, SCALE, HEIGHT);
    // Right wall
    p.rect(WIDTH - SCALE, 0, SCALE, HEIGHT);

    snake.update();
    if (snake.eat(food)) {
      score++;
      food = randomFood();
    }
    if (snake.checkCollision()) {
      p.noLoop();
      p.fill(255, 0, 0);
      p.textSize(48);
      p.textAlign(p.CENTER, p.CENTER);
      p.text("Game Over", WIDTH / 2, HEIGHT / 2);
      return;
    }

    // Draw food
    p.fill(255, 0, 0);
    p.rect(food.x * SCALE, food.y * SCALE, SCALE, SCALE);

    // Draw snake
    snake.draw(p);

    // Draw score
    p.fill(0);
    p.textSize(24);
    p.textAlign(p.LEFT, p.TOP);
    p.text("Score: " + score, 25, 25);
  };

  // Attach keyPressed handler to the p5 instance
  p.keyPressed = function() {
    if (p.key === p.LEFT_ARROW) snake.setDir(-1, 0);
    else if (p.key === p.RIGHT_ARROW) snake.setDir(1, 0);
    else if (p.key === p.UP_ARROW) snake.setDir(0, -1);
    else if (p.key === p.DOWN_ARROW) snake.setDir(0, 1);
  };
};

new p5(sketch);
