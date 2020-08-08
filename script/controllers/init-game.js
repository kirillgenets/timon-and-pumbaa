(() => {
  const { Key, DEFAULT_STATS } = window.constants;
  const { GameStateDataModel } = window.models;
  const { hideElement, showElement } = window.utils;
  const {
    createBackgroundData,
    renderBackground,
  } = window.controllers.background;
  const {
    createScoreCounterData,
    renderScoreCounter,
  } = window.controllers.score;
  const { createCharacterData, renderCharacter } = window.controllers.character;
  const { createHyenasData, renderHyenas } = window.controllers.hyenas;
  const {
    createCaterpillarsData,
    renderCaterpillars,
  } = window.controllers.caterpillars;
  const { createHpCounterData, renderHpCounter } = window.controllers.hp;
  const { createTimerData, renderTimer } = window.controllers.timer;

  const initialGameState = {
    isStarted: false,
    isPaused: false,
    isOver: false,
    stats: DEFAULT_STATS,
    userName: "",
  };

  // DOM-elements

  const gameWrapperElement = document.querySelector(".game");

  const startModalElement = gameWrapperElement.querySelector(".start-modal");
  const loginInput = startModalElement.querySelector(".login-input");
  const startGameButton = startModalElement.querySelector(".start-game-button");

  const introVideoElement = gameWrapperElement.querySelector(".intro-video");

  const playgroundElement = gameWrapperElement.querySelector(".playground");
  const statePanelElement = gameWrapperElement.querySelector(".panel");
  const userNameElement = statePanelElement.querySelector(".user-name");

  // Data initialization

  window.data.gameState = new GameStateDataModel(initialGameState);

  // Game functions

  const hideIntroVideo = () => {
    introVideoElement.pause();
    introVideoElement.currentTime = 0;

    hideElement(introVideoElement);
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
    if (evt.code !== Key.SPACE || window.data.gameState.isStarted) return;

    hideIntroVideo();
    initGame();
  };

  const handleStartGameButtonClick = () => {
    window.data.gameState.userName = loginInput.value;

    introVideoElement.addEventListener("ended", handleIntroVideoEnded);
    document.addEventListener("keydown", handleIntroVideoCloseKeyDown);

    hideElement(startModalElement);

    showElement(introVideoElement);
    introVideoElement.play();

    loginInput.removeEventListener("input", handleLoginInput);
    startGameButton.removeEventListener("click", handleStartGameButtonClick);
  };

  const handlePauseKeyDown = (evt) => {
    if (evt.code !== Key.ESC) return;

    window.data.timerData.startTime = window.data.timerData.pauseTime
      ? window.data.timerData.startTime +
        (Date.now() - window.data.timerData.pauseTime)
      : window.data.timerData.startTime;
    window.data.timerData.pauseTime = window.data.timerData.pauseTime
      ? null
      : Date.now();
    window.data.gameState.isPaused = !window.data.gameState.isPaused;

    if (window.audio.backgroundAudio.paused) {
      window.audio.backgroundAudio.play();
    } else {
      window.audio.backgroundAudio.pause();
    }
  };

  // Data creation

  const createAllObjectsData = () => {
    createBackgroundData();
    createCharacterData();
    createTimerData();
    createCaterpillarsData();
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
    if (window.data.gameState.isStarted) return;

    showElement(playgroundElement);
    showElement(statePanelElement);

    window.data.gameState.isOver = false;
    window.data.gameState.isStarted = true;

    userNameElement.textContent = window.data.gameState.userName;

    createAllObjectsData();
    renderAllObjects();

    document.addEventListener("keydown", handlePauseKeyDown);

    window.audio.backgroundAudio.play();
  };

  // Event listeners

  loginInput.addEventListener("input", handleLoginInput);
  startGameButton.addEventListener("click", handleStartGameButtonClick);

  window.controllers.initGame = initGame;
})();
