
// Ref: https://codepen.io/rexrainbow/pen/ExZLoWL
// Meow audio Source: https://pixabay.com/sound-effects/search/meow/?duration=0-30 & https://mixkit.co/free-sound-effects/cat/

const COLOR_PRIMARY = 0x6B8799;
const COLOR_LIGHT = 0xA5BBC7;

export default class Speech {

    constructor() {
    }

    static preload(scene) {
        scene.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
        scene.load.image('nextPage', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png');
        scene.load.bitmapFont('gothic', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/fonts/gothic.png', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/fonts/gothic.xml');
        scene.load.audio('meow1', 'assets/audio/meow1.wav');
        scene.load.audio('meow2', 'assets/audio/meow2.mp3');
        scene.load.audio('meow3', 'assets/audio/meow3.mp3');
    }

    create(scene) {
        this.meow1= scene.sound.add('meow1');
        this.meow2= scene.sound.add('meow2');
        this.meow3= scene.sound.add('meow3');
        this.textbox = createTextBox(scene);
        this.hide();
    }

    isShowing() {
        return this.showing;
    }

    show(text) {
        this.showing = true;
        this.textbox.visible = true;

        console.log("Showing " + text);
        this.textbox.start(text, 50);
        this.playSound();
    }

    hide() {
        this.showing = false;
        this.textbox.visible = false;
    }

    update(scene) {
        if (
            Phaser.Input.Keyboard.JustDown(this.inputKeys.enter) || 
            Phaser.Input.Keyboard.JustDown(this.inputKeys.up) ||
            Phaser.Input.Keyboard.JustDown(this.inputKeys.down) || 
            Phaser.Input.Keyboard.JustDown(this.inputKeys.left) ||
            Phaser.Input.Keyboard.JustDown(this.inputKeys.right)
        ) {
            console.log("Enter detected");
            this.next(this.textbox);
        }
    }

    next(textbox) {
        var icon = textbox.getElement('action').setVisible(false);
        textbox.resetChildVisibleState(icon);
        if (textbox.isTyping) {
            textbox.stop(true);
        } else if (textbox.isLastPage) {
            this.hide()
        } else {
            textbox.typeNextPage();
        }
    }

    playSound() {
        // return; // TODO: Remove after development
        let random = Math.floor(Math.random() * 3);
        switch(random){
            case 0: this.meow1.play(); break;
            case 1: this.meow2.play(); break;
            case 2: this.meow3.play(); break;
        }
    }

}

var createTextBox = function (scene) {
    var x = 10;
    var y = 210;
    var wrapWidth = 190;
    var textBox = scene.rexUI.add.textBox({
        x: x,
        y: y,

        background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 10, COLOR_PRIMARY)
            .setStrokeStyle(2, COLOR_LIGHT),

        icon: null,

        text: scene.add.bitmapText(0, 0, 'gothic').setFontSize(12).setMaxWidth(wrapWidth),

        action: scene.add.image(0, 0, 'nextPage').setTint(COLOR_LIGHT).setVisible(false),

        space: {
            left: 4,
            right: 4,
            top: 2,
            bottom: 2,
            icon: 5,
            text: 5,
        },

        page: {
            maxLines: 2
        }
    })
        .setOrigin(0)
        .layout();

    textBox.setInteractive()
        .on('pointerdown', function () {
            // Do nothing
        }, textBox)
        .on('pageend', function () {
            var icon = this.getElement('action').setVisible(true);
            if (this.isLastPage) {
                return;
            }

            this.resetChildVisibleState(icon);
            icon.y -= 30;
            var tween = scene.tweens.add({
                targets: icon,
                y: '+=30', // '+=100'
                ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 500,
                repeat: 0, // -1: infinity
                yoyo: false
            });
        }, textBox);
    //.on('type', function () {
    //})
    return textBox;
}
