import Phaser from "phaser";

export default class Game extends Phaser.Scene {
  private stickman!: Phaser.Physics.Arcade.Sprite;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private speed!: number;
  private platforms?: Phaser.Physics.Arcade.StaticGroup;
  private platform!: Phaser.Physics.Arcade.Image;

  private head!: Phaser.Physics.Matter.Sprite;
  private body!: Phaser.Physics.Matter.Sprite;
  private leftArm!: Phaser.Physics.Matter.Sprite;
  private rightArm!: Phaser.Physics.Matter.Sprite;
  private leftLeg!: Phaser.Physics.Matter.Sprite;
  private rightLeg!: Phaser.Physics.Matter.Sprite;
  /* private head!: Phaser.Physics.Arcade.Sprite;
  private body!: Phaser.Physics.Arcade.Sprite;
  private leftArm!: Phaser.Physics.Arcade.Sprite;
  private rightArm!: Phaser.Physics.Arcade.Sprite;
  private leftLeg!: Phaser.Physics.Arcade.Sprite;
  private rightLeg!: Phaser.Physics.Arcade.Sprite; */

  constructor() {
    super("game-scene");
  }

  preload() {
    /* this.load.atlas('idle','./src/assets/images/idle.png','./src/assets/images/idle_atlas.json') */
    this.load.atlas(
      "stickman",
      "./src/assets/images/stickman.png",
      "./src/assets/images/stickman.json"
    );

    this.load.image('hat',"./src/assets/images/item_hat.png")

    this.load.image("platform", "./src/assets/images/collider.png");
    /* this.load.image("head", "./src/assets/images/head.png");
    this.load.image("body", "./src/assets/images/body.png");
    this.load.image("left_arm", "./src/assets/images/left_arm.png");
    this.load.image("right_arm", "./src/assets/images/right_arm.png");
    this.load.image("left_leg", "./src/assets/images/left_leg.png");
    this.load.image("right_leg", "./src/assets/images/right_leg.png"); */
  }

  create() {
    // Add any create logic here
    /* this.platform  = this.physics.add.image(500,720,'platform')
    this.platform.setImmovable(true)
    this.platform.setTint(0xdd3333)
    this.platform.setCollideWorldBounds(true); */
    /*STICKMAN*/
    //platforms

    /* this.add.text(200, 200, "What's poppin!", {
      fontFamily: "Arial",
      fontSize: "32px",
      color: "black",
    }); */
    this.physics.world.setBounds(35, 0, 1320, 720);
    

    this.platforms = this.physics.add.staticGroup();
    const ground = this.platforms.create(
      640,
      700,
      "platform"
    ) as Phaser.Physics.Arcade.Sprite;
    ground.setScale(1).refreshBody().setImmovable(true);

    this.stickman = this.physics.add.sprite(500, 620, "stickman");
    this.stickman.setBounce(0);
    this.stickman.setCollideWorldBounds(true);
    

    const hat = this.add.sprite(200, 200, 'hat');
    hat.setScale(.25,.25)

    this.add.existing(hat)

    hat.x = this.stickman.x + 4
    hat.y = this.stickman.y + -53

    this.events.on('update', () => {
      // Update the hat's position relative to the character's position
      hat.x = this.stickman.x + 3;
      hat.y = this.stickman.y + -55;
    
      // Update the hat's rotation to match the character's rotation if needed
      hat.rotation = this.stickman.rotation;
    });

    this.anims.create({
      key: "idleAnim",
      frames: this.anims.generateFrameNames("stickman", {
        prefix: "idle",
        start: 1,
        end: 27,
        zeroPad: 4,
        suffix: ".png",
      }),
      frameRate: 30,
      repeat: -1,
    });
    this.anims.create({
      key: "kickAnim",
      frames: this.anims.generateFrameNames("stickman", {
        prefix: "kick",
        start: 50,
        end: 71,
        zeroPad: 4,
        suffix: ".png",
      }),
      frameRate: 100,
      repeat: 0,
    });

    this.stickman.anims.play("idleAnim");

    this.speed = 5;

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    const qKey = this.input.keyboard!.addKey("Q");
    qKey.on("down", () => {
      this.stickman!.anims.play("kickAnim");
    });

    this.stickman.on(
      "animationcomplete",
      (animation: Phaser.Animations.Animation) => {
        if (animation.key === "kickAnim") {
          this.stickman!.anims.play("idleAnim");
        }
      }
    );

    this.physics.add.collider(this.stickman, this.platforms);
  }

  update() {
    // Add any update logic here
    // Define the animation using frame names

    if (this.cursors?.left?.isDown) {
      this.stickman.x -= this.speed;
      this.stickman.setScale(-1, 1);
    } else if (this.cursors?.right.isDown) {
      this.stickman.setScale(1, 1);
      this.stickman.x += this.speed;
    } else if (this.cursors?.down.isDown) {
      this.stickman.y += this.speed;
    } else if (this.cursors?.up.isDown) {
      this.stickman.y -= this.speed;
    }
  }
}
