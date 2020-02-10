(() => {
  const TRIANGLE_SELECTOR = ".triangles";

  const square_color = "#FFF";
  const lines_color = "#FFF";
  const lines_opacity = 0.2;
  const triangle_height = 50;
  const triangle_base = 50;
  const square_size = 5;
  const hold_duration = 1500;
  const CANVASES = [];

  mountCanvas();

  CANVASES.map(canv => {
    startAnimation(canv);
  });

  // add throttle only trailling, leading: false
  window.addEventListener(
    "resize",
    () => {
      setCanvasSize();
    },
    false
  );

  function mountCanvas() {
    [...document.querySelectorAll(TRIANGLE_SELECTOR)].map(elem => {
      const width = elem.offsetWidth;
      const height = elem.offsetHeight;
      const canvas = document.createElement("canvas");
      elem.appendChild(canvas);
      canvas.width = width * 2;
      canvas.height = height * 2;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";

      const ctx = canvas.getContext("2d");
      ctx.scale(2, 2);

      CANVASES.push(canvas);
    });
  }

  function setCanvasSize() {
    // Resize all canvases
    // canvasEl.width = window.innerWidth * 2;
    // canvasEl.height = window.innerHeight * 2;
    // canvasEl.style.width = window.innerWidth + "px";
    // canvasEl.style.height = window.innerHeight + "px";
    // ctx.scale(2, 2);
  }

  function startAnimation(canvas) {
    const ctx = canvas.getContext("2d");

    var render = anime({
      duration: Infinity,
      update: function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground(canvas);
      }
    });

    // Every 2 seconds with 75% chance start animation
    setInterval(() => {
      const maxX = Math.floor(canvas.width / triangle_base / 2);
      const maxY = Math.floor(canvas.height / (triangle_height * 2) / 2);
      const rnd = Math.random();
      const chance = 0.75;
      if (rnd < chance) {
        // Select random triangle

        const x = Math.floor(Math.random() * maxX);
        const y = Math.floor(Math.random() * maxY);

        // Animate triangle
        const base_triangle = createTriangle(ctx, x, y);

        // Select random amount (1-3) of closest triangles
        const closestTriangles = Math.floor(Math.random() * 5) + 1;
        let closest_triangles = [];
        for (let i = 0; i < closestTriangles; i++) {
          // Animate them
          const deltaX = Math.random() > 0.5 ? 0.5 : -0.5;
          const deltaY = Math.random() > 0.5 ? 0.5 : -0.5;
          closest_triangles = [
            closest_triangles,
            ...createTriangle(ctx, x + deltaX, y + deltaY)
          ];
        }
        animateTriangle([...base_triangle, ...closest_triangles]);
      }
    }, 2000);
  }

  function createSquare(ctx, x, y) {
    var p = {};
    p.x = x;
    p.y = y;
    p.alpha = 0;
    p.draw = function() {
      ctx.globalAlpha = p.alpha;
      ctx.fillRect(p.x, p.y, square_size, square_size);
      ctx.globalAlpha = 1;
    };
    return p;
  }

  function createTriangle(ctx, x, y) {
    const left_square = createSquare(
      ctx,
      x * triangle_base - square_size / 2,
      y * triangle_height * 2 - square_size / 2
    );
    const center_square = createSquare(
      ctx,
      x * triangle_base + triangle_base / 2 - square_size / 2,
      y * triangle_height * 2 + triangle_height - square_size / 2
    );
    const right_square = createSquare(
      ctx,
      x * triangle_base + triangle_base - square_size / 2,
      y * triangle_height * 2 - square_size / 2
    );

    return [left_square, center_square, right_square];
  }

  function animateTriangle(triangle) {
    const duration = anime.random(300, 600);
    const animeLeftSquare = anime
      .timeline({
        targets: triangle,
        easing: "easeInOutQuad",
        update: anim => {
          anim.animatables.map(({ target }) => target.draw());
        }
      })
      .add({
        alpha: 1,
        duration
      })
      .add({
        alpha: 1,
        duration: hold_duration
      })
      .add({
        alpha: 0,
        duration
      });
  }

  function drawBackground(canvas) {
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.globalAlpha = lines_opacity;
    ctx.strokeStyle = lines_color;
    ctx.fillStyle = square_color;
    drawHorizontalLine(canvas, ctx);
    drawLeftLine(canvas, ctx);
    drawRightLine(canvas, ctx);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function drawHorizontalLine(canvas, ctx) {
    const line_count = canvas.height / triangle_height;

    for (let i = 1; i <= line_count; i++) {
      drawLine(i * triangle_height);
    }

    function drawLine(y) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    }
  }
  function drawRightLine(canvas, ctx) {
    const line_count = canvas.width / triangle_base;

    let starting_point =
      (triangle_base / 2) * (canvas.height / triangle_height); // get width of end first line
    starting_point = Math.floor(starting_point / triangle_base);
    for (let i = -starting_point; i < line_count; i++) {
      drawLine(i * triangle_base);
    }

    function drawLine(x) {
      ctx.moveTo(x, 0);
      ctx.lineTo(
        x + (triangle_base / 2) * (canvas.height / triangle_height),
        canvas.height
      );
    }
  }
  function drawLeftLine(canvas, ctx) {
    const line_count = canvas.width / triangle_base;
    let starting_point =
      (triangle_base / 2) * (canvas.height / triangle_height); // get width of end first line
    starting_point = Math.floor(starting_point / triangle_base);
    for (let i = -starting_point; i < line_count; i++) {
      drawLine(i * triangle_base);
    }
    function drawLine(x) {
      ctx.moveTo(x, 0);
      ctx.lineTo(
        x - (triangle_base / 2) * (canvas.height / triangle_height),
        canvas.height
      );
    }
  }
})();
