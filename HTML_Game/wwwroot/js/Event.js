/// <reference path="robot.js" />
var PostApoc = PostApoc || {};

PostApoc.Event = {};

PostApoc.Event.eventTypes = [
   {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'vitality',
    value: -1,
    text: 'Hit your toe on a rock. vitality Lost: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'vitality',
    value: -3,
    text: 'Walked to a lamp post, in the middle of wasteland. vitality Lost: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'food',
    value: -10,
    text: 'Worm infestation. Food lost: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'money',
    value: -50,
    text: 'Pick pockets steal $'
  },
  {
    type: 'STAT-CHANGE',
    notification: 'negative',
    stat: 'strength',
    value: -1,
    text: 'BOX flu outbreak. Casualties: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'food',
    value: 20,
    text: 'Found wild berries. Food added: '
  }, 
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'food',
    value: 20,
    text: 'Found wild berries. Food added: '
  },
  {
    type: 'STAT-CHANGE',
    notification: 'positive',
    stat: 'strength',
    value: 1,
    text: 'Found wild strength. New strength: '
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'You have found a shop',
    products: [
      {item: 'food', qty: 20, price: 50},
      {item: 'strength', qty: 1, price: 200},
      {item: 'firepower', qty: 2, price: 50},
      {item: 'vitality', qty: 5, price: 80}
    ]
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'You have found a shop',
    products: [
      {item: 'food', qty: 30, price: 50},
      {item: 'strength', qty: 1, price: 200},
      {item: 'firepower', qty: 2, price: 20},
      {item: 'vitality', qty: 10, price: 80}
    ]
  },
  {
    type: 'SHOP',
    notification: 'neutral',
    text: 'Smugglers sell various goods',
    products: [
      {item: 'food', qty: 20, price: 60},
      {item: 'strength', qty: 1, price: 300},
      {item: 'firepower', qty: 2, price: 80},
      {item: 'vitality', qty: 5, price: 60}
    ]
    },
    {
     type: 'CALM',
     notification: 'neutral',
     text: 'You have found calm area. Rest and look at your inventory OR push forward.',
     //inventory code?
    },
    {
        type: 'CALM',
        notification: 'neutral',
        text: 'You have found calm area. Rest and look at your inventory OR push forward.',
        //inventory code?
    },
    {
        type: 'CALM',
        notification: 'neutral',
        text: 'You have found calm area. Rest and look at your inventory OR push forward.',
        //inventory code?
    },
    {
        type: 'CALM',
        notification: 'neutral',
        text: 'You have found calm area. Rest and look at your inventory OR push forward.',
        //inventory code?
    },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'Bandits are attacking you'
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'Bandits are attacking you'
  },
  {
    type: 'ATTACK',
    notification: 'negative',
    text: 'Bandits are attacking you'
  }
];

PostApoc.Event.generateEvent = function(){
  //pick random one
  var eventIndex = Math.floor(Math.random() * this.eventTypes.length);
  var eventData = this.eventTypes[eventIndex];

  //events that consist in updating a stat
  if(eventData.type == 'STAT-CHANGE') {
    this.stateChangeEvent(eventData);
  }

  //shops
  else if(eventData.type == 'SHOP') {
    //pause game
    this.game.pauseJourney();

    //notify user
    this.ui.notify(eventData.text, eventData.notification);

    //prepare event
    this.shopEvent(eventData);
  }

  //calm area
  else if (eventData.type == 'CALM') {
      //pause game
      this.game.pauseJourney();

      //notify user
      this.ui.notify(eventData.text, eventData.notification);

      //prepare event
      this.calmEvent(eventData);
  }

  //attacks
  else if(eventData.type == 'ATTACK') {
    //pause game
    this.game.pauseJourney();

    //notify user
    this.ui.notify(eventData.text, eventData.notification);

    //prepare event
    this.attackEvent(eventData);
  }
};

PostApoc.Event.stateChangeEvent = function(eventData) {
  //can't have negative quantities
  if(eventData.value + this.Robot[eventData.stat] >= 0) {
    this.Robot[eventData.stat] += eventData.value;
    this.ui.notify(eventData.text + Math.abs(eventData.value), eventData.notification);
  }
};

PostApoc.Event.shopEvent = function(eventData) {
  //number of products for sale
  var numProds = Math.ceil(Math.random() * 4);

  //product list
  var products = [];
  var j, priceFactor;

  for(var i = 0; i < numProds; i++) {
    //random product
    j = Math.floor(Math.random() * eventData.products.length);

    //multiply price by random factor +-30%
    priceFactor = 0.7 + 0.6 * Math.random();

    products.push({
      item: eventData.products[j].item,
      qty: eventData.products[j].qty,
      price: Math.round(eventData.products[j].price * priceFactor)
    });
  }

  this.ui.showShop(products);
};

//prepare an attack event
PostApoc.Event.attackEvent = function(eventData){
  var firepower = Math.round((0.7 + 0.6 * Math.random()) * PostApoc.ENEMY_FIREPOWER_AVG);
  var gold = Math.round((0.7 + 0.6 * Math.random()) * PostApoc.ENEMY_GOLD_AVG);

  this.ui.showAttack(firepower, gold);
};

PostApoc.Event.calmEvent = function (eventData) {
    //var firepower = Math.round((0.7 + 0.6 * Math.random()) * PostApoc.ENEMY_FIREPOWER_AVG);
    //var gold = Math.round((0.7 + 0.6 * Math.random()) * PostApoc.ENEMY_GOLD_AVG);

    this.ui.showCalm();
};