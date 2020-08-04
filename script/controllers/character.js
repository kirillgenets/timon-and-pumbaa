(() => {
  const { CharacterDataModel } = window.models;
  const {
    SpriteData,
    Direction,
    Key,
    MAX_BACKGROUND_POSITION,
  } = window.constants;
  const { areObjectsEqual } = window.utils;
  const { AnimationSprite, AnimatedGameObjectView } = window.views;

  const initialCharacterData = {
    width: 160,
    height: 100,
    speed: 3,
    direction: Direction.NONE,
    position: {
      x: 0,
      y: 100,
    },
    template: document.querySelector("#character"),
    sprite: { data: SpriteData.CHARACTER.standing, position: 0 },
    isMoving: false,
  };

  const playgroundElement = document.querySelector(".playground");

  const createCharacterData = () => {
    window.data.characterData = new CharacterDataModel(initialCharacterData);
  };

  const renderCharacter = () => {
    const handleCharacterKeyDown = (evt) => {
      switch (evt.code) {
        case Key.ARROW_RIGHT:
          window.data.characterData.direction = Direction.RIGHT;
          window.data.characterData.isMoving = true;
          break;
        case Key.ARROW_LEFT:
          window.data.characterData.direction = Direction.LEFT;
          window.data.characterData.isMoving = true;
          break;
      }
    };

    const handleCharacterKeyUp = (evt) => {
      if (evt.code === Key.ARROW_LEFT || evt.code === Key.ARROW_RIGHT) {
        window.data.characterData.direction = Direction.NONE;
        window.data.characterData.isMoving = false;
      }
    };

    const updateCharacterPosition = () => {
      const isCharacterInMiddle =
        window.data.characterData.position.x +
          window.data.characterData.width >=
        playgroundElement.clientWidth / 2 + window.data.characterData.width / 2;

      switch (window.data.characterData.direction) {
        case Direction.RIGHT:
          window.data.characterData.position.x +=
            window.data.characterData.speed;
          window.data.characterData.sprite.data = SpriteData.CHARACTER.running;
          break;
        case Direction.LEFT:
          window.data.characterData.position.x -=
            window.data.characterData.speed;
          window.data.characterData.sprite.data = SpriteData.CHARACTER.running;
          break;
        case Direction.NONE:
        default:
          window.data.characterData.sprite.data = SpriteData.CHARACTER.standing;
          break;
      }

      if (window.data.characterData.position.x < 0) {
        window.data.characterData.position.x = 0;
      }

      if (
        isCharacterInMiddle &&
        window.data.backgroundData.position < 0 &&
        window.data.backgroundData.position > MAX_BACKGROUND_POSITION
      ) {
        window.data.characterData.position.x =
          playgroundElement.clientWidth / 2 -
          window.data.characterData.width / 2;
      }
    };

    const getSpriteInstance = (previousSprite) => {
      if (
        !areObjectsEqual(window.data.characterData.sprite.data, previousSprite)
      ) {
        spriteInstance = new AnimationSprite({
          position: 0,
          ...window.data.characterData.sprite.data,
        });
      }

      return spriteInstance;
    };

    const moveCharacter = () => {
      if (!window.data.gameState.isStarted) return;

      if (!window.data.gameState.isPaused) {
        const previousSprite = window.data.characterData.sprite.data;

        updateCharacterPosition();

        characterInstance.move(
          window.data.characterData.position,
          getSpriteInstance(previousSprite)
        );
      }

      requestAnimationFrame(moveCharacter);
    };

    let spriteInstance = new AnimationSprite({
      position: window.data.characterData.sprite.position,
      ...window.data.characterData.sprite.data,
    });

    const characterInstance = new AnimatedGameObjectView(
      window.data.characterData
    );
    playgroundElement.append(characterInstance.render());

    document.addEventListener("keydown", handleCharacterKeyDown);
    document.addEventListener("keyup", handleCharacterKeyUp);

    requestAnimationFrame(moveCharacter);
  };

  window.controllers.character = {
    createCharacterData,
    renderCharacter,
  };
})();
