import MainScene from "./MainScene.js";

const config = {
  width: 256,
  height: 256,
  backgroundColor: '#999999',
  type: Phaser.AUTO,
  parent: 'tmbday-game-2025',
  scene: [MainScene],
  scale: {
    zoom: 3,
  },
  physics: {
    default: 'matter',
    matter: {
      debug: false,
      gravity: { y: 0 },
    }
  },
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin.default,
        key: 'matterCollision',
        mapping: 'matterCollision'
      }
    ]
  }
}

new Phaser.Game(config);