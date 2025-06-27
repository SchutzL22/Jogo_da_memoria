const gameBoard = document.getElementById('game-board');
const timerElement = document.getElementById('timer');

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchesFound = 0;
let totalMatches = 0;
let timerInterval;
let seconds = 0;

function initGame(imageSet, cardCount) {
    totalMatches = cardCount / 2;
    const cardImages = imageSet.concat(imageSet); // Duplica as imagens para formar os pares
    
    // Embaralhar as cartas
    cardImages.sort(() => 0.5 - Math.random());

    gameBoard.innerHTML = '';
    gameBoard.className = 'game-container'; // Reseta as classes
    gameBoard.classList.add(`cards-${cardCount}`); // Adiciona classe para o grid CSS

    cardImages.forEach(imageSrc => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.name = imageSrc;

        card.innerHTML = `
            <div class="card-face card-front">
                <img src="${imageSrc}" alt="Imagem da carta">
            </div>
            <div class="card-face card-back"></div>
        `;

        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });

    startTimer();
}

function startTimer() {
    seconds = 0;
    timerElement.textContent = `Tempo: ${seconds}s`;
    timerInterval = setInterval(() => {
        seconds++;
        timerElement.textContent = `Tempo: ${seconds}s`;
    }, 1000);
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    matchesFound++;
    if (matchesFound === totalMatches) {
        endGame();
    }
    
    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1200);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function endGame() {
    clearInterval(timerInterval);
    setTimeout(() => {
        localStorage.setItem('time', seconds);
        window.location.href = 'resultado.html';
    }, 500);
}