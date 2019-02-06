var PostApoc = PostApoc || {};

PostApoc.Robot = {};

PostApoc.Robot.init = function(stats){
  this.day = stats.day;
  this.distance = stats.distance;
  this.vitality = stats.vitality;
  this.food = stats.food;
  this.strength = stats.strength;
  this.money = stats.money;
  this.firepower = stats.firepower;
};

//update weight and capacity
PostApoc.Robot.updateWeight = function(){
  var droppedFood = 0;
  var droppedGuns = 0;

  //how much can the Robot carry
  this.capacity = this.strength * PostApoc.WEIGHT_PER_BOX + this.vitality * PostApoc.WEIGHT_PER_SIZE;

  //how much weight do we currently have
  this.weight = this.food * PostApoc.FOOD_WEIGHT + this.firepower * PostApoc.FIREPOWER_WEIGHT;

  //drop things behind if it's too much weight
  //assume guns get dropped before food
  while(this.firepower && this.capacity <= this.weight) {
    this.firepower--;
    this.weight -= PostApoc.FIREPOWER_WEIGHT;
    droppedGuns++;
  }

  if(droppedGuns) {
    this.ui.notify('Left '+droppedGuns+' guns behind', 'negative');
  }

  while(this.food && this.capacity <= this.weight) {
    this.food--;
    this.weight -= PostApoc.FOOD_WEIGHT;
    droppedFood++;
  }

  if(droppedFood) {
    this.ui.notify('Left '+droppedFood+' food provisions behind', 'negative');
  }
};

//update covered distance
PostApoc.Robot.updateDistance = function() {
  //the closer to capacity, the slower
  var diff = this.capacity - this.weight;
  var speed = PostApoc.SLOW_SPEED + diff/this.capacity * PostApoc.FULL_SPEED;
  this.distance += speed;
};

/*
//food consumption
PostApoc.Robot.consumeFood = function() {
  this.food -= this.vitality * PostApoc.FOOD_PER_SIZE;

  if(this.food < 0) {
    this.food = 0;
  }
};
*/
