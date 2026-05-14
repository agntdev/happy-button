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
  if (showCelebration) {
    celebrationMessage.textContent = `Congratulations! You clicked the button ${totalClicks} times.`;
  }
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

// Secret easter egg: type "BOOM" anywhere on the page to trigger an explosion.
const EASTER_EGG_SEQUENCE = "BOOM";
const EASTER_EGG_PARTICLE_COUNT = 24;
let easterEggBuffer = "";
let easterEggActive = false;

function triggerExplosion() {
  if (easterEggActive) {
    return;
  }
  easterEggActive = true;

  const overlay = document.createElement("div");
  overlay.className = "easter-egg-explosion";
  overlay.setAttribute("aria-hidden", "true");

  const core = document.createElement("div");
  core.className = "easter-egg-core";
  core.textContent = "BOOM!";
  overlay.appendChild(core);

  for (let i = 0; i < EASTER_EGG_PARTICLE_COUNT; i += 1) {
    const particle = document.createElement("span");
    particle.className = "easter-egg-particle";
    const angle = (Math.PI * 2 * i) / EASTER_EGG_PARTICLE_COUNT;
    const distance = 140 + Math.random() * 120;
    particle.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    particle.style.setProperty("--delay", `${Math.random() * 80}ms`);
    overlay.appendChild(particle);
  }

  document.body.appendChild(overlay);

  const cleanup = () => {
    overlay.remove();
    easterEggActive = false;
  };
  overlay.addEventListener("animationend", cleanup, { once: true });
  // Safety net in case animationend never fires (e.g. reduced-motion).
  window.setTimeout(cleanup, 2000);
}

window.addEventListener("keydown", (event) => {
  // Ignore modifier-only or non-character keys.
  if (event.key.length !== 1) {
    return;
  }
  easterEggBuffer = (easterEggBuffer + event.key.toUpperCase()).slice(
    -EASTER_EGG_SEQUENCE.length,
  );
  if (easterEggBuffer === EASTER_EGG_SEQUENCE) {
    easterEggBuffer = "";
    triggerExplosion();
  }
});
