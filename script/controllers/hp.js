(() => {
  const { HpCounterDataModel } = window.models;
  const { HpCounterView } = window.views;

  const HP_DECREASE_STEP = 1;
  const MAX_HP = 100;

  const initialHpCounterData = {
    value: 100,
    template: document.querySelector("#hp"),
    previousDecrease: 0,
  };

  const hpCounterWrapper = document.querySelector(".hp-counter-wrapper");

  const createHpCounterData = () => {
    window.data.hpCounterData = new HpCounterDataModel(initialHpCounterData);
  };

  const renderHpCounter = () => {
    const decreaseHp = () => {
      const seconds = Math.floor(
        ((Date.now() - window.data.timerData.startTime) / 1000) % 60
      );

      window.data.hpCounterData.value -=
        seconds === window.data.hpCounterData.previousDecrease
          ? 0
          : HP_DECREASE_STEP;
      window.data.hpCounterData.previousDecrease = seconds;
    };

    const updateHpCounter = () => {
      if (window.data.gameState.isOver) {
        hpCounterInstance.destroy();
        return;
      }

      if (!window.data.gameState.isStarted) return;

      if (!window.data.gameState.isPaused) {
        decreaseHp();

        if (window.data.hpCounterData.value < 0) {
          window.data.hpCounterData.value = 0;
          window.controllers.overGame();
        }

        if (window.data.hpCounterData.value > MAX_HP) {
          window.data.hpCounterData.value = MAX_HP;
        }

        hpCounterInstance.update(window.data.hpCounterData.value);
      }

      requestAnimationFrame(updateHpCounter);
    };

    const hpCounterInstance = new HpCounterView(window.data.hpCounterData);
    hpCounterWrapper.append(hpCounterInstance.render());

    requestAnimationFrame(updateHpCounter);
  };

  window.controllers.hp = {
    createHpCounterData,
    renderHpCounter,
  };
})();
