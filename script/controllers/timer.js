(() => {
  const { TimerDataModel } = window.models;
  const { CounterView } = window.views;

  const initialTimerData = {
    startTime: null,
    pauseTime: null,
    value: "00:00",
    template: document.querySelector("#counter"),
  };

  const timeCounterWrapper = document.querySelector(".time-counter-wrapper");

  const createTimerData = () => {
    window.data.timerData = new TimerDataModel({
      ...initialTimerData,
      startTime: Date.now(),
    });
  };

  const renderTimer = () => {
    const updateTimer = () => {
      if (window.data.gameState.isOver) {
        timerInstance.destroy();
        return;
      }

      if (!window.data.gameState.isStarted) return;

      if (!window.data.gameState.isPaused) {
        const currentTime =
          (Date.now() - window.data.timerData.startTime) / 1000;
        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60);
        const preparedValue = `${minutes > 9 ? minutes : `0${minutes}`}:${
          seconds > 9 ? seconds : `0${seconds}`
        }`;

        window.data.timerData.value = Math.floor(currentTime);
        timerInstance.update(preparedValue);
      }

      requestAnimationFrame(updateTimer);
    };

    const timerInstance = new CounterView(window.data.timerData);
    timeCounterWrapper.append(timerInstance.render());

    requestAnimationFrame(updateTimer);
  };

  window.controllers.timer = {
    createTimerData,
    renderTimer,
  };
})();
