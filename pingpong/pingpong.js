const canvas = document.getElementById('pingpong');
const ctx = canvas.getContext('2d');

// Tamaño de las palas y pelota
let paddleWidth = 10, paddleHeight = 100;
let ballRadius = 10;

// Posiciones iniciales de las palas
let paddle1Y = (canvas.height - paddleHeight) / 2;
let paddle2Y = (canvas.height - paddleHeight) / 2;

// Posición y velocidad de la pelota
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 3;
let ballSpeedY = 2;

// Estado de las teclas para mover las palas
let wPressed = false;
let sPressed = false;
let upPressed = false;
let downPressed = false;

// Contadores de puntos
let player1Score = 0;
let player2Score = 0;

// Manejadores de teclas
document.addEventListener('keydown', (e) => {
    if (e.key === 'w' || e.key === 'W') {
        wPressed = true;
    }
    if (e.key === 's' || e.key === 'S') {
        sPressed = true;
    }
    if (e.key === 'ArrowUp') {
        upPressed = true;
    }
    if (e.key === 'ArrowDown') {
        downPressed = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 'W') {
        wPressed = false;
    }
    if (e.key === 's' || e.key === 'S') {
        sPressed = false;
    }
    if (e.key === 'ArrowUp') {
        upPressed = false;
    }
    if (e.key === 'ArrowDown') {
        downPressed = false;
    }
});

// Función para dibujar las palas
function drawPaddles() {
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, paddle1Y, paddleWidth, paddleHeight); // Paleta jugador 1
    ctx.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight); // Paleta jugador 2
}

// Función para dibujar la pelota
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFF';
    ctx.fill();
    ctx.closePath();
}

// Función para dibujar los puntos
function drawScores() {
    ctx.font = '32px Arial';
    ctx.fillStyle = '#FFF';
    ctx.fillText(player1Score, canvas.width / 4, 40); // Puntaje jugador 1
    ctx.fillText(player2Score, 3 * canvas.width / 4, 40); // Puntaje jugador 2
}

// Función para dibujar el mensaje del creador
function drawCredits() {
    ctx.font = '11px Arial';
    ctx.fillStyle = '#FFF';
    ctx.textAlign = 'center';
    ctx.fillText('Creado por bryan678z', canvas.width / 2, canvas.height - 10); // Mensaje centrado en la parte inferior
}

// Función para mover la pelota
function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Colisión con las paredes superior e inferior
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Colisión con las palas
    if (ballX - ballRadius < paddleWidth && ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballX + ballRadius > canvas.width - paddleWidth && ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }

    // Cuando la pelota sale de la pantalla, actualizamos el puntaje
    if (ballX - ballRadius < 0) {
        player2Score++; // Puntaje para el jugador 2
        resetBall();
    }
    if (ballX + ballRadius > canvas.width) {
        player1Score++; // Puntaje para el jugador 1
        resetBall();
    }
}

// Función para reiniciar la pelota después de un punto
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = 4;
}

// Función para mover las palas
function movePaddles() {
    if (wPressed && paddle1Y > 0) {
        paddle1Y -= 10; // Movimiento de la paleta izquierda (W)
    }
    if (sPressed && paddle1Y < canvas.height - paddleHeight) {
        paddle1Y += 10; // Movimiento de la paleta izquierda (S)
    }
    if (upPressed && paddle2Y > 0) {
        paddle2Y -= 10; // Movimiento de la paleta derecha (flecha arriba)
    }
    if (downPressed && paddle2Y < canvas.height - paddleHeight) {
        paddle2Y += 10; // Movimiento de la paleta derecha (flecha abajo)
    }
}

// Función que actualiza el juego
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPaddles();
    drawBall();
    drawScores();
    moveBall();
    movePaddles();
    drawCredits(); // Dibujamos el mensaje de crédito al final

    requestAnimationFrame(gameLoop);
}

// Iniciar el ciclo de juego
gameLoop();
