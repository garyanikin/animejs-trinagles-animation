var canvasEl = document.querySelector(".triangles");
var ctx = canvasEl.getContext("2d");

function setCanvasSize() {
  canvasEl.width = window.innerWidth * 2;
  canvasEl.height = window.innerHeight * 2;
  canvasEl.style.width = window.innerWidth + "px";
  canvasEl.style.height = window.innerHeight + "px";
  ctx.scale(2, 2);
}

const triangle_height = 50;
const triangle_base = 40;
const square_size = 5;
function createSquare(x, y) {
  var p = {};
  p.x = x;
  p.y = y;
  p.color = "#000";
  p.alpha = 0;
  p.draw = function() {
    ctx.globalAlpha = p.alpha;
    ctx.fillRect(p.x, p.y, square_size, square_size);
    ctx.globalAlpha = 1;
  };
  return p;
}

function animateTriangle(x, y) {
  const left_square = createSquare(
    x * triangle_base - square_size / 2,
    y * triangle_height * 2 - square_size / 2
  );
  const center_square = createSquare(
    x * triangle_base + triangle_base / 2 - square_size / 2,
    y * triangle_height * 2 + triangle_height - square_size / 2
  );
  const right_square = createSquare(
    x * triangle_base + triangle_base - square_size / 2,
    y * triangle_height * 2 - square_size / 2
  );

  const duration = anime.random(1000, 3000);
  const animeLeftSquare = anime
    .timeline({
      targets: [left_square, center_square, right_square],
      easing: "linear",
      update: anim => anim.animatables.map(({ target }) => target.draw())
    })
    .add({
      alpha: 1,
      duration
    })
    .add({
      alpha: 1,
      duration: 1000
    })
    .add({
      alpha: 0,
      duration
    });
}

var render = anime({
  duration: Infinity,
  update: function() {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    drawBackground();
  }
});

setCanvasSize();

// add throttle only trailling, leading: false
window.addEventListener(
  "resize",
  () => {
    setCanvasSize();
  },
  false
);

// Every second with 30% chance start animation
setInterval(() => {
  const maxX = Math.floor(canvasEl.width / triangle_base / 2);
  const maxY = Math.floor(canvasEl.height / (triangle_height * 2) / 2);
  const rnd = Math.random();
  const chance = 0.3;
  if (rnd < chance) {
    // Select random triangle

    const x = Math.floor(Math.random() * maxX);
    const y = Math.floor(Math.random() * maxY);

    // Animate triangle
    animateTriangle(x, y);

    // Select random amount (1-3) of closest triangles
    const closestTriangles = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < closestTriangles; i++) {
      // Animate them
      const deltaX = Math.random() > 0.5 ? 0.5 : -0.5;
      const deltaY = Math.random() > 0.5 ? 0.5 : -0.5;
      animateTriangle(x + deltaX, y + deltaY);
    }
  }
}, 1000);

function drawBackground() {
  ctx.beginPath();
  drawHorizontalLine();
  drawLeftLine();
  drawRightLine();
  ctx.stroke();
}

function drawHorizontalLine() {
  const line_count = canvasEl.height / triangle_height;

  for (let i = 1; i <= line_count; i++) {
    drawLine(i * triangle_height);
  }

  function drawLine(y) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvasEl.width, y);
  }
}
function drawRightLine() {
  const line_count = canvasEl.width / triangle_base;

  let starting_point =
    (triangle_base / 2) * (canvasEl.height / triangle_height); // get width of end first line
  starting_point = Math.floor(starting_point / triangle_base);
  for (let i = -starting_point; i < line_count; i++) {
    drawLine(i * triangle_base);
  }

  function drawLine(x) {
    ctx.moveTo(x, 0);
    ctx.lineTo(
      x + (triangle_base / 2) * (canvasEl.height / triangle_height),
      canvasEl.height
    );
  }
}
function drawLeftLine() {
  const line_count = canvasEl.width / triangle_base;
  let starting_point =
    (triangle_base / 2) * (canvasEl.height / triangle_height); // get width of end first line
  starting_point = Math.floor(starting_point / triangle_base);
  for (let i = -starting_point; i < line_count; i++) {
    drawLine(i * triangle_base);
  }
  function drawLine(x) {
    ctx.moveTo(x, 0);
    ctx.lineTo(
      x - (triangle_base / 2) * (canvasEl.height / triangle_height),
      canvasEl.height
    );
  }
}
