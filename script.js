const SEQUENCE_KEY = "happyButtonAlternationSequence";
const LAST_BUTTON_KEY = "happyButtonLastButton";
const SEQUENCE_TARGET = 6;
const EASTER_TARGET = 3;

const button = document.getElementById("happy-button");
const secondButton = document.getElementById("second-button");
const clickStatus = document.getElementById("click-status");
const celebrationStatus = document.getElementById("celebration-status");
const celebrationMessage = document.getElementById("celebration-message");
const easterHint = document.getElementById("easter-hint");
const confetti = document.getElementById("confetti");
const explosion = document.getElementById("explosion");

function readStoredCount(key) {
  const value = Number.parseInt(window.localStorage.getItem(key) ?? "0", 10);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

let sequenceCount = Math.min(readStoredCount(SEQUENCE_KEY), SEQUENCE_TARGET);
let lastButton = window.localStorage.getItem(LAST_BUTTON_KEY);
let easterClicks = 0;

function renderState(showCelebration = false) {
  const hasStarted = sequenceCount > 0;
  const isComplete = sequenceCount >= SEQUENCE_TARGET || showCelebration;

  document.body.classList.toggle("state-green", !isComplete && lastButton !== "one");
  document.body.classList.toggle("state-red", !isComplete && lastButton === "one");
  document.body.classList.toggle("state-win", isComplete);

  clickStatus.textContent = `Alternation sequence: ${sequenceCount} / ${SEQUENCE_TARGET}`;
  celebrationStatus.textContent = hasStarted
    ? `Next click: ${lastButton === "one" ? "Button 2" : "Button 1"}`
    : "Alternate between both buttons to win.";
  celebrationMessage.hidden = !isComplete;

  if (isComplete) {
    celebrationMessage.textContent = "Ты выйграл";
    celebrationStatus.textContent = "Celebration unlocked!";
    launchConfetti();
  }
}

function storeSequence() {
  window.localStorage.setItem(SEQUENCE_KEY, String(sequenceCount));
  if (lastButton) {
    window.localStorage.setItem(LAST_BUTTON_KEY, lastButton);
  }
}

function handleButtonClick(buttonName) {
  if (!lastButton) {
    sequenceCount = 1;
  } else if (lastButton === buttonName) {
    sequenceCount = 1;
  } else {
    sequenceCount += 1;
  }

  lastButton = buttonName;

  const shouldCelebrate = sequenceCount >= SEQUENCE_TARGET;
  if (shouldCelebrate) {
    sequenceCount = SEQUENCE_TARGET;
  }

  storeSequence();
  renderState(shouldCelebrate);
}

function launchConfetti() {
  confetti.replaceChildren();
  for (let index = 0; index < 24; index += 1) {
    const piece = document.createElement("span");
    piece.style.setProperty("--x", `${Math.random() * 240 - 120}px`);
    piece.style.setProperty("--delay", `${Math.random() * 120}ms`);
    piece.style.setProperty("--color", confettiColor(index));
    confetti.append(piece);
  }
}

function confettiColor(index) {
  const colors = ["#f97316", "#22c55e", "#3b82f6", "#ec4899", "#eab308"];
  return colors[index % colors.length];
}

function triggerExplosion() {
  explosion.replaceChildren();
  explosion.classList.remove("is-active");
  for (let index = 0; index < 16; index += 1) {
    const spark = document.createElement("span");
    const angle = (index / 16) * Math.PI * 2;
    spark.style.setProperty("--dx", `${Math.cos(angle) * 120}px`);
    spark.style.setProperty("--dy", `${Math.sin(angle) * 120}px`);
    explosion.append(spark);
  }
  window.requestAnimationFrame(() => {
    explosion.classList.add("is-active");
  });
}

function handleEasterHint() {
  easterClicks += 1;
  if (easterClicks >= EASTER_TARGET) {
    easterClicks = 0;
    triggerExplosion();
  }
}

button.addEventListener("click", () => handleButtonClick("one"));
secondButton.addEventListener("click", () => handleButtonClick("two"));
easterHint.addEventListener("click", handleEasterHint);
easterHint.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    handleEasterHint();
  }
});

renderState(false);
