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
    const FREE_SPACE_INDEX = 12;

    let currentCard = [];

    /**
     * Generate random unique numbers within a range
     */
    function getRandomNumbers(min, max, count) {
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
     */
    function generateCard() {
        const card = [];
        const columnNumbers = {};

        COLUMNS.forEach(letter => {
            const range = BINGO_RANGES[letter];
            const count = letter === 'N' ? 4 : 5;
            columnNumbers[letter] = getRandomNumbers(range.min, range.max, count);
        });

        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                const letter = COLUMNS[col];
                const index = row * GRID_SIZE + col;
                
                if (index === FREE_SPACE_INDEX) {
                    card.push({ value: 'FREE', isFree: true, marked: true });
                } else {
                    let numIndex = row;
                    if (letter === 'N' && row > 2) {
                        numIndex = row - 1;
                    }
                    card.push({ 
                        value: columnNumbers[letter][numIndex], 
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
                cellEl.classList.add('free-space', 'marked');
                cellEl.innerHTML = '⭐<br>FREE';
            } else {
                cellEl.textContent = cell.value;
            }

            // Tap to toggle mark
            cellEl.onclick = function() {
                if (!cell.isFree) {
                    cell.marked = !cell.marked;
                    this.classList.toggle('marked', cell.marked);
                }
            };

            grid.appendChild(cellEl);
        });
    }

    /**
     * Clear all marked cells (except FREE)
     */
    function clearAllMarks() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach((cellEl, index) => {
            const cell = currentCard[index];
            if (cell && !cell.isFree) {
                cell.marked = false;
                cellEl.classList.remove('marked');
            }
        });
    }

    // ========================================
    // Story Modal
    // ========================================

    function openStoryModal() {
        const modal = document.getElementById('storyModal');
        if (modal) {
            modal.classList.add('story-modal--open');
            modal.setAttribute('aria-hidden', 'false');
        }
    }

    function closeStoryModal() {
        const modal = document.getElementById('storyModal');
        if (modal) {
            modal.classList.remove('story-modal--open');
            modal.setAttribute('aria-hidden', 'true');
        }
    }

    function initStoryModal() {
        const storyLink = document.getElementById('storyLink');
        const storyModal = document.getElementById('storyModal');
        const storyClose = document.getElementById('storyClose');
        const storyOverlay = document.querySelector('.story-modal__overlay');

        if (storyLink) {
            storyLink.addEventListener('click', openStoryModal);
        }

        if (storyClose) {
            storyClose.addEventListener('click', closeStoryModal);
        }

        if (storyOverlay) {
            storyOverlay.addEventListener('click', closeStoryModal);
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && storyModal && storyModal.classList.contains('story-modal--open')) {
                closeStoryModal();
            }
        });
    }

    // ========================================
    // Story Audio Playback
    // ========================================

    const storyAudioCache = new Map();
    let currentStoryAudio = null;

    async function playStoryAudio(filename) {
        const audioPath = `audio/${filename}.wav`;

        // Stop any currently playing audio
        if (currentStoryAudio) {
            currentStoryAudio.pause();
            currentStoryAudio.currentTime = 0;
            document.querySelectorAll('.story-audio-btn.playing').forEach(btn => {
                btn.classList.remove('playing');
            });
        }

        const clickedBtn = document.querySelector(`.story-audio-btn[onclick*="${filename}"]`);

        try {
            let audio = storyAudioCache.get(filename);

            if (!audio) {
                const response = await fetch(audioPath);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                audio = new Audio(blobUrl);
                storyAudioCache.set(filename, audio);
            }

            audio.onended = () => {
                if (clickedBtn) clickedBtn.classList.remove('playing');
                currentStoryAudio = null;
            };

            if (clickedBtn) clickedBtn.classList.add('playing');
            currentStoryAudio = audio;
            audio.currentTime = 0;
            await audio.play();

        } catch (err) {
            console.error(`Failed to play story audio ${filename}:`, err);
            if (clickedBtn) clickedBtn.classList.remove('playing');
        }
    }

    // Make playStoryAudio available globally
    window.playStoryAudio = playStoryAudio;

    /**
     * Initialize
     */
    function init() {
        currentCard = generateCard();
        renderCard();

        // Clear button - clears all marks
        document.getElementById('clearCardBtn').onclick = function() {
            clearAllMarks();
        };

        // New Card button - just reload the page
        document.getElementById('newCardBtn').onclick = function() {
            window.location.reload();
        };

        // Initialize story modal
        initStoryModal();
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
