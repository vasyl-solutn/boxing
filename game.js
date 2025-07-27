// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#1a1a1a',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

// Game variables
let game;
let player;
let npc;
let playerHealth = 100;
let playerPower = 50;
let playerProtection = 30;
let npcHealth = 100;
let npcPower = 50;
let npcProtection = 30;
let isPlayerBlocking = false;
let isNpcBlocking = false;
let gameState = 'fighting'; // 'fighting', 'gameOver'

// Initialize the game
game = new Phaser.Game(config);

function preload() {
    // No graphics needed for this game
}

function create() {
    // Create simple player object for positioning
    player = { x: 200, y: 300 };

    // Create simple NPC object for positioning
    npc = { x: 600, y: 300 };

    // Set up button event listeners
    setupButtons();

    // Start NPC AI with random timing
    scheduleNextNpcAction();

    // Add initial log entry
    addLogEntry('Fight started!', 'system');
}

function update() {
    updateUI();

    // Check for game over
    if (playerHealth <= 0 || npcHealth <= 0) {
        gameState = 'gameOver';
        endGame();
    }
}

function setupButtons() {
    const punchBtn = document.getElementById('punch-btn');
    const blockBtn = document.getElementById('block-btn');
    const resetBtn = document.getElementById('reset-btn');

    punchBtn.addEventListener('click', () => {
        if (gameState === 'fighting') {
            playerPunch();
        }
    });

    blockBtn.addEventListener('click', () => {
        if (gameState === 'fighting') {
            playerBlock();
        }
    });

    resetBtn.addEventListener('click', resetGame);
}

function scheduleNextNpcAction() {
    if (gameState !== 'fighting') return;

    // Random delay between 2-5 seconds
    const delay = Math.random() * 3000 + 2000; // 2000-5000ms

    game.scene.scenes[0].time.addEvent({
        delay: delay,
        callback: () => {
            npcAction();
            scheduleNextNpcAction(); // Schedule next action
        },
        callbackScope: this
    });
}

function addLogEntry(message, type) {
    const logContent = document.getElementById('log-content');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;

    const now = new Date();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
    const timestamp = `${minutes}:${seconds}.${milliseconds}`;

    entry.textContent = `[${timestamp}] ${message}`;

    // Add new entry at the top (reverse order)
    logContent.insertBefore(entry, logContent.firstChild);

    // Keep only last 20 combat entries (exclude system messages)
    const combatEntries = Array.from(logContent.children).filter(entry =>
        !entry.textContent.includes('Fight started') &&
        !entry.textContent.includes('Game Over') &&
        !entry.textContent.includes('New fight started')
    );

    // Remove excess combat entries (keep only last 20)
    while (combatEntries.length > 20) {
        const lastCombatEntry = combatEntries[combatEntries.length - 1];
        if (lastCombatEntry && lastCombatEntry.parentNode) {
            lastCombatEntry.parentNode.removeChild(lastCombatEntry);
        }
        combatEntries.pop();
    }
}

function playerPunch() {
    if (isNpcBlocking) {
        // NPC is blocking, reduced damage
        const damage = Math.max(5, playerPower - npcProtection);
        npcHealth = Math.max(0, npcHealth - damage);
        showDamageText(npc.x, npc.y, damage, 'blocked');
        addLogEntry(`Player punches NPC (blocked) - ${damage} damage`, 'player');
    } else {
        // Normal punch
        const damage = playerPower;
        npcHealth = Math.max(0, npcHealth - damage);
        showDamageText(npc.x, npc.y, damage, 'hit');
        addLogEntry(`Player punches NPC - ${damage} damage`, 'player');
    }


}

function playerBlock() {
    isPlayerBlocking = true;
    addLogEntry('Player blocks', 'player');

    // Block for 1 second
    setTimeout(() => {
        isPlayerBlocking = false;
        addLogEntry('Player stops blocking', 'player');
    }, 1000);
}

function npcAction() {
    if (gameState !== 'fighting') return;

    const action = Math.random();

    if (action < 0.7) {
        // NPC punches
        if (isPlayerBlocking) {
            const damage = Math.max(5, npcPower - playerProtection);
            playerHealth = Math.max(0, playerHealth - damage);
            showDamageText(player.x, player.y, damage, 'blocked');
            addLogEntry(`NPC punches Player (blocked) - ${damage} damage`, 'npc');
        } else {
            const damage = npcPower;
            playerHealth = Math.max(0, playerHealth - damage);
            showDamageText(player.x, player.y, damage, 'hit');
            addLogEntry(`NPC punches Player - ${damage} damage`, 'npc');
        }


    } else {
                        // NPC blocks
        isNpcBlocking = true;
        addLogEntry('NPC blocks', 'npc');

        setTimeout(() => {
            isNpcBlocking = false;
            addLogEntry('NPC stops blocking', 'npc');
        }, 1000);
    }
}

function showDamageText(x, y, damage, type) {
    const text = game.scene.scenes[0].add.text(x, y - 50, `${damage}`, {
        fontSize: '20px',
        fill: type === 'blocked' ? '#f39c12' : '#e74c3c',
        stroke: '#000',
        strokeThickness: 2
    }).setOrigin(0.5);

    // Animate the text
    game.scene.scenes[0].tweens.add({
        targets: text,
        y: y - 100,
        alpha: 0,
        duration: 1000,
        onComplete: () => text.destroy()
    });
}

function updateUI() {
    document.getElementById('player-health').textContent = Math.max(0, playerHealth);
    document.getElementById('player-power').textContent = playerPower;
    document.getElementById('player-protection').textContent = playerProtection;

    document.getElementById('npc-health').textContent = Math.max(0, npcHealth);
    document.getElementById('npc-power').textContent = npcPower;
    document.getElementById('npc-protection').textContent = npcProtection;
}

function endGame() {
    const winner = playerHealth <= 0 ? 'NPC' : 'Player';
    const gameOverText = game.scene.scenes[0].add.text(400, 250, `GAME OVER!\n${winner} Wins!`, {
        fontSize: '32px',
        fill: '#ffffff',
        stroke: '#000',
        strokeThickness: 4
    }).setOrigin(0.5);

    addLogEntry(`Game Over! ${winner} wins!`, 'system');

    // Disable buttons
    document.getElementById('punch-btn').disabled = true;
    document.getElementById('block-btn').disabled = true;
}

function resetGame() {
    // Reset health
    playerHealth = 100;
    npcHealth = 100;

    // Reset game state
    gameState = 'fighting';
    isPlayerBlocking = false;
    isNpcBlocking = false;



    // Enable buttons
    document.getElementById('punch-btn').disabled = false;
    document.getElementById('block-btn').disabled = false;

    // Clear fight log
    document.getElementById('log-content').innerHTML = '';

    // Remove game over text if it exists
    const gameOverText = game.scene.scenes[0].children.list.find(child =>
        child.text && child.text.includes('GAME OVER')
    );
    if (gameOverText) {
        gameOverText.destroy();
    }

    // Restart NPC AI
    scheduleNextNpcAction();

    addLogEntry('New fight started!', 'system');
}
