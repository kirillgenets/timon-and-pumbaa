(() => {
  const { hpCounterData, timerData, gameState } = window.data;
  const { HpCounterDataModel } = window.models;
  const { HpCounterView } = window.views;

  const initialHpCounterData = {
    value: 100,
    template: document.querySelector("#hp"),
    previousDecrease: 0,
  };

  const createHpCounterData = () => {
    hpCounterData = new HpCounterDataModel(initialHpCounterData);
  };

  const renderHpCounter = () => {
    const decreaseHp = () => {
      const seconds = Math.floor(
        ((Date.now() - timerData.startTime) / 1000) % 60
      );

      hpCounterData.value -=
        seconds === hpCounterData.previousDecrease ? 0 : HP_DECREASE_STEP;
      hpCounterData.previousDecrease = seconds;
    };

    const updateHpCounter = () => {
      if (!gameState.isStarted) return;

      if (!gameState.isPaused) {
        decreaseHp();

        if (hpCounterData.value < 0) {
          hpCounterData.value = 0;
        }

        if (hpCounterData.value > MAX_HP) {
          hpCounterData.value = MAX_HP;
        }

        hpCounterInstance.update(hpCounterData.value);
      }

      requestAnimationFrame(updateHpCounter);
    };

    const hpCounterInstance = new HpCounterView(hpCounterData);
    hpCounterWrapper.append(hpCounterInstance.render());

    requestAnimationFrame(updateHpCounter);
  };

  window.controllers.hp = {
    createHpCounterData,
    renderHpCounter,
  };
})();
