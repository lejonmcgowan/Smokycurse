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
var clearSmokeButton;
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
            this.game.world.setBounds(0, 0, 3500, this.game.height + 300);
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

            smoketrail.createMultiple(250,'smoke');
            smoketrail.setAll('checkWorldBounds', true);
            smoketrail.setAll('outOfBoundsKill', true);

            cursors = game.input.keyboard.createCursorKeys();
            jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            walkButton = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
            fullscreenToggleButton = game.input.keyboard.addKey(Phaser.Keyboard.F);
            clearSmokeButton = game.input.keyboard.addKey(Phaser.Keyboard.C);

            sprite.body.gravity.y = 2000;
            var style = { font: "bold 24px Arial", fill: "#fff", boundsAlignH: "center"};
            //  The Text is positioned at 0, 100
            var textGroup = game.add.group();
            var controls = ["Controls",
                            "Move Left: left arrow or A",
                            "Move Right: right arrow or D",
                            "jump: up arrow, W, or Spacebar",
                            "Create smoke: Drag Mouse",
                             "Clear all Smoke: C"];
            for(var i = 0; i < controls.length; i++)
            {
                var text = game.add.text(this.game.width / 4 ,50 * i , controls[i], style);
                text.setTextBounds(0, 400, 800, 200);
                textGroup.add(text);
            }
        }

        function render ()
        {
            game.physics.arcade.overlap(sprite,smoketrail,function(r,t)
            {
                if(r.body.velocity.y > -1000)
                    r.body.velocity.y = 0;

            });
        }

        function update()
        {
            if(sprite.body.velocity.x < 0) {
                sprite.body.velocity.x += 45;
                sprite.body.velocity.x = Math.min(sprite.body.velocity.x,0);
            }
            else {
                sprite.body.velocity.x -= 45;
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
                && (sprite.body.onFloor() || game.physics.arcade.overlap(sprite,smoketrail,collisionHandler,processHandler,this)))
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

            //clear current smoke
            if(clearSmokeButton.isDown) {
                smoketrail.removeAll();
                smoketrail.createMultiple(250,'smoke');
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