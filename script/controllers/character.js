(() => {
  const { CharacterDataModel } = window.models;
  const { Key, MAX_BACKGROUND_POSITION } = window.constants;
  const { areObjectsEqual } = window.utils;
  const { AnimationSprite, AnimatedGameObjectView } = window.views;

  const SpriteData = {
    STANDING: {
      url: "media/img/sprites/pumba-standing.png",
      framesWidth: 165,
    },
    RUNNING: {
      url: "media/img/sprites/pumba-running.png",
      framesWidth: 130,
    },
    JUMPING: {
      url: "media/img/sprites/pumba-jumping.png",
      framesWidth: 100,
    },
    DYING: {
      url: "media/img/sprites/pumba-dying.png",
      framesWidth: 120,
    },
  };

  const JUMP_HEIGHT = 400;
  const STANDARD_CHARACTER_POSITION = 100;

  const initialCharacterData = {
    width: 160,
    height: 100,
    speed: 3,
    directions: {
      top: false,
      bottom: false,
      left: false,
      right: false,
    },
    position: {
      x: 0,
      y: 100,
    },
    template: document.querySelector("#character"),
    sprite: { data: SpriteData.STANDING, position: 0 },
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
          window.data.characterData.directions.right = true;
          window.data.characterData.isMoving = true;
          break;
        case Key.ARROW_LEFT:
          window.data.characterData.directions.left = true;
          window.data.characterData.isMoving = true;
          break;
        case Key.ARROW_UP:
          if (window.data.characterData.directions.bottom) break;

          window.data.characterData.directions.top = true;
          window.data.characterData.isMoving = true;
          break;
      }
    };

    const handleCharacterKeyUp = (evt) => {
      switch (evt.code) {
        case Key.ARROW_RIGHT:
          window.data.characterData.directions.right = false;
          window.data.characterData.isMoving = false;
          break;
        case Key.ARROW_LEFT:
          window.data.characterData.directions.left = false;
          window.data.characterData.isMoving = false;
          break;
      }
    };

    const updateCharacterPosition = () => {
      const isCharacterInMiddle =
        window.data.characterData.position.x +
          window.data.characterData.width >=
        playgroundElement.clientWidth / 2 + window.data.characterData.width / 2;

      if (!window.data.characterData.isMoving) {
        window.data.characterData.sprite.data = SpriteData.STANDING;
      }

      if (
        window.data.characterData.directions.left ||
        window.data.characterData.directions.right
      ) {
        window.data.characterData.sprite.data = SpriteData.RUNNING;
      }

      if (window.data.characterData.directions.top) {
        window.data.characterData.sprite.data = SpriteData.JUMPING;
      }

      if (
        window.data.characterData.directions.top &&
        window.data.characterData.position.y >= JUMP_HEIGHT
      ) {
        window.data.characterData.directions.top = false;
        window.data.characterData.directions.bottom = true;
        window.data.characterData.position.y = JUMP_HEIGHT;
      }

      if (
        window.data.characterData.directions.bottom &&
        window.data.characterData.position.y <= STANDARD_CHARACTER_POSITION
      ) {
        window.data.characterData.directions.top = false;
        window.data.characterData.directions.bottom = false;
        window.data.characterData.position.y = STANDARD_CHARACTER_POSITION;
      }

      window.data.characterData.position.x += window.data.characterData
        .directions.right
        ? window.data.characterData.speed
        : 0;

      window.data.characterData.position.x -= window.data.characterData
        .directions.left
        ? window.data.characterData.speed
        : 0;

      window.data.characterData.position.y += window.data.characterData
        .directions.top
        ? window.data.characterData.speed
        : 0;

      window.data.characterData.position.y -= window.data.characterData
        .directions.bottom
        ? window.data.characterData.speed
        : 0;

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
