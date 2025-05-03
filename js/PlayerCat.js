export default class PlayerCat extends Phaser.Physics.Matter.Sprite {

    constructor(data) {
        let { scene, x, y, texture, frame } = data;
        super(scene.matter.world, x, y, texture, frame);
        this.scene.add.existing(this);

        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        var playerCollider = Bodies.circle(this.x, this.y, 3, { isSensor: false, label: "playerCatCollider" });
        var playerSensor = Bodies.circle(this.x, this.y, 12, { isSensor: true, label: "playerCatSensor" });
        this.playerSensor = playerSensor;
        const compoundBody = Body.create({
            parts: [playerCollider, playerSensor],
            frictionAir: 0.35,
        })
        this.setExistingBody(compoundBody);
        this.setFixedRotation();
    }

    static preload(scene) {
        scene.load.atlas('player_lily', 'assets/images/cat/player_lily.png', 'assets/images/cat/player_lily_atlas.json');
        scene.load.animation('player_lily_anim', 'assets/images/cat/player_lily_anim.json');
    }

    move(scene, target) {
        console.log("move cat to " + target.x + ", " + target.y);

        let currentPlayer = this;
        let currentX = this.x;
        let currentY = this.y; 

        let moveX = 0;
        if (target.x == this.x) {
            moveX = 0;
        } else {
            moveX = target.x - this.x;
        } 

        let moveY = 0;
        if (target.y == this.y) {
            moveY = 0;
        } else {
            moveY = target.y - this.y;
        } 
        
        let duration = 100;

        console.log("move cat by " + moveX + ", " + moveY);

        if (this.current_tween && this.current_tween.isActive()) {
            return;
        }

        this.current_tween = scene.tweens.add({
            targets: this,
            x: currentX + moveX,
            y: currentY + moveY,
            duration: duration, 
            ease: "Linear", // Smooth movement
            onStart: function () {
                currentPlayer.anims.play("walk_down", true); // Play animation
            },
            onComplete: function () {
                currentPlayer.anims.stop(); // Stop animation after movement
                currentPlayer.setPosition(target.x, target.y);
            }
        });
    }

    update(scene) {
    }
}