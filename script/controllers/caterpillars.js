(() => {
  const {
    MIN_CATERPILLARS_GAP,
    MAX_CATERPILLARS_COUNT,
    MAX_CATERPILLARS_COUNT,
    CATERPILLAR_HP_INCREASE,
    Direction,
  } = window.constants;
  const { areObjectsEqual, areObjectsIntersected } = window.utils;
  const { shouldBackgroundMove } = window.controllers.utils;
  const { ObjectPositionIterator } = window.utils;
  const { CaterpillarDataModel } = window.models;
  const { GameObjectView } = window.views;
  const {
    caterpillarsData,
    gameState,
    hpCounterData,
    scoreCounterData,
  } = window.data;

  const initialCaterpillarData = {
    width: 62,
    height: 50,
    position: {
      x: 0,
      y: 100,
    },
    template: document.querySelector("#caterpillar"),
  };

  const playgroundElement = document.querySelector(".playground");

  const createCaterpillarsData = (initialPosition) => {
    const positionIterator = new ObjectPositionIterator({
      initialPosition,
      minGap: MIN_CATERPILLARS_GAP,
      maxGap: MAX_CATERPILLARS_GAP,
    });

    for (let i = 0; i < MAX_CATERPILLARS_COUNT; i++) {
      caterpillarsData.push(
        new CaterpillarDataModel({
          ...initialCaterpillarData,
          position: {
            x: positionIterator.next(),
            y: initialCaterpillarData.position.y,
          },
        })
      );
    }
  };

  const renderCaterpillars = () => {
    const regenerateCaterpillars = () => {
      if (caterpillarsData.length > 0) return;

      createCaterpillarsData(playgroundElement.clientWidth);
      renderCaterpillars();
    };

    const removeCaterpillar = (instance, data) => {
      const index = caterpillarsData.findIndex((originalData) =>
        areObjectsEqual(originalData, data)
      );

      instance.destroy();
      caterpillarsData.splice(index, 1);
    };

    const moveCaterpillar = (data, index, instance) => () => {
      if (!gameState.isStarted) return;

      if (!gameState.isPaused) {
        if (shouldBackgroundMove()) {
          switch (characterData.direction) {
            case Direction.LEFT:
              data.position.x += backgroundData.speed;
              break;
            case Direction.RIGHT:
              data.position.x -= backgroundData.speed;
              break;
          }

          instance.move(data.position);
        }

        if (areObjectsIntersected(data, characterData)) {
          removeCaterpillar(instance, data);
          regenerateCaterpillars();
          scoreCounterData.value++;
          hpCounterData.value += CATERPILLAR_HP_INCREASE;
          return;
        }
      }

      requestAnimationFrame(moveCaterpillar(data, index, instance));
    };

    const renderCaterpillar = (data, index) => {
      const caterpillarInstance = new GameObjectView(data);
      playgroundElement.append(caterpillarInstance.render());

      requestAnimationFrame(moveCaterpillar(data, index, caterpillarInstance));
    };

    caterpillarsData.forEach(renderCaterpillar);
  };

  window.controllers.caterpillars = {
    createCaterpillarsData,
    renderCaterpillars,
  };
})();
