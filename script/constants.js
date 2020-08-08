(() => {
  const DEFAULT_STATS = [
    {
      name: "Ваня",
      score: 1100,
    },
    {
      name: "Петя",
      score: 1300,
    },
    {
      name: "Саша",
      score: 1400,
    },
    {
      name: "Даша",
      score: 1099,
    },
    {
      name: "Кирилл",
      score: 1455,
    },
    {
      name: "Руслан",
      score: 1100,
    },
    {
      name: "Сергей",
      score: 1600,
    },
    {
      name: "Витя",
      score: 1500,
    },
    {
      name: "Катя",
      score: 1100,
    },
    {
      name: "Илья",
      score: 1086,
    },
  ];

  const MAX_BACKGROUND_POSITION = -6000;

  const OBJECTS_BOTTOM_POSITION = 100;

  const Key = {
    SPACE: "Space",
    ESC: "Escape",
    ARROW_UP: "ArrowUp",
    ARROW_LEFT: "ArrowLeft",
    ARROW_RIGHT: "ArrowRight",
  };

  window.constants = {
    DEFAULT_STATS,
    MAX_BACKGROUND_POSITION,
    OBJECTS_BOTTOM_POSITION,
    Key,
  };
})();
