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
let isComputerMode = false;
let lastHumanMove = null;

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
avatarSelectors.forEach(selector => {
    selector.addEventListener('click', (e) => {
        const options = selector.querySelector('.avatar-options');
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
            e.stopPropagation(); // Ngăn sự kiện click lan tỏa
            const avatar = e.target.dataset.avatar;
            const currentAvatar = options.closest('.avatar-selector').querySelector('.current-avatar');
            currentAvatar.className = `current-avatar fa-solid ${avatar} fa-6x`;
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
    turnInfo.textContent = `Lượt của ${currentPlayerName} (${symbol})`;
    
    // Cập nhật class current-turn và hiệu ứng lắc lư
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
    
    // Xóa animation sau 2 giây
    setTimeout(() => {
        player1Avatar.classList.remove('active');
        player2Avatar.classList.remove('active');
    }, 15000);
}

function startGame(withComputer = false) {
    // Xóa hiệu ứng chiến thắng nếu có
    cells.forEach(cell => {
        cell.classList.remove('winning');
        cell.innerHTML = '';  // Xóa cả icon nếu có
        cell.classList.remove('x', 'o');
        cell.textContent = '';
    });
    winningMessage.classList.remove('show');

    // Dừng hiệu ứng nhắc nhở của các nút
    startButton.classList.remove('remind');
    playWithComputerButton.classList.remove('remind');

    // Thiết lập chế độ chơi
    isComputerMode = withComputer;
    
    // Thiết lập tên và avatar cho máy nếu cần
    if (withComputer) {
        player1NameInput.value = "Máy";
        player1NameInput.disabled = true;
        document.querySelector('.player-1 .current-avatar').className = 'current-avatar fa-solid fa-robot fa-6x';
        document.querySelector('.player-1 .avatar-selector').style.pointerEvents = 'none';
    } else {
        player1NameInput.value = "Méo";
        player1NameInput.disabled = false;
        document.querySelector('.player-1 .current-avatar').className = 'current-avatar fa-solid fa-cat fa-6x';
        document.querySelector('.player-1 .avatar-selector').style.pointerEvents = 'auto';
    }

    // Kiểm tra xem người chơi đã nhập tên chưa
    if (!player2NameInput.value.trim()) {
        alert('Vui lòng nhập tên người chơi!');
        return;
    }

    // Reset lại lượt chơi và trạng thái game
    isPlayer1Turn = true;
    lastHumanMove = null;
    gameActive = true;
    
    // Thêm lại sự kiện click cho các ô
    cells.forEach(cell => {
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });

    // Cập nhật giao diện
    updateTurnInfo();
    startButton.style.display = 'none';
    playWithComputerButton.style.display = 'none';
    restartButton.style.display = 'block';

    // Nếu chơi với máy, cho máy đánh trước sau một chút
    if (withComputer) {
        setTimeout(computerPlay, 500);
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
    
    // Trong chế độ chơi với máy, chỉ cho phép người chơi đánh khi đến lượt (O)
    if (isComputerMode && isPlayer1Turn) return;
    
    const cell = e.target;
    if (cell.classList.contains('x') || cell.classList.contains('o')) return;
    
    handleCellClick(cell);
}

function handleCellClick(cell) {
    const currentClass = isPlayer1Turn ? 'x' : 'o';
    placeMark(cell, currentClass);
    
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        updateTurnInfo();
        
        // Lưu nước đi của người chơi
        if (isComputerMode && !isPlayer1Turn) {
            lastHumanMove = cell;
        }
        
        // Nếu đang ở chế độ chơi với máy và đến lượt máy, cho máy đánh
        if (isComputerMode && isPlayer1Turn) {
            computerPlay();
        }
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
        // Thay thế X/O bằng mặt cười trên các ô thắng
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

// Tạo hiệu ứng confetti
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

// Tạo hiệu ứng confetti 3 lần
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
            
        // Phát hiệu ứng confetti khi thắng
        playConfettiEffect();
            
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
    startButton.style.display = 'block';
    playWithComputerButton.style.display = 'block';
    restartButton.style.display = 'none';
    gameActive = false;
    
    // Reset lại trạng thái của player 1 nếu đang ở chế độ máy
    if (isComputerMode) {
        player1NameInput.disabled = false;
        document.querySelector('.player-1 .avatar-selector').style.pointerEvents = 'auto';
    }
}

function playAgain() {
    startGame();
    activatePlayerAvatar(isPlayer1Turn ? 1 : 2); // Kích hoạt animation cho người chơi tiếp theo
}

// Thêm sự kiện cho các nút
startButton.addEventListener('click', () => startGame(false));
playWithComputerButton.addEventListener('click', () => startGame(true));
restartButton.addEventListener('click', restartGame);
playAgainButton.addEventListener('click', () => {
    if (isComputerMode) {
        startGame(true);
    } else {
        startGame(false);
    }
});

// Thêm sự kiện cho input name
player1NameInput.addEventListener('input', updateTurnInfo);
player2NameInput.addEventListener('input', updateTurnInfo);

// Hàm kiểm tra xem có 4 quân liên tiếp không
function checkFourInARow(currentClass) {
    // Kiểm tra hàng ngang
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col <= 5; col++) {
            let count = 0;
            let emptyCell = null;
            for (let i = 0; i < 5; i++) {
                const index = row * 10 + col + i;
                if (index >= 100) continue; // Bỏ qua nếu index vượt quá bảng
                const cell = cells[index];
                if (!cell) continue; // Bỏ qua nếu cell không tồn tại
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

    // Kiểm tra hàng dọc
    for (let col = 0; col < 10; col++) {
        for (let row = 0; row <= 5; row++) {
            let count = 0;
            let emptyCell = null;
            for (let i = 0; i < 5; i++) {
                const index = (row + i) * 10 + col;
                if (index >= 100) continue; // Bỏ qua nếu index vượt quá bảng
                const cell = cells[index];
                if (!cell) continue; // Bỏ qua nếu cell không tồn tại
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

    // Kiểm tra đường chéo xuống phải
    for (let row = 0; row <= 5; row++) {
        for (let col = 0; col <= 5; col++) {
            let count = 0;
            let emptyCell = null;
            for (let i = 0; i < 5; i++) {
                const index = (row + i) * 10 + col + i;
                if (index >= 100) continue; // Bỏ qua nếu index vượt quá bảng
                const cell = cells[index];
                if (!cell) continue; // Bỏ qua nếu cell không tồn tại
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

    // Kiểm tra đường chéo xuống trái
    for (let row = 0; row <= 5; row++) {
        for (let col = 4; col < 10; col++) {
            let count = 0;
            let emptyCell = null;
            for (let i = 0; i < 5; i++) {
                const index = (row + i) * 10 + col - i;
                if (index >= 100) continue; // Bỏ qua nếu index vượt quá bảng
                const cell = cells[index];
                if (!cell) continue; // Bỏ qua nếu cell không tồn tại
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

// Hàm lấy các ô trống xung quanh một ô
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

// Hàm lấy một ô ngẫu nhiên từ danh sách
function getRandomCell(cellList) {
    return cellList[Math.floor(Math.random() * cellList.length)];
}

// Hàm lấy tất cả các ô trống
function getAllEmptyCells() {
    return [...cells].filter(cell => 
        !cell.classList.contains('x') && !cell.classList.contains('o')
    );
}

// Hàm lấy các ô trung tâm còn trống
function getCenterCells() {
    const centerCells = [];
    // Lấy 9 ô ở giữa bảng (từ hàng 4-6, cột 4-6)
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

// Hàm cho máy đánh
function computerPlay() {
    if (!gameActive || !isComputerMode || !isPlayer1Turn) return;

    setTimeout(() => {
        let cellToPlay;

        // Nếu là nước đi đầu tiên, chọn một ô ở giữa
        const emptyCells = getAllEmptyCells();
        if (emptyCells.length === 100) { // Bảng còn trống hoàn toàn
            const centerCells = getCenterCells();
            if (centerCells.length > 0) {
                cellToPlay = getRandomCell(centerCells);
                handleCellClick(cellToPlay);
                return;
            }
        }

        // Kiểm tra nếu máy có thể thắng
        cellToPlay = checkFourInARow('x');
        if (cellToPlay) {
            handleCellClick(cellToPlay);
            return;
        }

        // Kiểm tra nếu cần chặn người chơi
        cellToPlay = checkFourInARow('o');
        if (cellToPlay) {
            handleCellClick(cellToPlay);
            return;
        }

        // Nếu có nước đi gần nhất của người chơi, đánh gần đó
        if (lastHumanMove !== null) {
            const adjacentCells = getAdjacentEmptyCells(parseInt(lastHumanMove.dataset.index));
            if (adjacentCells.length > 0) {
                cellToPlay = getRandomCell(adjacentCells);
                handleCellClick(cellToPlay);
                return;
            }
        }

        // Nếu không có lựa chọn nào, đánh ngẫu nhiên
        if (emptyCells.length > 0) {
            cellToPlay = getRandomCell(emptyCells);
            handleCellClick(cellToPlay);
        }
    }, 500); // Đợi 0.5 giây trước khi máy đánh
} 