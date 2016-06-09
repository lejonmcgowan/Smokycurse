requirejs.config({
    baseUrl: 'js',
    paths: {
        Phaser: '../lib/phaser'
    }
});

require(["Phaser"],
    function(Phaser)
    {
        var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { create: create, render: render });
        var sprite,floor, testSquare;

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
        }

        function render ()
        {
            //game.debug.geom(floor,'#00ffff');
            game.physics.arcade.overlap(sprite,floor,function(r,t){r.body.velocity.y = 0;});
            sprite.body.gravity.y = 400;

            //game.debug.body(sprite);
        }
    });