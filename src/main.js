import p5 from "p5";
// ------------------- P5.js Setup -------------------
const WIDTH = 800;
const HEIGHT = 600;
const SCALE = 20; // Size of each grid cell

class Snake {
  constructor() {
    this.body = [{ x: 10, y: 10 }];
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
    const startColor = p.color(0, 200, 0);
    const endColor = p.color(0, 100, 0);
    for (let i = 0; i < this.body.length; i++) {
      const t = i / Math.max(1, this.body.length - 1);
      const segmentColor = p.lerpColor(startColor, endColor, t);
      p.fill(segmentColor);
      p.rect(this.body[i].x * SCALE, this.body[i].y * SCALE, SCALE, SCALE);
    }
  }
}

let snake = new Snake();
let food;
let foodFade = 255; // Initial opacity (fully visible)
let foodFadeSpeed = 5; // How fast the food fades
let foodTimer = 0; // Timer to track how long the food has been on screen
let score = 0;


function randomFood() {
  return {
      x: Math.floor(Math.random() * ((WIDTH / SCALE) - 2)) + 1,
      y: Math.floor(Math.random() * ((HEIGHT / SCALE) - 2)) + 1,
      fade: 255, // Initial opacity
      timer: 0,  // Initial timer
    };
}

const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(WIDTH, HEIGHT);
    p.frameRate(5); // Lower speed
    food = randomFood();
    score = 0;
  };

  p.draw = () => {
    p.background(255);

    // Draw walls
    p.fill(100);
    p.rect(0, 0, WIDTH, SCALE);
    p.rect(0, HEIGHT - SCALE, WIDTH, SCALE);
    p.rect(0, 0, SCALE, HEIGHT);
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

    // Update food fade
    food.timer++;
    food.fade = 255 - (food.timer * foodFadeSpeed);
    if (food.fade <= 0) {
      food = randomFood(); // Reset food if it's fully faded
    }

    // Draw food with fade
    p.fill(255, 0, 0, food.fade);
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
