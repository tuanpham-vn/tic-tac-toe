const board = document.getElementById('board');
const winningMessage = document.getElementById('winning-message');
const winningText = document.querySelector('.winning-text');
const startButton = document.getElementById('start-btn');
const playWithComputerButton = document.getElementById('play-with-computer-btn');
const restartButton = document.getElementById('restart-btn');
const playAgainButton = document.getElementById('play-again-btn');
const score1Element = document.getElementById('score-1');
const score2Element = document.getElementById('score-2');
const turnInfo = document.getElementById('turn-info');
const player1NameInput = document.getElementById('player1Name');
const player2NameInput = document.getElementById('player2Name');
const avatarSelectors = document.querySelectorAll('.avatar-selector');
const avatarOptions = document.querySelectorAll('.avatar-options');
const thinkingIndicator = document.getElementById('thinking-indicator');

const winSounds = [
    new Audio('sounds/thắng rồi yahoo.mp3'),
    new Audio('sounds/thắng rồi nha.mp3'),
    new Audio('sounds/nanana.mp3'),
    new Audio('sounds/đùa với ninja rùa à.mp3'),
    new Audio('sounds/hihi_dua_voi_nịna_rua_a.mp3'),
    new Audio('sounds/đánh thế không thắng được đâu bạn ơi.mp3'),
    new Audio('sounds/hát lalala.mp3'),
    new Audio('sounds/này thì đánh này hihihi.mp3'),
    new Audio('sounds/thua_di_ban_oi_hihi.mp3'),
    new Audio('sounds/thang_hoai_the_nay_thi_chan_nhe.mp3'),
    new Audio('sounds/co_thang_duoc_dau_ma_danh_the.mp3'),
    new Audio('sounds/cuoi.mp3'),
    new Audio('sounds/eo_oi_ghe_nho.mp3'),
    new Audio('sounds/danh_buon_cuoi_the.mp3'),
];

const loseAudios = [
    new Audio('sounds/buồn như con chuồn chuồn.mp3'),
    new Audio('sounds/chán như con gián luôn.mp3'),
    new Audio('sounds/chán thế nhờ 2.mp3'),
    new Audio('sounds/chán thế nhờ.mp3'),
    new Audio('sounds/thua mất rồi trời ơi.mp3'),
    new Audio('sounds/thua rồi chán thế nhở.mp3'),
    new Audio('sounds/ghe_qua.mp3')
];

const moveSounds = [
    new Audio('sounds/đánh này.mp3'),
    new Audio('sounds/đánh này_2.mp3'),
    new Audio('sounds/đến lượt bạn rồi.mp3'),
    new Audio('sounds/đến lượt bạn rồi_2.mp3'),
    new Audio('sounds/đánh này.mp3'),
    new Audio('sounds/đánh này_2.mp3'),
    new Audio('sounds/đánh này.mp3'),
    new Audio('sounds/đánh vào chỗ này.mp3'),
    new Audio('sounds/đánh đê bạn ơi.mp3'),
    new Audio('sounds/đỡ vào mắt nhé.mp3'),
    new Audio('sounds/chơi hết mình đi bạn ơi.mp3'),
    new Audio('sounds/đánh này.mp3'),
    new Audio('sounds/đánh này_2.mp3'),
    new Audio('sounds/đến lượt bạn rồi.mp3'),
    new Audio('sounds/đến lượt bạn rồi_2.mp3'),
    new Audio('sounds/đố bạn thắng được tôi đấy.mp3'),
    new Audio('sounds/uhm cứ đánh vào đây đã.mp3'),
    new Audio('sounds/này thì đánh này hihihi.mp3'),
    new Audio('sounds/buồn ngủ thế nhờ.mp3'),
    new Audio('sounds/à đánh này.mp3'),
    new Audio('sounds/uhm cứ đánh vào đây đã.mp3'),
];

let scores = {
    player1: 0,
    player2: 0
};

let isPlayer1Turn = true;
let gameActive = false;
let lastWinner = null;
let isComputerMode = false;
let lastHumanMove = null;
let isFirstGame = true;
let cells;
let isSoundEnabled = localStorage.getItem('isSoundEnabled') !== 'false';
let computerDifficulty = localStorage.getItem('computerDifficulty') || '5';

const congratMessages = [
    "🎉 Xuất sắc! Bạn đã chiến thắng đầy thuyết phục!",
    "🌟 Wow! Đúng là bậc thầy cờ ca-rô!",
    "🏆 Chiến thắng tuyệt vời! Đối thủ không có cửa!",
    "👑 Quá đỉnh! Xứng đáng là nhà vô địch!",
    "🎮 Game hay quá! Thắng đẹp như phim!",
    "⭐ Đẳng cấp! Không ai cản được bạn!",
    "🎯 Chính xác từng nước đi! Quá xuất sắc!",
    "🌈 Tuyệt vời ông mặt trời! Thắng quá xứng đáng!",
    "💫 Siêu sao cờ ca-rô đây rồi!",
    "🔥 Quá hot! Đối thủ phải chào thua!",
    "🌈 Tuyệt vời ông mặt trời!",
    "🎪 Xinh đẹp tài giỏi lại còn giỏi cờ ca-rô nữa!",
    "🎭 Thông minh quá! Đánh hay như diễn viên chính vậy!",
    "🎨 Nghệ sĩ của trò chơi đây rồi!",
    "🎪 Dễ thương mà còn giỏi thế này!",
    "🎭 Thắng đẹp như một vở kịch hay!",
    "🎪 Tài năng xuất chúng! Ai cũng phải nể phục!",
    "🎭 Quá đáng yêu! Vừa xinh vừa giỏi!",
    "🎨 Nghệ thuật đánh cờ của bạn thật tuyệt vời!",
    "🎪 Dễ thương hết phần thiên hạ!",
    "🎭 Thắng đẹp như một vở diễn hoàn hảo!"
];

function getRandomCongratMessage() {
    const randomIndex = Math.floor(Math.random() * congratMessages.length);
    return congratMessages[randomIndex];
}

avatarSelectors.forEach(selector => {
    selector.addEventListener('click', (e) => {
        const options = selector.querySelector('.avatar-options');
        options.classList.toggle('show');
        
        const closeHandler = (event) => {
            if (!event.target.closest('.avatar-selector')) {
                options.classList.remove('show');
                document.removeEventListener('click', closeHandler);
            }
        };
        
        setTimeout(() => {
            document.addEventListener('click', closeHandler);
        }, 0);
    });
});

avatarOptions.forEach(options => {
    options.querySelectorAll('i').forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            const avatar = e.target.dataset.avatar;
            const currentAvatar = options.closest('.avatar-selector').querySelector('.current-avatar');
            currentAvatar.className = `current-avatar fa-solid ${avatar} fa-6x`;
            options.classList.remove('show');

            const playerNumber = options.id === 'avatarOptions1' ? 1 : 2;
            if (!isComputerMode || playerNumber === 2) {
                const playerName = playerNumber === 1 ? player1NameInput.value : player2NameInput.value;
                savePlayerInfo(playerNumber, playerName, avatar);
                
                // Cập nhật avatar trong game-area
                updateGameAreaAvatars();
            }
        });
    });
});

const WINNING_COMBINATIONS = [];

for (let i = 0; i < 10; i++) {
    const row = [];
    for (let j = 0; j < 6; j++) {
        row.push([i * 10 + j, i * 10 + j + 1, i * 10 + j + 2, i * 10 + j + 3, i * 10 + j + 4]);
    }
    WINNING_COMBINATIONS.push(...row);
}

for (let i = 0; i < 10; i++) {
    const col = [];
    for (let j = 0; j < 6; j++) {
        col.push([i + j * 10, i + (j + 1) * 10, i + (j + 2) * 10, i + (j + 3) * 10, i + (j + 4) * 10]);
    }
    WINNING_COMBINATIONS.push(...col);
}

for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
        if (j + 4 < 10 && i + 4 < 10) {
            WINNING_COMBINATIONS.push([
                i * 10 + j,
                (i + 1) * 10 + (j + 1),
                (i + 2) * 10 + (j + 2),
                (i + 3) * 10 + (j + 3),
                (i + 4) * 10 + (j + 4)
            ]);
        }
        if (j + 4 < 10 && i + 4 < 10) {
            WINNING_COMBINATIONS.push([
                i * 10 + (j + 4),
                (i + 1) * 10 + (j + 3),
                (i + 2) * 10 + (j + 2),
                (i + 3) * 10 + (j + 1),
                (i + 4) * 10 + j
            ]);
        }
    }
}

// Thêm hằng số cho localStorage keys
const STORAGE_KEYS = {
    DIFFICULTY: 'ticTacToe_difficulty',
    PLAYER1_NAME: 'ticTacToe_player1Name',
    PLAYER2_NAME: 'ticTacToe_player2Name'
};

function getPlayerName(playerNumber) {
    const input = playerNumber === 1 ? player1NameInput : player2NameInput;
    return input.value.trim() || `Người chơi ${playerNumber}`;
}

function updateTurnInfo() {
    const currentPlayerName = isPlayer1Turn ? getPlayerName(1) : getPlayerName(2);
    const symbol = isPlayer1Turn ? 'X' : 'O';
    turnInfo.textContent = `Lượt của ${currentPlayerName} (${symbol})`;
    
    const player1Element = document.querySelector('.player-1');
    const player2Element = document.querySelector('.player-2');
    const player1Avatar = player1Element.querySelector('.current-avatar');
    const player2Avatar = player2Element.querySelector('.current-avatar');
    
    if (isPlayer1Turn) {
        player1Element.classList.add('current-turn');
        player2Element.classList.remove('current-turn');
        player1Avatar.classList.add('active');
        player2Avatar.classList.remove('active');
    } else {
        player1Element.classList.remove('current-turn');
        player2Element.classList.add('current-turn');
        player1Avatar.classList.remove('active');
        player2Avatar.classList.add('active');
    }
}

function activatePlayerAvatar(playerNumber) {
    const player1Avatar = document.querySelector('.player-1 .current-avatar');
    const player2Avatar = document.querySelector('.player-2 .current-avatar');
    
    player1Avatar.classList.remove('active');
    player2Avatar.classList.remove('active');
    
    if (playerNumber === 1) {
        player1Avatar.classList.add('active');
    } else if (playerNumber === 2) {
        player2Avatar.classList.add('active');
    }
    
    setTimeout(() => {
        player1Avatar.classList.remove('active');
        player2Avatar.classList.remove('active');
    }, 15000);
}

function startGame(withComputer = false) {
    cells.forEach(cell => {
        cell.classList.remove('winning');
        cell.classList.remove('last-move');
        cell.innerHTML = '';
        cell.classList.remove('x', 'o');
        cell.textContent = '';
    });
    winningMessage.classList.remove('show');

    startButton.classList.remove('remind');
    playWithComputerButton.classList.remove('remind');

    isComputerMode = withComputer;
    
    // Ẩn các nút bắt đầu
    startButton.style.display = 'none';
    playWithComputerButton.style.display = 'none';
    
    // Hiển thị các nút điều khiển trong game
    const difficultySelect = document.querySelector('.difficulty-select');
    const restartBtn = document.getElementById('restart-btn');
    const soundToggle = document.getElementById('sound-toggle');
    
    if (withComputer) {
        player1NameInput.disabled = true;
        
        if (difficultySelect) {
            difficultySelect.classList.add('show');
            const selectElement = difficultySelect.querySelector('select');
            if (selectElement) {
                selectElement.className = 'computer-player';
            }
        }
        
        const computerInfo = getComputerInfoByDifficulty(computerDifficulty);
        player1NameInput.value = computerInfo.name;
        document.querySelector('.player-1 .current-avatar').className = `current-avatar fa-solid ${computerInfo.avatar} fa-6x`;
        document.querySelector('.player-1 .avatar-selector').style.pointerEvents = 'none';
        
        // Hiển thị nút chơi lại và nút âm thanh
        restartBtn.classList.add('show');
        soundToggle.classList.add('show');
        
        // Căn giữa các nút điều khiển
        const controlsContainer = document.querySelector('.game-controls');
        if (controlsContainer) {
            controlsContainer.style.justifyContent = 'space-between';
        }
    } else {
        loadPlayerInfo();
        player1NameInput.disabled = false;

        if (difficultySelect) {
            difficultySelect.classList.remove('show');
            const selectElement = difficultySelect.querySelector('select');
            if (selectElement) {
                selectElement.className = '';
            }
        }

        document.querySelector('.player-1 .current-avatar').className = 'current-avatar fa-solid fa-cat fa-6x';
        document.querySelector('.player-1 .avatar-selector').style.pointerEvents = 'auto';
        
        // Chỉ hiển thị nút chơi lại và căn giữa
        restartBtn.classList.add('show');
        soundToggle.classList.remove('show');
        
        // Căn giữa nút chơi lại
        const controlsContainer = document.querySelector('.game-controls');
        if (controlsContainer) {
            controlsContainer.style.justifyContent = 'center';
        }
    }
    
    // Cập nhật avatar trên game-area
    updateGameAreaAvatars();

    if (!player2NameInput.value.trim()) {
        alert('Vui lòng nhập tên người chơi!');
        return;
    }

    if (isFirstGame) {
        isPlayer1Turn = withComputer;
    } else {
        if (lastWinner === 'player1') {
            isPlayer1Turn = true;
        } else if (lastWinner === 'player2') {
            isPlayer1Turn = false;
        } else {
            isPlayer1Turn = true;
        }
    }

    lastHumanMove = null;
    gameActive = true;
    
    cells.forEach(cell => {
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick);
    });

    updateTurnInfo();

    if (withComputer && isPlayer1Turn) {
        setTimeout(computerPlay, isFirstGame ? 0 : 500);
    }
}

function handleClick(e) {
    if (!gameActive) {
        if (startButton.style.display !== 'none') {
            startButton.classList.add('remind');
            playWithComputerButton.classList.add('remind');
        }
        return;
    }
    
    if (isComputerMode && isPlayer1Turn) return;
    
    const cell = e.target;
    if (cell.classList.contains('x') || cell.classList.contains('o')) return;
    
    cell.removeEventListener('click', handleClick);
    handleCellClick(cell);
}

function handleCellClick(cell) {
    const currentClass = isPlayer1Turn ? 'x' : 'o';
    
    const penIcon = document.createElement('i');
    penIcon.className = `fa-solid fa-pen pen-pointer ${isPlayer1Turn ? 'player1' : 'player2'}`;
    const rect = cell.getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();
    
    penIcon.style.left = (rect.left - boardRect.left + rect.width/2 - 5) + 'px';
    penIcon.style.top = (rect.top - boardRect.top + rect.height/2 - 30) + 'px';
    
    board.appendChild(penIcon);
    
    setTimeout(() => {
        penIcon.remove();
    }, 1200);

    placeMark(cell, currentClass);
    
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        updateTurnInfo();
        
        if (isComputerMode && !isPlayer1Turn) {
            lastHumanMove = cell;
        }
        
        if (isComputerMode && isPlayer1Turn) {
            computerPlay();
        }
    }
}

function placeMark(cell, currentClass) {
    cells.forEach(c => c.classList.remove('last-move'));
    
    cell.classList.add(currentClass);
    if (!cell.classList.contains('winning')) {
        cell.textContent = currentClass.toUpperCase();
    }
    
    cell.classList.add('last-move');
}

function swapTurns() {
    isPlayer1Turn = !isPlayer1Turn;
}

function checkWin(currentClass) {
    let hasWon = false;
    let winningCombination = null;

    for (let row = 0; row < 10; row++) {
        for (let col = 0; col <= 5; col++) {
            let win = true;
            for (let i = 0; i < 5; i++) {
                if (!cells[row * 10 + col + i].classList.contains(currentClass)) {
                    win = false;
                    break;
                }
            }
            if (win) {
                hasWon = true;
                winningCombination = Array.from({length: 5}, (_, i) => row * 10 + col + i);
                break;
            }
        }
        if (hasWon) break;
    }

    if (!hasWon) {
        for (let col = 0; col < 10; col++) {
            for (let row = 0; row <= 5; row++) {
                let win = true;
                for (let i = 0; i < 5; i++) {
                    if (!cells[(row + i) * 10 + col].classList.contains(currentClass)) {
                        win = false;
                        break;
                    }
                }
                if (win) {
                    hasWon = true;
                    winningCombination = Array.from({length: 5}, (_, i) => (row + i) * 10 + col);
                    break;
                }
            }
            if (hasWon) break;
        }
    }

    if (!hasWon) {
        for (let row = 0; row <= 5; row++) {
            for (let col = 0; col <= 5; col++) {
                let win = true;
                for (let i = 0; i < 5; i++) {
                    if (!cells[(row + i) * 10 + col + i].classList.contains(currentClass)) {
                        win = false;
                        break;
                    }
                }
                if (win) {
                    hasWon = true;
                    winningCombination = Array.from({length: 5}, (_, i) => (row + i) * 10 + col + i);
                    break;
                }
            }
            if (hasWon) break;
        }
    }

    if (!hasWon) {
        for (let row = 0; row <= 5; row++) {
            for (let col = 4; col < 10; col++) {
                let win = true;
                for (let i = 0; i < 5; i++) {
                    if (!cells[(row + i) * 10 + col - i].classList.contains(currentClass)) {
                        win = false;
                        break;
                    }
                }
                if (win) {
                    hasWon = true;
                    winningCombination = Array.from({length: 5}, (_, i) => (row + i) * 10 + col - i);
                    break;
                }
            }
            if (hasWon) break;
        }
    }

    if (hasWon && winningCombination) {
        winningCombination.forEach(index => {
            const cell = cells[index];
            cell.classList.add('winning');
            cell.innerHTML = '<i class="fa-solid fa-face-laugh-wink"></i>';
        });
    }

    return hasWon;
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains('x') || cell.classList.contains('o');
    });
}

function createConfetti() {
    const colors = ['#ff6b6b', '#4d96ff', '#ffd868'];
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors,
        disableForReducedMotion: true
    });
}

function playConfettiEffect() {
    createConfetti();
    setTimeout(createConfetti, 500);
    setTimeout(createConfetti, 1000);
}

function endGame(draw) {
    gameActive = false;
    
    if (draw) {
        winningText.innerText = 'Hòa rồi! 🤝';
        lastWinner = null;
        winningMessage.classList.add('show');
    } else {
        const winner = isPlayer1Turn ? getPlayerName(1) : getPlayerName(2);
        const winnerAvatar = isPlayer1Turn ? 
            document.querySelector('.player-1 .current-avatar').className.split(' ')[2] :
            document.querySelector('.player-2 .current-avatar').className.split(' ')[2];
        const congratMessage = getRandomCongratMessage();
            
        playConfettiEffect();
        if (isComputerMode) {
            if (isPlayer1Turn) {
                playWinSound();
            } else {
                playLoseSound();
            }
        }
            
        setTimeout(() => {
            winningText.innerHTML = `
                <i class="fa-solid ${winnerAvatar} fa-2x"></i><br>
                ${winner} đã chiến thắng!<br>
                ${congratMessage}
            `;
            winningMessage.classList.add('show');
            
            if (isPlayer1Turn) {
                scores.player1++;
                score1Element.textContent = scores.player1;
                lastWinner = 'player1';
            } else {
                scores.player2++;
                score2Element.textContent = scores.player2;
                lastWinner = 'player2';
            }
        }, 3000);
    }
}

function restartGame() {
    // Hiển thị lại các nút bắt đầu
    startButton.style.display = 'block';
    playWithComputerButton.style.display = 'block';
    
    // Ẩn các nút điều khiển
    const difficultySelect = document.querySelector('.difficulty-select');
    const restartBtn = document.getElementById('restart-btn');
    const soundToggle = document.getElementById('sound-toggle');
    
    difficultySelect.classList.remove('show');
    restartBtn.classList.remove('show');
    soundToggle.classList.remove('show');
    
    gameActive = false;
    isFirstGame = true;
    
    // Khôi phục thông tin player 1 từ localStorage hoặc mặc định
    const savedPlayer1Name = localStorage.getItem('player1Name') || "Méo";
    const savedPlayer1Avatar = localStorage.getItem('player1Avatar') || "fa-cat";
    
    player1NameInput.disabled = false;
    player1NameInput.value = savedPlayer1Name;
    document.querySelector('.player-1 .current-avatar').className = `current-avatar fa-solid ${savedPlayer1Avatar} fa-6x`;
    document.querySelector('.player-1 .avatar-selector').style.pointerEvents = 'auto';
    
    // Reset computer mode
    isComputerMode = false;
    
    // Cập nhật avatar trên game-area
    updateGameAreaAvatars();

    cells.forEach(cell => {
        cell.classList.remove('x', 'o', 'winning', 'last-move');
        cell.textContent = '';
        cell.innerHTML = '';
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick);
    });

    winningMessage.classList.remove('show');

    turnInfo.textContent = 'Lượt của: Méo (X)';
    isPlayer1Turn = true;

    const player1Element = document.querySelector('.player-1');
    const player2Element = document.querySelector('.player-2');
    const player1Avatar = player1Element.querySelector('.current-avatar');
    const player2Avatar = player2Element.querySelector('.current-avatar');
    
    player1Element.classList.add('current-turn');
    player2Element.classList.remove('current-turn');
    player1Avatar.classList.remove('active');
    player2Avatar.classList.remove('active');
}

function playAgain() {
    isFirstGame = false;
    startGame(isComputerMode);
    updateGameAreaAvatars();
}

startButton.addEventListener('click', () => startGame(false));
playWithComputerButton.addEventListener('click', () => {
    // Log thông tin trước khi bắt đầu game với máy
    const currentDifficulty = document.getElementById('difficulty').value;
    const currentAvatarName = player1NameInput.value;
    const selectedDifficultyText = document.getElementById('difficulty').options[document.getElementById('difficulty').selectedIndex].text;
    
    console.log('=== Thông tin chế độ chơi với máy ===');
    console.log('Độ khó đang chọn:', currentDifficulty);
    console.log('Tên hiển thị ở avatar:', currentAvatarName);
    console.log('Text hiển thị ở listbox độ khó:', selectedDifficultyText);
    console.log('=====================================');
    
    startGame(true);
});
restartButton.addEventListener('click', restartGame);
playAgainButton.addEventListener('click', playAgain);

player1NameInput.addEventListener('change', function() {
    if (!isComputerMode) {
        savePlayerInfo(1, this.value, document.querySelector('.player-1 .current-avatar').className.split(' ')[2]);
    }
    updateTurnInfo();
});

player2NameInput.addEventListener('change', function() {
    savePlayerInfo(2, this.value, document.querySelector('.player-2 .current-avatar').className.split(' ')[2]);
    updateTurnInfo();
});

function checkFourInARow(currentClass) {
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col <= 5; col++) {
            let count = 0;
            let emptyCell = null;
            for (let i = 0; i < 5; i++) {
                const index = row * 10 + col + i;
                if (index >= 100) continue;
                const cell = cells[index];
                if (!cell) continue;
                if (cell.classList.contains(currentClass)) {
                    count++;
                } else if (!cell.classList.contains('x') && !cell.classList.contains('o')) {
                    emptyCell = cell;
                }
            }
            if (count === 4 && emptyCell) {
                return emptyCell;
            }
        }
    }

    for (let col = 0; col < 10; col++) {
        for (let row = 0; row <= 5; row++) {
            let count = 0;
            let emptyCell = null;
            for (let i = 0; i < 5; i++) {
                const index = (row + i) * 10 + col;
                if (index >= 100) continue;
                const cell = cells[index];
                if (!cell) continue;
                if (cell.classList.contains(currentClass)) {
                    count++;
                } else if (!cell.classList.contains('x') && !cell.classList.contains('o')) {
                    emptyCell = cell;
                }
            }
            if (count === 4 && emptyCell) {
                return emptyCell;
            }
        }
    }

    for (let row = 0; row <= 5; row++) {
        for (let col = 0; col <= 5; col++) {
            let count = 0;
            let emptyCell = null;
            for (let i = 0; i < 5; i++) {
                const index = (row + i) * 10 + col + i;
                if (index >= 100) continue;
                const cell = cells[index];
                if (!cell) continue;
                if (cell.classList.contains(currentClass)) {
                    count++;
                } else if (!cell.classList.contains('x') && !cell.classList.contains('o')) {
                    emptyCell = cell;
                }
            }
            if (count === 4 && emptyCell) {
                return emptyCell;
            }
        }
    }

    for (let row = 0; row <= 5; row++) {
        for (let col = 4; col < 10; col++) {
            let count = 0;
            let emptyCell = null;
            for (let i = 0; i < 5; i++) {
                const index = (row + i) * 10 + col - i;
                if (index >= 100) continue;
                const cell = cells[index];
                if (!cell) continue;
                if (cell.classList.contains(currentClass)) {
                    count++;
                } else if (!cell.classList.contains('x') && !cell.classList.contains('o')) {
                    emptyCell = cell;
                }
            }
            if (count === 4 && emptyCell) {
                return emptyCell;
            }
        }
    }

    return null;
}

function getAdjacentEmptyCells(cellIndex) {
    const row = Math.floor(cellIndex / 10);
    const col = cellIndex % 10;
    const emptyCells = [];

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
                const index = newRow * 10 + newCol;
                const cell = cells[index];
                if (!cell.classList.contains('x') && !cell.classList.contains('o')) {
                    emptyCells.push(cell);
                }
            }
        }
    }

    return emptyCells;
}

function getRandomCell(cellList) {
    return cellList[Math.floor(Math.random() * cellList.length)];
}

function getAllEmptyCells() {
    return [...cells].filter(cell => 
        !cell.classList.contains('x') && !cell.classList.contains('o')
    );
}

function getCenterCells() {
    const centerCells = [];
    for (let row = 4; row <= 6; row++) {
        for (let col = 4; col <= 6; col++) {
            const index = row * 10 + col;
            const cell = cells[index];
            if (!cell.classList.contains('x') && !cell.classList.contains('o')) {
                centerCells.push(cell);
            }
        }
    }
    return centerCells;
}

function showThinkingIndicator() {
    thinkingIndicator.classList.add('show');
}

function hideThinkingIndicator() {
    thinkingIndicator.classList.remove('show');
}

function getRandomThinkingTime() {
    const times = [500, 1000, 1500, 2000, 2500, 3000];
    return times[Math.floor(Math.random() * times.length)];
}

function evaluatePosition(index, currentClass) {
    const row = Math.floor(index / 10);
    const col = index % 10;
    let score = 0;

    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    for (const [dx, dy] of directions) {
        let count = 0;
        let blocked = 0;
        let space = 0;

        for (let step = 1; step <= 4; step++) {
            const newRow = row + dx * step;
            const newCol = col + dy * step;
            
            if (newRow < 0 || newRow >= 10 || newCol < 0 || newCol >= 10) {
                blocked++;
                break;
            }

            const cell = cells[newRow * 10 + newCol];
            if (cell.classList.contains(currentClass)) {
                count++;
            } else if (!cell.classList.contains('x') && !cell.classList.contains('o')) {
                space++;
            } else {
                blocked++;
                break;
            }
        }

        if (count === 3 && space === 1 && blocked === 0) score += 1000;
        else if (count === 2 && space === 2 && blocked === 0) score += 100;
        else if (count === 1 && space === 3 && blocked === 0) score += 10;
    }

    if ((row === 4 || row === 5) && (col === 4 || col === 5)) score += 5;
    if (row >= 2 && row <= 7 && col >= 2 && col <= 7) score += 2;

    return score;
}

function findBestMove() {
    const emptyCells = getAllEmptyCells();
    let bestScore = -1;
    let bestCell = null;

    // Ưu tiên tuyệt đối: thắng ngay
    const winningMove = checkFourInARow('x');
    if (winningMove) return winningMove;

    // Ưu tiên cao: chặn đối thủ thắng
    const blockingMove = checkFourInARow('o');
    if (blockingMove) return blockingMove;

    // Bé Mèo Con: Random cao, logic yếu
    if (computerDifficulty === '5' && Math.random() < 0.6) {
        return getRandomCell(emptyCells);
    }

    for (const cell of emptyCells) {
        const index = parseInt(cell.dataset.index);
        
        let attackScore = evaluatePosition(index, 'x');   // Computer tấn công
        let defenseScore = evaluatePosition(index, 'o');  // Chặn player
        
        let totalScore;
        
        if (computerDifficulty === '5') {
            // Bé Mèo Con: Yếu, thường phòng thủ
            totalScore = attackScore * 0.7 + defenseScore * 1.3;
            
            // Bonus nhỏ cho strategic position
            if (isStrategicPosition(index)) {
                totalScore *= 1.1;
            }
            
        } else if (computerDifficulty === '8') {
            // Anh Cún Con: Hơi mạnh hơn, cân bằng
            totalScore = attackScore * 1.0 + defenseScore * 1.2;
            
            if (isStrategicPosition(index)) {
                totalScore *= 1.2;
            }
            
        } else if (computerDifficulty === '20') {
            // Chú Lười Lém: Khá mạnh, bắt đầu có chiến thuật
            totalScore = attackScore * 1.3 + defenseScore * 1.4;
            
            // Tấn công: tạo double threat cho mình
            if (canCreateDoubleThreat(index, 'x')) {
                totalScore *= 1.8;
            }
            // Phòng thủ: ngăn double threat của đối thủ  
            if (canCreateDoubleThreat(index, 'o')) {
                totalScore *= 1.6;
            }
            if (isStrategicPosition(index)) {
                totalScore *= 1.4;
            }
            
        } else if (computerDifficulty === '24') {
            // Bác Hà Mã: Mạnh, chiến thuật rõ ràng
            totalScore = attackScore * 1.8 + defenseScore * 1.6;
            
            // Tấn công mạnh hơn
            if (canCreateDoubleThreat(index, 'x')) {
                totalScore *= 2.2;
            }
            // Phòng thủ vẫn quan trọng
            if (canCreateDoubleThreat(index, 'o')) {
                totalScore *= 2.0;
            }
            if (isStrategicPosition(index)) {
                totalScore *= 2.0;
            }
            
        } else if (computerDifficulty === '36') {
            // Base scores: Tấn công cực mạnh, phòng thủ thông minh
            totalScore = attackScore * 8.0 + defenseScore * 5.0;
            
            // CRITICAL THREATS - Ưu tiên tuyệt đối
            if (canCreateTripleThreat(index, 'x')) {
                totalScore *= 12.0; // Tăng mạnh hệ số tạo 3 threat
            }
            if (canCreateTripleThreat(index, 'o')) {
                totalScore *= 10.0; // Tăng mạnh hệ số chặn 3 threat
            }
            
            // DOUBLE THREATS - Ưu tiên rất cao
            if (canCreateDoubleThreat(index, 'x')) {
                totalScore *= 7.0; // Tăng hệ số tạo 2 threat
            }
            if (canCreateDoubleThreat(index, 'o')) {
                totalScore *= 6.0; // Tăng hệ số chặn 2 threat
            }
            
            // STRATEGIC POSITION - Tăng kiểm soát vị trí
            if (isStrategicPosition(index)) {
                totalScore *= 3.5;
            }
            
            // COMBO BONUS - Siêu nguy hiểm
            if (canCreateDoubleThreat(index, 'x') && canCreateTripleThreat(index, 'x')) {
                totalScore *= 15.0; // Tăng mạnh hệ số combo
            }
            
            // FORK DETECTION - Tạo nhiều hướng thắng
            if (canCreateFork(index, 'x')) {
                totalScore *= 8.0; // Tăng hệ số tạo fork
            }
            if (canCreateFork(index, 'o')) {
                totalScore *= 7.5; // Tăng hệ số chặn fork
            }
            
            // NEW: EARLY GAME STRATEGY
            if (emptyCells.length > 80) { // Trong 20 nước đầu
                if (isStrategicPosition(index)) {
                    totalScore *= 2.0; // Ưu tiên chiếm vị trí chiến lược sớm
                }
            }
            
            // NEW: LATE GAME AGGRESSION
            if (emptyCells.length < 40) { // Khi game đã qua nửa
                totalScore *= 1.5; // Tăng độ quyết liệt
            }
            
            // NEW: COUNTER ATTACK BONUS
            if (lastHumanMove) {
                const lastMoveIndex = parseInt(lastHumanMove.dataset.index);
                const distance = Math.abs(index - lastMoveIndex);
                if (distance <= 20) { // Nếu gần nước đi của người chơi
                    totalScore *= 1.3; // Tăng khả năng phản công
                }
            }
        }

        if (totalScore > bestScore) {
            bestScore = totalScore;
            bestCell = cell;
        }
    }

    if (!bestCell || bestScore === 0) {
        const centerCells = getCenterCells();
        if (centerCells.length > 0) {
            return getRandomCell(centerCells);
        }
        return getRandomCell(emptyCells);
    }

    return bestCell;
}

function canCreateDoubleThreat(index, symbol) {
    const row = Math.floor(index / 10);
    const col = index % 10;
    let threatCount = 0;

    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    for (const [dx, dy] of directions) {
        let count = 0;
        let space = 0;
        let blocked = 0;

        for (let step = 1; step <= 4; step++) {
            const newRow = row + dx * step;
            const newCol = col + dy * step;
            
            if (newRow < 0 || newRow >= 10 || newCol < 0 || newCol >= 10) {
                blocked++;
                break;
            }

            const cell = cells[newRow * 10 + newCol];
            if (cell.classList.contains(symbol)) {
                count++;
            } else if (!cell.classList.contains('x') && !cell.classList.contains('o')) {
                space++;
            } else {
                blocked++;
                break;
            }
        }

        if (count >= 2 && space >= 2 && blocked === 0) {
            threatCount++;
        }
    }

    return threatCount >= 2;
}

function isStrategicPosition(index) {
    const row = Math.floor(index / 10);
    const col = index % 10;
    
    if (row >= 3 && row <= 6 && col >= 3 && col <= 6) {
        return true;
    }
    
    let openDirections = 0;
    const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    
    for (const [dx, dy] of directions) {
        let hasSpace = true;
        for (let step = 1; step <= 4; step++) {
            const newRow = row + dx * step;
            const newCol = col + dy * step;
            
            if (newRow < 0 || newRow >= 10 || newCol < 0 || newCol >= 10) {
                hasSpace = false;
                break;
            }
        }
        if (hasSpace) openDirections++;
    }
    
    return openDirections >= 4;
}

function canCreateTripleThreat(index, symbol) {
    const row = Math.floor(index / 10);
    const col = index % 10;
    let threatCount = 0;

    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    for (const [dx, dy] of directions) {
        let count = 0;
        let space = 0;
        let blocked = 0;

        for (let step = 1; step <= 4; step++) {
            const newRow = row + dx * step;
            const newCol = col + dy * step;
            
            if (newRow < 0 || newRow >= 10 || newCol < 0 || newCol >= 10) {
                blocked++;
                break;
            }

            const cell = cells[newRow * 10 + newCol];
            if (cell.classList.contains(symbol)) {
                count++;
            } else if (!cell.classList.contains('x') && !cell.classList.contains('o')) {
                space++;
            } else {
                blocked++;
                break;
            }
        }

        if (count >= 3 && space >= 1 && blocked === 0) {
            threatCount++;
        }
    }

    return threatCount >= 3;
}

function canCreateFork(index, symbol) {
    // Kiểm tra xem có thể tạo 2+ hướng thắng cùng lúc không
    const row = Math.floor(index / 10);
    const col = index % 10;
    let winningDirections = 0;
    
    const directions = [
        [0, 1], [1, 0], [1, 1], [1, -1] // 4 hướng chính
    ];
    
    for (const [dx, dy] of directions) {
        let canWinThisDirection = true;
        let symbolCount = 0;
        
        // Kiểm tra 5 ô liên tiếp qua vị trí này
        for (let i = -4; i <= 4; i++) {
            const newRow = row + dx * i;
            const newCol = col + dy * i;
            
            if (newRow >= 0 && newRow < 10 && newCol >= 0 && newCol < 10) {
                const cell = cells[newRow * 10 + newCol];
                if (cell.classList.contains(symbol)) {
                    symbolCount++;
                } else if (cell.classList.contains(symbol === 'x' ? 'o' : 'x')) {
                    if (Math.abs(i) <= 2) { // Trong phạm vi 5 ô
                        canWinThisDirection = false;
                        break;
                    }
                }
            }
        }
        
        if (canWinThisDirection && symbolCount >= 2) {
            winningDirections++;
        }

    }
    
    return winningDirections >= 2;
}

function evaluateThreatLevel(index, symbol) {
    // Đánh giá mức độ nguy hiểm của một nước đi
    let threatLevel = 0;
    
    if (canCreateTripleThreat(index, symbol)) threatLevel += 1000;
    if (canCreateDoubleThreat(index, symbol)) threatLevel += 500;
    if (canCreateFork(index, symbol)) threatLevel += 300;
    if (isStrategicPosition(index)) threatLevel += 100;
    
    return threatLevel;
}

function preloadSounds() {
    setupAudio(winSounds);
    setupAudio(loseAudios);
    setupAudio(moveSounds);
}

function updateSoundArrays(isEnabled) {
    isSoundEnabled = isEnabled;
    const allSounds = [...winSounds, ...loseAudios, ...moveSounds];
    allSounds.forEach(sound => {
        sound.volume = isEnabled ? 0.5 : 0;
    });
}

function computerPlay() {
    if (!gameActive || !isComputerMode || !isPlayer1Turn) return;

    const emptyCells = getAllEmptyCells();
    const isFirstMove = emptyCells.length === 100;

    if (!isFirstMove) {
        showThinkingIndicator();
    }

    setTimeout(() => {
        if (!isFirstMove) {
            hideThinkingIndicator();
        }

        let cellToPlay;

        if (isFirstMove) {
            const centerCells = getCenterCells();
            cellToPlay = getRandomCell(centerCells);
        } else {
            cellToPlay = findBestMove();
        }

        if (cellToPlay) {
            const willWin = checkWinningMove(cellToPlay, 'x');
            
            if (!willWin) {
                playMoveSound();
            }
            
            handleCellClick(cellToPlay);
        }
    }, isFirstMove ? 0 : getRandomThinkingTime());
}

function checkWinningMove(cell, symbol) {
    const originalClass = cell.className;
    
    cell.classList.add(symbol);
    
    const isWinning = checkWin(symbol);
    
    cell.className = originalClass;
    
    return isWinning;
}

function savePlayerInfo(playerNumber, name, avatar) {
    if (!isComputerMode || playerNumber === 2) {
        localStorage.setItem(`player${playerNumber}Name`, name);
        localStorage.setItem(`player${playerNumber}Avatar`, avatar);
    }
}

function loadPlayerInfo() {
    if (!isComputerMode) {
        const savedName1 = localStorage.getItem('player1Name');
        const savedAvatar1 = localStorage.getItem('player1Avatar');
        if (savedName1) player1NameInput.value = savedName1;
        if (savedAvatar1) {
            document.querySelector('.player-1 .current-avatar').className = `current-avatar fa-solid ${savedAvatar1} fa-6x`;
        }
    }

    const savedName2 = localStorage.getItem('player2Name');
    const savedAvatar2 = localStorage.getItem('player2Avatar');
    if (savedName2) player2NameInput.value = savedName2;
    if (savedAvatar2) {
        document.querySelector('.player-2 .current-avatar').className = `current-avatar fa-solid ${savedAvatar2} fa-6x`;
    }
    
    // Cập nhật avatar sau khi load
    updateGameAreaAvatars();
}

document.addEventListener('DOMContentLoaded', () => {
    initializeBoard();
    preloadSounds();
    updateGameAreaAvatars();
});

function getComputerInfoByDifficulty(difficulty) {
    let computerInfo = {
        avatar: 'fa-cat',
        name: "Bé Mèo Con"
    };
    
    switch(difficulty) {
        case '5':
            computerInfo = { avatar: 'fa-cat', name: "Bé Mèo Con" };
            break;
        case '8':
            computerInfo = { avatar: 'fa-dog', name: "Anh Cún Con" };
            break;
        case '20':
            computerInfo = { avatar: 'fa-otter', name: "Chú Lười Lém" };
            break;
        case '24':
            computerInfo = { avatar: 'fa-hippo', name: "Bác Hà Mã" };
            break;
        case '36':
            computerInfo = { avatar: 'fa-dragon', name: "Cao thủ Rồng" };
            break;
    }
    return computerInfo;
}

function initializeBoard() {
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        board.appendChild(cell);
    }

    cells = document.querySelectorAll('.cell');

    // Thêm event listeners cho các nút
    const difficultySelect = document.getElementById('difficulty');
    const soundToggle = document.getElementById('sound-toggle');

    // Load độ khó từ localStorage và cập nhật UI
    const savedDifficulty = localStorage.getItem('computerDifficulty') || '5';
    computerDifficulty = savedDifficulty;
    difficultySelect.value = savedDifficulty;
    
    // Cập nhật tên và avatar dựa trên độ khó đã lưu
    const computerInfo = getComputerInfoByDifficulty(savedDifficulty);
    if (isComputerMode) {
        document.querySelector('.player-1 .current-avatar').className = `current-avatar fa-solid ${computerInfo.avatar} fa-6x`;
        player1NameInput.value = computerInfo.name;
        
        // Cập nhật options trong listbox
        Array.from(difficultySelect.options).forEach(option => {
            const optionInfo = getComputerInfoByDifficulty(option.value);
            option.textContent = optionInfo.name;
        });
    }

    difficultySelect.addEventListener('change', function() {
        computerDifficulty = this.value;
        localStorage.setItem('computerDifficulty', this.value);
        
        if (isComputerMode) {
            const computerInfo = getComputerInfoByDifficulty(this.value);
            document.querySelector('.player-1 .current-avatar').className = `current-avatar fa-solid ${computerInfo.avatar} fa-6x`;
            player1NameInput.value = computerInfo.name;
            updateGameAreaAvatars();
            
            // Cập nhật tên trong listbox
            const difficultyOptions = document.getElementById('difficulty').options;
            for (let option of difficultyOptions) {
                const optionInfo = getComputerInfoByDifficulty(option.value);
                option.textContent = optionInfo.name;
            }
            updateTurnInfo();
        }
    });

    soundToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        const isEnabled = this.classList.contains('active');
        localStorage.setItem('isSoundEnabled', isEnabled);
        updateSoundArrays(isEnabled);
    });

    // Khởi tạo trạng thái âm thanh
    if (isSoundEnabled) {
        soundToggle.classList.add('active');
    }

    loadPlayerInfo();
}

function setupAudio(audioArray) {
    audioArray.forEach(audio => {
        audio.preload = 'auto';
        audio.volume = 0.5;
    });
}

function playAudioSafely(audio) {
    if (!isSoundEnabled) return;
    
    audio.currentTime = 0;
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log("Playback prevented:", error);
        });
    }
}

function playWinSound() {
    if (!isSoundEnabled) return;
    const randomSound = winSounds[Math.floor(Math.random() * winSounds.length)];
    playAudioSafely(randomSound);
}

function playLoseSound() {
    if (!isSoundEnabled) return;
    const randomSound = loseAudios[Math.floor(Math.random() * loseAudios.length)];
    playAudioSafely(randomSound);
}

function playMoveSound() {
    if (!gameActive || !isSoundEnabled) return;
    const randomSound = moveSounds[Math.floor(Math.random() * moveSounds.length)];
    playAudioSafely(randomSound);
}

// Thêm hàm để cập nhật avatar ban đầu
function updateGameAreaAvatars() {
    const gameArea = document.querySelector('.game-area');
    const player1Avatar = document.querySelector('.player-1 .current-avatar').className.split(' ')[2];
    const player2Avatar = document.querySelector('.player-2 .current-avatar').className.split(' ')[2];
    
    // Xóa tất cả các class avatar cũ
    const oldClasses = Array.from(gameArea.classList).filter(c => c.startsWith('fa-'));
    oldClasses.forEach(c => gameArea.classList.remove(c));
    
    // Thêm class avatar mới cho cả hai người chơi
    if (player1Avatar) {
        gameArea.classList.add(player1Avatar); // Avatar cho game-area::before
    }
    if (player2Avatar) {
        gameArea.classList.add(player2Avatar + '-2'); // Avatar cho game-area::after
    }
}

// Cập nhật hàm updatePlayerName để đồng bộ với listbox
function updatePlayerName(player, newName) {
    if (player === 1) {
        player1Name = newName;
        document.querySelector('.player1-avatar .player-name').textContent = newName;
        // Cập nhật options trong listbox
        const difficultySelect = document.getElementById('difficulty-select');
        Array.from(difficultySelect.options).forEach(option => {
            if (option.value.includes('Dễ')) {
                option.text = `${newName} (Dễ)`;
            } else if (option.value.includes('Vừa')) {
                option.text = `${newName} (Vừa)`;
            } else if (option.value.includes('Khó')) {
                option.text = `${newName} (Khó)`;
            }
        });
        localStorage.setItem(STORAGE_KEYS.PLAYER1_NAME, newName);
    } else {
        player2Name = newName;
        document.querySelector('.player2-avatar .player-name').textContent = newName;
        localStorage.setItem(STORAGE_KEYS.PLAYER2_NAME, newName);
    }
    updateTurnInfo();
}

// Thêm hàm khởi tạo tên ban đầu cho score labels
function initializeScoreLabels() {
    document.getElementById('score-label-1').textContent = player1Name;
    document.getElementById('score-label-2').textContent = player2Name;
}

// Cập nhật hàm initGame để load độ khó và tên người chơi từ localStorage
function initGame() {
    // Load saved names
    const savedPlayer1Name = localStorage.getItem(STORAGE_KEYS.PLAYER1_NAME);
    const savedPlayer2Name = localStorage.getItem(STORAGE_KEYS.PLAYER2_NAME);
    
    if (savedPlayer1Name) {
        updatePlayerName(1, savedPlayer1Name);
    }
    if (savedPlayer2Name) {
        updatePlayerName(2, savedPlayer2Name);
    }

    // Load saved difficulty
    const difficultySelect = document.getElementById('difficulty-select');
    const savedDifficulty = localStorage.getItem(STORAGE_KEYS.DIFFICULTY);
    
    if (savedDifficulty) {
        difficultySelect.value = savedDifficulty;
    }

    // Cập nhật options trong listbox với tên người chơi hiện tại
    Array.from(difficultySelect.options).forEach(option => {
        if (option.value.includes('Dễ')) {
            option.text = `${player1Name} (Dễ)`;
        } else if (option.value.includes('Vừa')) {
            option.text = `${player1Name} (Vừa)`;
        } else if (option.value.includes('Khó')) {
            option.text = `${player1Name} (Khó)`;
        }
    });

    // Thêm event listener để lưu độ khó khi thay đổi
    difficultySelect.addEventListener('change', function() {
        localStorage.setItem(STORAGE_KEYS.DIFFICULTY, this.value);
    });

    // Hiển thị/ẩn nút voice dựa trên chế độ chơi
    const voiceButton = document.getElementById('voice-button');
    voiceButton.style.display = isComputerMode ? 'block' : 'none';
    
    resetGame();
}

function toggleGameMode() {
    isComputerMode = !isComputerMode;
    const difficultySelect = document.getElementById('difficulty-select');
    const voiceButton = document.getElementById('voice-button');
    
    if (isComputerMode) {
        difficultySelect.style.display = 'block';
        voiceButton.style.display = 'block';
        // ... existing code ...
    } else {
        difficultySelect.style.display = 'none';
        voiceButton.style.display = 'none';
        // ... existing code ...
    }
    resetGame();
} 