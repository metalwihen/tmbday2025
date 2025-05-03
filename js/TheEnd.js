// Ref: https://www.pngegg.com/en/png-fhvel

const COLOR_PRIMARY = 0xFEB1D3;
const COLOR_LIGHT = 0xFCDEEC;

export default class TheEnd {

    constructor() {
    }

    static preload(scene) {
        scene.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
        scene.load.bitmapFont('gothic', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/fonts/gothic.png', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/fonts/gothic.xml');
        scene.load.audio('end_win', 'assets/audio/end_win.mp3');
    }

    create(scene) {
        let text = "Hooray! You caught the little rascal! \n&\nHAPPY BIRTHDAY SISTER!"

        this.textbox = createTextBox(scene);
        this.textbox.visible = false;
        this.textbox.start(text, 200);


        this.song= scene.sound.add('end_win');
    }

    show(){
        this.textbox.visible = true;
        this.song.play();
    }
}

var createTextBox = function (scene) {
    var x = 10;
    var y = 70;
    var wrapWidth = 210;
    var textBox = scene.rexUI.add.textBox({
        x: x,
        y: y,

        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 10, COLOR_PRIMARY)
            .setStrokeStyle(2, COLOR_LIGHT),

        icon: null,

        text: scene.add.bitmapText(0, 0, 'gothic').setFontSize(12).setMaxWidth(wrapWidth),

        action: null, 

        space: {
            left: 10,
            right: 20,
            top: 20,
            bottom: 20,
            icon: 0,
            text: 30,
        },

        page: {
            maxLines: 10
        }
    })
        .setOrigin(0)
        .layout();

    textBox.setInteractive()
    return textBox;
}
