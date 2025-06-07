const board = document.getElementById('board');
const winningMessage = document.getElementById('winning-message');
const winningText = document.querySelector('.winning-text');
const startButton = document.getElementById('start-btn');
const restartButton = document.getElementById('restart-btn');
const playAgainButton = document.getElementById('play-again-btn');
const score1Element = document.getElementById('score-1');
const score2Element = document.getElementById('score-2');
const turnInfo = document.getElementById('turn-info');
const player1NameInput = document.getElementById('player1Name');
const player2NameInput = document.getElementById('player2Name');
const currentAvatars = document.querySelectorAll('.current-avatar');
const avatarOptions = document.querySelectorAll('.avatar-options');

// Tạo bảng 10x10
for (let i = 0; i < 100; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('data-index', i);
    board.appendChild(cell);
}

const cells = document.querySelectorAll('.cell');

let scores = {
    player1: 0,
    player2: 0
};

let isPlayer1Turn = true;
let gameActive = false;
let lastWinner = null;

// Mảng các lời chúc mừng
const congratMessages = [
    "🎉 Xuất sắc! Bạn đã chiến thắng một cách đầy thuyết phục!",
    "🌟 Wow! Đúng là bậc thầy cờ ca-rô!",
    "🏆 Chiến thắng tuyệt vời! Đối thủ không có cửa!",
    "👑 Quá đỉnh! Xứng đáng là nhà vô địch!",
    "🎮 Game hay quá! Thắng đẹp như phim!",
    "⭐ Đẳng cấp! Không ai cản được bạn!",
    "🎯 Chính xác từng nước đi! Quá xuất sắc!",
    "🌈 Tuyệt vời ông mặt trời! Thắng quá xứng đáng!",
    "💫 Siêu sao cờ ca-rô đây rồi!",
    "🔥 Quá hot! Đối thủ phải chào thua!"
];

// Hàm lấy ngẫu nhiên lời chúc mừng
function getRandomCongratMessage() {
    const randomIndex = Math.floor(Math.random() * congratMessages.length);
    return congratMessages[randomIndex];
}

// Xử lý click vào avatar để đổi
currentAvatars.forEach(avatar => {
    avatar.addEventListener('click', (e) => {
        const options = e.target.closest('.avatar-selector').querySelector('.avatar-options');
        options.classList.toggle('show');
        
        // Đóng avatar options khi click ra ngoài
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
            const avatar = e.target.dataset.avatar;
            const currentAvatar = options.closest('.avatar-selector').querySelector('.current-avatar');
            currentAvatar.className = `current-avatar fa-solid ${avatar} fa-8x`;
            options.classList.remove('show');
        });
    });
});

// Tạo mảng các combination chiến thắng cho bảng 10x10
const WINNING_COMBINATIONS = [];

// Thêm các hàng
for (let i = 0; i < 10; i++) {
    const row = [];
    for (let j = 0; j < 6; j++) {
        row.push([i * 10 + j, i * 10 + j + 1, i * 10 + j + 2, i * 10 + j + 3, i * 10 + j + 4]);
    }
    WINNING_COMBINATIONS.push(...row);
}

// Thêm các cột
for (let i = 0; i < 10; i++) {
    const col = [];
    for (let j = 0; j < 6; j++) {
        col.push([i + j * 10, i + (j + 1) * 10, i + (j + 2) * 10, i + (j + 3) * 10, i + (j + 4) * 10]);
    }
    WINNING_COMBINATIONS.push(...col);
}

// Thêm các đường chéo
for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
        // Đường chéo từ trái sang phải
        if (j + 4 < 10 && i + 4 < 10) {
            WINNING_COMBINATIONS.push([
                i * 10 + j,
                (i + 1) * 10 + (j + 1),
                (i + 2) * 10 + (j + 2),
                (i + 3) * 10 + (j + 3),
                (i + 4) * 10 + (j + 4)
            ]);
        }
        // Đường chéo từ phải sang trái
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

function getPlayerName(playerNumber) {
    const input = playerNumber === 1 ? player1NameInput : player2NameInput;
    return input.value.trim() || `Người chơi ${playerNumber}`;
}

function updateTurnInfo() {
    const currentPlayerName = isPlayer1Turn ? getPlayerName(1) : getPlayerName(2);
    const symbol = isPlayer1Turn ? 'X' : 'O';
    turnInfo.textContent = `Lượt của: ${currentPlayerName} (${symbol})`;
    
    activatePlayerAvatar(isPlayer1Turn ? 1 : 2);
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
    
    // Xóa animation sau 2 giây
    setTimeout(() => {
        player1Avatar.classList.remove('active');
        player2Avatar.classList.remove('active');
    }, 2000);
}

function startGame() {
    // Xóa hiệu ứng chiến thắng nếu có
    cells.forEach(cell => {
        cell.classList.remove('winning');
        cell.innerHTML = '';  // Xóa cả icon nếu có
    });
    winningMessage.classList.remove('show');

    // Dừng hiệu ứng nhắc nhở của nút bắt đầu
    startButton.classList.remove('remind');

    // Kiểm tra xem người chơi đã nhập tên chưa
    if (!player1NameInput.value.trim() || !player2NameInput.value.trim()) {
        alert('Vui lòng nhập tên cho cả hai người chơi!');
        return;
    }

    // Nếu có người thua cuộc, họ sẽ được chơi trước
    if (lastWinner === 'player1') {
        isPlayer1Turn = false;
    } else if (lastWinner === 'player2') {
        isPlayer1Turn = true;
    } else {
        isPlayer1Turn = true; // Ván đầu tiên, Player 1 chơi trước
    }
    
    gameActive = true;
    cells.forEach(cell => {
        cell.classList.remove('x', 'o');
        cell.textContent = '';
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    updateTurnInfo();
    startButton.style.display = 'none';
    restartButton.style.display = 'block';
    activatePlayerAvatar(1); // Kích hoạt animation cho người chơi 1
}

function handleClick(e) {
    if (!gameActive) {
        // Nếu game chưa bắt đầu, thêm hiệu ứng nhắc nhở cho nút bắt đầu
        if (startButton.style.display !== 'none') {
            startButton.classList.add('remind');
        }
        return;
    }
    
    const cell = e.target;
    if (cell.classList.contains('x') || cell.classList.contains('o')) return;
    
    const currentClass = isPlayer1Turn ? 'x' : 'o';
    placeMark(cell, currentClass);
    
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        updateTurnInfo();
    }
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    // Chỉ hiển thị X/O khi chưa thắng
    if (!cell.classList.contains('winning')) {
        cell.textContent = currentClass.toUpperCase();
    }
}

function swapTurns() {
    isPlayer1Turn = !isPlayer1Turn;
}

function checkWin(currentClass) {
    let hasWon = false;
    let winningCombination = null;

    // Kiểm tra hàng ngang
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

    // Kiểm tra hàng dọc
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

    // Kiểm tra đường chéo xuống phải
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

    // Kiểm tra đường chéo xuống trái
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
        // Lấy avatar của người thắng
        const winnerAvatar = isPlayer1Turn ? 
            document.querySelector('.player-1 .current-avatar').className.split(' ')[2] :
            document.querySelector('.player-2 .current-avatar').className.split(' ')[2];
        
        // Thay thế X/O bằng avatar trên các ô thắng
        winningCombination.forEach(index => {
            const cell = cells[index];
            cell.classList.add('winning');
            cell.innerHTML = `<i class="fa-solid ${winnerAvatar}"></i>`;
        });
    }

    return hasWon;
}

function isDraw() {
    return [...cells].every(cell => {
        return cell.classList.contains('x') || cell.classList.contains('o');
    });
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
            
        // Đợi 3 giây trước khi hiển thị thông báo chiến thắng
        setTimeout(() => {
            winningText.innerHTML = `
                <i class="fa-solid ${winnerAvatar} fa-2x"></i><br>
                ${winner} đã chiến thắng!<br>
                ${congratMessage}
            `;
            winningMessage.classList.add('show');
            
            // Update scores và lưu người thắng
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
    startGame();
    activatePlayerAvatar(1); // Kích hoạt animation cho người chơi 1 khi restart
}

function playAgain() {
    startGame();
    activatePlayerAvatar(isPlayer1Turn ? 1 : 2); // Kích hoạt animation cho người chơi tiếp theo
}

// Thêm sự kiện cho các nút
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
playAgainButton.addEventListener('click', playAgain);

// Thêm sự kiện cho input name
player1NameInput.addEventListener('input', updateTurnInfo);
player2NameInput.addEventListener('input', updateTurnInfo); 