(() => {
  const { backgroundData, gameState } = window.data;
  const { BackgroundDataModel } = window.models;
  const { BackgroundView } = window.views;
  const { MAX_BACKGROUND_POSITION } = window.constants;

  const initialBackgroundData = {
    position: -1,
    speed: 3,
    url: "media/img/game-bg.jpg",
  };

  const playgroundElement = document.querySelector(".playground");

  const createBackgroundData = () => {
    backgroundData = new BackgroundDataModel(initialBackgroundData);
  };

  const renderBackground = () => {
    const moveBackground = () => {
      if (!gameState.isStarted) return;

      if (!gameState.isPaused && shouldBackgroundMove()) {
        switch (characterData.direction) {
          case Direction.LEFT:
            backgroundData.position += backgroundData.speed;
            break;
          case Direction.RIGHT:
            backgroundData.position -= backgroundData.speed;
            break;
        }

        if (backgroundData.position > 0) {
          backgroundData.position = 0;
        }

        if (backgroundData.position < MAX_BACKGROUND_POSITION) {
          backgroundData.position = MAX_BACKGROUND_POSITION;
        }

        backgroundInstance.move(backgroundData.position);
      }

      requestAnimationFrame(moveBackground);
    };

    const backgroundInstance = new BackgroundView({
      position: backgroundData.position,
      element: playgroundElement,
    });

    backgroundInstance.setImage(backgroundData.url);

    requestAnimationFrame(moveBackground);
  };

  window.controllers.background = {
    createBackgroundData,
    renderBackground,
  };
})();
