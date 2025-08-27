import Phaser from "phaser";

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 300 },
			debug: false,
		},
	},
	scene: {
		preload: preload,
		create: create,
		update: update,
	},
	parent: "game-container",
};
const game = new Phaser.Game(config);

let player;
let cursors;
let platforms;
let stars;
let score = 0;
let scoreText;
let bombs;
let gameOver = false;

function preload() {
	this.load.image("sky", "assets/sky.png");
	this.load.image("ground", "assets/platform.png");
	this.load.image("star", "assets/star.png");
	this.load.image("bomb", "assets/bomb.png");
	this.load.spritesheet("dude", "assets/dude.png", { frameWidth: 32, frameHeight: 48 });
}

function create() {
	// Background
	this.add.image(400, 300, "sky");

	// Input
	cursors = this.input.keyboard.createCursorKeys();

	// Player
	player = this.physics.add.sprite(100, 450, "dude");
	player.setBounce(0.2);
	player.setCollideWorldBounds(true);
	player.body.setGravityY(300);

	// Player Animations
	this.anims.create({
		key: "left",
		frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
		frameRate: 10,
		repeat: -1,
	});

	this.anims.create({
		key: "turn",
		frames: [{ key: "dude", frame: 4 }],
		frameRate: 20,
	});

	this.anims.create({
		key: "right",
		frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
		frameRate: 10,
		repeat: -1,
	});

	// Platforms
	platforms = this.physics.add.staticGroup();
	platforms.create(400, 568, "ground").setScale(4).refreshBody();
	platforms.create(600, 400, "ground");
	platforms.create(50, 250, "ground");
	platforms.create(750, 220, "ground");

	// Stars
	stars = this.physics.add.group({
		key: "star",
		repeat: 11,
		setXY: { x: 12, y: 0, stepX: 70 },
	});

	stars.children.iterate(function (child) {
		child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
	});

	// Score Text
	scoreText = this.add.text(16, 16, "score: 0", { fontSize: "32px", fill: "#000" });

	// Bombs
	bombs = this.physics.add.group();

	// Physics Colliders
	this.physics.add.collider(player, platforms);
	this.physics.add.collider(stars, platforms);
	this.physics.add.overlap(player, stars, collectStar, null, this);
	this.physics.add.collider(bombs, platforms);
	this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update() {
	if (gameOver) {
		return;
	}

	if (cursors.left.isDown) {
		player.setVelocityX(-160);
		player.anims.play("left", true);
	} else if (cursors.right.isDown) {
		player.setVelocityX(160);
		player.anims.play("right", true);
	} else {
		player.setVelocityX(0);
		player.anims.play("turn");
	}

	if (cursors.up.isDown && player.body.touching.down) {
		player.setVelocityY(-530);
	}
}

function collectStar(player, star) {
	star.disableBody(true, true);

	updateScore();

	if (stars.countActive(true) === 0) {
		resetStars();
		createBomb(player);
	}
}

function updateScore() {
	score += 10;
	scoreText.setText("Score: " + score);
}

function resetStars() {
	stars.children.iterate((child) => {
		child.enableBody(true, child.x, 0, true, true);
	});
}

function createBomb(player) {
	const xPosition = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
	const bomb = bombs.create(xPosition, 16, "bomb");
	bomb.setBounce(1);
	bomb.setCollideWorldBounds(true);
	bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
}

function hitBomb(player) {
	this.physics.pause();
	player.setTint(0xff0000);
	player.anims.play("turn");

	gameOver = true;
}
