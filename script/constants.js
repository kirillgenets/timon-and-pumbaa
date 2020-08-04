(() => {
  const MAX_CATERPILLARS_COUNT = 5;
  const MIN_CATERPILLARS_GAP = 300;
  const MAX_CATERPILLARS_GAP = 800;

  const MAX_BACKGROUND_POSITION = -4000;

  const MAX_HYENAS_COUNT = 3;
  const MIN_HYENAS_GAP = 300;
  const MAX_HYENAS_GAP = 600;
  const HYENAS_POSITION_SPREAD = 250;

  const CATERPILLAR_HP_INCREASE = 15;

  const HP_DECREASE_STEP = 1;
  const MAX_HP = 100;

  const Direction = {
    RIGHT: "right",
    LEFT: "left",
    NONE: "none",
  };

  const SpriteData = {
    CHARACTER: {
      standing: {
        url: "media/img/sprites/pumba-standing.png",
        framesWidth: 165,
      },
      running: {
        url: "media/img/sprites/pumba-running.png",
        framesWidth: 130,
      },
      jumping: {
        url: "media/img/sprites/pumba-jumping.png",
        framesWidth: 100,
      },
      dying: {
        url: "media/img/sprites/pumba-dying.png",
        framesWidth: 120,
      },
    },
    HYENA: {
      running: {
        url: "media/img/sprites/hyena-running.png",
        framesWidth: 160,
      },
      biting: {
        url: "media/img/sprites/hyena-biting.png",
        framesWidth: 144,
      },
    },
  };

  const Key = {
    SPACE: "Space",
    ESC: "Escape",
    ARROW_UP: "ArrowUp",
    ARROW_LEFT: "ArrowLeft",
    ARROW_RIGHT: "ArrowRight",
  };

  window.constants = {
    MAX_CATERPILLARS_COUNT,
    MIN_CATERPILLARS_GAP,
    MAX_CATERPILLARS_GAP,
    MAX_BACKGROUND_POSITION,
    MAX_HYENAS_COUNT,
    MIN_HYENAS_GAP,
    MAX_HYENAS_GAP,
    HYENAS_POSITION_SPREAD,
    CATERPILLAR_HP_INCREASE,
    HP_DECREASE_STEP,
    MAX_HP,
    Direction,
    SpriteData,
    Key,
  };
})();
