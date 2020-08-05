(() => {
  const MAX_BACKGROUND_POSITION = -4000;

  const Direction = {
    RIGHT: "right",
    LEFT: "left",
    NONE: "none",
  };

  const Key = {
    SPACE: "Space",
    ESC: "Escape",
    ARROW_UP: "ArrowUp",
    ARROW_LEFT: "ArrowLeft",
    ARROW_RIGHT: "ArrowRight",
  };

  window.constants = {
    MAX_BACKGROUND_POSITION,
    HP_DECREASE_STEP,
    MAX_HP,
    Direction,
    Key,
  };
})();
