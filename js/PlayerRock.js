export default class PlayerRock extends Phaser.Physics.Matter.Sprite {

    constructor(data) {
        let { scene, x, y, texture } = data;
        super(scene.matter.world, x, y, texture);
        this.scene.add.existing(this);

        const { Body, Bodies } = Phaser.Physics.Matter.Matter;
        var playerCollider = Bodies.circle(this.x, this.y, 15, { isSensor: false, label: "playerRockCollider" });
        var playerSensor = Bodies.circle(this.x, this.y, 20, { isSensor: true, label: "playerRockSensor" });
        this.playerSensor = playerSensor;
        const compoundBody = Body.create({
            parts: [playerCollider, playerSensor],
            frictionAir: 1.0,
        })
        this.setExistingBody(compoundBody);
        this.setFixedRotation();
    }

    static preload(scene) {
        scene.load.image('rock', 'assets/images/objects/rock.png');
    }
}
