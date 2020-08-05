(() => {
  const {
    ObjectPositionIterator,
    areObjectsEqual,
    areObjectsIntersected,
  } = window.utils;
  const { shouldBackgroundMove } = window.controllers.utils;
  const { HyenaDataModel } = window.models;
  const { AnimatedGameObjectView, AnimationSprite } = window.views;

  const MAX_HYENAS_COUNT = 3;
  const MIN_HYENAS_GAP = 200;
  const MAX_HYENAS_GAP = 500;
  const HYENAS_POSITION_SPREAD = 250;

  const Direction = {
    RIGHT: "right",
    LEFT: "left",
  };

  const initialHyenaData = {
    width: 160,
    height: 100,
    speed: 2,
    direction: Direction.LEFT,
    position: {
      x: 0,
      y: 100,
    },
    template: document.querySelector("#hyena"),
    sprite: {
      data: {
        url: "media/img/sprites/hyena-running.png",
        framesWidth: 160,
      },
      position: 0,
    },
    damage: 30,
    damageTime: null,
    previousDamage: null,
  };

  const playgroundElement = document.querySelector(".playground");

  const createHyenasData = (
    initialPosition = playgroundElement.clientWidth / 2
  ) => {
    const positionIterator = new ObjectPositionIterator({
      initialPosition,
      minGap: MIN_HYENAS_GAP,
      maxGap: MAX_HYENAS_GAP,
    });

    for (let i = 0; i < MAX_HYENAS_COUNT; i++) {
      window.data.hyenasData.push(
        new HyenaDataModel({
          ...initialHyenaData,
          position: {
            x: positionIterator.next(),
            y: initialHyenaData.position.y,
          },
        })
      );
    }
  };

  const renderHyenas = () => {
    const regenerateHyenas = () => {
      if (window.data.hyenasData.length > 0) return;

      createHyenasData(playgroundElement.clientWidth);
      renderHyenas();
    };

    const removeHyena = (instance, data) => {
      const index = window.data.hyenasData.findIndex((originalData) =>
        areObjectsEqual(originalData, data)
      );

      instance.destroy();
      window.data.hyenasData.splice(index, 1);
    };

    const damageCharacter = (data) => () => {
      if (!data.damageTime) {
        data.damageTime = Date.now();
        data.previousDamage = 0;
        window.data.hpCounterData.value -= data.damage;
        return;
      }

      const currentTime = Math.floor((Date.now() - data.damageTime) / 1000);

      if (currentTime === data.previousDamage) return;

      data.previousDamage = currentTime;
      window.data.hpCounterData.value -= data.damage;
    };

    const normalizeHyenaPosition = (data) => {
      if (
        window.data.characterData.directions.left &&
        data.direction === Direction.LEFT
      ) {
        data.initialPosition.x += window.data.characterData.speed;
        data.position.x += window.data.characterData.speed;
      }

      if (
        window.data.characterData.directions.right &&
        data.direction === Direction.RIGHT
      ) {
        data.initialPosition.x -= window.data.characterData.speed;
        data.position.x -= window.data.characterData.speed;
      }

      if (
        window.data.characterData.directions.left &&
        data.direction === Direction.RIGHT
      ) {
        data.initialPosition.x += window.data.characterData.speed - data.speed;
        data.position.x += window.data.characterData.speed - data.speed;
      }

      if (
        window.data.characterData.directions.right &&
        data.direction === Direction.LEFT
      ) {
        data.initialPosition.x -= window.data.characterData.speed - data.speed;
        data.position.x -= window.data.characterData.speed - data.speed;
      }
    };

    const updateHyenaPosition = (data) => {
      const { initialPosition, speed, direction } = data;

      switch (direction) {
        case Direction.LEFT:
          data.position.x -= speed;
          break;
        case Direction.RIGHT:
          data.position.x += speed;
          break;
      }

      if (shouldBackgroundMove()) {
        normalizeHyenaPosition(data);
      }

      if (data.position.x < initialPosition.x - HYENAS_POSITION_SPREAD) {
        data.direction = Direction.RIGHT;
      }

      if (data.position.x > initialPosition.x + HYENAS_POSITION_SPREAD) {
        data.direction = Direction.LEFT;
      }
    };

    const moveHyena = (data, index, instance, spriteInstance) => () => {
      if (!window.data.gameState.isStarted) return;

      if (!window.data.gameState.isPaused) {
        updateHyenaPosition(data);

        if (areObjectsIntersected(window.data.characterData, data)) {
          requestAnimationFrame(damageCharacter(data));
        }

        if (data.position.x + data.width < 0) {
          removeHyena(instance, data);
          regenerateHyenas();
          return;
        }

        instance.move(data.position, spriteInstance);
      }

      requestAnimationFrame(moveHyena(data, index, instance, spriteInstance));
    };

    const renderHyena = (data, index) => {
      const hyenaInstance = new AnimatedGameObjectView(data);
      playgroundElement.append(hyenaInstance.render());
      const spriteInstance = new AnimationSprite({
        position: data.sprite.position,
        ...data.sprite.data,
      });

      requestAnimationFrame(
        moveHyena(data, index, hyenaInstance, spriteInstance)
      );
    };

    window.data.hyenasData.forEach(renderHyena);
  };

  window.controllers.hyenas = {
    createHyenasData,
    renderHyenas,
  };
})();
