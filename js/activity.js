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

define(function (require) {
    var activity = require('sugar-web/activity/activity');
    var icon = require('sugar-web/graphics/icon');
    require('easel');
    var io = require('socket.io');
    require('activity/turtles');

    // Manipulate the DOM only when it is ready.
    require(['domReady!'], function (doc) {

        // Initialize the activity.
        activity.setup();

        // Colorize the activity icon.
        var activityButton = docById('activity-button');
        var colors;  // I should be getting the XO colors here?
        activity.getXOColor(function (error, colors) {
            icon.colorize(activityButton, colors);
        });

	//
        var canvas = docById('myCanvas');
	var stage;
	var turtles;
	var lobby;
	var users = {};

	// default values
	var defaultBackgroundColor = [70, 80, 20];

        // Make the activity stop with the stop button.
        var stopButton = docById('stop-button');
        stopButton.addEventListener('click', function (e) {
            activity.close();
        });

	// Do we need to update the stage?
        var update = true;

	// Get things started
	init();

	function docById(id) {
	    return document.getElementById(id);
	}

	function last(myList) {
	    var i = myList.length;
	    if (i == 0) {
		return null;
	    } else {
		return myList[i - 1];
	    }
	}

        function init() {
	    self.dict = {}

            docById('loader').className = 'loader';

            // Check to see if we are running in a browser with touch support.
            stage = new createjs.Stage(canvas);
	    turtles = new Turtles(canvas, stage, refreshCanvas);

	    createjs.Ticker.addEventListener('tick', tick);

            // Enable touch interactions if supported on the current device.
            createjs.Touch.enable(stage);
            // Keep tracking the mouse even when it leaves the canvas.
            stage.mouseMoveOutside = true;
            // Enabled mouse over and mouse out events.
            stage.enableMouseOver(10); // default is 20

	    initNeighborhood();
	}

	function initNeighborhood() {
	    // this comes from somewhere
	    lobby = io.connect('http://localhost:3000/lobby');

	    lobby.on("connected", function(users){
		// lobby.emit("publish", {'activity': 'turtleblocks', 'room': '3ac3d8c0-5bd6-11e4-84fd-0002a5d5c51b'})
		console.log('connected');
		for (user in users) {
		    addTurtle[users[user].id, users[user].name];
		}
		lobby.emit("update", {"name": "tch"});
		console.log(users);
	    });
	    lobby.on("joined", function(user){
		console.log(user);
		users[user[id]] = user;
		addTurtle(user[id], user[name]);
	    });
	    lobby.on("updated", function(user){
		console.log(user);
	    });
	    lobby.on("left", function(id){
		removeTurtle(user[id]);
		console.log(user[id]);
	    });
	    lobby.on("published", function(id, service){
		console.log(service);
	    });
	    lobby.on("forgot", function(id, service){
		console.log(service);
	    });
	    
	}

	function addTurtle(id, name) {
	    if (self.dict[id]) {
		console.log('restoring ' + self.dict[id]['turtle'].name);
		self.dict[id]['turtle'].container.visible = true;
	    } else {
		turtles.add(id, name);
		self.dict[id] = {}
		self.dict[id]['turtle'] = turtles.turtleList[id];
		console.log('creating ' + self.dict[id]['turtle'].name);
	    }
	    self.dict[id]['turtle'].container.x = Math.floor(Math.random() * (canvas.width));
	    self.dict[id]['turtle'].container.y = Math.floor(Math.random() * (canvas.height));
	    update = true;
	}

	function removeTurtle(id) {
	    if (self.dict[id]) {
		console.log('hiding ' + self.dict[id]['turtle'].name);
		self.dict[id]['turtle'].container.visible = false;
	    }
	    update = true;
	}

        function stop() {
	    //
            createjs.Ticker.removeEventListener('tick', tick);
        }

	function refreshCanvas() {
	    update = true;
	}

        function tick(event) {
            // This set makes it so the stage only re-renders when an
            // event handler indicates a change has happened.
            if (update) {
                update = false; // Only update once
                stage.update(event);
            }
        }
    });

});
