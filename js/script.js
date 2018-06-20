var canvas = document.querySelector("#canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 500;
document.body.appendChild(canvas);

let dictionary;
let country;

var xhr = new XMLHttpRequest();
xhr.open('GET', 'json/dictionary.json', true);
xhr.send();
xhr.onreadystatechange = function () {
  if (xhr.readyState != 4) return;

  if (xhr.status != 200) {
    console.log(xhr.status + ': ' + xhr.statusText);
  } else {
    dictionary = JSON.parse(xhr.responseText);
  }
}

var xhr1 = new XMLHttpRequest();
xhr1.open('GET', 'json/country.json', true);
xhr1.send();
xhr1.onreadystatechange = function () {
  console.log('json');
  if (xhr1.readyState != 4) return;

  if (xhr1.status != 200) {
    console.log(xhr1.status + ': ' + xhr1.statusText);
  } else {
    country = JSON.parse(xhr1.responseText);
  }
}

let taskType = document.querySelector('#taskType');
let enemyName;
let enemyName1 = ["ужасная", "злобная", "яростная", "злая", "грозная", "сердитая"];
let enemyName2 = ["Ведьма", "Колдунья", "Злюка"];
let enemyName3 = ["Лиза", "Даша", "Лара", "Вика", "Соня"];


var hpUser = 100;
var hpEnemy = 100;

let taskChoice;
let taskMode;
let taskText;

let round = 1;

function randomInt(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1)
  rand = Math.round(rand);
  if (rand === -0) {
    return 0;
  }
  return rand;
}

function defineEnemyName(i, j, k) {
  enemyName = enemyName1[i] + " " + enemyName2[j] + " " + enemyName3[k];
}

defineEnemyName(randomInt(0, enemyName1.length - 1), randomInt(0, enemyName2.length - 1), randomInt(0, enemyName3.length - 1));
console.log(enemyName);

var lastTime;
function main() {
  var now = Date.now();
  var dt = (now - lastTime) / 1000.0;

  // update(dt);
  render();

  lastTime = now;
  requestAnimationFrame(main);
};

resources.load(['img/back2.png', 'img/hero.png', "img/Gradient_Health_Bar.png", 'img/enemy_1.png', 'img/enemy_2.png', 'img/enemy_3.png', 'img/enemy_4.png', 'img/enemy_5.png', 'img/enemy_6.png']);
resources.onReady(init);

var ptrn;

var enemyHealth = getEnemyHealth(0);
var heroHealth = getHeroHealth(0);

function getEnemyHealth(i) {
  return {
    pos: [canvas.width - 250, 50],
    sprite: new Sprite('img/Gradient_Health_Bar.png', [i * 205, 0], [205, 50])
  }
}

function getHeroHealth(i) {
  return {
    pos: [50, 50],
    sprite: new Sprite('img/Gradient_Health_Bar.png', [i * 205, 0], [205, 50])
  }
}

// enemy = createEnemy(randomInt(1, 3));

// function createEnemy(i){
//   return{
//     pos: [canvas.width - 200, canvas.height / 2],
//     sprite: new Sprite('img/enemy_'+i+'.png', [0, 0], [150, 160])
//   }
// }

function animateHero(i, j) {
  return {
    pos: [j, canvas.height / 2 + 15],
    sprite: new Sprite('img/hero.png', [i * 220, 0], [220, 150])
  }
}

player = animateHero(0, 0);
var player_i = 0;
var player_j = -100;

var runHero = setInterval(function () {
  player_i++;
  player_i = player_i % 5;
  player_j += 25;

  player = animateHero(player_i, player_j);

  if (player.pos[0] > 100) {
    clearInterval(runHero);
  }
}, 100);


function animateEnemy(i, j, x) {
  return {
    pos: [j, canvas.height / 2],
    sprite: new Sprite('img/enemy_' + x + '.png', [i * 175, 0], [175, 165])
  }
}


var enemy_x = randomInt(1, 6);

function enemyAppear(randEnemy) {
  var enemy_j = canvas.width+50;
  var enemy_i = 0;
  enemy = animateEnemy(enemy_i, enemy_j, randEnemy);
  var runEnemy = setInterval(function () {
    enemy_i++;
    enemy_i = enemy_i % 4;
    enemy_j -= 25;

    enemy = animateEnemy(enemy_i, enemy_j, randEnemy);

    if (enemy.pos[0] < canvas.width - 200) {
      clearInterval(runEnemy);
    }
  }, 100);
}

enemyAppear(enemy_x);


function init() {

  ptrn = ctx.createPattern(resources.get('img/back2.png'), 'no-repeat');

  // document.getElementById('play-again').addEventListener('click', function() {
  //     reset();
  // });

  // reset();
  lastTime = Date.now();
  main();
}

function render() {
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // ctx.fillStyle = 'blue';



  // hero = resources.get('img/dino-hero/png/Idle (1).png');
  // ctx.drawImage(hero, 100, canvas.height / 2, 200, 150);
  ctx.font = "25px Arial";
  ctx.fillStyle = 'red';
  ctx.fillText(enemyName, canvas.width-275, 45);
  ctx.fillText('Round ' + round, canvas.width / 2 - 25, 50);
  ctx.fillText('Hero name', 75, 45);
  ctx.fillStyle = ptrn;

  renderEntity(player);
  renderEntity(enemy);
  renderEntity(heroHealth);
  renderEntity(enemyHealth);

  // enemy = resources.get('img/enemy_1_sprite.png');
  // ctx.drawImage(enemy, canvas.width-200, canvas.height / 2, 150, 125);
  setTimeout(function () { taskType.style.display = "block"; }, 1500);
}

function renderEntity(entity) {
  ctx.save();
  ctx.translate(entity.pos[0], entity.pos[1]);
  entity.sprite.render(ctx);

  ctx.restore();
}

let taskDiv = document.querySelector('#task');
let task = document.createElement("div");
let result;

function clearTaskDiv() {
  task.innerHTML = '';
}

function taskMath() {
  clearTaskDiv();
  let operators = ['+', '-', '*', '/'];
  let i = randomInt(0, operators.length - 1);
  let number1 = randomInt(0, 20);
  let number2 = randomInt(0, 20);
  taskText = "Enter result: "

  task.innerHTML = taskText + number1 + operators[i] + number2 + '=' + '<input type="text">';
  setTimeout(function(){
    let input = task.querySelector('input');
    input.focus();
  }, 100);

  switch (operators[i]) {
    case '+':
      result = number1 + number2;
      break;
    case '-':
      result = number1 - number2;
      break;
    case '*':
      result = number1 * number2;
      break;
    case '/':
      result = number1 / number2;
      result.toFixed(1);
      break;
  }

  taskDiv.appendChild(task);
  taskMode = 'input';
}


let checkTask = document.querySelector('#checkMathBtn');
checkTask.addEventListener('click', checkTaskAnswer);

function checkTaskAnswer() {
  let currentresult;
  if (taskMode == 'input') {
    currentresult = task.lastChild.value;
  } else if (taskMode == 'select') {
    currentresult = task.childNodes[1].value;
  } else if (taskMode == 'drag') {
    let sorted = $("#sortable").sortable("toArray");
    currentresult = sorted.join('');
  }

  // console.log('currentRes', currentresult);

  if (typeof result == "number") {
    currentresult = +currentresult;
  }

  if (taskChoice == "attack") {
    console.log("attack");
    if (result === currentresult) {
      hpEnemy = changeHeath(hpEnemy);
      enemyHealth = getEnemyHealth(hpCount(hpEnemy));
      closeTaskDiv();
      if (hpEnemy <= 0) {
        killEnemy();
      }
      console.log("true attack ", result, currentresult, 'hpEn', hpEnemy, 'hpUs', hpUser);
      return true;
    } else {
      hpUser = changeHeath(hpUser);
      heroHealth = getHeroHealth(hpCount(hpUser));
      closeTaskDiv();
      if (hpUser <= 0) {
        killUser();
      }
      console.log("false attack ", result, currentresult, 'hpEn', hpEnemy, 'hpUs', hpUser);
      return false;
    }
  } else {
    console.log("heal");

    if (result === currentresult) {
      hpUser = hpUser + 20;
      heroHealth = getHeroHealth(hpCount(hpUser));
      closeTaskDiv();
      if (hpUser >= 100) {
        hpUser = 100;
        heroHealth = getHeroHealth(hpCount(hpUser));
      }
      console.log("true heal ", result, currentresult, 'hpEn', hpEnemy, 'hpUs', hpUser);
      return true;
    } else {
      hpUser = changeHeath(hpUser);
      heroHealth = getHeroHealth(hpCount(hpUser));
      closeTaskDiv();
      if (hpUser <= 0) {
        killUser();
      }
      console.log("false heal", result, currentresult, 'hpEn', hpEnemy, 'hpUs', hpUser);
      return false;
    }
  }
};

function closeTaskDiv(){
  setTimeout(function(){
    taskDiv.style.display = 'none';
  }, 100);
}

function closeTaskTypeDiv(){
  taskType.style.display = 'none';
}

var btnAttack = document.querySelector('#attack');
btnAttack.addEventListener('click', attackEnemy);

function attackEnemy() {
  taskChoice = "attack";
  taskDiv.style.display = "flex";
  taskDiv.style.flexDirection = "column";
  randomTask();
}

var btnHeal = document.querySelector('#heal');
btnHeal.addEventListener('click', healUser);

function healUser() {
  taskChoice = "heal";
  taskDiv.style.display = "block";
  randomTask();
}

function changeHeath(hp) {
  hp = hp - 20;
  return hp;
}

function randomTask() {
  let functionArr = [taskMath, taskTranslate, taskAudio, taskDragAndDrop, taskComparison, taskCountries];
  let i = randomInt(0, functionArr.length - 1);

  return functionArr[i]();
}

function killEnemy() {
  enemyAppear(randomInt(1, 6));

  hpEnemy = 100;
  enemyHealth = getEnemyHealth(hpCount(hpEnemy));
  round++;
  console.log('round', round);
  // getHeroHealth(0);
  defineEnemyName(randomInt(0, enemyName1.length - 1), randomInt(0, enemyName2.length - 1), randomInt(0, enemyName3.length - 1));
  //enemy dies sprite + enemy born function(generate another enemy, generate another name)

}

function killUser() {
  //user dies sprite
  showTablescore();
}

function showTablescore(){

}

function taskTranslate() {
  clearTaskDiv();
  taskText = "Translate the word into russian: ";
  let i = randomInt(0, dictionary.length - 1);
  task.innerHTML = taskText + dictionary[i][0] + '<input type="text">';
  setTimeout(function(){
    let input = task.querySelector('input');
    input.focus();
  }, 100);
  result = dictionary[i][2];

  taskDiv.appendChild(task);
  taskMode = 'input';
}

function taskAudio() {
  clearTaskDiv();
  taskText = "Enter what do you hear: ";
  let btnRepeat = document.createElement('button');
  btnRepeat.textContent = "REPEAT";
  btnRepeat.addEventListener('click', function () {
    speak(i)
  });
  task.appendChild(btnRepeat);

  task.innerHTML += taskText + '<input type="text">';
  setTimeout(function(){
    let input = task.querySelector('input');
    input.focus();
  }, 100);
  taskDiv.appendChild(task);
  let i = randomInt(0, dictionary.length - 1);
  result = speak(i);

  taskMode = 'input';
}

var synth = window.speechSynthesis;

function speak(i) {
  let voices = synth.getVoices();
  if (synth.speaking) {
    console.error('speechSynthesis.speaking');
    return;
  }

  let utterThis = new SpeechSynthesisUtterance(dictionary[i][0]);

  utterThis.onend = function (event) {
    console.log('SpeechSynthesisUtterance.onend');
  }
  utterThis.onerror = function (event) {
    console.error('SpeechSynthesisUtterance.onerror');
  }

  utterThis.voice = voices[4];
  synth.speak(utterThis);
  return dictionary[i][0];
}

function shuffleArr(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function taskDragAndDrop() {
  clearTaskDiv();
  let i = randomInt(0, dictionary.length - 1);
  let word = dictionary[i][0];
  result = dictionary[i][0];

  let wordArr = word.split('');
  shuffleArr(wordArr);

  let ul = document.createElement('ul');
  ul.setAttribute('id', 'sortable');

  for (let j = 0; j < wordArr.length; j++) {
    let li = document.createElement('li');
    li.setAttribute('class', 'ui-state-default');
    li.textContent = wordArr[j];
    li.setAttribute('id', wordArr[j]);
    ul.appendChild(li);
  }

  task.appendChild(ul);

  $(function () {
    $("#sortable").sortable({
      axis: "x"
    });
    $("#sortable").disableSelection();
  });

  taskMode = 'drag';
}

function taskComparison() {
  clearTaskDiv();
  taskText = "Compare numbers: ";
  let i = randomInt(-100, 100);
  let j = randomInt(-100, 100);
  task.innerHTML = taskText + i + '  <select><option>></option><option><</option><option>=</option></select>  ' + j;
  taskDiv.appendChild(task);

  if (i > j) {
    result = '>'
  } else if (i < j) {
    result = '<';
  } else {
    result = '=';
  }

  taskMode = 'select';
}

function taskCountries() {
  clearTaskDiv();
  taskText = "Enter the capital of the country: ";
  let i = randomInt(0, country.length - 1);
  task.innerHTML = taskText + country[i][0] + '<input type="text">';
  setTimeout(function(){
    let input = task.querySelector('input');
    input.focus();
  }, 100);
  taskDiv.appendChild(task);

  result = country[i][1];
  taskMode = 'input';
}

function hpCount(n) {
  return (5 - (n / 20));
}