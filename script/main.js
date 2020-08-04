// Constants

// Initial data

const initialGameState = {
  isStarted: false,
  isPaused: false,
  stats: [],
};

// DOM-elements

const gameWrapperElement = document.querySelector(".game");

const startModalElement = gameWrapperElement.querySelector(".start-modal");
const loginInput = startModalElement.querySelector(".login-input");
const startGameButton = startModalElement.querySelector(".start-game-button");

const introVideoElement = gameWrapperElement.querySelector(".intro-video");

const playgroundElement = gameWrapperElement.querySelector(".playground");
const statePanelElement = gameWrapperElement.querySelector(".panel");
const hpCounterWrapper = statePanelElement.querySelector(".hp-counter-wrapper");

// Data initialization

const gameState = new GameStateDataModel(initialGameState);

// Game functions

const hideIntroVideo = () => {
  introVideoElement.pause();
  introVideoElement.currentTime = 0;

  hideElement(introVideoElement);
  showElement(playgroundElement);
  showElement(statePanelElement);
};

// Event handlers

const handleLoginInput = (evt) => {
  if (evt.target.value) {
    startGameButton.disabled = false;
  } else {
    startGameButton.disabled = true;
  }
};

const handleIntroVideoEnded = () => {
  hideIntroVideo();
  initGame();
};

const handleIntroVideoCloseKeyDown = (evt) => {
  if (evt.code !== Key.SPACE || gameState.isStarted) return;

  hideIntroVideo();
  initGame();
};

const handleStartGameButtonClick = () => {
  hideElement(startModalElement);

  introVideoElement.addEventListener("ended", handleIntroVideoEnded);
  document.addEventListener("keydown", handleIntroVideoCloseKeyDown);

  showElement(introVideoElement);
  introVideoElement.play();
};

const handlePauseKeyDown = (evt) => {
  if (evt.code !== Key.ESC) return;

  timerData.startTime = timerData.pauseTime
    ? timerData.startTime + (Date.now() - timerData.pauseTime)
    : timerData.startTime;
  timerData.pauseTime = timerData.pauseTime ? null : Date.now();
  gameState.isPaused = !gameState.isPaused;
};

// Data creation

const createAllObjectsData = () => {
  createBackgroundData();
  createCharacterData();
  createTimerData();
  createCaterpillarsData(initialCaterpillarData.position.x);
  createScoreCounterData();
  createHyenasData();
  createHpCounterData();
};

// Objects rendering

const renderAllObjects = () => {
  renderCharacter();
  renderBackground();
  renderTimer();
  renderCaterpillars();
  renderScoreCounter();
  renderHyenas();
  renderHpCounter();
};

// Main functions

const initGame = () => {
  gameState.isStarted = true;

  createAllObjectsData();
  renderAllObjects();

  document.addEventListener("keydown", handlePauseKeyDown);
};

// Event listeners

loginInput.addEventListener("input", handleLoginInput);
startGameButton.addEventListener("click", handleStartGameButtonClick);
