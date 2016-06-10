requirejs.config({
    baseUrl: 'js',
    paths: {
        Phaser: '../lib/phaser'
    }
});
var cursors;
var jumpButton, walkButton;
var fullscreenToggleButton;

var walkSpeed = 150, runSpeed = 450;
var jumpTimer = 0;
var sprite,testSquare;
var smoketrail;
var nextFire = 0;
var fireRate = 100;

require(["Phaser"],
    function(Phaser)
    {
        var game = new Phaser.Game(1280, 720, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render, update: update });

        function preload()
        {
            game.load.image("smoke","assets/smoke.png");
        }

        function create()
        {
            this.game.world.setBounds(0, 0, 3500, this.game.height);
            game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.game.stage.backgroundColor = "#4488AA";

            testSquare = game.add.graphics();
            testSquare.beginFill(0xff0000,1);
            testSquare.drawRect(0,0,100,100);
            sprite = game.add.sprite(testSquare.width,testSquare.height,null);
            sprite.addChild(testSquare);
            game.physics.enable(sprite,Phaser.Physics.ARCADE);
            sprite.body.collideWorldBounds = true;
            sprite.body.setSize(testSquare.width, testSquare.height);

            //the camera will follow the player in the world
            this.game.camera.follow(sprite);

            smoketrail = game.add.group();
            smoketrail.enableBody = true;
            smoketrail.physicsBodyType = Phaser.Physics.ARCADE;

            smoketrail.createMultiple(50,'smoke');
            smoketrail.setAll('checkWorldBounds', true);
            smoketrail.setAll('outOfBoundsKill', true);

            cursors = game.input.keyboard.createCursorKeys();
            jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            walkButton = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
            fullscreenToggleButton = game.input.keyboard.addKey(Phaser.Keyboard.F);

            sprite.body.gravity.y = 2000;
        }

        function render ()
        {
            //game.debug.geom(floor,'#00ffff');
            game.physics.arcade.overlap(sprite,smoketrail,function(r,t)
            {
                if(r.body.velocity.y > -200)
                    r.body.velocity.y = 0;

            });
            game.debug.text('Active Bullets: ' + smoketrail.countLiving() + ' / ' + smoketrail.total, 32, 32);
            game.debug.spriteInfo(sprite, 32, 450);
        }

        function update()
        {
            if(sprite.body.velocity.x < 0) {
                sprite.body.velocity.x += 15;
                sprite.body.velocity.x = Math.min(sprite.body.velocity.x,0);
            }
            else {
                sprite.body.velocity.x -= 15;
                sprite.body.velocity.x = Math.max(sprite.body.velocity.x,0);
            }

            if (cursors.left.isDown || game.input.keyboard.isDown(Phaser.Keyboard.A))
            {
                sprite.body.velocity.x = walkButton.isDown ? -walkSpeed : -runSpeed;
            }
            else if (cursors.right.isDown || game.input.keyboard.isDown(Phaser.Keyboard.D))
            {
                sprite.body.velocity.x = walkButton.isDown ? walkSpeed : runSpeed;
            }

            if ((jumpButton.isDown || cursors.up.isDown || game.input.keyboard.isDown(Phaser.Keyboard.W))
                && (sprite.body.onFloor() || game.physics.arcade.collide(sprite,smoketrail,collisionHandler,processHandler,this)))
                sprite.body.velocity.y = -1000;

            if(fullscreenToggleButton.isDown)
            {
                //figure out later

            }

            if(cursors.down.isDown || game.input.keyboard.isDown(Phaser.Keyboard.S))
                sprite.body.gravity.y = 4500;
            else
                sprite.body.gravity.y = 2000;

            //create smoke trail
            if (game.input.mousePointer.isDown)
            {
                createSmoke();
            }
        }
        function createSmoke()
        {
            console.log("SMOKE at (" + game.input.worldX + "," + game.input.worldY + ")");

            if (game.time.now > nextFire && smoketrail.countDead() > 0)
            {
                nextFire = game.time.now + fireRate;

                var newPuff = smoketrail.getFirstDead();

                newPuff.reset(game.input.worldX, game.input.worldY);

                //game.physics.arcade.moveToPointer(newPuff, 300);
            }

        }

        function processHandler (player, group) {

            return true;

        }

        function collisionHandler (player, group) {

        }
    });