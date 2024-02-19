const player = document.getElementById('player');
const monsters = document.querySelectorAll('.monster');
const loginScreen = document.getElementById('login-screen');
const gameScreen = document.getElementById('game-screen');
const startButton = document.getElementById('start-button');
const playerNameInput = document.getElementById('player-name');
const playerNameSpan = document.getElementById('player-name-info'); 
const currentTimeSpan = document.getElementById('current-time');
const elapsedTimeSpan = document.getElementById('elapsed-time');
const lifeCounterSpan = document.getElementById('life-counter');

let playerName = '';
let startTime = null; 
let elapsedTimeInterval = null; 
let monsterMovementInterval = null; 
let isSpawningPaused = false;
let trapCount = 0; 


// Функция для получения текущего времени 
function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

// Функция для обновления времени игры
function updateElapsedTime() {
  const currentTime = new Date();
  const elapsedTime = Math.floor((currentTime - startTime) / 1000); // Время в секундах
  const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
  const seconds = String(elapsedTime % 60).padStart(2, '0');
  elapsedTimeSpan.textContent = `${minutes}:${seconds}`;
}

function startGame(playerName) {
	playerNameSpan.textContent = playerName;
	startTime = new Date();
	elapsedTimeInterval = setInterval(updateElapsedTime, 1000);
	currentTimeSpan.textContent = getCurrentTime(); 
	lifeCounterSpan.textContent = '5'; 


	let monsterCount = 0;
	const maxMonsters = 10;
	const spawnInterval = 3000;

	monsterMovementInterval = setInterval(() => { // Запускаем интервал для перемещения монстров
		  if (monsterCount < maxMonsters) {
				 createMonster();
				 monsterCount++;
		  } else {
				 clearInterval(monsterMovementInterval);
		  }
	}, spawnInterval);

	// Спавн ловушек
	spawnTrap(); 
}


startButton.addEventListener('click', () => {
	const playerName = playerNameInput.value.trim();
	if (playerName !== '') {
	  loginScreen.style.display = 'none';
	  gameScreen.style.display = 'block';
	  startGame(playerName); // Запускаем игру с введенным именем игрока
	} else {
	  alert('Пожалуйста, введите ваше имя.');
	}
});

const gameContainer = document.getElementById('game-container');


let monsterCount = 0;
const maxMonsters = 10;
const spawnInterval = 3000;

function spawnMonster() {
  if (monsterCount < maxMonsters) {
    createMonster();
    monsterCount++;
  } else {
    clearInterval(monsterSpawnInterval);
  }
}

let monsterSpawnInterval = setInterval(spawnMonster, spawnInterval);

// Функция для создания монстра
function createMonster() {
  const monster = document.createElement('img');
  monster.src = './img/free-icon-party-12715281.png';
  monster.className = 'monster';
  
 
  const maxX = gameContainer.offsetWidth - monster.width;
  const maxY = gameContainer.offsetHeight - monster.height;
  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);
  
  monster.style.left = `${randomX}px`;
  monster.style.top = `${randomY}px`;
  
  gameContainer.appendChild(monster);
}


const maxTraps = 2; 


let trapSpawnInterval = setInterval(spawnTrap, 3000);

// Функция для спавна ловушек
function spawnTrap() {
  if (!isSpawningPaused && trapCount < maxTraps) {
    const trapContainer = document.getElementById('game-container');
    const trap = document.createElement('img');
    trap.src = './img/free-icon-trap-5434247.png';
    trap.className = 'trap';
    
    const maxX = trapContainer.offsetWidth - trap.width;
    const maxY = trapContainer.offsetHeight - trap.height;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    trap.style.left = `${randomX}px`;
    trap.style.top = `${randomY}px`;
    
    trapContainer.appendChild(trap);
    
    trapCount++;
  } else if (trapCount >= maxTraps) {
    clearInterval(trapSpawnInterval); 
}


// Функция для перемещения монстров
function moveMonsters() {
	if (!isGamePaused) { 
	  const monsters = document.querySelectorAll('.monster');
	  const step = 15;
	  
	  monsters.forEach(monster => {
		 const directionX = Math.random() > 0.5 ? 1 : -1; 
		 const directionY = Math.random() > 0.5 ? 1 : -1; 
		 
		 const monsterRect = monster.getBoundingClientRect();
		 const gameContainerRect = gameContainer.getBoundingClientRect();
		 
		 let newLeft = monsterRect.left + directionX * step;
		 let newTop = monsterRect.top + directionY * step;
		 

		 newLeft = Math.max(gameContainerRect.left, Math.min(newLeft, gameContainerRect.right - monsterRect.width));
		 newTop = Math.max(gameContainerRect.top, Math.min(newTop, gameContainerRect.bottom - monsterRect.height));
		 
		 monster.style.left = `${newLeft}px`;
		 monster.style.top = `${newTop}px`;
	  });
	}
 }


setInterval(moveMonsters, 100);

document.addEventListener('keydown', (event) => {
  const step = 10; 
  switch(event.key) {
    case 'w':
      movePlayer(0, -step);
      break;
    case 'a':
      movePlayer(-step, 0);
      break;
    case 's':
      movePlayer(0, step);
      break;
    case 'd':
      movePlayer(step, 0);
      break;
  }
});

function movePlayer(deltaX, deltaY) {
	if (!isGamePaused) { 
	  const playerRect = player.getBoundingClientRect();
	  const gameContainerRect = document.getElementById('game-container').getBoundingClientRect();
	  
	  let newLeft = playerRect.left + deltaX;
	  let newTop = playerRect.top + deltaY;
	  

	  newLeft = Math.max(gameContainerRect.left, Math.min(newLeft, gameContainerRect.right - playerRect.width));
	  newTop = Math.max(gameContainerRect.top, Math.min(newTop, gameContainerRect.bottom - playerRect.height));
	  
	  player.style.left = `${newLeft}px`;
	  player.style.top = `${newTop}px`;
	}
 }


document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') {
	  togglePauseGame(); 
	}
 });
 

 let isGamePaused = false;
 
// Функция для управления паузой игры
function togglePauseGame() {
	if (isGamePaused) {

	  resumeGame();
	  isSpawningPaused = false; 
	} else {

	  pauseGame();
	  isSpawningPaused = true; 
	}
 }

// Функция для постановки игры на паузу
function pauseGame() {
	clearInterval(elapsedTimeInterval);
	clearInterval(monsterMovementInterval); 
	gameScreen.classList.add('paused');
	isGamePaused = true;
	const pauseOverlay = document.getElementById('pause-overlay');
	pauseOverlay.style.display = 'flex'; 
}

function resumeGame() {
	elapsedTimeInterval = setInterval(updateElapsedTime, 1000);
	monsterMovementInterval = setInterval(moveMonsters, 100);
	gameScreen.classList.remove('paused');
	isGamePaused = false;

	if (!isSpawningPaused && monsterCount < maxMonsters) {
		 monsterSpawnInterval = setInterval(spawnMonster, spawnInterval);
	}

	if (!isSpawningPaused && trapCount < maxTraps) {
		 trapSpawnInterval = setInterval(spawnTrap, 3000);
	}

	const pauseOverlay = document.getElementById('pause-overlay');
	pauseOverlay.style.display = 'none';
}


function spawnMonster() {
	if (!isSpawningPaused && monsterCount < maxMonsters) { 
	  createMonster();
	  monsterCount++;
	} else {
	  clearInterval(monsterSpawnInterval);
	}
 }
 

function updateGameStats(monsterCollisions, trapCollisions) {
	const elapsedTime = elapsedTimeSpan.textContent;
	const remainingLives = lifeCounterSpan.textContent;

	const resultScreen = document.getElementById('result-screen');
	const resultTimeSpan = document.getElementById('result-time');
	const resultMonsterSpan = document.getElementById('result-monster');
	const resultTrapSpan = document.getElementById('result-trap');
	const resultLifeSpan = document.getElementById('result-life');

	resultTimeSpan.textContent = elapsedTime;
	resultMonsterSpan.textContent = monsterCollisions;
	resultTrapSpan.textContent = trapCollisions;
	resultLifeSpan.textContent = remainingLives;

	gameScreen.style.display = 'none'; 
	resultScreen.style.display = 'block'; 
}


function handleMonsterCollision() {
	lifeCounterSpan.textContent = Number(lifeCounterSpan.textContent) - 1; 
	if (lifeCounterSpan.textContent <= 0) {
		 updateGameStats(monsterCount, trapCount);
	} else {
		 player.style.left = '0px';
		 player.style.top = '0px';
	}
}


function handleTrapCollision() {
	lifeCounterSpan.textContent = Number(lifeCounterSpan.textContent) - 1; 
	if (lifeCounterSpan.textContent <= 0) {
		 updateGameStats(monsterCount, trapCount); 
	}

	player.style.left = '0px';
	player.style.top = '0px';
}


function checkCollisions() {
	const playerRect = player.getBoundingClientRect();
	const monsters = document.querySelectorAll('.monster');
	const traps = document.querySelectorAll('.trap');

	monsters.forEach(monster => {
		 const monsterRect = monster.getBoundingClientRect();
		 if (isColliding(playerRect, monsterRect)) {
			  handleMonsterCollision();
			  monster.remove();
		 }
	});

	traps.forEach(trap => {
		 const trapRect = trap.getBoundingClientRect();
		 if (isColliding(playerRect, trapRect)) {
			  handleTrapCollision();
			  trap.remove(); 
		 }
	});


	if (Number(lifeCounterSpan.textContent) <= 0) {
		 endGame();
	}
}


setInterval(checkCollisions, 100);



function isColliding(rect1, rect2) {
	return !(rect1.right < rect2.left ||
		 rect1.left > rect2.right ||
		 rect1.bottom < rect2.top ||
		 rect1.top > rect2.bottom);
}


const gameOverScreen = document.getElementById('game-over-screen');
const restartButton = document.getElementById('restart-button');


restartButton.addEventListener('click', () => {
    restartGame();
});

function handleMonsterCollision() {
	lifeCounterSpan.textContent = Number(lifeCounterSpan.textContent) - 1; 
	if (lifeCounterSpan.textContent <= 0) {
		 lifeCounterSpan.textContent = 0; 
		 endGame(); 
	} else {
		 player.style.left = '0px';
		 player.style.top = '0px';
	}
}

function handleTrapCollision() {
	lifeCounterSpan.textContent = Number(lifeCounterSpan.textContent) - 1; 
	if (lifeCounterSpan.textContent <= 0) {
		 lifeCounterSpan.textContent = 0; 
		 endGame(); 
	} else {
		 player.style.left = '0px';
		 player.style.top = '0px';
	}
}




finishElement.addEventListener('click', checkWin);

function checkWin() {

    const playerRect = player.getBoundingClientRect();
    const finishRect = finishElement.getBoundingClientRect();

    if (isColliding(playerRect, finishRect)) {
        endGame('WIN'); 
    }
}

function endGame(result) {
    clearInterval(elapsedTimeInterval);
    clearInterval(monsterMovementInterval);
    clearInterval(trapSpawnInterval);

    const resultScreen = document.getElementById('game-over-screen');
    resultScreen.style.display = 'block'; 


    const monsters = document.querySelectorAll('.monster');
    monsters.forEach(monster => {
        monster.remove();
    });

    const traps = document.querySelectorAll('.trap');
    traps.forEach(trap => {
        trap.remove();
    });

 
    const resultText = document.getElementById('result-text');
    resultText.textContent = result;


    const resultTime = document.getElementById('result-time');
    const resultMonster = document.getElementById('result-monster');
    const resultTrap = document.getElementById('result-trap');
    const resultLife = document.getElementById('result-life');

    resultTime.textContent = elapsedTimeSpan.textContent;
    resultMonster.textContent = monsterCount;
    resultTrap.textContent = trapCount;
    resultLife.textContent = lifeCounterSpan.textContent;


    const restartButton = document.getElementById('restart-button');
    restartButton.addEventListener('click', restartGame);
}

function restartGame() {

    elapsedTimeSpan.textContent = '00:00';
    lifeCounterSpan.textContent = '5';
    player.style.left = '0px';
    player.style.top = '0px';

    const monsters = document.querySelectorAll('.monster');
    monsters.forEach(monster => {
        monster.remove();
    });

    const traps = document.querySelectorAll('.trap');
    traps.forEach(trap => {
        trap.remove();
    });

    
    const gameOverScreen = document.getElementById('game-over-screen');
    gameOverScreen.style.display = 'none';

   
    startGame(playerName);
}



function updateGameStats(monsterCollisions, trapCollisions) {
	const elapsedTime = elapsedTimeSpan.textContent;
	const remainingLives = lifeCounterSpan.textContent;

	const resultScreen = document.getElementById('game-over-screen');
	const resultTimeSpan = document.getElementById('result-time');
	const resultMonsterSpan = document.getElementById('result-monster');
	const resultTrapSpan = document.getElementById('result-trap');
	const resultLifeSpan = document.getElementById('result-life');

	if (resultTimeSpan && resultMonsterSpan && resultTrapSpan && resultLifeSpan) { 
		 resultTimeSpan.textContent = elapsedTime;
		 resultMonsterSpan.textContent = monsterCollisions;
		 resultTrapSpan.textContent = trapCollisions;
		 resultLifeSpan.textContent = remainingLives;

		 gameScreen.style.display = 'none'; 
		 resultScreen.style.display = 'block'; 
	} else {
		 console.error('One of the required elements is null.'); 
	}
}

const finishElement = document.createElement('img');
finishElement.src = './img/free-icon-red-flag-395841.png'; 
finishElement.id = 'finish-element';
finishElement.style.position = 'absolute';
finishElement.style.bottom = '20px';
finishElement.style.right = '20px';
finishElement.style.width = '50px'; 
finishElement.style.height = '50px'; 


document.getElementById('game-container').appendChild(finishElement);


