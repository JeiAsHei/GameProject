var PostApoc = PostApoc || {};

PostApoc.UI = {};

//show a notification in the message area
PostApoc.UI.notify = function(message, type){
  document.getElementById('updates-area').innerHTML = '<div class="update-' + type + '">Day '+ Math.ceil(this.Robot.day) + ': ' + message+'</div>' + document.getElementById('updates-area').innerHTML;
};

//refresh visual Robot stats
PostApoc.UI.refreshStats = function() {
  //modify the dom
  document.getElementById('stat-day').innerHTML = Math.ceil(this.Robot.day);
  document.getElementById('stat-distance').innerHTML = Math.floor(this.Robot.distance);
  document.getElementById('stat-vitality').innerHTML = this.Robot.vitality;
  document.getElementById('stat-strength').innerHTML = this.Robot.strength;
  document.getElementById('stat-food').innerHTML = Math.ceil(this.Robot.food);
  document.getElementById('stat-money').innerHTML = this.Robot.money;
  document.getElementById('stat-firepower').innerHTML = this.Robot.firepower;
  document.getElementById('stat-weight').innerHTML = Math.ceil(this.Robot.weight) + '/' + this.Robot.capacity;

  //update Robot position
  document.getElementById('Robot').style.left = (380 * this.Robot.distance/PostApoc.FINAL_DISTANCE) + 'px';
};

//show shop
PostApoc.UI.showShop = function(products){

  //get shop area
  var shopDiv = document.getElementById('shop');
  shopDiv.classList.remove('hidden');

  //init the shop just once
  if(!this.shopInitiated) {

    //event delegation
    shopDiv.addEventListener('click', function(e){
      //what was clicked
      var target = e.target || e.src;

      //exit button
      if(target.tagName == 'BUTTON') {
        //resume journey
        shopDiv.classList.add('hidden');
        PostApoc.UI.game.resumeJourney();
      }
      else if(target.tagName == 'DIV' && target.className.match(/product/)) {

        console.log('buying')

        var bought = PostApoc.UI.buyProduct({
          item: target.getAttribute('data-item'),
          qty: target.getAttribute('data-qty'),
          price: target.getAttribute('data-price')
        });

        if(bought) target.html = '';
      }
    });

    this.shopInitiated = true;
  }

  //clear existing content
  var prodsDiv = document.getElementById('prods');
  prodsDiv.innerHTML = '';

  //show products
  var product;
  for(var i=0; i < products.length; i++) {
    product = products[i];
    prodsDiv.innerHTML += '<div class="product" data-qty="' + product.qty + '" data-item="' + product.item + '" data-price="' + product.price + '">' + product.qty + ' ' + product.item + ' - $' + product.price + '</div>';
  }

  //setup click event
  //document.getElementsByClassName('product').addEventListener(PostApoc.UI.buyProduct);
};

//show calm area
PostApoc.UI.showCalm = function () {

    //get calm area
    var calmDiv = document.getElementById('calm');
    calmDiv.classList.remove('hidden');

    //init the shop just once
    if (!this.calmInitiated) {

        //event delegation
        calmDiv.addEventListener('click', function (e) {
            //what was clicked
            var target = e.target || e.src;

            //exit button
            if (target.tagName == 'BUTTON') {
                //resume journey
                calmDiv.classList.add('hidden');
                PostApoc.UI.game.resumeJourney();
            }

        }); 

            this.shopInitiated = true;
        }

        };

//buy product
PostApoc.UI.buyProduct = function(product) {
  //check we can afford it
  if(product.price > PostApoc.UI.Robot.money) {
    PostApoc.UI.notify('Not enough money', 'negative');
    return false;
  }

  PostApoc.UI.Robot.money -= product.price;

  PostApoc.UI.Robot[product.item] += +product.qty;

  PostApoc.UI.notify('Bought ' + product.qty + ' x ' + product.item, 'positive');

  //update weight
  PostApoc.UI.Robot.updateWeight();

  //update visuals
  PostApoc.UI.refreshStats();

  return true;

};

//show attack
PostApoc.UI.showAttack = function(firepower, gold) {
  var attackDiv = document.getElementById('attack');
  attackDiv.classList.remove('hidden');

  //keep properties
  this.firepower = firepower;
  this.gold = gold;

  //show firepower
  document.getElementById('attack-description').innerHTML = 'Firepower: ' + firepower;

  //init once
  if(!this.attackInitiated) {

    //fight
    document.getElementById('fight').addEventListener('click', this.fight.bind(this));

    //run away
    document.getElementById('runaway').addEventListener('click', this.runaway.bind(this));

    this.attackInitiated = true;
  }
};

//fight
PostApoc.UI.fight = function(){

  var firepower = this.firepower;
  var gold = this.gold;

  var damage = Math.ceil(Math.max(0, firepower * 2 * Math.random() - this.Robot.firepower));

  //check there are survivors
  if(damage < this.Robot.vitality) {
    this.Robot.vitality -= damage;
    this.Robot.money += gold;
    this.notify(damage + ' people were killed fighting', 'negative');
    this.notify('Found $' + gold, 'gold');
  }
  else {
    this.Robot.vitality = 0;
    this.notify('Everybody died in the fight', 'negative');
  }

  //resume journey
  document.getElementById('attack').classList.add('hidden');
  this.game.resumeJourney();
};

//runing away from enemy
PostApoc.UI.runaway = function(){

  var firepower = this.firepower;

  var damage = Math.ceil(Math.max(0, firepower * Math.random()/2));

  //check there are survivors
  if(damage < this.Robot.vitality) {
    this.Robot.vitality -= damage;
    this.notify(' Shot in the ass and lost ' + damage + ' vitality, while running like a chicken', 'negative');
  }
  else {
    this.Robot.vitality = 0;
    this.notify('If (your.speed < bullet.speed) {you = dead};', 'negative');
  }

  //remove event listener
  document.getElementById('runaway').removeEventListener('click');

  //resume journey
  document.getElementById('attack').classList.add('hidden');
  this.game.resumeJourney();

};