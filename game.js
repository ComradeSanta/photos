const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const bird = {
    x: 50,
    y: canvas.height / 2,
    width: 30,
    height: 30,
    gravity: 0.6,
    lift: -15,
    velocity: 0,
};

const pipes = [];
const pipeWidth = 50;
const pipeGap = 350;
const pipeFrequency = 130;
let frameCount = 0;
let score = 0;
let isPlaying = false;  // Game state

function drawBird() {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    ctx.fillStyle = 'green';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    });
}

function updatePipes() {
    if (frameCount % pipeFrequency === 0) {
        const topHeight = Math.random() * (canvas.height - pipeGap - 100) + 50;
        pipes.push({
            x: canvas.width,
            top: topHeight,
            bottom: canvas.height - topHeight - pipeGap
        });
    }

    pipes.forEach(pipe => {
        pipe.x -= 2;
    });

    if (pipes.length > 0 && pipes[0].x < -pipeWidth) {
        pipes.shift();
        score++;
    }
}

function checkCollisions() {
    if (bird.y < 0 || bird.y + bird.height > canvas.height) {
        resetGame();
    }

    pipes.forEach(pipe => {
        if (
            bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
        ) {
            resetGame();
        }
    });
}

function resetGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    isPlaying = false;  // Stop the game
    startButton.style.display = 'block';  // Show the start button
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function gameLoop() {
    if (!isPlaying) return;  // Only update the game if it is playing

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frameCount++;
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    drawBird();
    updatePipes();
    drawPipes();
    checkCollisions();
    drawScore();

    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click', () => {
    if (isPlaying) {
        bird.velocity = bird.lift;
    }
});

startButton.addEventListener('click', () => {
    isPlaying = true;  // Start the game
    startButton.style.display = 'none';  // Hide the start button
    gameLoop();  // Start the game loop
});

