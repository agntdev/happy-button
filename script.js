const TOTAL_KEY = "happyButtonTotalClicks";
const CYCLE_KEY = "happyButtonCelebrationClicks";
const CELEBRATION_INTERVAL = 5;

const button = document.getElementById("happy-button");
const clickStatus = document.getElementById("click-status");
const celebrationStatus = document.getElementById("celebration-status");
const celebrationMessage = document.getElementById("celebration-message");

function readStoredCount(key) {
  const value = Number.parseInt(window.localStorage.getItem(key) ?? "0", 10);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

let totalClicks = readStoredCount(TOTAL_KEY);
let celebrationClicks = readStoredCount(CYCLE_KEY);

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
  celebrationMessage.hidden = !showCelebration;
}

button.addEventListener("click", () => {
  totalClicks += 1;
  celebrationClicks += 1;

  const shouldCelebrate = celebrationClicks === CELEBRATION_INTERVAL;
  if (shouldCelebrate) {
    celebrationClicks = 0;
  }

  window.localStorage.setItem(TOTAL_KEY, String(totalClicks));
  window.localStorage.setItem(CYCLE_KEY, String(celebrationClicks));
  renderState(shouldCelebrate);
});

renderState(false);
