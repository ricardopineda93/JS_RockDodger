// git checkout origin master -- index.js
const DODGER = document.getElementById('dodger')
const GAME = document.getElementById('game')
const GAME_HEIGHT = 400
const GAME_WIDTH = 400
const LEFT_ARROW = 37 // use e.which!
const RIGHT_ARROW = 39 // use e.which!
const ROCKS = []
const START = document.getElementById('start')

var gameInterval = null

function checkCollision(rock) {
 
  const top = positionToInteger(rock.style.top)

  // rocks are 20px high
  // DODGER is 20px high
  // GAME_HEIGHT - 20 - 20 = 360px;
  if (top > 360) {
    const dodgerLeftEdge = positionToInteger(DODGER.style.left)
    
    // DODGER is 40px wide... 
    const dodgerRightEdge = dodgerLeftEdge + 40;

    const rockLeftEdge = positionToInteger(rock.style.left)

    // Rock is 20px wide...
    const rockRightEdge = rockLeftEdge + 20;

    if (
    ((rockLeftEdge <= dodgerLeftEdge) && (rockRightEdge >= dodgerLeftEdge)) ||
    ((rockLeftEdge >= dodgerLeftEdge) && (rockRightEdge <= dodgerRightEdge)) ||
    ((rockLeftEdge <= dodgerRightEdge) && (rockRightEdge >= dodgerRightEdge))
               ){
      return true
    }
  }
}

function createRock(x) {
  const rock = document.createElement('div')

  rock.className = 'rock'
  rock.style.left = `${x}px`

  var top = 0

  rock.style.top = top


  function moveRock() {

     //3 possible scenarios to determine rock movement - rock collides with DODGER and endGame(), 
     //Rock neither hits dodger nor hits bottom of screen so can continue to move down,
     //Rock reaches bottom of screen and must be terminated.
     
     if (checkCollision(rock)){
       endGame();
     } else if (top < 400){function step() {
         rock.style.top = `${top += 2}px`
         window.requestAnimationFrame(step)
         }
       window.requestAnimationFrame(step);
     } else {
       rock.remove();
       }
     }
  
  // Add the rock to ROCKS so that we can remove all rocks
  // when there's a collision
  
  ROCKS.push(rock)

  // Finally, return the rock element 
  
  return rock
}


/**
 * End the game by clearing `gameInterval`,
 * removing all ROCKS from the DOM,
 * and removing the `moveDodger` event listener.
 * Finally, alert "YOU LOSE!" to the player.
 */
function endGame() {
  clearInterval(gameInterval);

  ROCKS.forEach(function(rock){
    rock.remove();
  });

  window.removeEventListener('keydown', moveDodger);

  alert('YOU LOSE!');
}


function moveDodger(e) {
 
   if(e.which === LEFT_ARROW){
     e.preventDefault();
     e.stopPropagation();
     moveDodgerLeft();
   } else if (e.which === RIGHT_ARROW) {
     e.preventDefault();
     e.stopPropagation();
     moveDodgerRight();
   }
}


function moveDodgerLeft() {

  var left = positionToInteger(DODGER.style.left);

  function leftStep(){
    if (left > 0) {
      DODGER.style.left = `${left -= 4}px`;
    }
  }
  window.requestAnimationFrame(leftStep)
}


function moveDodgerRight() {

   var left = positionToInteger(DODGER.style.left);

   function rightStep(){
     if (left < 360){
           DODGER.style.left = `${left += 4}px`;
     }
   }
   window.requestAnimationFrame(rightStep)
}
/**
 * @param {string} p The position property
 * @returns {number} The position as an integer (without 'px')
 */
function positionToInteger(p) {
  return parseInt(p.split('px')[0]) || 0
}

function start() {
  window.addEventListener('keydown', moveDodger)

  START.style.display = 'none'

  gameInterval = setInterval(function() {
    createRock(Math.floor(Math.random() *  (GAME_WIDTH - 20)))
  }, 1000)
}
