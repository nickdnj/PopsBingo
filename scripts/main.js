/**
 * Pop's Christmas Bingo
 * A festive tribute to family game nights
 */

// Bingo column definitions
const BINGO_COLUMNS = {
  B: { numbers: Array.from({ length: 15 }, (_, i) => i + 1), color: '#2196f3' },
  I: { numbers: Array.from({ length: 15 }, (_, i) => i + 16), color: '#e91e63' },
  N: { numbers: Array.from({ length: 15 }, (_, i) => i + 31), color: '#9c27b0' },
  G: { numbers: Array.from({ length: 15 }, (_, i) => i + 46), color: '#4caf50' },
  O: { numbers: Array.from({ length: 15 }, (_, i) => i + 61), color: '#ff9800' },
};

// DOM Elements
const elements = {
  // Buttons
  callBtn: document.getElementById('callBtn'),
  resetBtn: document.getElementById('resetBtn'),
  
  // Stats
  totalCalls: document.getElementById('totalCalls'),
  previousCall: document.getElementById('previousCall'),
  remainingCount: document.getElementById('remainingCount'),
  
  // Board
  boardGrid: document.getElementById('boardGrid'),
  
  // Current call display
  currentBall: document.getElementById('currentBall'),
  currentLetter: document.getElementById('currentLetter'),
  currentNumber: document.getElementById('currentNumber'),
  
  // Mini card
  miniCardGrid: document.getElementById('miniCardGrid'),
  
  // History
  historyList: document.getElementById('historyList'),
  
  // Audio
  bingoSound: document.getElementById('bingoSound'),
  
  // Voice status
  voiceStatus: document.getElementById('voiceStatus'),
  
  // Status
  statusMessage: document.getElementById('statusMessage'),
};

// Game state
let calledNumbers = [];
let callOrder = [];
let miniCard = [];
const boardCells = new Map();
const miniCardCells = new Map();

// Voice pack state
const voicePack = {
  loaded: false,
  files: new Map(), // Map of call label (e.g., "B1") to Audio object
  count: 0,
};

// Utility: Shuffle array
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Get letter for a number
function getLetterForNumber(num) {
  if (num <= 15) return 'B';
  if (num <= 30) return 'I';
  if (num <= 45) return 'N';
  if (num <= 60) return 'G';
  return 'O';
}

// Build the main bingo board (horizontal rows like letsplaybingo.io)
function renderBoard() {
  elements.boardGrid.innerHTML = '';
  boardCells.clear();
  
  // Create 5 rows (B, I, N, G, O) with 15 numbers each
  const letters = ['B', 'I', 'N', 'G', 'O'];
  
  letters.forEach(letter => {
    const { numbers } = BINGO_COLUMNS[letter];
    
    numbers.forEach(num => {
      const cell = document.createElement('div');
      cell.className = 'board__cell';
      cell.dataset.number = num;
      cell.dataset.row = letter;
      cell.textContent = num;
      elements.boardGrid.appendChild(cell);
      boardCells.set(num, cell);
    });
  });
}

// Generate a random bingo card for the mini display
function generateMiniCard() {
  miniCard = [];
  const columns = Object.entries(BINGO_COLUMNS);
  
  columns.forEach(([letter, { numbers }], colIndex) => {
    const shuffled = shuffle(numbers);
    const selected = shuffled.slice(0, 5);
    
    selected.forEach((num, rowIndex) => {
      // Center cell (N column, middle row) is FREE
      const isFree = colIndex === 2 && rowIndex === 2;
      miniCard.push({
        number: isFree ? 'FREE' : num,
        letter,
        isFree,
        marked: isFree,
        position: rowIndex * 5 + colIndex,
      });
    });
  });
  
  // Sort by position for correct grid display
  miniCard.sort((a, b) => a.position - b.position);
  renderMiniCard();
}

// Render the mini bingo card
function renderMiniCard() {
  elements.miniCardGrid.innerHTML = '';
  miniCardCells.clear();
  
  miniCard.forEach((cell, index) => {
    const cellEl = document.createElement('div');
    cellEl.className = 'mini-card__cell';
    
    if (cell.isFree) {
      cellEl.classList.add('mini-card__cell--free');
      cellEl.textContent = 'FREE';
    } else {
      cellEl.textContent = cell.number;
    }
    
    if (cell.marked && !cell.isFree) {
      cellEl.classList.add('mini-card__cell--marked');
    }
    
    elements.miniCardGrid.appendChild(cellEl);
    miniCardCells.set(index, cellEl);
  });
}

// Update mini card when a number is called
function updateMiniCard(number) {
  miniCard.forEach((cell, index) => {
    if (cell.number === number) {
      cell.marked = true;
      const cellEl = miniCardCells.get(index);
      if (cellEl) {
        cellEl.classList.add('mini-card__cell--marked');
      }
    }
  });
}

// Build the call order
function buildCallOrder() {
  callOrder = shuffle(Array.from({ length: 75 }, (_, i) => i + 1));
  calledNumbers = [];
  
  updateStats();
  updateBoard(null);
  updateHistory();
  updateCurrentCall(null);
  
  showStatus('🎄 Merry Christmas! Click "Call Number" to start!');
}

// Update stats display
function updateStats() {
  elements.totalCalls.textContent = calledNumbers.length;
  elements.remainingCount.textContent = callOrder.length;
  
  if (calledNumbers.length > 1) {
    const prev = calledNumbers[calledNumbers.length - 2];
    elements.previousCall.textContent = `${getLetterForNumber(prev)}${prev}`;
  } else {
    elements.previousCall.textContent = '--';
  }
}

// Update the main board state
function updateBoard(latestNumber) {
  boardCells.forEach((cell, num) => {
    cell.classList.remove('board__cell--called', 'board__cell--latest');
  });
  
  calledNumbers.forEach((num, index) => {
    const cell = boardCells.get(num);
    if (cell) {
      cell.classList.add('board__cell--called');
      if (index === calledNumbers.length - 1 && latestNumber !== null) {
        cell.classList.add('board__cell--latest');
      }
    }
  });
}

// Update current call display
function updateCurrentCall(number) {
  if (number === null) {
    elements.currentLetter.textContent = '🎄';
    elements.currentNumber.textContent = '';
    elements.currentBall.classList.add('history__current-ball--waiting');
  } else {
    const letter = getLetterForNumber(number);
    elements.currentLetter.textContent = letter;
    elements.currentNumber.textContent = number;
    elements.currentBall.classList.remove('history__current-ball--waiting');
    
    // Add a little animation
    elements.currentBall.style.animation = 'none';
    elements.currentBall.offsetHeight; // Trigger reflow
    elements.currentBall.style.animation = 'float 3s ease-in-out infinite';
  }
}

// Update history display
function updateHistory() {
  elements.historyList.innerHTML = '';
  
  if (calledNumbers.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'history__empty';
    empty.textContent = 'No numbers called yet...';
    elements.historyList.appendChild(empty);
    return;
  }
  
  // Show most recent calls first, limit to last 20 for performance
  const recentCalls = calledNumbers.slice(-20).reverse();
  
  recentCalls.forEach((num, index) => {
    const letter = getLetterForNumber(num);
    const item = document.createElement('div');
    item.className = 'history__item';
    if (index === 0) {
      item.classList.add('history__item--latest');
    }
    
    item.innerHTML = `
      <span class="history__item-letter">${letter}</span>
      <span class="history__item-number">${num}</span>
    `;
    
    elements.historyList.appendChild(item);
  });
}

// Auto-load voice files from the audio folder
async function loadVoiceFiles() {
  const audioPath = 'audio';
  const validRanges = {
    B: [1, 15],
    I: [16, 30],
    N: [31, 45],
    G: [46, 60],
    O: [61, 75],
  };
  
  let loadedCount = 0;
  const loadPromises = [];
  
  // Generate all expected file paths and try to load them
  Object.entries(validRanges).forEach(([letter, [min, max]]) => {
    for (let num = min; num <= max; num++) {
      const label = `${letter}${num}`;
      const audio = new Audio();
      
      const loadPromise = new Promise((resolve) => {
        audio.addEventListener('canplaythrough', () => {
          voicePack.files.set(label, audio);
          loadedCount++;
          resolve(true);
        }, { once: true });
        
        audio.addEventListener('error', () => {
          resolve(false);
        }, { once: true });
        
        audio.src = `${audioPath}/${label}.wav`;
        audio.preload = 'auto';
      });
      
      loadPromises.push(loadPromise);
    }
  });
  
  // Wait for all files to attempt loading
  await Promise.all(loadPromises);
  
  voicePack.count = loadedCount;
  voicePack.loaded = loadedCount > 0;
  
  updateVoiceStatus(loadedCount);
  
  return loadedCount;
}

// Update voice status display
function updateVoiceStatus(count) {
  const statusEl = elements.voiceStatus;
  if (!statusEl) return;
  
  if (count === 75) {
    statusEl.classList.add('voice-status--loaded');
    statusEl.innerHTML = `
      <span class="voice-status__icon">🎙️</span>
      <span class="voice-status__text">Pop's Voice Ready!</span>
    `;
  } else if (count > 0) {
    statusEl.classList.add('voice-status--partial');
    statusEl.innerHTML = `
      <span class="voice-status__icon">🎙️</span>
      <span class="voice-status__text">${count}/75 loaded</span>
    `;
  } else {
    statusEl.classList.add('voice-status--error');
    statusEl.innerHTML = `
      <span class="voice-status__icon">🔇</span>
      <span class="voice-status__text">No voice files</span>
    `;
  }
}

// Play voice clip for a specific call
function playVoiceCall(number) {
  const letter = getLetterForNumber(number);
  const label = `${letter}${number}`;
  const audio = voicePack.files.get(label);
  
  if (audio) {
    // Stop any currently playing voice clip
    voicePack.files.forEach(a => {
      a.pause();
      a.currentTime = 0;
    });
    
    audio.currentTime = 0;
    audio.play().catch(err => {
      console.warn('Voice playback failed:', err);
      playFallbackSound('call');
    });
    return true;
  }
  return false;
}

// Play fallback sound effect
function playFallbackSound(type) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  if (type === 'bingo') {
    // Cheerful arpeggio for bingo
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
    osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
    gain.gain.value = 0.1;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } else {
    // Simple bell tone for calls
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }
}

// Play sound effect
function playSound(type, number = null) {
  // For call sounds, try voice pack first
  if (type === 'call' && number !== null && voicePack.loaded) {
    if (playVoiceCall(number)) {
      return; // Voice clip played successfully
    }
  }
  
  // Bingo sound or fallback
  const audioEl = type === 'bingo' ? elements.bingoSound : null;
  
  if (audioEl && audioEl.src) {
    audioEl.currentTime = 0;
    audioEl.play().catch(() => {});
  } else {
    playFallbackSound(type);
  }
}

// Show status message
function showStatus(message, duration = 3000) {
  elements.statusMessage.textContent = message;
  elements.statusMessage.classList.add('status--visible');
  
  setTimeout(() => {
    elements.statusMessage.classList.remove('status--visible');
  }, duration);
}

// Call the next number
function callNextNumber() {
  if (callOrder.length === 0) {
    showStatus('🎉 All 75 numbers have been called! Click "New Game" to play again.');
    playSound('bingo');
    return;
  }
  
  const number = callOrder.pop();
  calledNumbers.push(number);
  
  updateStats();
  updateBoard(number);
  updateCurrentCall(number);
  updateHistory();
  updateMiniCard(number);
  
  const letter = getLetterForNumber(number);
  showStatus(`🔔 ${letter}-${number}!`, 2000);
  playSound('call', number);
  
  // Check if all numbers called
  if (callOrder.length === 0) {
    setTimeout(() => {
      showStatus('🎅 Ho Ho Ho! All numbers called! What a game!', 5000);
      playSound('bingo');
    }, 1000);
  }
}

// Reset the game
function resetSession() {
  buildCallOrder();
  generateMiniCard();
  showStatus('🎄 New game started! Let\'s play Bingo!');
}


// Wire up event listeners
function wireEvents() {
  elements.callBtn.addEventListener('click', callNextNumber);
  elements.resetBtn.addEventListener('click', resetSession);
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !e.repeat) {
      e.preventDefault();
      callNextNumber();
    }
    if (e.code === 'KeyR' && e.ctrlKey) {
      e.preventDefault();
      resetSession();
    }
  });
}

// Initialize the app
async function initialize() {
  renderBoard();
  generateMiniCard();
  buildCallOrder();
  wireEvents();
  
  // Auto-load voice files from audio folder
  const voiceCount = await loadVoiceFiles();
  
  if (voiceCount === 75) {
    console.log('🎙️ All 75 voice files loaded!');
  } else if (voiceCount > 0) {
    console.log(`🎙️ ${voiceCount}/75 voice files loaded.`);
  } else {
    console.log('🔇 No voice files found in audio/ folder.');
  }
  
  console.log('🎄 Pop\'s Christmas Bingo loaded! Press Space to call numbers.');
}

// Start the app
initialize();

