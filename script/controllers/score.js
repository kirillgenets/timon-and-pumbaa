(() => {
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
    window.data.scoreCounterData = new ScoreCounterDataModel(
      initialScoreCounterData
    );
  };

  const renderScoreCounter = () => {
    const updateScoreCounter = () => {
      if (window.data.gameState.isOver) {
        scoreCounterInstance.destroy();
        return;
      }

      if (!window.data.gameState.isStarted) return;

      if (!window.data.gameState.isPaused) {
        scoreCounterInstance.update(window.data.scoreCounterData.value);
      }

      requestAnimationFrame(updateScoreCounter);
    };

    const scoreCounterInstance = new CounterView(window.data.scoreCounterData);
    scoreCounterWrapper.append(scoreCounterInstance.render());

    requestAnimationFrame(updateScoreCounter);
  };

  window.controllers.score = {
    createScoreCounterData,
    renderScoreCounter,
  };
})();
