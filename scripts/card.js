/**
 * Pop's Christmas Bingo - Mobile Card Generator
 * Generates a valid random bingo card and handles tap interactions
 */

(function() {
    'use strict';

    const BINGO_RANGES = {
        B: { min: 1, max: 15 },
        I: { min: 16, max: 30 },
        N: { min: 31, max: 45 },
        G: { min: 46, max: 60 },
        O: { min: 61, max: 75 }
    };

    const COLUMNS = ['B', 'I', 'N', 'G', 'O'];
    const GRID_SIZE = 5;
    const FREE_SPACE_INDEX = 12; // Center of 5x5 grid (row 2, col 2)

    let currentCard = [];

    /**
     * Generate random unique numbers within a range
     */
    function getRandomNumbers(min, max, count) {
        const numbers = [];
        const available = [];
        
        for (let i = min; i <= max; i++) {
            available.push(i);
        }
        
        // Fisher-Yates shuffle
        for (let i = available.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [available[i], available[j]] = [available[j], available[i]];
        }
        
        return available.slice(0, count);
    }

    /**
     * Generate a valid bingo card
     * Returns a 5x5 array (row-major order)
     */
    function generateCard() {
        const card = [];
        const columnNumbers = {};

        // Generate 5 random numbers for each column
        COLUMNS.forEach(letter => {
            const range = BINGO_RANGES[letter];
            const count = letter === 'N' ? 4 : 5; // N column only needs 4 (FREE space)
            columnNumbers[letter] = getRandomNumbers(range.min, range.max, count);
        });

        // Build the card in row-major order
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                const letter = COLUMNS[col];
                const index = row * GRID_SIZE + col;
                
                if (index === FREE_SPACE_INDEX) {
                    card.push({ value: 'FREE', letter: 'N', isFree: true, marked: true });
                } else {
                    // Adjust row index for N column (skip center)
                    let numIndex = row;
                    if (letter === 'N' && row > 2) {
                        numIndex = row - 1;
                    }
                    card.push({ 
                        value: columnNumbers[letter][numIndex], 
                        letter: letter,
                        isFree: false,
                        marked: false
                    });
                }
            }
        }

        return card;
    }

    /**
     * Render the card to the DOM
     */
    function renderCard() {
        const grid = document.getElementById('cardGrid');
        grid.innerHTML = '';

        currentCard.forEach((cell, index) => {
            const cellEl = document.createElement('div');
            cellEl.className = 'cell';
            cellEl.dataset.index = index;

            if (cell.isFree) {
                cellEl.classList.add('free-space');
                cellEl.innerHTML = '⭐<br>FREE';
                cellEl.classList.add('marked');
            } else {
                cellEl.textContent = cell.value;
                if (cell.marked) {
                    cellEl.classList.add('marked');
                }
            }

            // Add tap handler
            cellEl.addEventListener('click', () => toggleCell(index));
            cellEl.addEventListener('touchend', (e) => {
                e.preventDefault();
                toggleCell(index);
            });

            grid.appendChild(cellEl);
        });
    }

    /**
     * Toggle a cell's marked state
     */
    function toggleCell(index) {
        const cell = currentCard[index];
        
        // Don't allow unmarking the free space
        if (cell.isFree) return;

        cell.marked = !cell.marked;
        
        const cellEl = document.querySelector(`.cell[data-index="${index}"]`);
        if (cellEl) {
            cellEl.classList.toggle('marked', cell.marked);
            
            // Haptic feedback if available
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        }
    }

    /**
     * Generate a new card
     */
    function newCard() {
        currentCard = generateCard();
        renderCard();
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate([20, 50, 20]);
        }
    }

    /**
     * Initialize the app
     */
    function init() {
        // Generate initial card
        newCard();

        // New card button
        document.getElementById('newCardBtn').addEventListener('click', newCard);

        // Prevent double-tap zoom on iOS
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - (window.lastTouchEnd || 0) < 300) {
                e.preventDefault();
            }
            window.lastTouchEnd = now;
        }, { passive: false });

        // Prevent pull-to-refresh
        document.body.addEventListener('touchmove', (e) => {
            if (e.touches.length > 1) return;
            e.preventDefault();
        }, { passive: false });
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

