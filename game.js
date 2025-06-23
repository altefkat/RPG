
const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 480,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let player, cursors, spaceKey;
let attackHitbox;

function preload() {
  this.load.image('tiles', 'tileset.png');
  this.load.tilemapTiledJSON('map', 'map.json');
  this.load.spritesheet('hero', 'character.png', {
    frameWidth: 32,
    frameHeight: 32
  });
}

function create() {
  const map = this.make.tilemap({ key: 'map' });
  const tileset = map.addTilesetImage('tileset', 'tiles');
  const ground = map.createLayer('Ground', tileset);
  const walls = map.createLayer('Walls', tileset);
  walls.setCollisionByProperty({ collides: true });

  player = this.physics.add.sprite(100, 100, 'hero', 0);
  player.setSize(16, 20).setOffset(8, 12);
  this.physics.add.collider(player, walls);

  cursors = this.input.keyboard.createCursorKeys();
  spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  // Animations
  this.anims.create({
    key: 'down',
    frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('hero', { start: 4, end: 7 }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('hero', { start: 8, end: 11 }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: 'up',
    frames: this.anims.generateFrameNumbers('hero', { start: 12, end: 15 }),
    frameRate: 10,
    repeat: -1
  });

  attackHitbox = this.add.rectangle(0, 0, 32, 32, 0xff0000, 0.3);
  this.physics.add.existing(attackHitbox);
  attackHitbox.body.enable = false;
}

function update() {
  const speed = 100;
  let vx = 0;
  let vy = 0;

  if (cursors.left.isDown) {
    vx = -speed;
    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    vx = speed;
    player.anims.play('right', true);
  } else if (cursors.up.isDown) {
    vy = -speed;
    player.anims.play('up', true);
  } else if (cursors.down.isDown) {
    vy = speed;
    player.anims.play('down', true);
  } else {
    player.anims.stop();
  }

  player.setVelocity(vx, vy);

  if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
    attackHitbox.body.enable = true;
    attackHitbox.x = player.x;
    attackHitbox.y = player.y;
    setTimeout(() => {
      attackHitbox.body.enable = false;
    }, 200);
  }
}
