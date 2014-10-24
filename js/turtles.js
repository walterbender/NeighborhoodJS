// Copyright (c) 2014 Walter Bender
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 3 of the License, or
// (at your option) any later version.
//
// You should have received a copy of the GNU General Public License
// along with this library; if not, write to the Free Software
// Foundation, 51 Franklin Street, Suite 500 Boston, MA 02110-1335 USA

// Turtles
var defaultColor = 5;
var defaultValue = 50;
var defaultChroma = 100;
var defaultStroke = 5;

// Turtle sprite
var turtlePath = 'images/turtle.svg';
var turtleBasePath = 'images/';

function Turtle (name, turtles) {
    this.name = name;
    this.turtles = turtles;

    console.log(name);
    // Things used for drawing the turtle.
    this.container = null;
    this.bitmap = null;
};

function Turtles(canvas, stage, refreshCanvas) {
    this.canvas = canvas;
    this.stage = stage;
    this.refreshCanvas = refreshCanvas;
    
    // The list of all of our turtles, one for each start block.
    this.turtleList = [];

    this.add = function(name) {
	// Add a new turtle for each start block
	console.log('adding a new turtle ' + name);
	var i = this.turtleList.length;
	var turtleName = i.toString();
	var myTurtle = new Turtle(name, this);
	this.turtleList.push(myTurtle);

	// Each turtle needs its own canvas.
        myTurtle.drawingCanvas = new createjs.Shape();
        this.stage.addChild(myTurtle.drawingCanvas);

	var turtleImage = new Image();
	i %= 10;
	turtleImage.src = turtleBasePath + 'turtle-' + i.toString() + '.svg';
	myTurtle.container = new createjs.Container();
	this.stage.addChild(myTurtle.container);
	myTurtle.bitmap = new createjs.Bitmap(turtleImage);
	myTurtle.container.addChild(myTurtle.bitmap);
	myTurtle.container.x = myTurtle.x;
	myTurtle.container.y = myTurtle.y;
	myTurtle.bitmap.x = 0;
	myTurtle.bitmap.y = 0;
	myTurtle.bitmap.regX = 27 | 0;
	myTurtle.bitmap.regY = 27 | 0;
	myTurtle.bitmap.name = 'bmp_turtle';
	myTurtle.bitmap.cursor = 'pointer';
	myTurtle.bitmap.rotation = Math.floor(Math.random() * 360);
	var hitArea = new createjs.Shape();
	hitArea.graphics.beginFill('#FFF').drawEllipse(-27, -27, 55, 55);
	hitArea.x = 0;
	hitArea.y = 0;
	myTurtle.container.hitArea = hitArea;

        this.stage.update();

	var turtles = this;

	myTurtle.container.on('click', function(event) {
	    console.log(myTurtle.name);
	    alert(myTurtle.name);
	});

	myTurtle.container.on('mousedown', function(event) {
	    var offset = {
                x: myTurtle.container.x - event.stageX,
                y: myTurtle.container.y - event.stageY
	    }

	    myTurtle.container.on('pressmove', function(event) {
                myTurtle.container.x = event.stageX + offset.x;
                myTurtle.container.y = event.stageY + offset.y;
		myTurtle.x = myTurtle.container.x;
		myTurtle.y = myTurtle.container.y;
                turtles.refreshCanvas();
	    });
	});

	myTurtle.container.on('mouseover', function(event) {
            myTurtle.bitmap.scaleX = 1.2;
            myTurtle.bitmap.scaleY = 1.2;
            myTurtle.bitmap.scale = 1.2;
            turtles.refreshCanvas();
        });

	myTurtle.container.on('mouseout', function(event) {
            myTurtle.bitmap.scaleX = 1;
            myTurtle.bitmap.scaleY = 1;
            myTurtle.bitmap.scale = 1;
            turtles.refreshCanvas();
        });

        this.refreshCanvas();
    }
}
