// Function to handle game over
function gameOver() {
    // Display the "GAME OVER" message
    const gameOverElement = document.getElementById('gameOver');
    gameOverElement.style.display = 'block';

    // Stop the game loop
    cancelAnimationFrame(gameLoop);
}

function restartGame() {
    // Reload the page to start a new game
    location.reload();
}


// Get the canvas element and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load the spaceship image
const spaceshipImg = new Image();
spaceshipImg.src = 'Spaceship.png';

// Define player properties
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 75,
    width: 50,
    height: 50,
    speed: 8,
    health: 100, // Player health
    score: 0 // Player score
};

// Define key state 
const keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
    Space: false
};

// Define enemy properties
const enemies = [];
const maxEnemies = 10;

// Define bullet properties
const bullets = [];
const bulletSpeed = 10;
const maxBullets = 5;

// Define fragments array
const fragments = [];

// Define initial enemy speed
let initialEnemySpeed = 1;

// Handle keydown and keyup events
document.addEventListener('keydown', (event) => {
    if (event.code in keys) {
        keys[event.code] = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.code in keys) {
        keys[event.code] = false;
    }
});

// Draw player (spaceship)
function drawPlayer() {
    ctx.drawImage(spaceshipImg, player.x, player.y, player.width, player.height);
}

// Draw enemies as lava fireballs
function drawEnemies() {
    for (const enemy of enemies) {
        const gradient = ctx.createRadialGradient(
            enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 0,
            enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 2
        );
        gradient.addColorStop(0, '#FF6347'); // Start color (red)
        gradient.addColorStop(1, '#FF4500'); // End color (orange-red)

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.width / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Draw bullets
function drawBullets() {
    for (const bullet of bullets) {
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
}

// Draw fragments
function drawFragments() {
    for (const fragment of fragments) {
        ctx.fillStyle = fragment.color;
        ctx.beginPath();
        ctx.arc(fragment.x, fragment.y, fragment.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Draw HUD (score and health)
function drawHUD() {
    ctx.fillStyle = '#FFFFFF'; // White color for HUD
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + player.score, 10, 30);
    ctx.fillText('Health: ' + player.health, 10, 60);
}

// Spawn enemy
function spawnEnemy() {
    const enemy = {
        x: Math.random() * (canvas.width - 50),
        y: 0,
        width: 50,
        height: 50,
        speed: initialEnemySpeed // Set initial speed
    };
    enemies.push(enemy);
}

// Shoot bullet
function shootBullet() {
    const bullet = {
        x: player.x + player.width / 2 - 2.5, // Center bullet horizontally
        y: player.y,
        width: 5,
        height: 10,
        speed: 10 // Adjust bullet speed as needed
    };
    bullets.push(bullet);
}

// Function to create enemy fragments
function createEnemyFragments(enemy) {
    // Define the number of fragments and their properties
    const numFragments = 20;
    const fragmentSize = 5;

    // Create fragments around the enemy's position
    for (let i = 0; i < numFragments; i++) {
        const fragment = {
            x: enemy.x + enemy.width / 2, // Center fragments around the enemy's center
            y: enemy.y + enemy.height / 2,
            size: fragmentSize,
            // Provide initial velocities to fragments
            dx: Math.random() * 4 - 2, // Random horizontal velocity between -2 and 2
            dy: Math.random() * 4 - 2, // Random vertical velocity between -2 and 2
            color: '#FF0000' // Color of the fragments
        };

        // Add the fragment to the fragments array
        fragments.push(fragment);
    }
}

// Update fragments movement
function updateFragments() {
    for (let i = 0; i < fragments.length; i++) {
        const fragment = fragments[i];
        fragment.x += fragment.dx;
        fragment.y += fragment.dy;

        // You may want to add gravity or friction to simulate realistic movement

        // Remove fragments if they move off-screen or after a certain time
        if (fragment.x < 0 || fragment.x > canvas.width || fragment.y < 0 || fragment.y > canvas.height) {
            fragments.splice(i, 1);
            i--; // Decrement index after removal
        }
    }
}

// Update player position
function updatePlayer() {
    if (keys.ArrowLeft && player.x > 0) {
        player.x -= player.speed;
    }

    if (keys.ArrowRight && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }

    if (keys.ArrowUp && player.y > 0) {
        player.y -= player.speed;
    }

    if (keys.ArrowDown && player.y < canvas.height - player.height) {
        player.y += player.speed;
    }

    if (keys.Space && bullets.length < maxBullets) {
        shootBullet();
        keys.Space = false; // Reset space key state
    }
}

// Update enemies position
function updateEnemies() {
    if (enemies.length < maxEnemies && Math.random() < 0.02) {
        spawnEnemy();
    }

    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        enemy.y += enemy.speed;

        // Check for collision with player
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            player.health -= 10;
            enemies.splice(i, 1);
            i--; // Decrement index to account for removed enemy
        }

        // Remove enemies that have moved off-screen
        if (enemy.y > canvas.height) {
            enemies.splice(i, 1);
            i--; // Decrement index to account for removed enemy
        }
    }
}

// Update bullets position and check for collisions
function updateBullets() {
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        bullet.y -= bulletSpeed;

        // Remove bullets that have moved off-screen
        if (bullet.y < 0) {
            bullets.splice(i, 1);
            i--; // Decrement index to account for removed bullet
            continue; // Skip collision detection for bullets off-screen
        }

        // Check for collisions with enemies
        for (let j = 0; j < enemies.length; j++) {
            const enemy = enemies[j];
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                // Create fragments around the enemy's position
                createEnemyFragments(enemy);

                // Remove the bullet and enemy
                bullets.splice(i, 1);
                enemies.splice(j, 1);

                // Increment the player's score
                player.score += 10;

                // Decrement indices to account for removed bullet and enemy
                i--;
                break; // Exit the enemy loop after a collision is found
            }
        }
    }
}

// Increase enemy speed over time
function increaseEnemySpeed() {
    initialEnemySpeed += 0.004; // Adjust the rate of speed increase as needed
}

// Game loop
function gameLoop() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update player
    updatePlayer();

    // Update enemies
    updateEnemies();

    // Update bullets
    updateBullets();

    // Update fragments
    updateFragments();

    // Draw player
    drawPlayer();

    // Draw enemies
    drawEnemies();

    // Draw bullets
    drawBullets();

    // Draw fragments
    drawFragments();

    // Draw score and health
    drawHUD();

    // Increase enemy speed over time
    increaseEnemySpeed();

    // Check for game over
    if (player.health <= 0) {
        gameOver();
        return;
    }

    // Request animation frame
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
