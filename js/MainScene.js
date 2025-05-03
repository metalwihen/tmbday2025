import PlayerMan from "./PlayerMan.js";
import PlayerCat from "./PlayerCat.js";
import PlayerRock from "./PlayerRock.js";
import Speech from "./Speech.js";
import TheEnd from "./TheEnd.js";
import Queue from "./Queue.js";
import MapObjects from "./MapObjects.js";

const STAGE_BEG = 1;
const STAGE_END = 5;

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
    this.stage = STAGE_BEG;
  }

  preload() {
    console.log("preload");
    MapObjects.preload(this);
    PlayerMan.preload(this);
    PlayerCat.preload(this);
    PlayerRock.preload(this);
    Speech.preload(this);
    TheEnd.preload(this);
  }

  create() {
    console.log("create");

    // Map Elements
    this.mapObjects = new MapObjects();
    this.mapObjects.create(this);

    // Player
    let player_keys = {
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
    };

    this.player_rock = new PlayerRock({ scene: this, x: 110, y: 230, texture: 'rock' });

    this.player_man = new PlayerMan({ scene: this, x: 105, y: 105, texture: 'man_running', frame: 'run_(5)' });
    this.player_man.inputKeys = this.input.keyboard.addKeys(player_keys, false, false);

    this.player_cat = new PlayerCat({ scene: this, x: 205, y: 10, texture: 'player_lily', frame: 'idle' });
    this.player_cat.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.I,
      down: Phaser.Input.Keyboard.KeyCodes.K,
      left: Phaser.Input.Keyboard.KeyCodes.J,
      right: Phaser.Input.Keyboard.KeyCodes.L,
    }, false, false);


    // Speech
    this.speechQueue = new Queue();
    this.speech = new Speech();
    this.speech.inputKeys = this.input.keyboard.addKeys(player_keys);
    this.speech.create(this);

    // The End
    this.theEnd = new TheEnd();
    this.theEnd.create(this);

    // Player Interactions with objects
    this.onMeetMapObject(this.player_cat.playerSensor);
    this.onMeetMapObject(this.player_man.playerSensor);
    this.onMeetMapObject(this.player_rock.playerSensor);

    // Welcome
    this.stage = STAGE_BEG;
    this.stage_beginning();
  }

  update() {
    console.log("update");
    if (this.stage == STAGE_END) {
      return;
    }

    if (!this.speech.isShowing() && !this.speechQueue.isEmpty) {
      this.speech.show(this.speechQueue.dequeue());
    }
    this.player_man.update(this);
    this.player_cat.update(this);
    this.player_rock.update(this);
    this.speech.update(this);
    this.mapObjects.update(this);

    this.move_cat_if_man_nearby();
  }

  onMeetMapObject(playerCollider) {
    this.matterCollision.addOnCollideStart({
      objectA: [playerCollider],
      callback: other => {
        // console.log("START COLLISION b/w " + other.bodyA.label + " & " + other.bodyB.label);

        let currentObjectLabel = other.bodyA.label;
        let otherObjectLabel = other.bodyB.label;

        if (currentObjectLabel == "playerManSensor") {
          if (otherObjectLabel == "playerCatSensor") {
            this.stage_ending();
          }
        }

        if (otherObjectLabel.startsWith("map_object")) {

        }

      },
      context: this,
    });
  }

  isNearPosition(player, target, tolerance = 10) {
    return Math.abs(player.x - target.x) <= tolerance && Math.abs(player.y - target.y) <= tolerance;
  }

  move_cat_if_man_nearby() {
    let location_left_bottom_corner_tree = { "x": 150, "y": 200 };
    let location_left_bottom_corner_fruit_garden = { "x": 160, "y": 150 };
    let location_right_bottom_corner_fruit_garden = { "x": 240, "y": 200 };
    let location_left_top_corner_fruit_garden = { "x": 160, "y": 10 };
    let location_right_top_corner_fruit_garden = { "x": 240, "y": 10 };

    let isRockBlockingLeftPath =
      this.isNearPosition(this.player_rock, location_left_bottom_corner_fruit_garden, 15);

    let isRockBlockingRightPath =
      this.isNearPosition(this.player_rock, location_right_bottom_corner_fruit_garden, 15);

    // console.log("Is rock blocking? " + isRockBlockingLeftPath + " or " + isRockBlockingRightPath);
    if (isRockBlockingLeftPath || isRockBlockingRightPath) {
      this.player_cat.move(location_right_top_corner_fruit_garden);
      return;
    }

    if (this.isNearPosition(this.player_man, location_left_bottom_corner_fruit_garden)) {
      console.log("Player is near the left bottom position!");
      this.player_cat.move(this, location_right_top_corner_fruit_garden);
    }
    if (this.isNearPosition(this.player_man, location_right_bottom_corner_fruit_garden)) {
      console.log("Player is near the right bottom position!");
      this.player_cat.move(this, location_left_top_corner_fruit_garden);
    }
    if (this.isNearPosition(this.player_man, location_left_top_corner_fruit_garden)) {
      console.log("Player is near the left top position!");
      this.player_cat.move(this, location_right_bottom_corner_fruit_garden);
    }
    if (this.isNearPosition(this.player_man, location_right_top_corner_fruit_garden)) {
      console.log("Player is near the right top position!");
      this.player_cat.move(this, location_left_bottom_corner_tree);
    }
  }

  stage_beginning() {
    this.speechQueue.enqueue("The cat is out of the house! Help me catch it!")
    this.speechQueue.enqueue("Oh, and tap ASDF to move me!");
  }

  stage_ending() {
    this.stage = STAGE_END;
    this.speech.hide();
    this.theEnd.show();
  }

  moveItemOnHunt(objectKey) {
    let otherObject = this.mapObjects.getObjectMap().get(objectKey);
    otherObject.setPosition(168, 45);
    otherObject.setCollisionCategory(null);
  }
}

