(() => {
  const { scoreCounterData, gameState } = window.data;
  const { ScoreCounterDataModel } = window.models;
  const { CounterView } = window.views;

  const initialScoreCounterData = {
    value: 0,
    template: document.querySelector("#counter"),
  };

  const scoreCounterWrapper = document.querySelector(
    ".caterpillar-counter-wrapper"
  );

  const createScoreCounterData = () => {
    scoreCounterData = new ScoreCounterDataModel(initialScoreCounterData);
  };

  const renderScoreCounter = () => {
    const updateScoreCounter = () => {
      if (!gameState.isStarted) return;

      if (!gameState.isPaused) {
        scoreCounterInstance.update(scoreCounterData.value);
      }

      requestAnimationFrame(updateScoreCounter);
    };

    const scoreCounterInstance = new CounterView(scoreCounterData);
    scoreCounterWrapper.append(scoreCounterInstance.render());

    requestAnimationFrame(updateScoreCounter);
  };

  window.controllers.score = {
    createScoreCounterData,
    renderScoreCounter,
  };
})();
