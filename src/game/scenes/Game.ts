import { Scene } from "phaser";

export class Game extends Scene {
	private camera: Phaser.Cameras.Scene2D.Camera;
	private background: Phaser.GameObjects.Image;
	private msg_text: Phaser.GameObjects.Text;
	private stars: Phaser.Physics.Arcade.Group;

	constructor() {
		super("Game");
	}

	create() {
		this.camera = this.cameras.main;
		this.camera.setBackgroundColor(0x00ff00);

		this.background = this.add.image(512, 384, "background");
		this.background.setAlpha(0.5);

		this.msg_text = this.add.text(
			512,
			384,
			"Make something fun!\nand share it with us:\nsupport@phaser.io",
			{
				fontFamily: "Arial Black",
				fontSize: 38,
				color: "#ffffff",
				stroke: "#000000",
				strokeThickness: 8,
				align: "center",
			}
		);
		this.msg_text.setOrigin(0.5);

		this.input.once("pointerdown", () => {
			this.scene.start("GameOver");
		});

		this.stars = this.physics.add.group({
			key: "star",
			repeat: 11,
			setXY: { x: 12, y: 0, stepX: 70 },
		});
	}

	// private rerenderStars() {
	// 	this.stars.children.iterate((child) => {
	// 		const star = child as Phaser.Physics.Arcade.Image;
	// 		star.enableBody(true, star.x, 0, true, true);
	// 		star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
	// 		return null;
	// 	});
	// }
}
