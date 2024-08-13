const grid = document.getElementById('grid');
const moneyDisplay = document.getElementById('money');
const finalBalanceAmount = document.getElementById('final-balance-amount');
const cashoutButton = document.getElementById('cashout-button');
let money = 100;
let displayMoney = 100;
let mines = [];
let gameEnded = false;
let finalBalance = parseFloat(getCookie('finalBalance')) || 0; // Retrieve final balance from cookies

console.log('Initial final balance:', finalBalance); // Debugging

// Initialize the game and display the final balance
function initializeGame() {
    grid.innerHTML = '';
    money = 100;
    displayMoney = 100;
    gameEnded = false;
    mines = generateMines();
    updateMoneyDisplay();
    finalBalanceAmount.textContent = finalBalance.toFixed(2);

    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        const coinIcon = document.createElement('i');
        coinIcon.className = 'fas fa-coins';
        cell.appendChild(coinIcon);
        cell.addEventListener('click', () => revealCell(cell, i));
        grid.appendChild(cell);
    }
}

// Generate random mines
function generateMines() {
    const minePositions = [];
    while (minePositions.length < 3) {
        const pos = Math.floor(Math.random() * 25);
        if (!minePositions.includes(pos)) {
            minePositions.push(pos);
        }

    }
    return minePositions;
}

// Reveal a cell
function revealCell(cell, index) {
    if (gameEnded || cell.classList.contains('revealed')) return;

    setTimeout(() => {
        cell.classList.add('revealed');
    }, 50); // Add a slight delay to allow animation to play

    cell.innerHTML = ''; // Remove coin icon
    if (mines.includes(index)) {
        cell.classList.add('mine');
        const bombIcon = document.createElement('i');
        bombIcon.className = 'fas fa-bomb';
        cell.appendChild(bombIcon);
        money = 100;
        gameEnded = true;
	finalBalance = finalBalance / 2; finalBalanceAmount.textContent = finalBalance.toFixed(2);
    } else {
        money *= 1.25;
        addNeonDollarSign(cell);
    }

    animateMoneyChange(displayMoney, money, 1000);
}

// Add a neon dollar sign to the cell
function addNeonDollarSign(cell) {
    const dollarSign = document.createElement('div');
    dollarSign.className = 'neon-dollar';
    dollarSign.textContent = '$';
    cell.appendChild(dollarSign);
}

// Animate the change in money display
function animateMoneyChange(start, end, duration) {
    const range = end - start;
    const startTime = performance.now();

    function updateAnimation(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        displayMoney = start + range * progress;
        updateMoneyDisplay();

        if (progress < 1) {
            requestAnimationFrame(updateAnimation);
        } else {
            displayMoney = end;
            updateMoneyDisplay();
        }
    }

    requestAnimationFrame(updateAnimation);
}

// Update the displayed money
function updateMoneyDisplay() {
    moneyDisplay.textContent = displayMoney.toFixed(2);
}

// Handle cashing out
function cashout() {
    if (money > 100) {
        // Add current game money to final balance
        finalBalance += money;
        // Save final balance to cookies
        setCookie('finalBalance', finalBalance, 7); // 7 days expiration
        console.log('New final balance:', finalBalance); // Debugging
        finalBalanceAmount.textContent = finalBalance.toFixed(2);
        alert('You have successfully cashed out your balance!');
        money = 100; // Reset game money
        displayMoney = 100;
        updateMoneyDisplay();
	initializeGame();
    } else {
        alert('You need to have more than $100 to cash out.');
    }
}

// Set a cookie with a name, value, and expiration in days
function setCookie(name, value, days) {
    if (!name || !value) {
        console.error('Cookie name or value is missing.');
        return;
    }

    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/`;
    console.log('Cookie set:', document.cookie); // Debugging
}

// Retrieve a cookie value by name
function getCookie(name) {
    if (!name) {
        console.error('Cookie name is missing.');
        return null;
    }

    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
    }
    return null;
}

// Restart the game
function restartGame() {
    initializeGame();
}

// On page load, ensure the final balance is correctly displayed
document.addEventListener('DOMContentLoaded', () => {
    finalBalance = parseFloat(getCookie('finalBalance')) || 0;
    finalBalanceAmount.textContent = finalBalance.toFixed(2);
    console.log('Final balance on load:', finalBalance); // Debugging
    initializeGame();
});
