var PostApoc = PostApoc || {};

//constants
PostApoc.WEIGHT_PER_BOX = 20;
PostApoc.WEIGHT_PER_SIZE = 2;
PostApoc.FOOD_WEIGHT = 0.6;
PostApoc.FIREPOWER_WEIGHT = 5;
PostApoc.GAME_SPEED = 800;
PostApoc.DAY_PER_STEP = 0.2;
PostApoc.FOOD_PER_SIZE = 0.02;
PostApoc.FULL_SPEED = 5;
PostApoc.SLOW_SPEED = 3;
PostApoc.FINAL_DISTANCE = 1000;
PostApoc.EVENT_PROBABILITY = 0.15;
PostApoc.ENEMY_FIREPOWER_AVG = 5;
PostApoc.ENEMY_GOLD_AVG = 5;

PostApoc.Game = {};

//initiate the game
PostApoc.Game.init = function(){

  //reference ui
  this.ui = PostApoc.UI;

  //reference event manager
  this.eventManager = PostApoc.Event;

  //setup Robot
  this.Robot = PostApoc.Robot;
  this.Robot.init({
    day: 0,
    distance: 0,
    vitality: 30,
    food: 80,
    strength: 2,
    money: 7,
    firepower: 2
  });

  //pass references
  this.Robot.ui = this.ui;
  this.Robot.eventManager = this.eventManager;

  this.ui.game = this;
  this.ui.Robot = this.Robot;
  this.ui.eventManager = this.eventManager;

  this.eventManager.game = this;
  this.eventManager.Robot = this.Robot;
  this.eventManager.ui = this.ui;

  //begin adventure!
  this.startJourney();
};

//start the journey and time starts running
PostApoc.Game.startJourney = function() {
  this.gameActive = true;
  this.previousTime = null;
  this.ui.notify('Time to head home', 'positive');

  this.step();
};

//game loop
PostApoc.Game.step = function(timestamp) {

  //starting, setup the previous time for the first time
  if(!this.previousTime){
    this.previousTime = timestamp;
    this.updateGame();
  }

  //time difference
  var progress = timestamp - this.previousTime;

  //game update
  if(progress >= PostApoc.GAME_SPEED) {
    this.previousTime = timestamp;
    this.updateGame();
  }

  //we use "bind" so that we can refer to the context "this" inside of the step method
  if(this.gameActive) window.requestAnimationFrame(this.step.bind(this));
};

//update game stats
PostApoc.Game.updateGame = function() {
  //day update
  this.Robot.day += PostApoc.DAY_PER_STEP;

  //food consumption
  this.Robot.consumeFood();

  if(this.Robot.food === 0) {
    this.ui.notify('Your Robot starved to death', 'negative');
    this.gameActive = false;
    return;
  }

  //update weight
  this.Robot.updateWeight();

  //update progress
  this.Robot.updateDistance();

  //show stats
  this.ui.refreshStats();

  //check if everyone died
  if(this.Robot.vitality <= 0) {
    this.Robot.vitality = 0;
    this.ui.notify('Everyone died', 'negative');
    this.gameActive = false;
    return;
  }

  //check win game
  if(this.Robot.distance >= PostApoc.FINAL_DISTANCE) {
    this.ui.notify('You have returned home!', 'positive');
    this.gameActive = false;
    return;
  }

  //random events
  if(Math.random() <= PostApoc.EVENT_PROBABILITY) {
    this.eventManager.generateEvent();
  }
};

//pause the journey
PostApoc.Game.pauseJourney = function() {
  this.gameActive = false;
};

//resume the journey
PostApoc.Game.resumeJourney = function() {
  this.gameActive = true;
  this.step();
};


//init game
PostApoc.Game.init();