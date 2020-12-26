
let numBalls = 12;
let spring = 0.05;
let gravity = 0.03;
let friction = -0.9;
let balls = [];

let mainOsc, mainFreq, mainAmp

function setup() {
  createCanvas(1200, 600);
  for (let i = 0; i < numBalls; i++) {
    balls[i] = new Ball(
      random(width),
      random(height/2),
      random(10, 40),
      i,
      balls
    );
  }
  noStroke();
  fill(255, 204);
  frameRate(60)

  mainOsc = new p5.Oscillator('square');
  mainOsc.amp(0.02)
  mainOsc.freq(110)
  mainOsc.start()
}

function draw() {
  background(0);
  balls.forEach(ball => {
    ball.collide();
    ball.move();
    ball.display();
  });
}

class Ball {
  constructor(xin, yin, din, idin, oin) {
    this.x = xin;
    this.y = yin;
    this.vx = 0;
    this.vy = 0;
    this.diameter = din;
    this.id = idin;
    this.others = oin;

    this.osc = new p5.Oscillator('sine');
    this.osc.amp(0, 0)
    this.osc.start();
  }

  collide() {
    for (let i = this.id + 1; i < numBalls; i++) {
      // console.log(others[i]);
      let dx = this.others[i].x - this.x;
      let dy = this.others[i].y - this.y;
      let distance = sqrt(dx * dx + dy * dy);
      let minDist = this.others[i].diameter / 2 + this.diameter / 2;
      if (distance < minDist) {
        let angle = atan2(dy, dx);
        let targetX = this.x + cos(angle) * minDist;
        let targetY = this.y + sin(angle) * minDist;
        let ax = (targetX - this.others[i].x) * spring;
        let ay = (targetY - this.others[i].y) * spring;
        this.vx -= ax;
        this.vy -= ay;
        this.others[i].vx += ax;
        this.others[i].vy += ay;

        let freq = constrain(map(this.vx, -1, 1, 100, 1000), 100, 1000);
        let amp = constrain(map(this.vy, -2, 2, 0, 1), 0.1, 1);
        this.osc.pan(this.x/width)
        this.osc.freq(freq, 0.1);
        this.osc.amp(amp, 0.1);
        setTimeout(_=>this.osc.amp(0, 0.5), 500)
        if (random()<0.0725) {
          mainOsc.freq(freq/2)
        }
      }
    }
  }

  move() {
    this.vy += gravity;
    this.x += this.vx;
    this.y += this.vy;
    if (this.x + this.diameter / 2 > width) {
      this.x = width - this.diameter / 2;
      this.vx *= friction;
    } else if (this.x - this.diameter / 2 < 0) {
      this.x = this.diameter / 2;
      this.vx *= friction;
    }
    if (this.y + this.diameter / 2 > height) {
      this.y = height - this.diameter / 2;
      this.vy *= friction;
    } else if (this.y - this.diameter / 2 < 0) {
      this.y = this.diameter / 2;
      this.vy *= friction;
    }
  }

  display() {
    ellipse(this.x, this.y, this.diameter);
  }
}
