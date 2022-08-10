import kaboom from "kaboom";

const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;
const SPEED = 480;

// initialize context
kaboom();

// load assets
loadSprite("fish", "sprites/fish.png");
loadSprite("fosh", "sprites/fosh1.png");
loadSound("explode", "sounds/explode.mp3");
scene("start", (score) => {

	add([
		sprite("fish"),
		pos(width() / 2, height() / 2 - 80),
		scale(2),
		origin("center"),
	]);

  	add([
		text("press to space to play."),
		pos(width() / 2, height() / 3 + 80),
		scale(1),
		origin("center"),
	]);

	// go back to game with space is pressed
	onKeyPress("space", () => go("game"));
	onClick(() => go("game"));

});

scene("game", () => {

	// define gravity
	gravity(2400);

	// add a game object to screen
	const player = add([
		// list of components
		sprite("fish"),
		pos(80, 40),
		area(),
		body(),
	]);

	// floor
	add([
		rect(width(), FLOOR_HEIGHT),
		outline(4),
		pos(0, height()),
		origin("botleft"),
		area(),
		solid(),
		color(127, 200, 255),
	]);

	function jump() {
		if (player.grounded()) {
			player.jump(JUMP_FORCE);
		}
	}

	// jump when user press space
	onKeyPress("space", jump);
	onClick(jump);

	function spawnTree() {

		// add tree obj
		add([
  		sprite("fosh"),
			area(),
			outline(4),
			pos(width(), height() - FLOOR_HEIGHT),
			origin("botleft"),
			color(255, 180, 255),
			move(LEFT, SPEED),
			"tree",
		]);

		// wait a random amount of time to spawn next tree
		wait(rand(0.5, 1.5), spawnTree);

	}

	// start spawning trees
	spawnTree();

	// lose if player collides with any game obj with tag "tree"
	player.onCollide("tree", () => {
		// go to "lose" scene and pass the score
		go("lose", score);
		play("explode");
		addKaboom(player.pos);
	});

	// keep track of score
	let score = 0;

	const scoreLabel = add([
		text(score),
		pos(24, 24),
	]);

	// increment score every frame
	onUpdate(() => {
		score++;
		scoreLabel.text = score;
	});

});

scene("lose", (score) => {

	add([
		sprite("fish"),
		pos(width() / 2, height() / 5 - 80),
		scale(2),
		origin("center"),
	]);

	// display score
	add([
		text(score),
		pos(width() / 2, height() / 3 + 80),
		scale(2),
		origin("center"),
	]);
  	add([
		text("Your score is: "),
		pos(width() / 2, height() / 6 + 80),
		scale(2),
		origin("center"),
	]);
  	add([
		text("press to space play again"),
		pos(width() / 2, height() / 2 + 80),
		scale(1),
		origin("center"),
	]);

	// go back to game with space is pressed
	onKeyPress("space", () => go("game"));
	onClick(() => go("game"));

});

go("start");