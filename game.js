var config = {
    type: Phaser.AUTO,
    width: 2000, // Set a default width
    height: 600,
    scale: {
        mode: Phaser.Scale.RESIZE, // Scale the canvas to fit the screen size
        parent: 'phaser-example', // Replace with the ID of your HTML element
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: {
         key: 'mainScene',
        preload: preload,
        create: create,
        update: update
    }

};

var player;
var cursors;
var leftButton, rightButton, jumpButton;
var lasers;
var lastPlayerLaserTime = 0;
var leftEnemyExists = true;
var rightEnemyExists = true;
let bouncingEnemy1, bouncingEnemy2, bouncingEnemy3, bouncingEnemy4, bouncingEnemy5;
let blueBouncyEnemy1, blueBouncyEnemy2, blueBouncyEnemy3, blueBouncyEnemy4, blueBouncyEnemy5;
let redBouncyEnemy1, redBouncyEnemy2, redBouncyEnemy3, redBouncyEnemy4, redBouncyEnemy5;
var playerHealth = 100; // Set an initial value for player health
var gameOver = false;
let jumpButtonPressed = false;
let leftButtonPressed = false;
let rightButtonPressed = false;
let shootButtonPressed = false;
let ishooting = false;




var game = new Phaser.Game(config);

function preload() {

    this.load.image('sky', 'sky.png');
    this.load.spritesheet('dude', 'dude.png', { frameWidth: 128, frameHeight: 138 });
    this.load.spritesheet('jumpdude', 'jumpdude.png', { frameWidth: 131, frameHeight: 138 });
    this.load.spritesheet('idledude', 'idledude.png', { frameWidth: 131.2, frameHeight: 138 });
    this.load.image('ground', 'platform.png');
    this.load.image('wall', 'wall.png');
    this.load.image('platform', 'platform.png');
    this.load.spritesheet('enemy', 'enemy.png', { frameWidth: 237, frameHeight: 210 });
    this.load.spritesheet('bouncyenemy', 'bouncyenemy.png', { frameWidth: 192, frameHeight: 128 });
    this.load.spritesheet('bluebouncyenemy', 'bluebouncyenemy.png', { frameWidth: 192, frameHeight: 128 });
    this.load.spritesheet('redbouncyenemy', 'redbouncyenemy.png', { frameWidth: 192, frameHeight: 128 });
    this.load.image('purpleLaser', 'laser.png'); // Replace 'purpleLaser.png' with your actual purple laser image file
    this.load.spritesheet('attack', 'attack.png', { frameWidth: 142.1, frameHeight: 138 });
    this.load.image('leftButton', 'left.png');
    this.load.image('rightButton', 'right.png');
    this.load.image('jumpButton', 'jump.png');
    this.load.image('shootButton', 'shoot.png');
    this.load.spritesheet('playerLaser', 'playerlaser.png', { frameWidth: 19, frameHeight: 55 });



   this.load.on('complete', function () {
        // Hide the preloader div
        document.getElementById('preloader').style.display = 'none';
    });


}

function create() {


   // Add background image
     let bg = this.add.image(0, 0, 'sky').setOrigin(0, 0).setScale(1.8);

 // Set camera bounds based on the whole world
    this.physics.world.setBounds(0, 0, bg.displayWidth * bg.scaleX, bg.displayHeight * bg.scaleY);

    // Adjust camera bounds to follow the player within the world size
this.cameras.main.setBounds(0, 0, config.width - 50, config.height +200);

this.cameras.main.setZoom(0.8);

lasers = this.physics.add.group();




function shootEnemyLaser(enemy) {
if (!gameOver) {
    // Create a laser at the enemy's position
    var laser = lasers.create(enemy.x, enemy.y +10, 'purpleLaser');


    // Set the velocity of the laser (adjust as needed)
    laser.setVelocityX(enemy.flipX ? -3000 : 3000);

    // Set additional properties for the enemy laser
    laser.setCollideWorldBounds(false);

    // Flip the laser sprite if shot from the right side
    if (enemy.flipX) {
        laser.setFlipX(true);
    }

    // Set a custom property to identify it as an enemy laser
    laser.isPlayerLaser = false;
}
}

this.time.addEvent({
    delay: 1000,
    callback: function () {
        // Check if left and right enemies still exist before shooting enemy lasers
        if (leftEnemyExists) {
            shootEnemyLaser(enemyLeft);
        }
        if (rightEnemyExists) {
            shootEnemyLaser(enemyRight);
        }
        // Add more enemy references if needed
    },
    loop: true
});










    // Set physics world bounds to include the wall
    this.physics.world.setBounds(0, 0, 2000 + bg.displayWidth * bg.scaleX, bg.displayHeight * bg.scaleY);

// Create ground
let ground = this.physics.add.staticSprite(0, 700, 'ground').setOrigin(0, 0).setDisplaySize(config.width, 100).refreshBody();

// Create wall at the end of the ground
let wall = this.physics.add.staticSprite(config.width - 10, 100, 'wall').setOrigin(0, 0).setDisplaySize(50, config.height).refreshBody();

let platform = this.physics.add.staticSprite(350, 500, 'platform').setDisplaySize(260, 60).refreshBody();
let platform1 = this.physics.add.staticSprite(750, 500, 'platform').setDisplaySize(260, 60).refreshBody();
let platform2 = this.physics.add.staticSprite(1150, 500, 'platform').setDisplaySize(260, 60).refreshBody();
let platform3 = this.physics.add.staticSprite(1550, 500, 'platform').setDisplaySize(260, 60).refreshBody();
let platform4 = this.physics.add.staticSprite(1350, 300, 'platform').setDisplaySize(200, 60).refreshBody();
let platform5 = this.physics.add.staticSprite(950, 300, 'platform').setDisplaySize(200, 60).refreshBody();
let platform6 = this.physics.add.staticSprite(550, 300, 'platform').setDisplaySize(200, 60).refreshBody();


// Set up one-way collision for platforms
platform.body.checkCollision.down = false;
platform1.body.checkCollision.down = false;
platform2.body.checkCollision.down = false;
platform3.body.checkCollision.down = false;
platform4.body.checkCollision.down = false;
platform5.body.checkCollision.down = false;
platform6.body.checkCollision.down = false;



    // Set up player
    player = this.physics.add.sprite(config.width / 2, config.height + 30, 'dude');
    player.setSize(40, 55); // Adjust the width and height as needed
    player.setBounce(0);
    player.setCollideWorldBounds(true);



   // Set up collision between player and world bounds
    this.physics.world.on('worldbounds', function (body) {
        if (body.gameObject === player) {
            // Constrain the player within the world bounds
            player.setVelocityX(0);
            player.setX(Phaser.Math.Clamp(player.x, 0, bg.displayWidth * bg.scaleX));
        }
    }, this);


  // Create enemies on the left and right edges
    let enemyLeft = this.physics.add.sprite(50, config.height - 50, 'enemy');
    let enemyRight = this.physics.add.sprite(config.width - 130, config.height  + 20, 'enemy');

    // Set properties for the enemies
    enemyLeft.setCollideWorldBounds(true);
    enemyRight.setCollideWorldBounds(true);

    // Set the scale of the enemies to make them smaller
    enemyLeft.setScale(0.7); // Adjust the scale value as needed
    enemyRight.setScale(0.7); // Adjust the scale value as needed

// Set custom bounding box size for enemies
enemyLeft.setSize(enemyLeft.width, enemyLeft.height * 0.5); // Adjust the height as needed
enemyRight.setSize(enemyRight.width, enemyRight.height * 0.5); // Adjust the height as needed

    // Add static bodies to make enemies stand on the ground
    this.physics.add.existing(enemyLeft, true);
    this.physics.add.existing(enemyRight, true);


  // Add collision between the ground and enemies
    this.physics.add.collider([enemyLeft, enemyRight], ground);

 // green bouncy enemy
    let bouncingEnemy1 = this.physics.add.sprite(1050, 350, 'bouncyenemy');
    let bouncingEnemy2 = this.physics.add.sprite(1220, 350, 'bouncyenemy');
    let bouncingEnemy3 = this.physics.add.sprite(1120, 350, 'bouncyenemy');
    let bouncingEnemy4 = this.physics.add.sprite(1080, 350, 'bouncyenemy');
    let bouncingEnemy5 = this.physics.add.sprite(1200, 350, 'bouncyenemy');


    // blue bouncy enemy

    let bluebouncyenemy1 = this.physics.add.sprite(1469, 350, 'bluebouncyenemy');
    let bluebouncyenemy2 = this.physics.add.sprite(1639, 350, 'bluebouncyenemy');
    let bluebouncyenemy3 = this.physics.add.sprite(1550, 350, 'bluebouncyenemy');
    let bluebouncyenemy4 = this.physics.add.sprite(1489, 350, 'bluebouncyenemy');
    let bluebouncyenemy5 = this.physics.add.sprite(1659, 350, 'bluebouncyenemy');

       // red bouncy enemy

        let redbouncyenemy1 = this.physics.add.sprite(680, 350, 'redbouncyenemy');
        let redbouncyenemy2 = this.physics.add.sprite(800, 350, 'redbouncyenemy');
        let redbouncyenemy3 = this.physics.add.sprite(730, 350, 'redbouncyenemy');
        let redbouncyenemy4 = this.physics.add.sprite(690, 350, 'redbouncyenemy');
        let redbouncyenemy5 = this.physics.add.sprite(780, 350, 'redbouncyenemy');



    bouncingEnemy1.setBounce(0.8); // Set bounce value to make the enemy bounce
    bouncingEnemy2.setBounce(0.8);
    bouncingEnemy3.setBounce(0.8);
    bouncingEnemy4.setBounce(1);
    bouncingEnemy5.setBounce(1);

    bluebouncyenemy1.setBounce(0.8); // Set bounce value to make the enemy bounce
    bluebouncyenemy2.setBounce(0.8);
    bluebouncyenemy3.setBounce(0.8);
    bluebouncyenemy4.setBounce(1);
    bluebouncyenemy5.setBounce(1);

    redbouncyenemy1.setBounce(0.8); // Set bounce value to make the enemy bounce
    redbouncyenemy2.setBounce(0.8);
    redbouncyenemy3.setBounce(0.8);
    redbouncyenemy4.setBounce(1);
    redbouncyenemy5.setBounce(1);

    bouncingEnemy1.setCollideWorldBounds(true);
    bouncingEnemy2.setCollideWorldBounds(true);
    bouncingEnemy3.setCollideWorldBounds(true);
    bouncingEnemy4.setCollideWorldBounds(true);
    bouncingEnemy5.setCollideWorldBounds(true);

    bluebouncyenemy1.setCollideWorldBounds(true);
    bluebouncyenemy2.setCollideWorldBounds(true);
    bluebouncyenemy3.setCollideWorldBounds(true);
    bluebouncyenemy4.setCollideWorldBounds(true);
    bluebouncyenemy5.setCollideWorldBounds(true);

    redbouncyenemy1.setCollideWorldBounds(true);
    redbouncyenemy2.setCollideWorldBounds(true);
    redbouncyenemy3.setCollideWorldBounds(true);
    redbouncyenemy4.setCollideWorldBounds(true);
    redbouncyenemy5.setCollideWorldBounds(true);

    bouncingEnemy1.setScale(0.6);
    bouncingEnemy2.setScale(0.8);
    bouncingEnemy3.setScale(0.5);
    bouncingEnemy4.setScale(0.8);
    bouncingEnemy5.setScale(0.8);

    bouncingEnemy2.setFlipX(true);
    bouncingEnemy3.setFlipX(true);
    bouncingEnemy4.setFlipX(true);



    bluebouncyenemy1.setScale(0.6);
    bluebouncyenemy2.setScale(0.8);
    bluebouncyenemy3.setScale(0.5);
    bluebouncyenemy4.setScale(0.8);
    bluebouncyenemy5.setScale(0.8);

    bluebouncyenemy2.setFlipX(true);
    bluebouncyenemy3.setFlipX(true);
    bluebouncyenemy4.setFlipX(true);

    redbouncyenemy1.setScale(0.5);
    redbouncyenemy2.setScale(0.8);
    redbouncyenemy3.setScale(0.5);
    redbouncyenemy4.setScale(0.8);
    redbouncyenemy5.setScale(0.8);

    redbouncyenemy2.setFlipX(true);
    redbouncyenemy3.setFlipX(true);
    redbouncyenemy4.setFlipX(true);

// Set custom collision body size for the top part of bouncing enemies
const topCollisionWidth = 128; // Adjust based on the actual width of your bouncing enemies
const topCollisionHeight = 128; // Adjust based on the height you want for the top collision area

this.physics.add.existing(bouncingEnemy1, false);
bouncingEnemy1.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
bouncingEnemy1.body.setOffset(0, bouncingEnemy1.height - 180); // Set offset to keep bottom collision intact

this.physics.add.existing(bouncingEnemy2, false);
bouncingEnemy2.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
bouncingEnemy2.body.setOffset(0, bouncingEnemy1.height - 180); // Set offset to keep bottom collision intact

this.physics.add.existing(bouncingEnemy3, false);
bouncingEnemy3.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
bouncingEnemy3.body.setOffset(0, bouncingEnemy1.height - 180); // Set offset to keep bottom collision intact

this.physics.add.existing(bouncingEnemy4, false);
bouncingEnemy4.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
bouncingEnemy4.body.setOffset(0, bouncingEnemy1.height - 180); // Set offset to keep bottom collision intact

this.physics.add.existing(bouncingEnemy5, false);
bouncingEnemy5.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
bouncingEnemy5.body.setOffset(0, bouncingEnemy1.height - 180); // Set offset to keep bottom collision intact

// blue
this.physics.add.existing(bluebouncyenemy1, false);
bluebouncyenemy1.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
bluebouncyenemy1.body.setOffset(0, bouncingEnemy1.height - 180); // Set offset to keep bottom collision intact

this.physics.add.existing(bluebouncyenemy2, false);
bluebouncyenemy2.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
bluebouncyenemy2.body.setOffset(0, bouncingEnemy1.height - 180); // Set offset to keep bottom collision intact

this.physics.add.existing(bluebouncyenemy3, false);
bluebouncyenemy3.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
bluebouncyenemy3.body.setOffset(0, bouncingEnemy1.height - 180); // Set offset to keep bottom collision intact

this.physics.add.existing(bluebouncyenemy4, false);
bluebouncyenemy4.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
bluebouncyenemy4.body.setOffset(0, bouncingEnemy1.height - 180); // Set offset to keep bottom collision intact

this.physics.add.existing(bluebouncyenemy5, false);
bluebouncyenemy5.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
bluebouncyenemy5.body.setOffset(0, bouncingEnemy1.height - 180); // Set offset to keep bottom collision intact


//red
this.physics.add.existing(redbouncyenemy1, false);
redbouncyenemy1.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
redbouncyenemy1.body.setOffset(0, bouncingEnemy1.height - 180); // Set offset to keep bottom collision intact

this.physics.add.existing(redbouncyenemy2, false);
redbouncyenemy2.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
redbouncyenemy2.body.setOffset(0, bouncingEnemy1.height - 180); // Set offset to keep bottom collision intact

this.physics.add.existing(redbouncyenemy3, false);
redbouncyenemy3.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
redbouncyenemy3.body.setOffset(0, bouncingEnemy1.height - 180); // Set offset to keep bottom collision intact

this.physics.add.existing(redbouncyenemy4, false);
redbouncyenemy4.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
redbouncyenemy4.body.setOffset(0, bouncingEnemy1.height - 180); // Set offset to keep bottom collision intact

this.physics.add.existing(bouncingEnemy5, false);
redbouncyenemy5.body.setSize(topCollisionWidth, topCollisionHeight, true); // Set custom size for the top part
redbouncyenemy5.body.setOffset(0, bouncingEnemy1.height - 180); // Set offset to keep bottom collision intact




    this.physics.add.existing(bouncingEnemy1, true);
    this.physics.add.existing(bouncingEnemy2, true);
    this.physics.add.existing(bouncingEnemy3, true);
    this.physics.add.existing(bouncingEnemy4, true);
    this.physics.add.existing(bouncingEnemy5, true);

    this.physics.add.existing(bluebouncyenemy1, false);
    this.physics.add.existing(bluebouncyenemy2, false);
    this.physics.add.existing(bluebouncyenemy3, false);
    this.physics.add.existing(bluebouncyenemy4, false);
    this.physics.add.existing(bluebouncyenemy5, false);

        this.physics.add.existing(redbouncyenemy1, false);
        this.physics.add.existing(redbouncyenemy2, false);
        this.physics.add.existing(redbouncyenemy3, false);
        this.physics.add.existing(redbouncyenemy4, false);
        this.physics.add.existing(redbouncyenemy5, false);


    this.physics.add.collider([bouncingEnemy1, bouncingEnemy2, bouncingEnemy3, bouncingEnemy4, bouncingEnemy5], [platform2, ground, wall, platform, platform1, platform2, platform3, platform4, platform5, platform6]);

    this.physics.add.collider([bluebouncyenemy1, bluebouncyenemy2, bluebouncyenemy3, bluebouncyenemy4, bluebouncyenemy5], [platform3, ground, wall, platform, platform1, platform2, platform3, platform4, platform5, platform6]);

    this.physics.add.collider([redbouncyenemy1, redbouncyenemy2, redbouncyenemy3, redbouncyenemy4, redbouncyenemy5], [platform1, ground, wall, platform, platform1, platform2, platform3, platform4, platform5, platform6]);
// Set up collision callbacks for green bouncing enemies
this.physics.add.overlap(player, [bouncingEnemy1, bouncingEnemy2, bouncingEnemy3, bouncingEnemy4, bouncingEnemy5], function (player, enemy) {
    bouncingEnemyCollision(player, enemy, 0x00FF00); // Green tint
});

// Set up collision callbacks for blue bouncing enemies
this.physics.add.overlap(player, [bluebouncyenemy1, bluebouncyenemy2, bluebouncyenemy3, bluebouncyenemy4, bluebouncyenemy5], function (player, enemy) {
    bouncingEnemyCollision(player, enemy, 0x0000FF); // Blue tint
});

// Set up collision callbacks for red bouncing enemies
this.physics.add.overlap(player, [redbouncyenemy1, redbouncyenemy2, redbouncyenemy3, redbouncyenemy4, redbouncyenemy5], function (player, enemy) {
    bouncingEnemyCollision(player, enemy, 0xFF0000); // Red tint
});





    // Add animation for bouncing enemies
    this.anims.create({
        key: 'bouncingEnemyAnimation',
        frames: this.anims.generateFrameNumbers('bouncyenemy', { start: 0, end: 12 }),
        frameRate: 40,
        repeat: -1
    });

    bouncingEnemy1.anims.play('bouncingEnemyAnimation', true);
    bouncingEnemy2.anims.play('bouncingEnemyAnimation', true);
    bouncingEnemy3.anims.play('bouncingEnemyAnimation', true);
    bouncingEnemy4.anims.play('bouncingEnemyAnimation', true);
    bouncingEnemy5.anims.play('bouncingEnemyAnimation', true);

    // animation for blue bouncing enemies
       // Add animation for bouncing enemies
        this.anims.create({
            key: 'BluebouncingEnemyAnimation',
            frames: this.anims.generateFrameNumbers('bluebouncyenemy', { start: 0, end: 12 }),
            frameRate: 40,
            repeat: -1
        });

        bluebouncyenemy1.anims.play('BluebouncingEnemyAnimation', true);
        bluebouncyenemy2.anims.play('BluebouncingEnemyAnimation', true);
        bluebouncyenemy3.anims.play('BluebouncingEnemyAnimation', true);
        bluebouncyenemy4.anims.play('BluebouncingEnemyAnimation', true);
        bluebouncyenemy5.anims.play('BluebouncingEnemyAnimation', true);

          // animation for red bouncing enemies
               // Add animation for bouncing enemies
                this.anims.create({
                    key: 'RedbouncingEnemyAnimation',
                    frames: this.anims.generateFrameNumbers('redbouncyenemy', { start: 0, end: 12 }),
                    frameRate: 40,
                    repeat: -1
                });

                redbouncyenemy1.anims.play('RedbouncingEnemyAnimation', true);
                redbouncyenemy2.anims.play('RedbouncingEnemyAnimation', true);
                redbouncyenemy3.anims.play('RedbouncingEnemyAnimation', true);
                redbouncyenemy4.anims.play('RedbouncingEnemyAnimation', true);
                redbouncyenemy5.anims.play('RedbouncingEnemyAnimation', true);


    // Create enemy animations
   this.anims.create({
       key: 'enemyAnimation',
       frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 58 }),
       frameRate: 30,
       repeat: -1, // Set repeat to -1 to make it loop indefinitely
       yoyo: true // Set yoyo to true to make it play backward after reaching the last frame
   });

    // Play the enemy animation on both enemies
    enemyLeft.anims.play('enemyAnimation', true);
    enemyRight.anims.play('enemyAnimation', true);

     enemyRight.setFlipX(true);




  this.anims.create({
        key: 'playerLaser',
        frames: this.anims.generateFrameNumbers('playerLaser', { start: 0, end: 7, first: 0 }),
        frameRate: 22,
        repeat: -1  // Set repeat to -1 for continuous looping
    });

    // Create player animations
       this.anims.create({
           key: 'left',
           frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 12 }),  // Adjust end frame based on the number of frames in your sprite
           frameRate: 25,
           repeat: -1
       });

       this.anims.create({
           key: 'turn',
           frames: [{ key: 'dude', frame: 1 }],  // Adjust frame based on the number of frames in your sprite
           frameRate: 40
       });

       this.anims.create({
           key: 'right',
           frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 12 }),  // Adjust start and end frames based on the number of frames in your sprite
           frameRate: 25,
           repeat: -1
       });

  this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('jumpdude', { start: 0, end: 14, first: 0 }),
        frameRate: 22,
        repeat: -1  // Set repeat to -1 for continuous looping
    });

this.anims.create({
    key: 'attack',
    frames: this.anims.generateFrameNumbers('attack', { start: 7, end: 0, first: 7 }),
    frameRate: 18,
    repeat: -1  // Set repeat to -1 for continuous looping
});


        this.anims.create({
             key: 'idle',
             frames: this.anims.generateFrameNumbers('idledude', { start: 0, end: 14, first: 0 }),
             frameRate: 30,
             repeat: -1  // Set repeat to -1 for continuous looping
         });
         player.anims.play('idle');



    // Follow the player with the camera
    this.cameras.main.startFollow(player, true, 0.1, 0.1);

    // Create cursor keys
    cursors = this.input.keyboard.createCursorKeys();
        // Add collision between the player and the ground
        this.physics.add.collider(player, [ground, wall, platform, platform1, platform2, platform3, platform4, platform5, platform6]);
        this.physics.add.overlap(player, lasers, laserCollision, null, this);


      // Create on-screen buttons
         leftButton = this.add.sprite(config.width - 250, config.height - 150, 'leftButton').setInteractive();
         rightButton = this.add.sprite(config.width - 150, config.height - 150, 'rightButton').setInteractive();
         jumpButton = this.add.sprite(config.width - 300, config.height - 150, 'jumpButton').setInteractive();
        shootButton = this.add.sprite(config.width - 300, config.height - 50, 'shootButton').setInteractive();


// Scale and set alpha as needed
shootButton.setScale(2);
shootButton.setAlpha(0.8);

      // Scale the buttons as needed
      leftButton.setScale(2);
      rightButton.setScale(2);
      jumpButton.setScale(2);

      leftButton.setAlpha(0.8);
      rightButton.setAlpha(0.8);
      jumpButton.setAlpha(0.8);


     // Add event listeners for touch events
     leftButton.on('pointerdown', onLeftButtonDown);
     leftButton.on('pointerup', onLeftButtonUp);

     rightButton.on('pointerdown', onRightButtonDown);
     rightButton.on('pointerup', onRightButtonUp);

     jumpButton.on('pointerdown', onJumpButtonDown);
     jumpButton.on('pointerup', onJumpButtonUp);

shootButton.on('pointerdown', onShootButtonDown);
shootButton.on('pointerup', onShootButtonUp);

       function onLeftButtonDown() {
           leftButtonPressed = true;
           cursors.left.isDown = true;
       }

       function onLeftButtonUp() {
           leftButtonPressed = false;
           if (!rightButtonPressed) {
               cursors.left.isDown = false;
           }
       }

       function onRightButtonDown() {
           rightButtonPressed = true;
           cursors.right.isDown = true;
       }

       function onRightButtonUp() {
           rightButtonPressed = false;
           if (!leftButtonPressed) {
               cursors.right.isDown = false;
           }
       }

       function onJumpButtonDown() {
           jumpButtonPressed = true;
       }

       function onJumpButtonUp() {
           jumpButtonPressed = false;
           if (!leftButtonPressed) {
               cursors.left.isDown = false;
           }
           if (!rightButtonPressed) {
               cursors.right.isDown = false;
           }
       }
    function onShootButtonDown() {
        shootButtonPressed = true;
        ishooting = true
    }

    function onShootButtonUp() {
        shootButtonPressed = false;
        ishooting = false;
        // Add any additional logic if needed
    }




function laserCollision(player, laser) {
    if (laser.isPlayerLaser) {
        return;
    }

    // Store the amount of health decrease
    const decreaseAmount = 20;

    // Tint the player to purple
    player.setTint(0xE816F3);
    playerHealth -= decreaseAmount;
    // Ensure playerHealth doesn't go below 0
    playerHealth = Math.max(playerHealth, 0);

    // Update the HP bar
    updatePlayerHPBar();

    // Display the amount of decrease as text
    const decreaseText = this.add.text(player.x, player.y, `-${decreaseAmount}`, {
        fontSize: '24px',
        fill: '#FF0000',
    }).setOrigin(0.5, 0.5);

    // Fade out and destroy the text after a delay
    this.tweens.add({
        targets: decreaseText,
        alpha: 0,
        y: player.y - 50, // Move the text upward
        duration: 1000, // 1000 milliseconds (1 second)
        onComplete: () => {
            decreaseText.destroy();
        },
    });

    // Check if the player has an input property before disabling it
    if (player.input) {
        // Disable player input during the tint effect
        player.input.enabled = false;
    }

    // Destroy the laser
    laser.destroy();

    // Set a timeout to reset the player after 1500 milliseconds
    setTimeout(() => {
        // Reset tint and re-enable player input if it exists
        player.clearTint();
        if (player.input) {
            player.input.enabled = true;
        }
    }, 1500);
}


function bouncingEnemyCollision(player, enemy, tintColor) {
    // Tint the player based on the specified color
    player.setTint(tintColor);

    // Decrease the player's health by 0.05
    playerHealth -= 0.5;




    // Ensure playerHealth doesn't go below 0
    playerHealth = Math.max(playerHealth, 0);

    // Update the HP bar
    updatePlayerHPBar();

    // Disable player input during the tint effect
    if (player.input) {
        player.input.enabled = false;
    }

    // Set a timeout to reset the player after a specified time
    setTimeout(function () {
        // Reset tint and re-enable player input if it exists
        player.clearTint();
        if (player.input) {
            player.input.enabled = true;
        }
    }, 1500);
}





 // Check for collisions between player lasers and enemies
    this.physics.add.overlap(lasers, [bouncingEnemy1, bouncingEnemy2, bouncingEnemy3, bouncingEnemy4, bouncingEnemy5], playerLaserEnemyCollision);
    this.physics.add.overlap(lasers, [bluebouncyenemy1, bluebouncyenemy2, bluebouncyenemy3, bluebouncyenemy4, bluebouncyenemy5], playerLaserEnemyCollision);
    this.physics.add.overlap(lasers, [redbouncyenemy1, redbouncyenemy2, redbouncyenemy3, redbouncyenemy4, redbouncyenemy5], playerLaserEnemyCollision);
     this.physics.add.overlap(lasers, [enemyRight, enemyLeft,], playerLaserEnemyCollision);

    // ... (rest of the previous code)

    // Function to handle player laser and enemy collision
function playerLaserEnemyCollision(enemy, laser) {
    if (laser.isPlayerLaser) {
        enemy.setTint(0x4D0751);

        // Check which enemy is hit and set the corresponding flag to false
        if (enemy === enemyLeft) {
            leftEnemyExists = false;
        } else if (enemy === enemyRight) {
            rightEnemyExists = false;
        }

        setTimeout(() => {
            enemy.destroy();
            areAllEnemiesDefeated();
            // Additional logic or scoring here
        }, 500);

        laser.destroy();
    }
}




function areAllEnemiesDefeated() {
    // Check left and right enemies
    if (!leftEnemyExists && !rightEnemyExists) {
        // Check green bouncing enemies
        if (!bouncingEnemy1.active && !bouncingEnemy2.active && !bouncingEnemy3.active && !bouncingEnemy4.active && !bouncingEnemy5.active) {
            // Check blue bouncing enemies
            if (!bluebouncyenemy1.active && !bluebouncyenemy2.active && !bluebouncyenemy3.active && !bluebouncyenemy4.active && !bluebouncyenemy5.active) {
                // Check red bouncing enemies
                if (!redbouncyenemy1.active && !redbouncyenemy2.active && !redbouncyenemy3.active && !redbouncyenemy4.active && !redbouncyenemy5.active) {
                    // All enemies are defeated, create a new enemy

                    console.log('All enemies are defeated! ');
                      winScreen();
                }
            }
        }
    }
}

function winScreen() {
    // Display the win screen
    document.getElementById('win-screen').style.display = 'flex';
    // Additional win screen logic if needed
    gameOver = true; // Update game over status
}

    hpBar = this.add.graphics();

    // Initial update of the HP bar
    updatePlayerHPBar();






  }
  var hpBar = this.add.graphics();

function updatePlayerHPBar() {
    // Calculate the width of the HP bar based on the player's health percentage
    var hpBarWidth = (playerHealth / 100) * 100; // Adjust 100 based on your desired maximum width

    // Determine the start and end colors for the gradient based on the player's health
    var startColor =  0xFF0000; // Green if health is 70 or above, red otherwise
    var endColor = 0x000000; // Black as the end color

    // Update the HP bar graphics or any UI element you're using
    hpBar.clear();

        hpBar.fillStyle(0x222222, 1); // Adjust the background color based on your preference
        hpBar.fillRoundedRect(10, 10, 100, 20, 5);

    // Draw the filled HP bar with rounded corners and radial gradient color
    var borderRadius =3; // Adjust the border radius based on your preference

    // Set up a radial gradient
    hpBar.fillGradientStyle(1, endColor, startColor, 1);
    hpBar.fillRoundedRect(11, 11, hpBarWidth - 2, 18, borderRadius - 1); // Adjust the position, dimensions, and border radius based on your preference

   // Draw Border with 3D Effect
   var borderWidth = 2; // Adjust the border width based on your preference
   var borderColor = 0x000000; // Border color

   // Draw the outer shadow
   hpBar.lineStyle(borderWidth, 0x333333, 1); // Darker color for outer shadow
   hpBar.strokeRoundedRect(10, 10, 100, 20, borderRadius);

   // Draw the inner shadow
   hpBar.lineStyle(borderWidth, 0x666666, 1); // Slightly lighter color for inner shadow
   hpBar.strokeRoundedRect(11, 11, hpBarWidth - 2, 18, borderRadius - 1);

   // Draw the main border
   hpBar.lineStyle(borderWidth, borderColor, 1);
   hpBar.strokeRoundedRect(11, 11, hpBarWidth - 2, 18, borderRadius - 1);

}




function gameOverScreen() {
        // Display the game over screen
        document.getElementById('game-over-screen').style.display = 'flex';
        // Additional game over logic if needed
gameOver = true
    }

function resetGame() {

    // Reload the game
    window.location.reload();
}



    function restartGame() {
        // Reset the game state
        resetGame();

    }

function update() {
if (!gameOver) {
 hpBar.x = player.x - 50; // Adjust the offset based on your preference
    hpBar.y = player.y - 100;
    // Update the position of the on-screen buttons with the camera
leftButton.x = this.cameras.main.worldView.left + 50;
rightButton.x = this.cameras.main.worldView.left + 150;
jumpButton.x = this.cameras.main.worldView.left + 100;
shootButton.x = this.cameras.main.worldView.right - 150;


leftButton.y = this.cameras.main.worldView.bottom - 100;
rightButton.y = this.cameras.main.worldView.bottom - 100;
jumpButton.y = this.cameras.main.worldView.bottom - 200;
shootButton.y = this.cameras.main.worldView.bottom - 100;


    // Check if the shoot button is pressed and enough time has passed since the last shot
    if (shootButtonPressed && game.getTime() - lastPlayerLaserTime > 500) {
        ishooting = true;

        // Call a function to shoot a player laser
        shootPlayerLaser();

        // Update the last player laser time
        lastPlayerLaserTime = game.getTime();
    }

    // Check if the player is shooting and play the attack animation continuously
    if (ishooting) {
        player.anims.play('attack', true);
    } else {
        // If not shooting, handle other animations (left, right, idle, jump)
        if (cursors.left.isDown) {
            // Left movement
            player.setVelocityX(-360);
            player.flipX = true;
            if (player.body.onFloor()) {
                player.anims.play('left', true);
            }
        } else if (cursors.right.isDown) {
            // Right movement
            player.setVelocityX(360);
            player.flipX = false;
            if (player.body.onFloor()) {
                player.anims.play('right', true);
            }
        } else if (cursors.up.isDown || jumpButtonPressed) {
            // Jumping
            player.anims.play('jump', true);
        } else {
            // No movement, play the idle animation
            player.setVelocityX(0);
            if (player.body.onFloor()) {
                player.anims.play('idle', true);
            }
        }
    }


    // Check for the jump key
if ((cursors.up.isDown || jumpButtonPressed) && player.body.onFloor()) {
    player.setVelocityY(-800);
    player.anims.play('jump', true);
} else if (!player.body.onFloor()) {
        // Player is in the air, play the jump animation continuously
        player.anims.play('jump', true);

    }



     if (player.body.velocity.y > 0) {
            // Increase gravity when the player is falling
            player.body.gravity.y = 10000; // You can adjust the gravity value as needed
        } else {
            // Reset gravity to the default value when the player is not falling
            player.body.gravity.y = 250;
        }

 // Check if the player's health is less than or equal to 0
    if (playerHealth <= 0) {
gameOverScreen();
    }
}
}


function shootPlayerLaser() {
if(ishooting){
     const laserX = player.flipX ? player.x - 80 : player.x + 80;

       // Create a laser at the calculated position
       var laser = lasers.create(laserX, player.y - 20, 'purpleLaser');

    // Set the velocity of the laser (adjust as needed)
    laser.setVelocityX(player.flipX ? -2500 : 2500);

    // Set additional properties for the player laser
    laser.setCollideWorldBounds(false);

    // Flip the laser sprite if shot from the right side
    if (player.flipX) {
        laser.setFlipX(true);
    }

    // Set a custom property to identify it as a player laser
    laser.isPlayerLaser = true;


    // Set a timeout to destroy the laser after a certain time (adjust as needed)
    setTimeout(() => {
        laser.destroy();
        // Additional logic or scoring here
    }, 500);
}
}





