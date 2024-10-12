let gameScene = new Phaser.Scene('Game');

gameScene.init = function () { }

gameScene.preload = function () {
    this.load.image('box', './img/wood-box.png');
    this.load.image('coins', './img/star.png');
    this.load.spritesheet('player', './img/player_spritesheet.png', {
        frameWidth: 28,
        frameHeight: 30,
        margin: 1,
        pacing: 1
    });
    this.load.image('enemy', './img/bomb.png',);


    this.load.json('levelData', './data/levelData.json');
}

gameScene.create = function () {

    //Blacbox De que manera se puede mover el personaje con las teclas wasd teniendo una perpectiva desde arriba en la logica de caminar del persona(no funciono)
    this.setupLevel();

    this.anims.create({
        key: 'mover_arriba',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'mover_abajo',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'mover_izquierda',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'mover_derecha',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    function collectCoin(player, coin) {
        coin.destroy();
      }
}
// ChatGPT Estoy teniendo problemas con la logica de caminar del personaje usando javascript y phaser con las teclas wasd siendo el personaje un spritesheet me puede ayudar a crear la logica correcta
gameScene.update = function () {

    const cursors = this.input.keyboard.createCursorKeys();
    const keys = this.input.keyboard.addKeys({
        up: 'W',
        left: 'A',
        down: 'S',
        right: 'D'
    });

    this.player.setVelocity(0);

    if (keys.up.isDown) {
        this.player.setVelocityY(-160);
        this.player.anims.play('mover_arriba', true);
    } else if (keys.down.isDown) {
        this.player.setVelocityY(160);
        this.player.anims.play('mover_abajo', true);
    }

    if (keys.left.isDown) {
        this.player.setVelocityX(-160);
        this.player.anims.play('mover_izquierda', true);
    } else if (keys.right.isDown) {
        this.player.setVelocityX(160);
        this.player.anims.play('mover_derecha', true);
    }

    // Detener la animación si no se presionan teclas
    if (!keys.up.isDown && !keys.down.isDown && !keys.left.isDown && !keys.right.isDown) {
        this.player.anims.stop();
    }

    // Colisiones Codeium
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.platformsW);
    //this.physics.add.collider(this.player, this.coins, collectCoin, null, this);
    //this.physics.add.collider(this.player, this.enemies, hitEnemy, null, this);
}

gameScene.setupLevel = function () {

    this.levelData = this.cache.json.get('levelData');

    this.physics.world.bounds.width = this.levelData.world.width;
    this.physics.world.bounds.height = this.levelData.world.height;

    this.platforms = this.physics.add.staticGroup();
    this.platformsW = this.physics.add.staticGroup();

    this.levelData.platforms.forEach((item) => {
        let box;
        if (item.tiles == 1) {
            box = this.add.sprite(item.x, item.y, item.key).setOrigin(0, 0);
        } else {
            let w = this.textures.get(item.key).get(0).width;
            let h = this.textures.get(item.key).get(0).height;
            //create tile sprite
            box = this.add.tileSprite(item.x, item.y, w, item.tiles * h, item.key).setOrigin(0, 0);
        }
        //enable physics
        this.physics.add.existing(box, true);
        //add sprite to group
        this.platforms.add(box);
    });

    this.levelData.platformsW.forEach((item) => {
        let boxW;
        if (item.tiles == 1) {
            boxW = this.add.sprite(item.x, item.y, item.key).setOrigin(0, 0);
        } else {
            let w = this.textures.get(item.key).get(0).width;
            let h = this.textures.get(item.key).get(0).height;
            //create tile sprite
            boxW = this.add.tileSprite(item.x, item.y, item.tiles * w, h, item.key).setOrigin(0, 0);
        }
        //enable physics
        this.physics.add.existing(boxW, true);
        //add sprite to group
        this.platformsW.add(boxW);
    });

    //create coins
    this.coins = this.physics.add.group({
        allowGravity: false,
        immovable: true
    });

    this.levelData.coins.forEach((item) => {
        let coin = this.add.sprite(item.x, item.y, 'coins').setOrigin(0, 0);
        this.add.existing(coin, true);
        this.coins.add(coin);

    });


    this.player = this.physics.add.sprite(this.levelData.player.x, this.levelData.player.y, 'player');
    this.player.body.setCollideWorldBounds(true)
}

let config = {
    width: 1000,
    height: 1000,
    scene: gameScene,
    title: 'Interactivas - Game',
    pixelArt: false,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 }, 
            debug: false
        }
    }
};

let game = new Phaser.Game(config);


