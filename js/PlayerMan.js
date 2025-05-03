export default class PlayerMan extends Phaser.Physics.Matter.Sprite {

    constructor(data) {
        let { scene, x, y, texture, frame } = data;
        super(scene.matter.world, x, y, texture, frame);
        this.scene.add.existing(this);

        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        var playerCollider = Bodies.circle(this.x, this.y, 6, { isSensor: false, label: "playerManCollider" });
        var playerSensor = Bodies.circle(this.x, this.y, 12, { isSensor: true, label: "playerManSensor" });
        this.playerSensor = playerSensor;
        const compoundBody = Body.create({
            parts: [playerCollider, playerSensor],
            frictionAir: 0.35,
        })
        this.setExistingBody(compoundBody);
        this.setFixedRotation();
    }

    static preload(scene) {
        scene.load.atlas('man_running', 'assets/images/man/man_running.png', 'assets/images/man/man_running_atlas.json');
        scene.load.animation('man_running_anim', 'assets/images/man/man_running_anim.json');
    }

    update(scene) {
        const speed = 2.5;
        let playerVelocity = new Phaser.Math.Vector2();
        let playerAnimation = "run_down"
        if (this.inputKeys.left.isDown && this.inputKeys.down.isDown) {
            playerVelocity.x = -1;
            playerVelocity.y = 1;
            playerAnimation = "run_left_down";
        } else if (this.inputKeys.right.isDown && this.inputKeys.down.isDown) {
            playerVelocity.x = 1;
            playerVelocity.y = 1;
            playerAnimation = "run_right_down";
        } else if (this.inputKeys.left.isDown && this.inputKeys.up.isDown) {
            playerVelocity.x = -1;
            playerVelocity.y = -1;
            playerAnimation = "run_left_up";
        } else if (this.inputKeys.right.isDown && this.inputKeys.up.isDown) {
            playerVelocity.x = 1;
            playerVelocity.y = -1;
            playerAnimation = "run_right_up";
        } else if (this.inputKeys.up.isDown) {
            playerVelocity.y = -1;
            playerAnimation = "run_up";
        } else if (this.inputKeys.down.isDown) {
            playerVelocity.y = 1;
            playerAnimation = "run_down";
        } else if (this.inputKeys.left.isDown) {
            playerVelocity.x = -1;
            playerAnimation = "run_left";
        } else if (this.inputKeys.right.isDown) {
            playerVelocity.x = 1;
            playerAnimation = "run_right";
        }
        playerVelocity.normalize();
        playerVelocity.scale(speed);

        this.anims.play(playerAnimation, true);
        this.setVelocity(playerVelocity.x, playerVelocity.y);
    }
}