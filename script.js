const TOTAL_KEY = "happyButtonTotalClicks";
const CYCLE_KEY = "happyButtonCelebrationClicks";
const CELEBRATION_INTERVAL = 5;
const SEQUENCE_TARGET = 3;
const SEQUENCE_LENGTH = SEQUENCE_TARGET * 2;

const button = document.getElementById("happy-button");
const button2 = document.getElementById("happy-button-2");
const clickStatus = document.getElementById("click-status");
const celebrationStatus = document.getElementById("celebration-status");
const sequenceStatus = document.getElementById("sequence-status");
const celebrationMessage = document.getElementById("celebration-message");

function readStoredCount(key) {
  const value = Number.parseInt(window.localStorage.getItem(key) ?? "0", 10);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

let totalClicks = readStoredCount(TOTAL_KEY);
let celebrationClicks = readStoredCount(CYCLE_KEY);
let sequenceStep = 0;
let sequenceCelebrationActive = false;

function alternationsForStep(step) {
  return Math.floor(step / 2);
}

function renderState(showCelebration = false) {
  const isGreenButton = totalClicks % 2 === 0;

  button.classList.toggle("button-green", isGreenButton);
  button.classList.toggle("button-red", !isGreenButton);
  document.body.classList.toggle("state-green", isGreenButton);
  document.body.classList.toggle("state-red", !isGreenButton);

  clickStatus.textContent = `Total clicks: ${totalClicks}`;
  celebrationStatus.textContent = `Clicks until celebration: ${
    CELEBRATION_INTERVAL - celebrationClicks
  }`;
  sequenceStatus.textContent = `Sequence progress: ${alternationsForStep(
    sequenceStep,
  )} / ${SEQUENCE_TARGET}`;

  if (sequenceCelebrationActive) {
    celebrationMessage.textContent = "Ты выйграл";
    celebrationMessage.hidden = false;
  } else if (showCelebration) {
    celebrationMessage.textContent = `Congratulations! You clicked the button ${totalClicks} times.`;
    celebrationMessage.hidden = false;
  } else {
    celebrationMessage.hidden = true;
  }
}

function advanceSequence(clickedId) {
  const expectedId = sequenceStep % 2 === 0 ? button.id : button2.id;
  if (clickedId === expectedId) {
    sequenceStep += 1;
  } else if (clickedId === button.id) {
    sequenceStep = 1;
  } else {
    sequenceStep = 0;
  }

  if (sequenceStep >= SEQUENCE_LENGTH) {
    sequenceCelebrationActive = true;
    sequenceStep = 0;
    triggerSequenceCelebration();
    document.body.dispatchEvent(new CustomEvent("sequence:complete"));
  } else {
    sequenceCelebrationActive = false;
    document.body.classList.remove("state-celebrate");
  }
}

const CONFETTI_COUNT = 80;
const CONFETTI_COLORS = ["#ef4444", "#22c55e", "#3b82f6", "#f59e0b", "#a855f7", "#ec4899"];
const CONFETTI_DURATION_MS = 2600;

function triggerSequenceCelebration() {
  document.body.classList.add("state-celebrate");

  const layer = document.createElement("div");
  layer.className = "confetti-layer";
  layer.setAttribute("aria-hidden", "true");

  for (let i = 0; i < CONFETTI_COUNT; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    const left = Math.random() * 100;
    const delay = Math.random() * 400;
    const duration = 1800 + Math.random() * 800;
    const rotate = Math.random() * 360;
    piece.style.setProperty("--confetti-color", color);
    piece.style.setProperty("--confetti-left", `${left}%`);
    piece.style.setProperty("--confetti-delay", `${delay}ms`);
    piece.style.setProperty("--confetti-duration", `${duration}ms`);
    piece.style.setProperty("--confetti-rotate", `${rotate}deg`);
    layer.appendChild(piece);
  }

  document.body.appendChild(layer);
  window.setTimeout(() => {
    layer.remove();
  }, CONFETTI_DURATION_MS);
}

function handlePrimaryClick() {
  totalClicks += 1;
  celebrationClicks += 1;

  const shouldCelebrate = celebrationClicks === CELEBRATION_INTERVAL;
  if (shouldCelebrate) {
    celebrationClicks = 0;
  }

  advanceSequence(button.id);

  window.localStorage.setItem(TOTAL_KEY, String(totalClicks));
  window.localStorage.setItem(CYCLE_KEY, String(celebrationClicks));
  renderState(shouldCelebrate);
}

function handleSecondaryClick() {
  advanceSequence(button2.id);
  renderState(false);
}

button.addEventListener("click", handlePrimaryClick);
button2.addEventListener("click", handleSecondaryClick);

renderState(false);
