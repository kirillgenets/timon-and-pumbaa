(() => {
  const { characterData, gameState } = window.data;
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
    characterData = new CharacterDataModel(initialCharacterData);
  };

  const renderCharacter = () => {
    const handleCharacterKeyDown = (evt) => {
      switch (evt.code) {
        case Key.ARROW_RIGHT:
          characterData.direction = Direction.RIGHT;
          characterData.isMoving = true;
          break;
        case Key.ARROW_LEFT:
          characterData.direction = Direction.LEFT;
          characterData.isMoving = true;
          break;
      }
    };

    const handleCharacterKeyUp = (evt) => {
      if (evt.code === Key.ARROW_LEFT || evt.code === Key.ARROW_RIGHT) {
        characterData.direction = Direction.NONE;
        characterData.isMoving = false;
      }
    };

    const updateCharacterPosition = () => {
      const isCharacterInMiddle =
        characterData.position.x + characterData.width >=
        playgroundElement.clientWidth / 2 + characterData.width / 2;

      switch (characterData.direction) {
        case Direction.RIGHT:
          characterData.position.x += characterData.speed;
          characterData.sprite.data = SpriteData.CHARACTER.running;
          break;
        case Direction.LEFT:
          characterData.position.x -= characterData.speed;
          characterData.sprite.data = SpriteData.CHARACTER.running;
          break;
        case Direction.NONE:
        default:
          characterData.sprite.data = SpriteData.CHARACTER.standing;
          break;
      }

      if (characterData.position.x < 0) {
        characterData.position.x = 0;
      }

      if (
        isCharacterInMiddle &&
        backgroundData.position < 0 &&
        backgroundData.position > MAX_BACKGROUND_POSITION
      ) {
        characterData.position.x =
          playgroundElement.clientWidth / 2 - characterData.width / 2;
      }
    };

    const getSpriteInstance = (previousSprite) => {
      if (!areObjectsEqual(characterData.sprite.data, previousSprite)) {
        spriteInstance = new AnimationSprite({
          position: 0,
          ...characterData.sprite.data,
        });
      }

      return spriteInstance;
    };

    const moveCharacter = () => {
      if (!gameState.isStarted) return;

      if (!gameState.isPaused) {
        const previousSprite = characterData.sprite.data;

        updateCharacterPosition();

        characterInstance.move(
          characterData.position,
          getSpriteInstance(previousSprite)
        );
      }

      requestAnimationFrame(moveCharacter);
    };

    let spriteInstance = new AnimationSprite({
      position: characterData.sprite.position,
      ...characterData.sprite.data,
    });

    const characterInstance = new AnimatedGameObjectView(characterData);
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
