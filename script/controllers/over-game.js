(() => {
  const { hideElement, showElement, getElementFromTemplate } = window.utils;

  const SHOWN_STATS_COUNT = 10;

  const resultElementTemplate = document.querySelector(
    "#results-table-element"
  );

  const gameWrapperElement = document.querySelector(".game");
  const playgroundElement = gameWrapperElement.querySelector(".playground");
  const statePanelElement = gameWrapperElement.querySelector(".panel");

  const resultsModalElement = gameWrapperElement.querySelector(
    ".results-modal"
  );
  const resultsTableElement = resultsModalElement.querySelector(
    ".results-table-body"
  );
  const playAgainButton = resultsModalElement.querySelector(
    ".play-again-button"
  );

  const getUserIndex = () =>
    window.data.gameState.stats.findIndex(
      ({ name }) => name === window.data.gameState.userName
    );

  const handlePlayAgainButtonClick = () => {
    window.controllers.initGame();
  };

  const calculateScoreForStats = (time, score) => 1000 - time + score * 10;

  const clearAllData = () => {
    window.data.characterData = {};
    window.data.backgroundData = {};
    window.data.timerData = {};
    window.data.scoreCounterData = {};
    window.data.hpCounterData = {};
    window.data.caterpillarsData = [];
    window.data.hyenasData = [];
  };

  const updateStats = () => {
    const userIndex = getUserIndex();
    const score = calculateScoreForStats(
      window.data.timerData.value,
      window.data.scoreCounterData.value
    );

    if (userIndex === -1) {
      window.data.gameState.stats.push({
        name: window.data.gameState.userName,
        score,
      });
      return;
    }

    window.data.gameState.stats[userIndex].score = score;
  };

  const getPreparedStats = () => {
    const preparedStats = [...window.data.gameState.stats].sort(
      (a, b) => b.score - a.score
    );
    const userIndex = getUserIndex();

    if (userIndex > SHOWN_STATS_COUNT - 1) {
      preparedStats[SHOWN_STATS_COUNT - 1] = preparedStats[userIndex];
    }

    return preparedStats.slice(0, SHOWN_STATS_COUNT);
  };

  const renderResultsTable = () => {
    resultsTableElement.innerHTML = "";

    getPreparedStats().forEach(({ name, score }) => {
      const row = getElementFromTemplate(resultElementTemplate);
      row.querySelector(".name").textContent = name;
      row.querySelector(".score").textContent = score;

      resultsTableElement.append(row);
    });
  };

  const overGame = () => {
    window.data.gameState.isStarted = false;
    window.data.gameState.isOver = true;

    window.audio.backgroundAudio.currentTime = 0;
    window.audio.backgroundAudio.pause();

    hideElement(playgroundElement);
    hideElement(statePanelElement);
    showElement(resultsModalElement);

    updateStats();
    renderResultsTable();
    clearAllData();
  };

  playAgainButton.addEventListener("click", handlePlayAgainButtonClick);

  window.controllers.overGame = overGame;
})();
