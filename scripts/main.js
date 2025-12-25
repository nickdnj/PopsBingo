const BINGO_COLUMNS = {
  B: Array.from({ length: 15 }, (_, i) => i + 1),
  I: Array.from({ length: 15 }, (_, i) => i + 16),
  N: Array.from({ length: 15 }, (_, i) => i + 31),
  G: Array.from({ length: 15 }, (_, i) => i + 46),
  O: Array.from({ length: 15 }, (_, i) => i + 61),
};

const elements = {
  callBtn: document.getElementById("callBtn"),
  heroCallBtn: document.getElementById("heroCallBtn"),
  heroResetBtn: document.getElementById("heroResetBtn"),
  resetBtn: document.getElementById("resetBtn"),
  remainingCount: document.getElementById("remainingCount"),
  historyList: document.getElementById("historyList"),
  queueList: document.getElementById("queueList"),
  statusText: document.getElementById("statusText"),
  boardGrid: document.getElementById("boardGrid"),
  callAudio: document.getElementById("callAudio"),
  bingoAudio: document.getElementById("bingoAudio"),
  callSound: document.getElementById("callSound"),
  bingoSound: document.getElementById("bingoSound"),
};

let calledNumbers = [];
let callOrder = [];
const boardCells = new Map();

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildCallOrder() {
  callOrder = shuffle(Array.from({ length: 75 }, (_, i) => i + 1));
  calledNumbers = [];
  updateHistory();
  updateQueue();
  updateRemaining();
  updateStatus("Waiting to start…");
  updateBoardState(null);
}

function getLetterForNumber(num) {
  if (num <= 15) return "B";
  if (num <= 30) return "I";
  if (num <= 45) return "N";
  if (num <= 60) return "G";
  return "O";
}

function updateRemaining() {
  elements.remainingCount.textContent = callOrder.length.toString();
}

function updateStatus(message) {
  elements.statusText.textContent = message;
}

function updateHistory() {
  elements.historyList.innerHTML = "";
  calledNumbers
    .slice()
    .reverse()
    .forEach((number, index) => {
      const historyItem = document.createElement("div");
      historyItem.className = `history__item ${index === 0 ? "history__item--new" : ""}`;
      const letter = getLetterForNumber(number);
      historyItem.innerHTML = `<span>${letter}</span><strong>${number}</strong>`;
      elements.historyList.appendChild(historyItem);
    });
}

function updateQueue() {
  elements.queueList.innerHTML = "";
  const remainingOrder = callOrder.slice().reverse();

  remainingOrder.forEach((number, index) => {
    const queueItem = document.createElement("div");
    queueItem.className = "queue__item";
    const letter = getLetterForNumber(number);
    queueItem.innerHTML = `<span>${index === 0 ? "Next" : "In line"}</span><strong>${letter}${number}</strong>`;
    elements.queueList.appendChild(queueItem);
  });
}

function renderBoard() {
  elements.boardGrid.innerHTML = "";
  boardCells.clear();

  Object.entries(BINGO_COLUMNS).forEach(([letter, numbers]) => {
    const column = document.createElement("div");
    column.className = "board__column";
    const heading = document.createElement("div");
    heading.className = "board__heading";
    heading.textContent = letter;
    column.appendChild(heading);

    numbers.forEach((number) => {
      const ball = document.createElement("button");
      ball.type = "button";
      ball.className = "board__ball";
      ball.dataset.number = number;
      ball.dataset.letter = letter;
      ball.textContent = `${letter}${number}`;
      column.appendChild(ball);
      boardCells.set(number, ball);
    });

    elements.boardGrid.appendChild(column);
  });
}

function updateBoardState(latestNumber) {
  boardCells.forEach((ball) => {
    ball.classList.remove("board__ball--called", "board__ball--latest");
  });

  calledNumbers.forEach((num, index) => {
    const ball = boardCells.get(num);
    if (ball) {
      ball.classList.add("board__ball--called");
      if (index === calledNumbers.length - 1 && latestNumber !== null) {
        ball.classList.add("board__ball--latest");
      }
    }
  });
}

function playSound(sound) {
  const audioElement = sound === "bingo" ? elements.bingoSound : elements.callSound;
  if (audioElement && audioElement.src) {
    audioElement.currentTime = 0;
    audioElement.play().catch(() => {
      // Ignore autoplay restrictions; fallback handled below
    });
  } else {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = sound === "bingo" ? "triangle" : "sine";
    oscillator.frequency.value = sound === "bingo" ? 740 : 540;
    gain.gain.value = 0.08;
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + (sound === "bingo" ? 0.45 : 0.25));
  }
}

function callNextNumber() {
  if (callOrder.length === 0) {
    updateStatus("All numbers have been called. Reset to start again.");
    return;
  }

  const nextNumber = callOrder.pop();
  calledNumbers.push(nextNumber);
  updateRemaining();
  updateHistory();
  updateQueue();
  updateBoardState(nextNumber);
  updateStatus(`Last called: ${getLetterForNumber(nextNumber)}${nextNumber}`);
  playSound("call");

  if (callOrder.length === 0) {
    updateStatus("All numbers called! Wrap up the game or start fresh.");
    playSound("bingo");
  }
}

function resetSession() {
  buildCallOrder();
}

function handleAudioLoad(inputEl, audioEl) {
  const [file] = inputEl.files || [];
  if (file) {
    const objectUrl = URL.createObjectURL(file);
    audioEl.src = objectUrl;
  }
}

function wireActions() {
  elements.callBtn.addEventListener("click", callNextNumber);
  if (elements.heroCallBtn) {
    elements.heroCallBtn.addEventListener("click", callNextNumber);
  }
  if (elements.resetBtn) {
    elements.resetBtn.addEventListener("click", resetSession);
  }
  if (elements.heroResetBtn) {
    elements.heroResetBtn.addEventListener("click", resetSession);
  }

  elements.callAudio.addEventListener("change", () => handleAudioLoad(elements.callAudio, elements.callSound));
  elements.bingoAudio.addEventListener("change", () => handleAudioLoad(elements.bingoAudio, elements.bingoSound));
}

function initialize() {
  renderBoard();
  buildCallOrder();
  wireActions();
}

initialize();
