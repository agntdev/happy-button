const TOTAL_KEY = "happyButtonTotalClicks";
const SEQUENCE_KEY = "happyButtonSequenceClicks";
const LAST_KEY = "happyButtonLastButton";
const TARGET_ALTERNATIONS = 3;
const TARGET_CLICKS = TARGET_ALTERNATIONS * 2;

const buttons = Array.from(document.querySelectorAll("[data-button]"));
const clickStatus = document.getElementById("click-status");
const sequenceStatus = document.getElementById("sequence-status");
const sequenceHint = document.getElementById("sequence-hint");
const celebrationMessage = document.getElementById("celebration-message");

function readStoredInt(key) {
  const value = Number.parseInt(window.localStorage.getItem(key) ?? "0", 10);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

let totalClicks = readStoredInt(TOTAL_KEY);
let sequenceClicks = readStoredInt(SEQUENCE_KEY);
let lastButton = window.localStorage.getItem(LAST_KEY);

function persist() {
  window.localStorage.setItem(TOTAL_KEY, String(totalClicks));
  window.localStorage.setItem(SEQUENCE_KEY, String(sequenceClicks));
  if (lastButton === null) window.localStorage.removeItem(LAST_KEY);
  else window.localStorage.setItem(LAST_KEY, lastButton);
}

function renderState({ celebrated = false, resetHint = null } = {}) {
  const isPrimaryGreen = totalClicks % 2 === 0;
  const b1 = document.getElementById("button-1");
  const b2 = document.getElementById("button-2");

  b1.classList.toggle("button-green", isPrimaryGreen);
  b1.classList.toggle("button-red", !isPrimaryGreen);
  b2.classList.toggle("button-green", !isPrimaryGreen);
  b2.classList.toggle("button-red", isPrimaryGreen);

  document.body.classList.toggle("state-green", isPrimaryGreen);
  document.body.classList.toggle("state-red", !isPrimaryGreen);

  clickStatus.textContent = `Total clicks: ${totalClicks}`;
  const alternations = Math.floor(sequenceClicks / 2);
  sequenceStatus.textContent = `Alternations: ${alternations} / ${TARGET_ALTERNATIONS}`;

  if (resetHint) {
    sequenceHint.textContent = resetHint;
  } else if (sequenceClicks === 0) {
    sequenceHint.textContent = "Click either button to start the sequence.";
  } else {
    const expected = lastButton === "1" ? "Button 2" : "Button 1";
    sequenceHint.textContent = `Next: ${expected} (${sequenceClicks}/${TARGET_CLICKS} alternating clicks).`;
  }

  if (celebrated) {
    celebrationMessage.textContent = "Congratulations! You completed 3 alternations.";
  }
  celebrationMessage.hidden = !celebrated;
}

function handleClick(buttonId) {
  totalClicks += 1;

  let resetHint = null;
  if (lastButton === null) {
    sequenceClicks = 1;
  } else if (lastButton !== buttonId) {
    sequenceClicks += 1;
  } else {
    sequenceClicks = 1;
    resetHint = "Same button twice — sequence restarted.";
  }
  lastButton = buttonId;

  const celebrated = sequenceClicks >= TARGET_CLICKS;
  if (celebrated) {
    sequenceClicks = 0;
    lastButton = null;
  }

  persist();
  renderState({ celebrated, resetHint });
}

for (const btn of buttons) {
  btn.addEventListener("click", () => handleClick(btn.dataset.button));
}

renderState();
