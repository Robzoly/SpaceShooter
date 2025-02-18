const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');
const pauseMenu = document.getElementById('pauseMenu');
const resumeButton = document.getElementById('resumeButton');

const player = new Player(400, 550, 50, 50, 5);
let bullets = [];
let enemies = [];
let powerUps = [];
let score = 0;
let gameState = 'start'; // Estados: 'start', 'playing', 'paused'
let animationFrameId;
let round = 1;
let enemiesPerRound = 5;
let lives = 3;
let gameMode = 'infinite'; // 'infinite', 'levels', 'survival'

// Animación simple para los enemigos: cambiar entre dos colores
let enemyColorToggle = true;

// Array de estrellas para el fondo dinámico
let stars = [];
for (let i = 0; i < 100; i++) {
    stars.push({
        x: getRandomInt(0, canvas.width),
        y: getRandomInt(0, canvas.height),
        size: getRandomInt(1, 3),
        speed: getRandomInt(1, 3) / 10
    });
}

// Función para dibujar estrellas en movimiento
function drawStars(ctx, stars) {
    ctx.fillStyle = 'white';
    stars.forEach(star => {
        ctx.fillRect(star.x, star.y, star.size, star.size);
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = getRandomInt(0, canvas.width);
        }
    });
}

// Función para detectar colisión entre el jugador y los enemigos
function checkPlayerCollision(player, enemy) {
    return (
        player.x < enemy.x + enemy.width &&
        player.x + player.width > enemy.x &&
        player.y < enemy.y + enemy.height &&
        player.y + player.height > enemy.y
    );
}

// Función para detectar colisión entre balas y enemigos
function checkCollision(bullet, enemy) {
    return (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
    );
}

// Función para detectar colisión entre el jugador y los power-ups
function checkPowerUpCollision(player, powerUp) {
    return (
        player.x < powerUp.x + powerUp.width &&
        player.x + player.width > powerUp.x &&
        player.y < powerUp.y + powerUp.height &&
        player.y + player.height > powerUp.y
    );
}

// Crear enemigos al inicio del juego
function spawnEnemies() {
    lives = 3;
    player.multiShot = false;
    player.speed = 5; // Reiniciamos la velocidad del jugador
    let enemiesToSpawn = Math.min(enemiesPerRound, 10 - enemies.length);
    for (let i = 0; i < enemiesToSpawn; i++) {
        let type = ['basic', 'fast', 'tough'][getRandomInt(0, 2)];
        enemies.push(new Enemy(getRandomInt(0, 800 - 30), -30, getRandomInt(1, type === 'fast' ? 5 : 3), type));
    }
}

// Generar power-ups
function spawnPowerUp() {
    let types = ['life', 'multiShot', 'speed', 'shield'];
    let type = types[getRandomInt(0, 3)];
    powerUps.push(new PowerUp(getRandomInt(0, 800 - 20), -20, type));
}

// Evento para seleccionar el modo de juego
document.getElementById('startButton').addEventListener('click', () => {
    let modeSelect = document.createElement('div');
    modeSelect.innerHTML = `
        <h2>Selecciona el Modo de Juego</h2>
        <button class="btn btn-futuristic" onclick="selectMode('infinite')">Modo Infinito</button>
        <button class="btn btn-futuristic" onclick="selectMode('levels')">Modo por Niveles</button>
        <button class="btn btn-futuristic" onclick="selectMode('survival')">Modo Supervivencia</button>
    `;
    modeSelect.style.position = 'absolute';
    modeSelect.style.top = '50%';
    modeSelect.style.left = '50%';
    modeSelect.style.transform = 'translate(-50%, -50%)';
    modeSelect.style.background = 'rgba(0, 0, 0, 0.8)';
    modeSelect.style.padding = '20px';
    modeSelect.style.border = '2px solid #00ff00';
    modeSelect.style.borderRadius = '10px';
    modeSelect.style.boxShadow = '0 0 20px #00ff00';
    modeSelect.style.textAlign = 'center';
    document.body.appendChild(modeSelect);
});

// Función para seleccionar el modo de juego
function selectMode(mode) {
    gameMode = mode;
    startScreen.style.display = 'none';
    document.querySelector('.game-ui').style.display = 'block';
    canvas.style.display = 'block';
    document.body.removeChild(document.querySelector('div[style*="position: absolute;"]'));
    gameState = 'playing';
    spawnEnemies();
    gameLoop();
}

// Evento para pausar y reanudar el juego
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        if (gameState === 'playing') {
            gameState = 'paused';
            pauseMenu.style.display = 'block';
            cancelAnimationFrame(animationFrameId);
        } else if (gameState === 'paused') {
            gameState = 'playing';
            pauseMenu.style.display = 'none';
            gameLoop();
        }
    }
});

resumeButton.addEventListener('click', () => {
    gameState = 'playing';
    pauseMenu.style.display = 'none';
    gameLoop();
});

// Eventos de movimiento y disparo
document.addEventListener('keydown', (event) => {
    if (gameState !== 'playing') return;
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
            player.dy = -player.speed;
            break;
        case 'ArrowDown':
        case 's':
            player.dy = player.speed;
            break;
        case 'ArrowLeft':
        case 'a':
            player.dx = -player.speed;
            break;
        case 'ArrowRight':
        case 'd':
            player.dx = player.speed;
            break;
        case 'z':
        case ' ':
            if (!player.charging) {
                player.startCharge();
            }
            break;
    }
});

document.addEventListener('keyup', (event) => {
    if (gameState !== 'playing') return;
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'ArrowDown':
        case 's':
            player.dy = 0;
            break;
        case 'ArrowLeft':
        case 'a':
        case 'ArrowRight':
        case 'd':
            player.dx = 0;
            break;
        case 'z':
        case ' ':
            player.stopCharge();
            break;
    }
});

// Función para actualizar la UI
function updateUI() {
    document.getElementById('scoreDisplay').innerText = `SCORE: ${score}`;
    document.getElementById('roundDisplay').innerText = `ROUND: ${round}`;
    document.getElementById('livesDisplay').innerText = `LIVES: ${lives}`;
}

function gameLoop(deltaTime = 16) {
    if (gameState !== 'playing') return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujamos las estrellas de fondo
    drawStars(ctx, stars);

    player.move();
    player.draw(ctx);
    player.updateCharge(deltaTime);

    // Actualización de balas
    bullets = bullets.filter(bullet => {
        bullet.update();
        bullet.draw(ctx);

        for (let i = enemies.length - 1; i >= 0; i--) {
            if (checkCollision(bullet, enemies[i])) {
                if (enemies[i].takeDamage()) {
                    enemies.splice(i, 1);
                    score++;
                }
                return false;
            }
        }

        return bullet.x > 0 && bullet.x < 800 && bullet.y > 0 && bullet.y < 600;
    });

    // Actualización de enemigos con animación simple
    enemies.forEach(enemy => {
        enemy.update();
        if (checkPlayerCollision(player, enemy)) {
            enemies.splice(enemies.indexOf(enemy), 1);
            lives--;
            if (lives <= 0) {
                gameState = 'gameOver';
                cancelAnimationFrame(animationFrameId);
                alert('Game Over! Tu puntuación final es: ' + score);
                // Aquí podrías implementar una pantalla de game over o reiniciar el juego
                location.reload();
            }
        }
        enemyColorToggle = !enemyColorToggle;
        enemy.draw(ctx, enemy.type === 'basic' ? (enemyColorToggle ? '#ff0000' : '#ff6347') : null);
    });

    // Actualización de power-ups
    powerUps.forEach((powerUp, index) => {
        powerUp.update();
        powerUp.draw(ctx);

        if (checkPowerUpCollision(player, powerUp)) {
            powerUp.apply(player);
            powerUps.splice(index, 1);
        } else if (powerUp.y > 600) {
            powerUps.splice(index, 1);
        }
    });

    // Aplicar efectos temporales de los power-ups
    if (player.multiShot && powerUps.some(powerUp => powerUp.type === 'multiShot' && powerUp.duration > 0)) {
        let multiShotPowerUp = powerUps.find(powerUp => powerUp.type === 'multiShot');
        if (multiShotPowerUp.decreaseDuration(deltaTime)) {
            player.multiShot = false;
        }
    }
    if (player.speed > 5 && powerUps.some(powerUp => powerUp.type === 'speed' && powerUp.duration > 0)) {
        let speedPowerUp = powerUps.find(powerUp => powerUp.type === 'speed');
        if (speedPowerUp.decreaseDuration(deltaTime)) {
            player.speed = 5; // Volvemos a la velocidad original
        }
    }
    if (player.shield && powerUps.some(powerUp => powerUp.type === 'shield' && powerUp.duration > 0)) {
        let shieldPowerUp = powerUps.find(powerUp => powerUp.type === 'shield');
        if (shieldPowerUp.decreaseDuration(deltaTime)) {
            player.shield = false;
        }
    }

    // Dibujar la UI
    updateUI();

    // Lógica para avanzar de ronda
    if (enemies.length === 0) {
        if (gameMode === 'levels') {
            round++;
            enemiesPerRound = 5 * round; // Aumentamos la cantidad de enemigos por 5 cada nueva ronda
            spawnEnemies();
            spawnPowerUp(); // Generamos un power-up al final de cada nivel
        } else if (gameMode === 'infinite' || gameMode === 'survival') {
            round++;
            enemiesPerRound = Math.min(enemiesPerRound + 5, 30); // Aumentamos el número de enemigos cada ronda hasta un máximo
            spawnEnemies();
            if (Math.random() < 0.3) { // 30% de probabilidad de generar un power-up
                spawnPowerUp();
            }
        }
        // Ajustamos la dificultad
        enemies.forEach(enemy => {
            if (enemy.type === 'fast') enemy.speed += 0.2;
            if (enemy.type === 'tough') enemy.health = Math.min(enemy.health + 1, 5);
        });
    }

    // Lógica específica para el modo supervivencia
    if (gameMode === 'survival') {
        // Aquí podrías implementar un contador de tiempo o una condición de victoria basada en el tiempo
    }

    animationFrameId = requestAnimationFrame(gameLoop);
}

// Función para iniciar el juego
function startGame() {
    gameState = 'playing';
    startScreen.style.display = 'none';
    canvas.style.display = 'block';
    document.querySelector('.game-ui').style.display = 'block';
    spawnEnemies();
    gameLoop();
}

// Iniciar el juego cuando se presiona el botón de inicio
startButton.addEventListener('click', startGame);