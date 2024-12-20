const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');

// Definir colores
const COLORS = [
    '#00FFFF', // Cyan
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FF00', // Green
    '#FF0000', // Red
    '#0000FF', // Blue
    '#FFFFFF', // White
];

// Tamaños
const BLOCK_SIZE = 30;
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

// Definir las formas de Tetris
const SHAPES = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]], // Z
    [[1, 0, 0], [1, 1, 1]], // J
    [[0, 0, 1], [1, 1, 1]]  // L
];

const SHAPE_COLORS = COLORS;

let board = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
let currentShape = randomShape();
let currentColor = randomColor();
let shapePos = { x: 3, y: 0 };
let score = 0;
let level = 1;
let isPaused = false;
let gameOver = false;
let fallSpeed = 1000;  // Tiempo de caída inicial
let lastFallTime = Date.now();

// Sonidos
const lineClearSound = new Audio('line_clear.mp3');
const gameOverSound = new Audio('game_over.mp3');

// Función para dibujar el tablero
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas

    // Dibujar las celdas del tablero
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (board[y][x]) {
                ctx.fillStyle = board[y][x];
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = '#000';
                ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

// Función para dibujar la pieza actual
function drawShape() {
    for (let y = 0; y < currentShape.length; y++) {
        for (let x = 0; x < currentShape[y].length; x++) {
            if (currentShape[y][x]) {
                ctx.fillStyle = currentColor;
                ctx.fillRect((shapePos.x + x) * BLOCK_SIZE, (shapePos.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeStyle = '#000';
                ctx.strokeRect((shapePos.x + x) * BLOCK_SIZE, (shapePos.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

// Función para generar una nueva pieza
function randomShape() {
    return SHAPES[Math.floor(Math.random() * SHAPES.length)];
}

function randomColor() {
    return SHAPE_COLORS[Math.floor(Math.random() * SHAPE_COLORS.length)];
}

// Función para mover la pieza hacia abajo
function moveShapeDown() {
    shapePos.y++;
    if (!isValidPosition()) {
        shapePos.y--;
        placeShape();
        board = clearLines(board);
        score += 10;
        if (score % 100 === 0) {
            level++;
            if (fallSpeed > 100) fallSpeed -= 50; // Aumentar la velocidad de caída con el nivel
        }
        currentShape = randomShape();
        currentColor = randomColor();
        shapePos = { x: 3, y: 0 };
        if (!isValidPosition()) {
            gameOver = true;
            gameOverSound.play();
            showGameOverScreen();
        }
    }
}

// Función para verificar si la pieza está en una posición válida
function isValidPosition() {
    for (let y = 0; y < currentShape.length; y++) {
        for (let x = 0; x < currentShape[y].length; x++) {
            if (currentShape[y][x]) {
                const newX = shapePos.x + x;
                const newY = shapePos.y + y;
                if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT || board[newY][newX]) {
                    return false;
                }
            }
        }
    }
    return true;
}

// Función para colocar la pieza en el tablero
function placeShape() {
    for (let y = 0; y < currentShape.length; y++) {
        for (let x = 0; x < currentShape[y].length; x++) {
            if (currentShape[y][x]) {
                board[shapePos.y + y][shapePos.x + x] = currentColor;
            }
        }
    }
}

// Función para eliminar líneas completas y hacer caer las filas superiores
function clearLines(board) {
    let linesCleared = 0;
    
    // Recorremos las filas del tablero de abajo hacia arriba
    board = board.filter(row => {
        if (row.every(cell => cell !== 0)) {
            linesCleared++;  // Incrementar el contador de filas completas
            lineClearSound.play();
            return false;  // Eliminar esta fila
        }
        return true;
    });

    // Agregar filas vacías en la parte superior según el número de líneas eliminadas
    while (linesCleared > 0) {
        board.unshift(Array(BOARD_WIDTH).fill(0));  // Agregar una fila vacía arriba
        linesCleared--;
    }

    return board;
}

// Función para actualizar el puntaje y el nivel
function updateMenu() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
}

// Función para mover la pieza
function moveShape(e) {
    if (gameOver || isPaused) return;

    if (e.key === 'ArrowLeft') {
        shapePos.x--;
        if (!isValidPosition()) {
            shapePos.x++;
        }
    } else if (e.key === 'ArrowRight') {
        shapePos.x++;
        if (!isValidPosition()) {
            shapePos.x--;
        }
    } else if (e.key === 'ArrowDown') {
        moveShapeDown();
    } else if (e.key === 'ArrowUp') {
        rotateShape();
    }
}

// Función para rotar la pieza
function rotateShape() {
    const rotatedShape = currentShape[0].map((_, index) => currentShape.map(row => row[index])).reverse();
    const originalShape = currentShape;
    currentShape = rotatedShape;
    if (!isValidPosition()) {
        currentShape = originalShape;
    }
}

// Función para pausar/despausar el juego
function togglePause() {
    isPaused = !isPaused;
    document.getElementById('pauseButton').textContent = isPaused ? 'Reanudar' : 'Pausar';
}

// Función para reiniciar el juego
function restartGame() {
    board = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
    currentShape = randomShape();
    currentColor = randomColor();
    shapePos = { x: 3, y: 0 };
    score = 0;
    level = 1;
    gameOver = false;
    isPaused = false;
    fallSpeed = 1000;  // Reiniciar la velocidad de caída
    document.getElementById('gameOverScreen').style.display = 'none';  // Ocultar pantalla de Game Over
    updateMenu(); // Actualizar el puntaje y nivel
    gameLoop(); // Reiniciar el bucle del juego
}

// Mostrar la pantalla de Game Over
function showGameOverScreen() {
    document.getElementById('gameOverScreen').style.display = 'block';
}

// Ocultar la pantalla de Game Over
function hideGameOverScreen() {
    document.getElementById('gameOverScreen').style.display = 'none';
}

// Bucle principal
function gameLoop() {
    if (gameOver) {
        return;
    }

    if (!isPaused && Date.now() - lastFallTime > fallSpeed) {
        lastFallTime = Date.now();
        moveShapeDown();
    }

    drawBoard();
    drawShape();
    updateMenu();

    requestAnimationFrame(gameLoop);
}

// Inicialización
document.addEventListener('keydown', moveShape);
document.getElementById('pauseButton').addEventListener('click', togglePause);
document.getElementById('restartButton').addEventListener('click', restartGame);
document.getElementById('gameOverRestartButton').addEventListener('click', restartGame);

gameLoop();
