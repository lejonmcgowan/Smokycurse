requirejs.config({
    baseUrl: 'js',
    paths: {
        Phaser: '../lib/phaser'
    }
});
var cursors;
var jumpButton, walkButton;
var walkSpeed = 150, runSpeed = 450;
var jumpTimer = 0;
var sprite,floor, testSquare;

require(["Phaser"],
    function(Phaser)
    {
        var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { create: create, render: render, update: update });


        function create()
        {
            testSquare = game.add.graphics();
            testSquare.beginFill(0xff0000,1);
            testSquare.drawRect(0,0,100,100);
            floor = new Phaser.Rectangle(0,game.height - 50,game.width,50);
            sprite = game.add.sprite(testSquare.width,testSquare.height,null);
            sprite.addChild(testSquare);
            game.physics.enable(sprite,Phaser.Physics.ARCADE);
            game.physics.enable(floor,Phaser.Physics.ARCADE);
            sprite.body.collideWorldBounds = true;
            sprite.body.setSize(testSquare.width, testSquare.height);

            cursors = game.input.keyboard.createCursorKeys();
            jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            walkButton = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

        }

        function render ()
        {
            //game.debug.geom(floor,'#00ffff');
            game.physics.arcade.overlap(sprite,floor,function(r,t){r.body.velocity.y = 0;});
            sprite.body.gravity.y = 2000;

            //game.debug.body(sprite);
        }

        function update()
        {
            sprite.body.velocity.x -= 10;
            sprite.body.velocity.x = Math.max(sprite.body.velocity.x,0);
            if (cursors.left.isDown)
            {
                sprite.body.velocity.x = walkButton.isDown ? -walkSpeed : -runSpeed;
            }
            else if (cursors.right.isDown)
            {
                sprite.body.velocity.x = walkButton.isDown ? walkSpeed : runSpeed;
            }

            if (jumpButton.isDown && sprite.body.onFloor())
                sprite.body.velocity.y = -1000;
        }
    });