
export default class MapObjects {

    constructor() {
    }

    static preload(scene) {
        scene.load.image('tiles', 'assets/images/garden-map/assets_sheet-all.png');
        scene.load.tilemapTiledJSON('map', 'assets/images/garden-map/garden_map.json');
    }

    create(scene) {
        const map = scene.make.tilemap({ key: 'map' });
        scene.map = map;

        const tileset = map.addTilesetImage('assets_sheet-all', 'tiles', 16, 16, 0, 0);
        const layer_bg = map.createLayer('bg', tileset, 0, 0);
        const layer_bg_sprites = map.createLayer('bg_sprites', tileset, 0, 0);
        const layer1 = map.createLayer('Tile Layer 1', tileset, 0, 0);

        layer1.setCollisionByProperty({ collide: true });
        layer_bg_sprites.setCollisionByProperty({ collide: true });
        layer_bg.setCollisionByProperty({ collide: true });

        scene.matter.world.convertTilemapLayer(layer_bg);
        scene.matter.world.convertTilemapLayer(layer_bg_sprites);
        scene.matter.world.convertTilemapLayer(layer1);

        this.layer1 = layer1;
    }

    update(scene) {
    }

    getTileLayer() {
        return this.layer1;
    }
}