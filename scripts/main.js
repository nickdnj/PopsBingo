const BINGO_COLUMNS = {
  B: Array.from({ length: 15 }, (_, i) => i + 1),
  I: Array.from({ length: 15 }, (_, i) => i + 16),
  N: Array.from({ length: 15 }, (_, i) => i + 31),
  G: Array.from({ length: 15 }, (_, i) => i + 46),
  O: Array.from({ length: 15 }, (_, i) => i + 61),
};

const elements = {
  callBtn: document.getElementById("callBtn"),
  newCardBtn: document.getElementById("newCardBtn"),
  resetBtn: document.getElementById("resetBtn"),
  remainingCount: document.getElementById("remainingCount"),
  historyList: document.getElementById("historyList"),
  statusText: document.getElementById("statusText"),
  cardBody: document.getElementById("cardBody"),
  callAudio: document.getElementById("callAudio"),
  bingoAudio: document.getElementById("bingoAudio"),
  callSound: document.getElementById("callSound"),
  bingoSound: document.getElementById("bingoSound"),
};

let cardCells = [];
let calledNumbers = [];
let callOrder = [];
let markedMatrix = [];
let bingoAchieved = false;

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
  bingoAchieved = false;
  updateHistory();
  updateRemaining();
  updateStatus("Waiting to start…");
  highlightWinners([]);
}

function generateCard() {
  elements.cardBody.innerHTML = "";
  cardCells = [];
  markedMatrix = Array.from({ length: 5 }, () => Array(5).fill(false));
  const columnKeys = Object.keys(BINGO_COLUMNS);
  const columnNumbers = columnKeys.reduce((acc, key) => {
    acc[key] = shuffle(BINGO_COLUMNS[key]).slice(0, 5);
    return acc;
  }, {});

  for (let rowIndex = 0; rowIndex < 5; rowIndex += 1) {
    const rowEl = document.createElement("div");
    rowEl.className = "card__row";
    cardCells[rowIndex] = [];

    columnKeys.forEach((key, colIndex) => {
      const value = columnNumbers[key][rowIndex];
      const cell = document.createElement("span");
      cell.className = "card__cell cell--number";
      cell.dataset.column = key;

      if (rowIndex === 2 && colIndex === 2) {
        cell.textContent = "FREE";
        cell.classList.add("cell--free", "cell--marked");
        markedMatrix[rowIndex][colIndex] = true;
      } else {
        cell.textContent = value;
        cell.dataset.number = value;
      }

      rowEl.appendChild(cell);
      cardCells[rowIndex][colIndex] = cell;
    });

    elements.cardBody.appendChild(rowEl);
  }
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

function getLetterForNumber(num) {
  if (num <= 15) return "B";
  if (num <= 30) return "I";
  if (num <= 45) return "N";
  if (num <= 60) return "G";
  return "O";
}

function markIfPresent(number) {
  let changed = false;
  cardCells.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell.dataset.number && Number(cell.dataset.number) === number) {
        cell.classList.add("cell--marked");
        markedMatrix[rowIndex][colIndex] = true;
        changed = true;
      }
    });
  });
  return changed;
}

function getWinningLines() {
  const lines = [];

  for (let i = 0; i < 5; i += 1) {
    if (markedMatrix[i].every(Boolean)) {
      lines.push(
        Array.from({ length: 5 }, (_, col) => [i, col])
      );
    }
  }

  for (let col = 0; col < 5; col += 1) {
    const columnComplete = markedMatrix.every((row) => row[col]);
    if (columnComplete) {
      lines.push(
        Array.from({ length: 5 }, (_, row) => [row, col])
      );
    }
  }

  const diag1Complete = [0, 1, 2, 3, 4].every((i) => markedMatrix[i][i]);
  if (diag1Complete) {
    lines.push(
      Array.from({ length: 5 }, (_, i) => [i, i])
    );
  }

  const diag2Complete = [0, 1, 2, 3, 4].every((i) => markedMatrix[i][4 - i]);
  if (diag2Complete) {
    lines.push(
      Array.from({ length: 5 }, (_, i) => [i, 4 - i])
    );
  }

  return lines;
}

function highlightWinners(lines) {
  cardCells.flat().forEach((cell) => cell.classList.remove("cell--bingo"));
  lines.forEach((coords) => {
    coords.forEach(([row, col]) => {
      cardCells[row][col].classList.add("cell--bingo");
    });
  });
}

function playSound(sound) {
  const audioElement = sound === "bingo" ? elements.bingoSound : elements.callSound;
  if (audioElement.src) {
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
  updateStatus(`Last called: ${getLetterForNumber(nextNumber)}${nextNumber}`);
  playSound("call");

  const onCard = markIfPresent(nextNumber);
  if (onCard) {
    const winningLines = getWinningLines();
    highlightWinners(winningLines);
    if (winningLines.length && !bingoAchieved) {
      bingoAchieved = true;
      updateStatus("BINGO! Celebrate that win.");
      playSound("bingo");
    }
  }
}

function resetSession() {
  buildCallOrder();
  cardCells.flat().forEach((cell) => {
    cell.classList.remove("cell--marked", "cell--bingo");
    if (cell.classList.contains("cell--free")) {
      cell.classList.add("cell--marked");
    }
  });
  markedMatrix = Array.from({ length: 5 }, () => Array(5).fill(false));
  markedMatrix[2][2] = true;
}

function handleAudioLoad(inputEl, audioEl) {
  const [file] = inputEl.files || [];
  if (file) {
    const objectUrl = URL.createObjectURL(file);
    audioEl.src = objectUrl;
  }
}

function initialize() {
  generateCard();
  buildCallOrder();

  elements.callBtn.addEventListener("click", callNextNumber);
  elements.newCardBtn.addEventListener("click", () => {
    generateCard();
    resetSession();
  });
  elements.resetBtn.addEventListener("click", resetSession);

  elements.callAudio.addEventListener("change", () => handleAudioLoad(elements.callAudio, elements.callSound));
  elements.bingoAudio.addEventListener("change", () => handleAudioLoad(elements.bingoAudio, elements.bingoSound));
}

initialize();
