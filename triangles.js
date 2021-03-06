(() => {
  const TRIANGLE_SELECTOR = ".triangles";

  const square_color = "#FFF";
  const lines_color = "#FFF";
  const lines_opacity = 0.2;
  let triangle_height = 50;
  let triangle_base = 50;
  let square_size = 5;
  const hold_duration = 1500;
  const CANVASES = [];

  window.setTriangleSize = (height, base, square) => {
    triangle_height = height;
    triangle_base = base;
    square_size = square;
  };

  mountCanvas();

  CANVASES.map(canv => {
    startAnimation(canv);
  });

  window.addEventListener("resize", debounce(updateCanvasSize, 200), false);

  function debounce(func, delay) {
    let inDebounce;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(inDebounce);
      inDebounce = setTimeout(() => func.apply(context, args), delay);
    };
  }

  function mountCanvas() {
    [...document.querySelectorAll(TRIANGLE_SELECTOR)].map(elem => {
      const width = elem.offsetWidth;
      const height = elem.offsetHeight;
      const canvas = document.createElement("canvas");
      elem.appendChild(canvas);
      setCanvasSize(canvas, width, height);
      CANVASES.push(canvas);
    });
  }

  function updateCanvasSize() {
    console.log("update");
    // Resize all canvases
    [...document.querySelectorAll(TRIANGLE_SELECTOR)].map(elem => {
      if (elem.childNodes) {
        const width = elem.offsetWidth;
        const height = elem.offsetHeight;
        const canvas = elem.childNodes[0];

        if (canvas.tagName && canvas.tagName.toLowerCase() === "canvas") {
          setCanvasSize(canvas, width, height);
        }
      }
    });
  }

  function setCanvasSize(canvas, width, height) {
    canvas.width = width * 2;
    canvas.height = height * 2;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    const ctx = canvas.getContext("2d");
    ctx.scale(2, 2);
  }

  function resetCanvas(canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground(canvas);
  }

  function startAnimation(canvas) {
    const ctx = canvas.getContext("2d");

    var render = anime({
      duration: Infinity,
      update: function() {
        resetCanvas(canvas);
      }
    });

    // Every some seconds with some chance start animation
    setInterval(() => {
      const maxX = Math.floor(canvas.width / triangle_base / 2);
      const maxY = Math.floor(canvas.height / (triangle_height * 2) / 2);
      const rnd = Math.random();
      const chance = 0.9;
      if (rnd < chance) {
        // Select random triangle

        const x = Math.floor(Math.random() * maxX);
        const y = Math.floor(Math.random() * maxY);

        // Animate triangle
        const base_triangle = createTriangle(ctx, x, y);

        // Select random amount (1-6) of closest triangles
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
        animateTriangle([...base_triangle], [...closest_triangles]);
      }
    }, 1500);
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

  function animateTriangle(base, closest) {
    const easing = "easeInOutQuad";
    const duration = anime.random(300, 600);
    const closest_duration = anime.random(300, 600);
    const update = anim => {
      anim.animatables.map(({ target }) => target.draw());
    };

    anime
      .timeline({
        easing
      })
      .add({
        targets: base,
        update,
        alpha: 1,
        duration
      })
      .add(
        {
          targets: closest,
          update,
          alpha: 1,
          duration: closest_duration
        },
        "+=" + closest_duration / 2
      )
      .add({
        alpha: 1,
        easing: "linear",
        targets: [...base, ...closest],
        update,
        duration: hold_duration
      })
      .add({
        alpha: 0,
        easing,
        targets: [...base, ...closest],
        update,
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
