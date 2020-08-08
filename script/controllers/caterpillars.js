(() => {
  const { OBJECTS_BOTTOM_POSITION } = window.constants;
  const { areObjectsEqual, areObjectsIntersected } = window.utils;
  const { shouldBackgroundMove } = window.controllers.utils;
  const { ObjectPositionIterator } = window.utils;
  const { CaterpillarDataModel } = window.models;
  const { GameObjectView } = window.views;

  const MAX_CATERPILLARS_COUNT = 12;
  const MIN_CATERPILLARS_GAP = 100;
  const MAX_CATERPILLARS_GAP = 300;
  const CATERPILLAR_HP_INCREASE = 5;

  const initialCaterpillarData = {
    width: 62,
    height: 50,
    position: {
      x: 0,
      y: OBJECTS_BOTTOM_POSITION,
    },
    template: document.querySelector("#caterpillar"),
  };

  const playgroundElement = document.querySelector(".playground");

  const createCaterpillarsData = (
    initialPosition = playgroundElement.clientWidth / 2
  ) => {
    const positionIterator = new ObjectPositionIterator({
      initialPosition,
      minGap: MIN_CATERPILLARS_GAP,
      maxGap: MAX_CATERPILLARS_GAP,
    });

    for (let i = 0; i < MAX_CATERPILLARS_COUNT; i++) {
      window.data.caterpillarsData.push(
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
      if (window.data.caterpillarsData.length > 0) return;

      createCaterpillarsData(playgroundElement.clientWidth);
      renderCaterpillars();
    };

    const removeCaterpillar = (instance, data) => {
      const index = window.data.caterpillarsData.findIndex((originalData) =>
        areObjectsEqual(originalData, data)
      );

      instance.destroy();
      window.data.caterpillarsData.splice(index, 1);
    };

    const moveCaterpillar = (data, index, instance) => () => {
      if (window.data.gameState.isOver) {
        removeCaterpillar(instance, data);
        return;
      }

      if (!window.data.gameState.isStarted) return;

      if (!window.data.gameState.isPaused) {
        if (shouldBackgroundMove()) {
          data.position.x += window.data.characterData.directions.left
            ? window.data.backgroundData.speed
            : 0;

          data.position.x -= window.data.characterData.directions.right
            ? window.data.backgroundData.speed
            : 0;

          instance.move(data.position);
        }

        if (data.position.x + data.width < 0) {
          removeCaterpillar(instance, data);
          regenerateCaterpillars();
          return;
        }

        if (areObjectsIntersected(data, window.data.characterData)) {
          removeCaterpillar(instance, data);
          regenerateCaterpillars();
          window.data.scoreCounterData.value++;
          window.data.hpCounterData.value += CATERPILLAR_HP_INCREASE;
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

    window.data.caterpillarsData.forEach(renderCaterpillar);
  };

  window.controllers.caterpillars = {
    createCaterpillarsData,
    renderCaterpillars,
  };
})();
