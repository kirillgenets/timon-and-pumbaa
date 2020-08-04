(() => {
  const { MAX_BACKGROUND_POSITION, Direction } = window.constants;
  const { shouldBackgroundMove } = window.controllers.utils;
  const { BackgroundDataModel } = window.models;
  const { BackgroundView } = window.views;

  const initialBackgroundData = {
    position: -1,
    speed: 3,
    url: "media/img/game-bg.jpg",
  };

  const playgroundElement = document.querySelector(".playground");

  const createBackgroundData = () => {
    window.data.backgroundData = new BackgroundDataModel(initialBackgroundData);
  };

  const renderBackground = () => {
    const moveBackground = () => {
      if (!window.data.gameState.isStarted) return;

      if (!window.data.gameState.isPaused && shouldBackgroundMove()) {
        switch (window.data.characterData.direction) {
          case Direction.LEFT:
            window.data.backgroundData.position +=
              window.data.backgroundData.speed;
            break;
          case Direction.RIGHT:
            window.data.backgroundData.position -=
              window.data.backgroundData.speed;
            break;
        }

        if (window.data.backgroundData.position > 0) {
          window.data.backgroundData.position = 0;
        }

        if (window.data.backgroundData.position < MAX_BACKGROUND_POSITION) {
          window.data.backgroundData.position = MAX_BACKGROUND_POSITION;
        }

        backgroundInstance.move(window.data.backgroundData.position);
      }

      requestAnimationFrame(moveBackground);
    };

    const backgroundInstance = new BackgroundView({
      position: window.data.backgroundData.position,
      element: playgroundElement,
    });

    backgroundInstance.setImage(window.data.backgroundData.url);

    requestAnimationFrame(moveBackground);
  };

  window.controllers.background = {
    createBackgroundData,
    renderBackground,
  };
})();
