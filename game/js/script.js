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

let heroName;

var hpUser = 100;
var hpEnemy = 100;

let taskChoice;
let taskMode;
let taskText;

let round = 1;

const RIGHT_KEYBOARD = 39;
const LEFT_KEYBOARD = 37;
const ENTER = 13;


function setFocusOnTaskType(event) {
  // taskType.children[0].focus();
  // console.log('111');
  // console.log(event);

  if (event.keyCode === RIGHT_KEYBOARD) {
    taskType.children[0].blur();
    taskType.children[1].focus();
    taskChoice = "attack";
  } else if (event.keyCode === LEFT_KEYBOARD) {
    taskType.children[0].focus();
    taskType.children[1].blur();
    taskChoice = "heal";
  }

  // if (event.keyCode === RIGHT_KEYBOARD) {
  //   taskType.children[0].classList.remove('btn_active');
  //   taskType.children[1].classList.add('btn_active');
  // } else if (event.keyCode === LEFT_KEYBOARD) {
  //   taskType.children[0].classList.add('btn_active');
  //   taskType.children[1].classList.remove('btn_active');
  // }
  // if (event.keyCode === ENTER && taskType.children[0].classList.contains('btn_active')) {
  //   healUser();
  // } else if(event.keyCode === ENTER && taskType.children[1].classList.contains('btn_active')){
  //   attackEnemy();
  // }
}

// function checkTaskEnter(event){
  
// }

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

let game = document.querySelector('#startGameForm');
game.addEventListener('submit', startGame);
game.addEventListener('keydown', startGameEnter);

function startGame(e) {
  e.preventDefault();
  let input = document.querySelector('#userNameInput');
  heroName = input.value;
  this.style.display = 'none';
  let divCover = document.querySelector('.cover_form');
  divCover.style.display = "none";
}

function startGameEnter(event) {
  if (event.keyCode === ENTER) {
    startGame(event);
  }
}

var lastTime;
function main() {
  // var now = Date.now();
  // var dt = (now - lastTime) / 1000.0;
  render();

  // lastTime = now;
  requestAnimationFrame(main);
};

var ptrn;

var enemyHealth = getEnemyHealth(0);
var heroHealth = getHeroHealth(0);

if (!localStorage.getItem('results')) {
  localStorage.setItem('results', '[]');
}

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

function animateHero(i, j) {
  return {
    pos: [j, canvas.height / 2 + 15],
    sprite: new Sprite('img/hero.png', [i * 220, 0], [220, 150])
  }
}

var player = animateHero(0, 0);
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
  var enemy_j = canvas.width + 50;
  var enemy_i = 0;
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
taskTypeDisplay('block');


function explosion(i, j) {
  return {
    pos: [j, player.pos[1] + 40],
    sprite: new Sprite('img/explosion_sprite.png', [i * 64, 0], [64, 66])
  }
}

var fire;

function explosionAppear() {
  var explosion_i = 0;
  var explosion_j = player.pos[0] + 40;
  fire = explosion(explosion_i, explosion_j);

  var explosionStart = setInterval(function () {
    explosion_i++;
    explosion_i = explosion_i % 16;
    explosion_j += 10;
    fire = explosion(explosion_i, explosion_j);
    audioAttack.play();
    if (fire.pos[0] >= enemy.pos[0] - 20) {
      clearInterval(explosionStart);
      audioAttack.pause();
      fire = null;
    }
  }, 25);
}


function explosionEnemyAppear() {
  var explosion_i = 0;
  var explosion_j = enemy.pos[0] - 40;
  fire = explosion(explosion_i, explosion_j);

  var explosionStart = setInterval(function () {
    explosion_i++;
    explosion_i = explosion_i % 16;
    explosion_j -= 10;
    fire = explosion(explosion_i, explosion_j);
    audioAttack.play();
    if (fire.pos[0] <= player.pos[0] + 50) {
      clearInterval(explosionStart);
      audioAttack.pause();
      fire = null;
    }
  }, 25);
}

function magicSpell(i) {
  return {
    pos: [player.pos[0] + 45, player.pos[1] - 130],
    sprite: new Sprite('img/magic.png', [i * 198, 0], [198, 158])
  }
}

var magic;

function magicAppear() {
  var magic_i = 0;
  magic = magicSpell(magic_i);

  var magicStart = setInterval(function () {
    magic_i++;
    magic = magicSpell(magic_i);
    audioHeal.play();
    if (magic_i >= 7) {
      clearInterval(magicStart);
      audioHeal.pause();
      magic = null;
    }
  }, 150);
}

function init() {
  ptrn = ctx.createPattern(resources.get('img/back2.png'), 'no-repeat');
  lastTime = Date.now();
  main();
}

function render() {
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "25px Arial";
  ctx.fillStyle = 'red';
  ctx.fillText(enemyName, canvas.width - 300, 45);
  ctx.fillText('Round ' + round, canvas.width / 2 - 25, 50);
  ctx.fillText(heroName, 75, 45);
  ctx.fillStyle = ptrn;

  renderEntity(player);
  renderEntity(enemy);
  renderEntity(heroHealth);
  renderEntity(enemyHealth);
  if (fire) {
    renderEntity(fire);
  }
  if (magic) {
    renderEntity(magic);
  }
}

function taskTypeDisplay(displayValue) {
  if (displayValue == 'block') {
    taskType.style.display = "block";
    document.addEventListener("keydown", setFocusOnTaskType); //document
  } else {
    taskType.style.display = "none";
  }
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
  focusInput();

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
checkTask.parentElement.addEventListener('keydown', checkTaskAnswerEnter);


function checkTaskAnswerEnter(event) {
  if (event.keyCode === ENTER) {
    checkTaskAnswer();
  }
}


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

  if (typeof result == "number") {
    currentresult = +currentresult;
  }

  if (taskChoice == "attack") {
    if (result === currentresult) {
      hpEnemy = changeHeath(hpEnemy);
      enemyHealth = getEnemyHealth(hpCount(hpEnemy));
      closeTaskDiv();
      if (hpEnemy <= 0) {
        setTimeout(function () {
          killEnemy();
        }, 1700)
      }
      explosionAppear();

      setTimeout(function () {
        taskTypeDisplay('block');
      }, 2000);
      return true;
    } else {
      hpUser = changeHeath(hpUser);
      heroHealth = getHeroHealth(hpCount(hpUser));
      closeTaskDiv();
      if (hpUser <= 0) {
        setTimeout(function () {
          killUser();
        }, 1700);
      }
      explosionEnemyAppear();

      setTimeout(function () {
        taskTypeDisplay('block');
      }, 2000);
      return false;
    }
  } else {
    if (result === currentresult) {
      hpUser = hpUser + 20;
      heroHealth = getHeroHealth(hpCount(hpUser));
      closeTaskDiv();
      if (hpUser > 100) {
        hpUser = 100;
        heroHealth = getHeroHealth(hpCount(hpUser));
      } else {
        magicAppear();
      }

      setTimeout(function () {
        taskTypeDisplay('block');
      }, 2000);

      return true;
    } else {
      hpUser = changeHeath(hpUser);
      heroHealth = getHeroHealth(hpCount(hpUser));
      closeTaskDiv();
      if (hpUser <= 0) {
        setTimeout(function () {
          killEnemy();
        }, 1700)
      }
      explosionEnemyAppear();
      setTimeout(function () {
        taskTypeDisplay('block');
      }, 2000);
      return false;
    }
  }
}

function closeTaskDiv() {
  setTimeout(function () {
    taskDiv.style.display = 'none';
  }, 100);
}

var audioAttack = document.querySelector('#audioAttack');
var audioHeal = document.querySelector('#audioHeal');


var btnAttack = document.querySelector('#attack');
btnAttack.addEventListener('click', attackEnemy);

function attackEnemy() {
  taskTypeDisplay('none');
  taskChoice = "attack";
  taskDiv.style.display = "flex";
  taskDiv.style.flexDirection = "column";
  // randomTask();
  // taskColours();
  taskComparison();
}

var btnHeal = document.querySelector('#heal');
btnHeal.addEventListener('click', healUser);

function healUser() {
  taskTypeDisplay('none');
  taskChoice = "heal";
  taskDiv.style.display = "flex";
  taskDiv.style.flexDirection = "column";
  // randomTask();
  // taskColours();
  taskComparison();

}

function changeHeath(hp) {
  hp = hp - 20;
  return hp;
}

function randomTask() {
  // let functionArr = [taskMath, taskTranslate, taskAudio, taskDragAndDrop, taskComparison, taskCountries, taskColours];
  // let i = randomInt(0, functionArr.length - 1);

  // return functionArr[i]();
}

function killEnemy() {
  enemyAppear(randomInt(1, 6));

  hpEnemy = 100;
  enemyHealth = getEnemyHealth(hpCount(hpEnemy));
  round++;
  defineEnemyName(randomInt(0, enemyName1.length - 1), randomInt(0, enemyName2.length - 1), randomInt(0, enemyName3.length - 1));
}

function killUser() {

  var scores = JSON.parse(localStorage.getItem('results')) || [];
  scores.push({
    name: heroName,
    rounds: round
  });
  scores.sort(compareRounds);
  if (scores.length > 10) {
    scores.pop();
  }
  localStorage.setItem('results', JSON.stringify(scores));
  showTablescore();
}

function compareRounds(scoresA, scoresB) {
  return scoresB.rounds - scoresA.rounds;
}

function showTablescore() {
  let scoreTable = document.querySelector('#scoreTable');
  let scoreDiv = scoreTable.parentElement;

  var scores = JSON.parse(localStorage.getItem('results')) || [];
  var scoresRows = scores.reduce((result, item) => {
    let newScore = document.createElement('tr');
    newScore.innerHTML = '<td>' + item.name + '</td>' + '<td>' + item.rounds + '</td>';
    result.push(newScore);
    return result;
  }, []);

  scoresRows.forEach(element => {
    scoreTable.appendChild(element)
  });
  let divCover = document.querySelector('.cover_form');
  divCover.style.display = "block";
  scoreDiv.style.display = 'flex';
}

let restart = document.querySelector("#restartGame");
restart.addEventListener('click', function () {
  location.reload();
});

restart.parentElement.addEventListener('keydown', function (event) {
  console.log(event);
  if (event.keyCode === ENTER) {
    location.reload();
  }
})

function taskTranslate() {
  clearTaskDiv();
  taskText = "Translate the word into russian: ";
  let i = randomInt(0, dictionary.length - 1);
  task.innerHTML = taskText + dictionary[i][0] + '<input type="text">';
  focusInput();
  result = dictionary[i][2];

  taskDiv.appendChild(task);
  taskMode = 'input';
}
let btnRepeat;

function taskAudio() {
  clearTaskDiv();
  taskText = "Enter what do you hear: ";
  btnRepeat = document.createElement('button');
  btnRepeat.textContent = "REPEAT";

  task.innerHTML += taskText + '<input type="text">';
  focusInput();
  taskDiv.appendChild(task);
  let i = randomInt(0, dictionary.length - 1);
  result = speak(i);

  taskMode = 'input';

  btnRepeat.addEventListener('click', function () {
    speak(i);
    focusInput();
  });
  task.appendChild(btnRepeat);
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

  let select = taskDiv.querySelector('select');
  select.focus();
}

function taskCountries() {
  clearTaskDiv();
  taskText = "Enter the capital of the country: ";
  let i = randomInt(0, country.length - 1);
  task.innerHTML = taskText + country[i][0] + '<input type="text">';
  focusInput();
  taskDiv.appendChild(task);

  result = country[i][1];
  taskMode = 'input';
}

function hpCount(n) {
  return (5 - (n / 20));
}


function taskColours() {
  clearTaskDiv();
  let coloursArr = ['black', 'yellow', 'green', 'pink', 'red', 'orange', 'brown', 'gray', 'violet', 'blue'];
  let i = randomInt(0, coloursArr.length - 1);
  let figure = document.createElement('div');

  taskText = "Enter the colour of the figure: ";
  figure.classList.add('taskfigure');
  figure.style.backgroundColor = coloursArr[i];
  result = figure.style.backgroundColor;

  task.appendChild(figure);
  task.innerHTML += taskText + '<input type="text">';

  focusInput();

  taskDiv.appendChild(task);
  taskMode = 'input';
}

function focusInput() {
  let input = task.querySelector('input');
  setTimeout(function () {
    input.focus();
  }, 100);
}

resources.load(['img/back2.png', 'img/hero.png', "img/Gradient_Health_Bar.png", 'img/enemy_1.png', 'img/enemy_2.png', 'img/enemy_3.png', 'img/enemy_4.png', 'img/enemy_5.png', 'img/enemy_6.png', 'img/explosion_sprite.png', 'img/magic.png']);
resources.onReady(init);