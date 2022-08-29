window.addEventListener('load', () => {

	const canvasHolder = document.querySelector('.canvas-holder');
	setTimeout(() => {
		canvasHolder.classList.add('canvas-holder--w100')
	}, 1000)

	//---------------------------------------
	// Set up ball options
	//---------------------------------------

	const imgBalls = [
		'images/balls/01.svg',
		'images/balls/02.svg',
		'images/balls/03.svg',
		'images/balls/04.svg',
		'images/balls/05.svg',
		'images/balls/06.svg',
		'images/balls/07.svg',
		'images/balls/08.svg',
		'images/balls/09.svg'
	]

	let canvas;
	let ctx;
	let vel_x;
	let vel_y;
	let balls = [];
	let ballCount = imgBalls.length; // How many balls
	let DAMPING = 0.25; // Damping
	let GRAVITY = 0.01; // Gravity strength
	let SPEED = 6.5; // Ball speed
	let ballAdditionTime = 100; // How fast are balls added
	let ballSrc = imgBalls; // Ball image source
	let topOffset = 90; // Adjust this for initial ball spawn point
	let xOffset = 0; // left offset
	let yOffset = 0; // bottom offset
	let ballDensity = 30; // How dense are the balls
	let ballSize1 = 200; // Ball 1 size
	let ballSize2 = 180; // Ball 2 size
	let ballSize3 = 140; // Ball 3 size
	let ballSize4 = 120; // Ball 4 size
	let ballSize5 = 80; // Ball 5 size
	let ballSize6 = 62; // Ball 6 size
	let canvasWidth = 1500; // Canvas width
	let canvasHeight = 1000; // Canvas height
	let stackBall = true; // Stack the balls (or false is overlap)
	let stopAnimation = false;
	let isDragging = false;
	let mouseDraggingStart = null;
	let ballDraggingStart = null;
	let draggingBall = null;


	//---------------------------------------
	// do the animation
	//---------------------------------------

	window.requestAnimFrame =
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		function (callback) {
			window.setTimeout(callback, ballAdditionTime);
		};

	//---------------------------------------
	// set up the ball
	//---------------------------------------

	const Ball = function (x, y, radius, num) {
		this.x = x;
		this.y = y;
		this.px = x;
		this.py = y;
		this.fx = 0;
		this.fy = 0;
		this.angle = 0;
		this.radius = radius;
		this.num = num;
		let random


		// Different ball sizes
		random = Math.round(Math.random() * imgBalls.length)

		if (random === 0) {
			this.width = ballSize1;
			this.height = ballSize1;
			if (stackBall) {
				this.radius = ballSize1 / 2;
			}
		} else if (random === 1 || random === 2) {
			this.width = ballSize2;
			this.height = ballSize2;
			if (stackBall) {
				this.radius = ballSize2 / 2;
			}
		} else if (random === 3 || random === 4) {
			this.width = ballSize3;
			this.height = ballSize3;
			if (stackBall) {
				this.radius = ballSize3 / 2;
			}
		} else if (random === 5 || random === 6) {
			this.width = ballSize4;
			this.height = ballSize4;
			if (stackBall) {
				this.radius = ballSize4 / 2;
			}
		} else if (random === 7 || random === 8) {
			this.width = ballSize5;
			this.height = ballSize5;
			if (stackBall) {
				this.radius = ballSize5 / 2;
			}
		} else {
			this.width = ballSize6;
			this.height = ballSize6;
			if (stackBall) {
				this.radius = ballSize6 / 2;
			}
		}
	};

	//---------------------------------------
	// Apply the physics
	//---------------------------------------

	Ball.prototype.applyForce = function (delta) {
		delta *= delta;
		this.fy += GRAVITY;
		this.x += this.fx * delta;
		this.y += this.fy * delta;
		this.fx = this.fy = 0;
	};

	//---------------------------------------
	// Newtonian motion algorithm
	//---------------------------------------

	Ball.prototype.velocity = function () {
		let nx = this.x * 2 - this.px;
		let ny = this.y * 2 - this.py;
		this.px = this.x;
		this.py = this.y;
		this.x = nx;
		this.y = ny;
	};

	//---------------------------------------
	// Ball prototype
	//---------------------------------------

	Ball.prototype.draw = function (ctx) {
		img = new Image();
		ballSrc = imgBalls[this.num];
		img.src = ballSrc;

		if (this.y < 440) {
			ctx.save();
			ctx.translate(+this.x, +this.y);
			ctx.rotate(this.angle++ * Math.PI / 180);
			ctx.rotate(Math.PI / 180);
			ctx.translate(-this.x, -this.y);
		}

		if (stackBall) {
			ctx.drawImage(
				img,
				this.x - this.radius - xOffset,
				this.y - this.radius - yOffset,
				this.width,
				this.height,
			);
		} else {
			ctx.drawImage(
				img,
				this.x - xOffset,
				this.y - yOffset,
				this.width,
				this.height
			);
		}

		ctx.restore()
	};

	//---------------------------------------
	// resolve collisions (ball on ball)
	//---------------------------------------

	function resolveCollisions(ip) {
		let i = balls.length;
		while (i--) {
			let ball_1 = balls[i];
			let n = balls.length;
			while (n--) {
				if (n == i) continue;
				let ball_2 = balls[n];
				let diff_x = ball_1.x - ball_2.x;
				let diff_y = ball_1.y - ball_2.y;
				let length = diff_x * diff_x + diff_y * diff_y;
				let dist = Math.sqrt(length);
				let real_dist = dist - (ball_1.radius + ball_2.radius);

				if (real_dist < 0) {
					let vel_x1 = ball_1.x - ball_1.px;
					let vel_y1 = ball_1.y - ball_1.py;
					let vel_x2 = ball_2.x - ball_2.px;
					let vel_y2 = ball_2.y - ball_2.py;
					let depth_x = diff_x * (real_dist / dist);
					let depth_y = diff_y * (real_dist / dist);
					ball_1.x -= depth_x * 0.5;
					ball_1.y -= depth_y * 0.5;
					ball_2.x += depth_x * 0.5;
					ball_2.y += depth_y * 0.5;

					if (ip) {
						let pr1 = (DAMPING * (diff_x * vel_x1 + diff_y * vel_y1)) / length;
						let pr2 = (DAMPING * (diff_x * vel_x2 + diff_y * vel_y2)) / length;
						vel_x1 += pr2 * diff_x - pr1 * diff_x;
						vel_x2 += pr1 * diff_x - pr2 * diff_x;
						vel_y1 += pr2 * diff_y - pr1 * diff_y;
						vel_y2 += pr1 * diff_y - pr2 * diff_y;
						ball_1.px = ball_1.x - vel_x1;
						ball_1.py = ball_1.y - vel_y1;
						ball_2.px = ball_2.x - vel_x2;
						ball_2.py = ball_2.y - vel_y2;
					}
				}
			}
		}
	}

	//---------------------------------------
	// Bounce off the walls
	//---------------------------------------

	function checkWalls() {
		let i = balls.length;
		while (i--) {
			let ball = balls[i];

			if (ball.x < ball.radius) {
				let vel_x = ball.px - ball.x;
				ball.x = ball.radius;
				ball.px = ball.x - vel_x * DAMPING;
			} else if (ball.x + ball.radius > canvas.width) {
				vel_x = ball.px - ball.x;
				ball.x = canvas.width - ball.radius;
				ball.px = ball.x - vel_x * DAMPING;
			}

			// Ball is new. So don't do collision detection until it hits the canvas.
			// (with an offset to stop it snapping)
			if (ball.y > 100) {
				if (ball.y < ball.radius) {
					let vel_y = ball.py - ball.y;
					ball.y = ball.radius;
					ball.py = ball.y - vel_y * DAMPING;
				} else if (ball.y + ball.radius > canvas.height) {
					vel_y = ball.py - ball.y;
					ball.y = canvas.height - ball.radius;
					ball.py = ball.y - vel_y * DAMPING;
				}
			}
		}
	}

	//---------------------------------------
	// Add a ball to the canvas
	//---------------------------------------

	function addBall(num) {
		let x = Math.random() * canvas.width;
		let y = -topOffset;
		let r = 30 + Math.random() * ballDensity;
		let diff_x = x;
		let diff_y = x;
		Math.sqrt(diff_x * diff_x + diff_y * diff_y);
		balls.push(new Ball(x, y, r, num));
	};


	//---------------------------------------
	// iterate balls
	//---------------------------------------

	function update() {
		let iter = 1;
		let delta = SPEED / iter;

		while (iter--) {
			let i = balls.length;

			while (i--) {
				balls[i].applyForce(delta);
				balls[i].velocity();
			}

			resolveCollisions();
			checkWalls();

			i = balls.length;

			while (i--) {
				balls[i].velocity();
				let ball = balls[i];
			}

			resolveCollisions();
			checkWalls();
		}

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		i = balls.length;

		while (i--) {
			balls[i].draw(ctx);
		}

		requestAnimFrame(update);
	}


	//---------------------------------------
	// Set up the canvas object
	//---------------------------------------

	function doBalls() {
		stopAnimation = false;
		canvas = document.getElementById("balls");
		ctx = canvas.getContext("2d");
		let $canvasDiv = document.querySelector('.canvas-holder');

		function respondCanvas() {
			canvas.height = $canvasDiv.clientHeight;
			canvas.width = $canvasDiv.clientWidth;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}

		respondCanvas();

		setTimeout(() => {
			respondCanvas()
		}, 1000);

		// Android friendly window resize
		let doit;

		function resizedw(appWidth) {
			window.innerWidth != appWidth;
			if (window.innerWidth != appWidth) {
				respondCanvas();
			}
			pastWidth = window.innerWidth;
		}

		let pastWidth = window.innerWidth;

		window.addEventListener('resize', () => {
			clearTimeout(doit);
			doit = setTimeout(() => {
				resizedw(pastWidth);
			}, 100);
		}, true);

		ballAdd();
	}

	function ballAdd() {
		let count = 1;
		let timer = setInterval(() => {
			addBallTimer();
		}, 100);

		let addBallTimer = () => {
			addBall(count % ballCount);
			count++;

			if (count === ballCount) {
				stopTimer();
			}
		};

		let stopTimer = () => clearInterval(timer);

		update();
	}

	function getMousePosition(e) {
		return {
			x: e.offsetX,
			y: e.offsetY
		};
	}

	function mouseMove(e) {
		if (e.which === 1 && isDragging && draggingBall) {
			const mouseCurrent = getMousePosition(e);
			const dx = mouseCurrent.x - mouseDraggingStart.x;
			const dy = mouseCurrent.y - mouseDraggingStart.y;

			draggingBall.x = ballDraggingStart.x + dx;
			draggingBall.y = ballDraggingStart.y + dy;
			draggingBall.px = draggingBall.x;
			draggingBall.py = draggingBall.y;
		}
	}

	function mouseDown(e) {
		if (e.which === 1) {
			mouseDraggingStart = getMousePosition(e);
			isDragging = true;
			draggingBall = balls.find(ball => Math.hypot(mouseDraggingStart.x - ball.x, mouseDraggingStart.y - ball.y) < ball.radius);
			if (draggingBall) {
				draggingBall.isDragging = true;
				ballDraggingStart = {
					x: draggingBall.x,
					y: draggingBall.y
				};
			}
		}
	}

	function mouseUp(e) {
		if (e.which === 1) {
			isDragging = false;
			if (draggingBall) {
				draggingBall.isDragging = false;
			}
		}
	}

	//if (window.matchMedia("(min-width: 577px)").matches) {
		doBalls();
		canvas.onmousemove = mouseMove;
		canvas.onmousedown = mouseDown;
		canvas.onmouseup = mouseUp;
	//}

});