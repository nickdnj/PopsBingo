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
  nextBtn: document.getElementById('nextBtn'),
  repeatBtn: document.getElementById('repeatBtn'),
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
  
  // Story Modal (Easter Egg)
  logo: document.querySelector('.logo'),
  storyModal: document.getElementById('storyModal'),
  storyClose: document.getElementById('storyClose'),
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

// iOS Audio unlock state
let audioUnlocked = false;
let audioContext = null;

// Unlock audio for iOS Safari
// iOS requires a user gesture to enable audio playback
async function unlockAudio() {
  if (audioUnlocked) return;
  
  console.log('🔊 Unlocking audio for iOS...');
  
  try {
    // Create and play a silent audio context to unlock iOS audio
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Resume the context if it's suspended (iOS Safari)
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
    
    // Play a silent buffer to fully unlock
    // This is all we need - once AudioContext is unlocked, Audio elements can play
    const buffer = audioContext.createBuffer(1, 1, 22050);
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
    
    audioUnlocked = true;
    console.log('🔊 Audio unlocked successfully!');
    
    // If voice files weren't loaded on initial page load, try again
    if (!voicePack.loaded || voicePack.count === 0) {
      console.log('🔊 Retrying voice file load after unlock...');
      await loadVoiceFiles();
    }
  } catch (err) {
    console.warn('🔊 Audio unlock failed:', err);
  }
}

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
// Uses fetch() + blob URLs for better iOS Safari compatibility
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
  
  // Generate all expected file paths and try to load them using fetch
  // fetch() works more reliably on iOS than Audio.src with preload
  Object.entries(validRanges).forEach(([letter, [min, max]]) => {
    for (let num = min; num <= max; num++) {
      const label = `${letter}${num}`;
      const url = `${audioPath}/${label}.wav`;
      
      const loadPromise = fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          return response.blob();
        })
        .then(blob => {
          // Create Audio from blob URL - this works on iOS
          const blobUrl = URL.createObjectURL(blob);
          const audio = new Audio(blobUrl);
          audio.preload = 'auto';
          voicePack.files.set(label, audio);
          loadedCount++;
          return true;
        })
        .catch(err => {
          // File doesn't exist or failed to load - that's okay
          console.debug(`Could not load ${label}:`, err.message);
          return false;
        });
      
      loadPromises.push(loadPromise);
    }
  });
  
  // Wait for all files to attempt loading
  await Promise.all(loadPromises);
  
  // Load HANGUP clip for game-over announcement
  try {
    const resp = await fetch(`${audioPath}/HANGUP.wav`);
    if (resp.ok) {
      const blob = await resp.blob();
      voicePack.files.set('HANGUP', new Audio(URL.createObjectURL(blob)));
    }
  } catch (e) { /* optional */ }

  voicePack.count = loadedCount;
  voicePack.loaded = loadedCount > 0;

  updateVoiceStatus(loadedCount);
  console.log(`🎙️ Voice files loaded: ${loadedCount}/75`);

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
// When isRepeat is false (new number), play the clip twice like Pop did.
// When isRepeat is true, play it once.
function playVoiceCall(number, isRepeat) {
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
      // Detailed error logging for debugging iOS issues
      console.error(`Voice playback failed for ${label}:`, err.name, err.message);
      console.log('Audio state:', {
        paused: audio.paused,
        readyState: audio.readyState,
        src: audio.src ? 'set' : 'empty',
        audioUnlocked: audioUnlocked
      });
      playFallbackSound('call');
    });

    // New calls: play a second time after the first clip ends
    if (!isRepeat) {
      audio.onended = function () {
        audio.onended = null;
        audio.currentTime = 0;
        audio.play().catch(() => {});
      };
    } else {
      audio.onended = null;
    }

    return true;
  } else {
    console.warn(`No audio loaded for ${label}. voicePack.loaded=${voicePack.loaded}, count=${voicePack.count}`);
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
function playSound(type, number = null, isRepeat = false) {
  // For call sounds, try voice pack first
  if (type === 'call' && number !== null && voicePack.loaded) {
    if (playVoiceCall(number, isRepeat)) {
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
    const hangup = voicePack.files.get('HANGUP');
    if (hangup) { hangup.currentTime = 0; hangup.play().catch(() => {}); }
    else { playSound('bingo'); }
    return;
  }

  const number = callOrder.pop();
  calledNumbers.push(number);

  updateStats();
  updateBoard(number);
  updateCurrentCall(number);
  updateHistory();
  updateMiniCard(number);

  // Enable repeat button now that we have a number
  elements.repeatBtn.disabled = false;

  const letter = getLetterForNumber(number);
  showStatus(`🔔 ${letter}-${number}!`, 2000);
  playSound('call', number);

  // Check if all numbers called
  if (callOrder.length === 0) {
    setTimeout(() => {
      showStatus('🎅 Ho Ho Ho! All numbers called! What a game!', 5000);
      const hangup = voicePack.files.get('HANGUP');
    if (hangup) { hangup.currentTime = 0; hangup.play().catch(() => {}); }
    else { playSound('bingo'); }
    }, 1000);
  }
}

// Repeat the current number
function repeatCurrentNumber() {
  if (calledNumbers.length === 0) {
    showStatus('No number to repeat yet!', 2000);
    return;
  }

  const number = calledNumbers[calledNumbers.length - 1];
  const letter = getLetterForNumber(number);
  showStatus(`🔁 ${letter}-${number}!`, 2000);
  playSound('call', number, true);
}

// Reset the game
function resetSession() {
  buildCallOrder();
  generateMiniCard();
  // Disable repeat button since no number has been called yet
  elements.repeatBtn.disabled = true;
  showStatus('🎄 New game started! Let\'s play Bingo!');
}


// ========================================
// Story Audio Clips (QTS tail numbers)
// ========================================

// Cache for story audio files
const storyAudioCache = new Map();
let currentStoryAudio = null;

// Play QTS audio clips in the story modal
async function playStoryAudio(filename) {
  // Ensure audio is unlocked on iOS
  await unlockAudio();

  const audioPath = `audio/${filename}.wav`;

  // Stop any currently playing story audio
  if (currentStoryAudio) {
    currentStoryAudio.pause();
    currentStoryAudio.currentTime = 0;
    // Remove playing class from all buttons
    document.querySelectorAll('.story-audio-btn.playing').forEach(btn => {
      btn.classList.remove('playing');
    });
  }

  // Find the button that was clicked
  const clickedBtn = document.querySelector(`.story-audio-btn[onclick*="${filename}"]`);

  try {
    let audio = storyAudioCache.get(filename);

    if (!audio) {
      // Fetch and cache the audio file (works better on iOS)
      const response = await fetch(audioPath);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      audio = new Audio(blobUrl);
      audio.preload = 'auto';
      storyAudioCache.set(filename, audio);
    }

    // Set up ended handler to remove playing class
    audio.onended = () => {
      if (clickedBtn) clickedBtn.classList.remove('playing');
      currentStoryAudio = null;
    };

    // Add playing class and play
    if (clickedBtn) clickedBtn.classList.add('playing');
    currentStoryAudio = audio;
    audio.currentTime = 0;
    await audio.play();

  } catch (err) {
    console.error(`Failed to play story audio ${filename}:`, err);
    if (clickedBtn) clickedBtn.classList.remove('playing');
    // Play a fallback beep to indicate something happened
    playFallbackSound('call');
  }
}

// Make playStoryAudio available globally for onclick handlers
window.playStoryAudio = playStoryAudio;

// ========================================
// Story Modal (Easter Egg)
// ========================================

function openStoryModal() {
  elements.storyModal.classList.add('story-modal--open');
  elements.storyModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeStoryModal() {
  elements.storyModal.classList.remove('story-modal--open');
  elements.storyModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function isStoryModalOpen() {
  return elements.storyModal.classList.contains('story-modal--open');
}

// Wire up event listeners
function wireEvents() {
  // Wrap button handlers to unlock audio on first interaction (iOS)
  // Next button advances to the next number
  elements.nextBtn.addEventListener('click', async () => {
    await unlockAudio();
    callNextNumber();
  });

  // Repeat button replays the current number
  elements.repeatBtn.addEventListener('click', async () => {
    await unlockAudio();
    repeatCurrentNumber();
  });

  elements.resetBtn.addEventListener('click', async () => {
    await unlockAudio();
    resetSession();
  });
  
  // Story modal (Easter egg) - click logo to open
  if (elements.logo && elements.storyModal) {
    elements.logo.addEventListener('click', (e) => {
      e.preventDefault();
      openStoryModal();
    });
    
    // Close button
    elements.storyClose.addEventListener('click', closeStoryModal);
    
    // Click overlay to close
    elements.storyModal.querySelector('.story-modal__overlay').addEventListener('click', closeStoryModal);
    
    // Prevent clicks inside the container from closing
    elements.storyModal.querySelector('.story-modal__container').addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Close lightbox on Escape first
    if (e.code === 'Escape' && isLightboxOpen()) {
      closeLightbox();
      return;
    }
    
    // Close story modal on Escape
    if (e.code === 'Escape' && isStoryModalOpen()) {
      closeStoryModal();
      return;
    }
    
    // Don't process game shortcuts if modal is open
    if (isStoryModalOpen()) return;

    // Spacebar or Left Arrow = Repeat current number
    if ((e.code === 'Space' || e.code === 'ArrowLeft') && !e.repeat) {
      e.preventDefault();
      unlockAudio().then(() => repeatCurrentNumber());
    }
    // Enter, N, or Right Arrow = Next number
    if ((e.code === 'Enter' || e.code === 'KeyN' || e.code === 'ArrowRight') && !e.repeat) {
      e.preventDefault();
      unlockAudio().then(() => callNextNumber());
    }
    if (e.code === 'KeyR' && e.ctrlKey) {
      e.preventDefault();
      unlockAudio().then(() => resetSession());
    }
  });
  
  // Set up lightbox
  setupLightbox();
}

// ========================================
// Photo Lightbox
// ========================================
const lightboxElements = {
  lightbox: document.getElementById('lightbox'),
  image: document.getElementById('lightboxImage'),
  caption: document.getElementById('lightboxCaption'),
  close: document.getElementById('lightboxClose'),
};

function isLightboxOpen() {
  return lightboxElements.lightbox?.classList.contains('lightbox--open');
}

function openLightbox(imageSrc, altText) {
  if (!lightboxElements.lightbox) return;
  
  lightboxElements.image.src = imageSrc;
  lightboxElements.image.alt = altText || '';
  lightboxElements.caption.textContent = altText || '';
  
  lightboxElements.lightbox.classList.add('lightbox--open');
  lightboxElements.lightbox.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
  if (!lightboxElements.lightbox) return;
  
  lightboxElements.lightbox.classList.remove('lightbox--open');
  lightboxElements.lightbox.setAttribute('aria-hidden', 'true');
  lightboxElements.image.src = '';
}

function setupLightbox() {
  if (!lightboxElements.lightbox) return;
  
  // Close button
  lightboxElements.close?.addEventListener('click', closeLightbox);
  
  // Click overlay to close
  lightboxElements.lightbox.querySelector('.lightbox__overlay')?.addEventListener('click', closeLightbox);
  
  // Set up clickable photos
  document.querySelectorAll('.story-photo--clickable').forEach((photo) => {
    photo.addEventListener('click', (e) => {
      e.stopPropagation();
      const fullSrc = photo.dataset.full;
      const img = photo.querySelector('img');
      const caption = photo.querySelector('figcaption')?.textContent || img?.alt || '';
      if (fullSrc) {
        openLightbox(fullSrc, caption);
      }
    });
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




