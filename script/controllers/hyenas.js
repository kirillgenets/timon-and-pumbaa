(() => {
  const {
    ObjectPositionIterator,
    areObjectsEqual,
    areObjectsIntersected,
  } = window.utils;
  const { shouldBackgroundMove } = window.controllers.utils;
  const {
    SpriteData,
    Direction,
    MIN_HYENAS_GAP,
    MAX_HYENAS_GAP,
    MAX_HYENAS_COUNT,
    HYENAS_POSITION_SPREAD,
  } = window.constants;
  const { hyenasData, hpCounterData, characterData } = window.data;
  const { HyenaDataModel } = window.models;
  const { AnimatedGameObjectView, AnimationSprite } = window.views;

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
    sprite: { data: SpriteData.HYENA.running, position: 0 },
    damage: 30,
    damageTime: null,
    previousDamage: null,
  };

  const playgroundElement = document.querySelector(".playground");

  const createHyenasData = () => {
    const positionIterator = new ObjectPositionIterator({
      initialPosition: playgroundElement.clientWidth,
      minGap: MIN_HYENAS_GAP,
      maxGap: MAX_HYENAS_GAP,
    });

    for (let i = 0; i < MAX_HYENAS_COUNT; i++) {
      hyenasData.push(
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
      if (hyenasData.length > 0) return;

      createHyenasData();
      renderHyenas();
    };

    const removeHyena = (instance, data) => {
      const index = hyenasData.findIndex((originalData) =>
        areObjectsEqual(originalData, data)
      );

      instance.destroy();
      hyenasData.splice(index, 1);
    };

    const damageCharacter = (data) => () => {
      if (!data.damageTime) {
        data.damageTime = Date.now();
        data.previousDamage = 0;
        hpCounterData.value -= data.damage;
        return;
      }

      const currentTime = Math.floor((Date.now() - data.damageTime) / 1000);

      if (currentTime === data.previousDamage) return;

      data.previousDamage = currentTime;
      hpCounterData.value -= data.damage;
    };

    const getSpriteInstance = (newSprite, previousSprite, spriteInstance) => {
      if (!areObjectsEqual(newSprite, previousSprite)) {
        return new AnimationSprite({
          position: 0,
          ...newSprite,
        });
      }

      return spriteInstance;
    };

    const normalizeHyenaPosition = (data) => {
      if (
        characterData.direction === Direction.LEFT &&
        data.direction === Direction.LEFT
      ) {
        data.initialPosition.x += characterData.speed;
        data.position.x += characterData.speed;
      }

      if (
        characterData.direction === Direction.RIGHT &&
        data.direction === Direction.RIGHT
      ) {
        data.initialPosition.x -= characterData.speed;
        data.position.x -= characterData.speed;
      }

      if (
        characterData.direction === Direction.LEFT &&
        data.direction === Direction.RIGHT
      ) {
        data.initialPosition.x += characterData.speed - data.speed;
        data.position.x += characterData.speed - data.speed;
      }

      if (
        characterData.direction === Direction.RIGHT &&
        data.direction === Direction.LEFT
      ) {
        data.initialPosition.x -= characterData.speed - data.speed;
        data.position.x -= characterData.speed - data.speed;
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
      if (!gameState.isStarted) return;

      if (!gameState.isPaused) {
        const previousSprite = { ...data.sprite };

        updateHyenaPosition(data);

        if (areObjectsIntersected(characterData, data)) {
          requestAnimationFrame(damageCharacter(data));
        }

        if (data.position.x + data.width < 0) {
          removeHyena(instance, data);
          regenerateHyenas();
          return;
        }

        instance.move(
          data.position,
          getSpriteInstance(
            data.sprite.data,
            previousSprite.data,
            spriteInstance
          )
        );
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

    hyenasData.forEach(renderHyena);
  };

  window.controllers.hyenas = {
    createHyenasData,
    renderHyenas,
  };
})();