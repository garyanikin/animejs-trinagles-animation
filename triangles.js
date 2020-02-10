// window.human = false;

var canvasEl = document.querySelector(".triangles");
var ctx = canvasEl.getContext("2d");
// var numberOfParticules = 30;
// var pointerX = 0;
// var pointerY = 0;
// var tap =
//   "ontouchstart" in window || navigator.msMaxTouchPoints
//     ? "touchstart"
//     : "mousedown";
// var colors = ["#FF1461", "#18FF92", "#5A87FF", "#FBF38C"];

function setCanvasSize() {
  canvasEl.width = window.innerWidth * 2;
  canvasEl.height = window.innerHeight * 2;
  canvasEl.style.width = window.innerWidth + "px";
  canvasEl.style.height = window.innerHeight + "px";
  ctx.scale(2, 2);
}

// function updateCoords(e) {
//   pointerX = e.clientX || e.touches[0].clientX;
//   pointerY = e.clientY || e.touches[0].clientY;
// }

// function setParticuleDirection(p) {
//   var angle = (anime.random(0, 360) * Math.PI) / 180;
//   var value = anime.random(50, 180);
//   var radius = [-1, 1][anime.random(0, 1)] * value;
//   return {
//     x: p.x + radius * Math.cos(angle),
//     y: p.y + radius * Math.sin(angle)
//   };
// }

// function createParticule(x, y) {
//   var p = {};
//   p.x = x;
//   p.y = y;
//   p.color = colors[anime.random(0, colors.length - 1)];
//   p.radius = anime.random(16, 32);
//   p.endPos = setParticuleDirection(p);
//   p.draw = function() {
//     ctx.beginPath();
//     ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
//     ctx.fillStyle = p.color;
//     ctx.fill();
//   };
//   return p;
// }

// function createCircle(x, y) {
//   var p = {};
//   p.x = x;
//   p.y = y;
//   p.color = "#FFF";
//   p.radius = 0.1;
//   p.alpha = 0.5;
//   p.lineWidth = 6;
//   p.draw = function() {
//     ctx.globalAlpha = p.alpha;
//     ctx.beginPath();
//     ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
//     ctx.lineWidth = p.lineWidth;
//     ctx.strokeStyle = p.color;
//     ctx.stroke();
//     ctx.globalAlpha = 1;
//   };
//   return p;
// }

// function renderParticule(anim) {
//   for (var i = 0; i < anim.animatables.length; i++) {
//     anim.animatables[i].target.draw();
//   }
// }

// function animateParticules(x, y) {
//   var circle = createCircle(x, y);
//   var particules = [];
//   for (var i = 0; i < numberOfParticules; i++) {
//     particules.push(createParticule(x, y));
//   }
//   anime
//     .timeline()
//     .add({
//       targets: particules,
//       x: function(p) {
//         return p.endPos.x;
//       },
//       y: function(p) {
//         return p.endPos.y;
//       },
//       radius: 0.1,
//       duration: anime.random(1200, 1800),
//       easing: "easeOutExpo",
//       update: renderParticule
//     })
//     .add({
//       targets: circle,
//       radius: anime.random(80, 160),
//       lineWidth: 0,
//       alpha: {
//         value: 0,
//         easing: "linear",
//         duration: anime.random(600, 800)
//       },
//       duration: anime.random(1200, 1800),
//       easing: "easeOutExpo",
//       update: renderParticule,
//       offset: 0
//     });
// }

// var render = anime({
//   duration: Infinity,
//   update: function() {
//     ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
//   }
// });

// document.addEventListener(
//   tap,
//   function(e) {
//     window.human = true;
//     render.play();
//     updateCoords(e);
//     animateParticules(pointerX, pointerY);
//   },
//   false
// );

// var centerX = window.innerWidth / 2;
// var centerY = window.innerHeight / 2;

// function autoClick() {
//   if (window.human) return;
//   animateParticules(
//     anime.random(centerX - 50, centerX + 50),
//     anime.random(centerY - 50, centerY + 50)
//   );
//   anime({ duration: 200 }).finished.then(autoClick);
// }

// autoClick();

setCanvasSize();
drawTriangles();

// add throttle only trailling, leading: false
window.addEventListener(
  "resize",
  () => {
    setCanvasSize();
    drawTriangles();
  },
  false
);

function drawTriangles() {
  startMeasure();
  ctx.beginPath();
  const triangle_height = 50;
  const triangle_base = 40;

  drawHorizontalLine(triangle_height);
  drawLeftLine(triangle_base, triangle_height);
  drawRightLine(triangle_base, triangle_height);
  ctx.stroke();

  const yCount = canvasEl.height / triangle_height / 2;
  const xCount = canvasEl.width / triangle_base;
  for (let y = 0; y < yCount; y++) {
    for (let x = 0; x < xCount; x++) {
      drawSquares({
        triangle_base,
        triangle_height,
        x: x * triangle_base,
        y: y * triangle_height * 2
      });
    }
  }
  stopMeasure();
}

console.log(1000 / 60, "ms for one frame");
function startMeasure() {
  performance.mark("startMeasure");
}

function drawHorizontalLine(triangle_height) {
  // canvasEl.width = window.innerWidth * 2;
  // canvasEl.height = window.innerHeight * 2;
  // ctx.scale(2, 2);

  const line_count = canvasEl.height / triangle_height;
  console.log("drawHorizontalLine line_count", line_count);

  for (let i = 1; i <= line_count; i++) {
    drawLine(i * triangle_height);
  }

  function drawLine(y) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvasEl.width, y);
  }
}
function drawRightLine(triangle_base, triangle_height) {
  const line_count = canvasEl.width / triangle_base;
  console.log("drawRightLine line_count", line_count);

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
function drawLeftLine(triangle_base, triangle_height) {
  const line_count = canvasEl.width / triangle_base;
  console.log("drawLeftLine line_count", line_count);
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

function drawSquares({ triangle_base, triangle_height, y, x }) {
  const square_size = 6;

  //left
  ctx.fillRect(
    x - square_size / 2,
    y - square_size / 2,
    square_size,
    square_size
  );

  // center
  ctx.fillRect(
    x + triangle_base / 2 - square_size / 2,
    y + triangle_height - square_size / 2,
    square_size,
    square_size
  );

  // right
  ctx.fillRect(
    x + triangle_base - square_size / 2,
    y - square_size / 2,
    square_size,
    square_size
  );
}

function stopMeasure() {
  performance.mark("stopMeasure");
  performance.measure("Draw triangles", "startMeasure", "stopMeasure");
  console.log(performance.getEntriesByType("measure"));

  // Finally, clean up the entries.
  performance.clearMarks();
  performance.clearMeasures();
}
