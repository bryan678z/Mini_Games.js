const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreElement = document.getElementById("finalScore");
const restartGameOverBtn = document.getElementById("restartGameOverBtn");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");

const box = 20;
const rows = canvas.height / box;
const cols = canvas.width / box;

// Estado inicial del juego
let snake = [{ x: 5 * box, y: 5 * box }];
let food = spawnFood();
let score = 0;
let direction = null;
let gameRunning = true;
let gamePaused = false;
let gameSpeed = 110;

// Dibuja la serpiente
function drawSnake() {
    ctx.fillStyle = "#00ff00";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, box, box);
    });
}

// Genera comida en posición aleatoria
function spawnFood() {
    return {
        x: Math.floor(Math.random() * cols) * box,
        y: Math.floor(Math.random() * rows) * box,
    };
}

// Dibuja la comida
function drawFood() {
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(food.x, food.y, box, box);
}

// Mueve la serpiente
function moveSnake() {
    const head = { ...snake[0] };

    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;
    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;

    // Inserta la nueva cabeza
    snake.unshift(head);

    // Si la serpiente come, no elimina el último segmento
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        food = spawnFood();
        // Aumenta la velocidad del juego ligeramente
        if (gameSpeed > 50) gameSpeed -= 5;
    } else {
        // Elimina el último segmento si no come
        snake.pop();
    }
}

// Detecta colisiones
function checkCollision() {
    const head = snake[0];

    // Colisión con paredes (rebotar o permitir pasar)
    if (head.x < 0) head.x = canvas.width - box; // Pasa por el otro lado
    if (head.x >= canvas.width) head.x = 0; // Pasa por el otro lado
    if (head.y < 0) head.y = canvas.height - box; // Pasa por el otro lado
    if (head.y >= canvas.height) head.y = 0; // Pasa por el otro lado

    // Colisión con el cuerpo
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true; // Fin del juego si colisiona con su propio cuerpo
        }
    }

    return false;
}

// Pantalla de Game Over
function gameOver() {
    gameRunning = false;
    gameOverScreen.style.display = "block";
    finalScoreElement.textContent = score;
}

// Reinicia el juego
function restartGame() {
    snake = [{ x: 5 * box, y: 5 * box }];
    food = spawnFood();
    score = 0;
    direction = null;
    gameRunning = true;
    gamePaused = false;
    gameSpeed = 150;
    scoreElement.textContent = score;
    gameOverScreen.style.display = "none";
}

// Lógica principal del juego
function gameLoop() {
    if (gameRunning && !gamePaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSnake();
        drawFood();
        moveSnake();

        if (checkCollision()) {
            gameOver();
        }
    }

    setTimeout(gameLoop, gameSpeed);
}

// Eventos de teclado
document.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// Pausar o reanudar el juego
pauseBtn.addEventListener("click", () => {
    gamePaused = !gamePaused;
    pauseBtn.textContent = gamePaused ? "Reanudar" : "Pausar";
});

// Reiniciar desde el botón del juego
restartBtn.addEventListener("click", restartGame);

// Reiniciar desde el botón de la pantalla de Game Over
restartGameOverBtn.addEventListener("click", restartGame);

// Inicia el bucle del juego
gameLoop();
