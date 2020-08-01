// Constants

const MAX_CATERPILLARS_COUNT = 5;
const MIN_CATERPILLARS_GAP = 300;
const MAX_CATERPILLARS_GAP = 800;
const MAX_BACKGROUND_POSITION = -2000;
const MAX_HYENAS_COUNT = 4;
const MIN_HYENAS_GAP = 100;
const MAX_HYENAS_GAP = 500;
const HYENAS_POSITION_SPREAD = 250;

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
      framesWidth: 157.09,
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

// Initial data

const initialGameState = {
  isStarted: false,
  isPaused: false,
  stats: [],
};

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

const initialBackgroundData = {
  position: -1,
  speed: 3,
  url: "media/img/game-bg.jpg",
};

const initialTimerData = {
  startTime: null,
  pauseTime: null,
  value: "00:00",
  template: document.querySelector("#counter"),
};

const initialHpCounterData = {
  value: 100,
  template: document.querySelector("#hp"),
};

const initialCaterpillarData = {
  width: 62,
  height: 50,
  position: {
    x: 0,
    y: 100,
  },
  template: document.querySelector("#caterpillar"),
};

const initialHyenaData = {
  width: 157,
  height: 100,
  speed: 2,
  direction: Direction.LEFT,
  position: {
    x: 0,
    y: 100,
  },
  template: document.querySelector("#hyena"),
  sprite: { data: SpriteData.HYENA.running, position: 0 },
};

const initialScoreCounterData = {
  value: 0,
  template: document.querySelector("#counter"),
};

// Utils

const showElement = (element) => {
  element.classList.remove("hidden");
};

const hideElement = (element) => {
  element.classList.add("hidden");
};

const getElementFromTemplate = (template) =>
  template.content.querySelector("*").cloneNode(true);

const areObjectsEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const isObjectInMiddleOfWrapper = (wrapper, obj) =>
  obj.position.x + obj.width === wrapper.clientWidth / 2 + obj.width / 2;

const areObjectsIntersected = (a, b) =>
  a.position.x <= b.position.x + b.width &&
  a.position.x + a.width >= b.position.x;

// Utils

class ObjectPositionIterator {
  constructor({ initialPosition, minGap, maxGap }) {
    this._minGap = minGap;
    this._maxGap = maxGap;
    this._position = initialPosition;
  }

  next() {
    this._position +=
      Math.random() * (this._maxGap - this._minGap) + this._minGap;

    return this._position;
  }
}

// Data models

class GameStateDataModel {
  constructor({ isStarted, stats, isPaused }) {
    this.isStarted = isStarted;
    this.isPaused = isPaused;
    this.stats = stats;
  }
}

class TimerDataModel {
  constructor({ startTime, value, template, pauseTime, isPaused }) {
    this.startTime = startTime;
    this.pauseTime = pauseTime;
    this.isPaused = isPaused;
    this.value = value;
    this.template = template;
  }
}

class ScoreCounterDataModel {
  constructor({ value, template }) {
    this.value = value;
    this.template = template;
  }
}

class HpCounterDataModel {
  constructor({ value, template }) {
    this.value = value;
    this.template = template;
  }
}

class CharacterDataModel {
  constructor({
    width,
    height,
    speed,
    direction,
    position,
    template,
    sprite,
    isMoving,
  }) {
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.direction = direction;
    this.position = position;
    this.template = template;
    this.sprite = sprite;
    this.isMoving = isMoving;
  }
}

class HyenaDataModel {
  constructor({ width, height, speed, direction, position, template, sprite }) {
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.direction = direction;
    this.position = position;
    this.initialPosition = { ...position };
    this.template = template;
    this.sprite = sprite;
  }
}

class CaterpillarDataModel {
  constructor({ width, height, position, template }) {
    this.width = width;
    this.height = height;
    this.position = position;
    this.template = template;
  }
}

class BackgroundDataModel {
  constructor({ position, speed, url }) {
    this.position = position;
    this.speed = speed;
    this.url = url;
  }
}

// Object views

class BackgroundView {
  constructor({ position, element }) {
    this._position = position;
    this._element = element;
  }

  setImage(url) {
    this._element.style.backgroundImage = `url("${url}")`;
  }

  move(position) {
    this._position = position;
    this._element.style.backgroundPosition = `${this._position}px`;
  }
}

class AnimationSprite {
  constructor({ url, framesWidth, position }) {
    this._url = url;
    this._framesWidth = framesWidth;
    this._position = position;
  }

  animate(element) {
    element.style.width = `${this._framesWidth}px`;
    element.style.backgroundImage = `url("${this._url}")`;
    element.style.backgroundPosition = `${this._position}px`;

    this._position += this._framesWidth;
  }
}

class DestroyableObject {
  constructor() {
    this._element = null;
  }

  destroy() {
    if (!this._element) return;

    this._element.remove();
    this._element = null;
  }
}

class GameObjectView extends DestroyableObject {
  constructor({ position, template }) {
    super();

    this._position = position;
    this._template = template;
  }

  render() {
    const { x, y } = this._position;

    this._element = getElementFromTemplate(this._template);
    this._element.style.left = `${x}px`;
    this._element.style.bottom = `${y}px`;

    return this._element;
  }

  move(position) {
    if (!this._element) return;

    this._position = position;
    this._element.style.left = `${this._position.x}px`;
    this._element.style.bottom = `${this._position.y}px`;
  }
}

class AnimatedGameObjectView extends GameObjectView {
  constructor(props) {
    super(props);
  }

  move(position, sprite) {
    if (!this._element) return;

    this._position = position;
    this._element.style.left = `${this._position.x}px`;
    this._element.style.bottom = `${this._position.y}px`;

    requestAnimationFrame(() => {
      sprite.animate(this._element);
    });
  }
}

class CounterView extends DestroyableObject {
  constructor({ value, template }) {
    super();
    this._value = value;
    this._template = template;
  }

  render() {
    this._element = getElementFromTemplate(this._template);
    this._element.textContent = this._value;

    return this._element;
  }

  update(value) {
    this._value = value;
    this._element.textContent = this._value;
  }
}

class HpCounterView extends CounterView {
  constructor(props) {
    super(props);

    this._scaleElement = null;
    this._valueElement = null;
  }

  render() {
    this._element = getElementFromTemplate(this._template);
    this._scaleElement = this._element.querySelector(".hp-scale-value");
    this._valueElement = this._element.querySelector(".counter");

    this._scaleElement.style.width = `${this._value}%`;
    this._valueElement.textContent = this._value;

    return this._element;
  }

  update(value) {
    this._value = value;

    this._scaleElement.style.width = `${this._value}%`;
    this._valueElement.textContent = this._value;
  }
}

// DOM-elements

const gameWrapperElement = document.querySelector(".game");

const startModalElement = gameWrapperElement.querySelector(".start-modal");
const loginInput = startModalElement.querySelector(".login-input");
const startGameButton = startModalElement.querySelector(".start-game-button");

const introVideoElement = gameWrapperElement.querySelector(".intro-video");

const playgroundElement = gameWrapperElement.querySelector(".playground");
const statePanelElement = gameWrapperElement.querySelector(".panel");
const timeCounterWrapper = statePanelElement.querySelector(
  ".time-counter-wrapper"
);
const scoreCounterWrapper = statePanelElement.querySelector(
  ".caterpillar-counter-wrapper"
);
const hpCounterWrapper = statePanelElement.querySelector(".hp-counter-wrapper");

// Data initialization

const gameState = new GameStateDataModel(initialGameState);

let characterData = {};
let backgroundData = {};
let timerData = {};
let scoreCounterData = {};
let hpCounterData = {};
let caterpillarsData = [];
let hyenasData = [];

// Game functions

const hideIntroVideo = () => {
  introVideoElement.pause();
  introVideoElement.currentTime = 0;

  hideElement(introVideoElement);
  showElement(playgroundElement);
  showElement(statePanelElement);
};

const shouldBackgroundMove = () =>
  characterData.isMoving &&
  isObjectInMiddleOfWrapper(playgroundElement, characterData) &&
  backgroundData.position <= 0 &&
  backgroundData.position > MAX_BACKGROUND_POSITION;

// Event handlers

const handleLoginInput = (evt) => {
  if (evt.target.value) {
    startGameButton.disabled = false;
  } else {
    startGameButton.disabled = true;
  }
};

const handleIntroVideoEnded = () => {
  hideIntroVideo();
  initGame();
};

const handleIntroVideoCloseKeyDown = (evt) => {
  if (evt.code !== Key.SPACE || gameState.isStarted) return;

  hideIntroVideo();
  initGame();
};

const handleStartGameButtonClick = () => {
  hideElement(startModalElement);

  introVideoElement.addEventListener("ended", handleIntroVideoEnded);
  document.addEventListener("keydown", handleIntroVideoCloseKeyDown);

  showElement(introVideoElement);
  introVideoElement.play();
};

const handlePauseKeyDown = (evt) => {
  if (evt.code !== Key.ESC) return;

  timerData.startTime = timerData.pauseTime
    ? timerData.startTime + (Date.now() - timerData.pauseTime)
    : timerData.startTime;
  timerData.pauseTime = timerData.pauseTime ? null : Date.now();
  gameState.isPaused = !gameState.isPaused;
};

// Data creation

const createCharacterData = () => {
  characterData = new CharacterDataModel(initialCharacterData);
};

const createBackgroundData = () => {
  backgroundData = new BackgroundDataModel(initialBackgroundData);
};

const createTimerData = () => {
  timerData = new TimerDataModel({
    ...initialTimerData,
    startTime: Date.now(),
  });
};

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

const createHyenasData = () => {
  const positionIterator = new ObjectPositionIterator({
    initialPosition: 300,
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

const createScoreCounterData = () => {
  scoreCounterData = new ScoreCounterDataModel(initialScoreCounterData);
};

const createHpCounterData = () => {
  hpCounterData = new HpCounterDataModel(initialHpCounterData);
};

const createAllObjectsData = () => {
  createBackgroundData();
  createCharacterData();
  createTimerData();
  createCaterpillarsData(initialCaterpillarData.position.x);
  createScoreCounterData();
  createHyenasData();
  createHpCounterData();
};

// Objects rendering

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

const renderBackground = () => {
  const moveBackground = () => {
    if (!gameState.isStarted) return;

    if (!gameState.isPaused && shouldBackgroundMove()) {
      switch (characterData.direction) {
        case Direction.LEFT:
          backgroundData.position += backgroundData.speed;
          break;
        case Direction.RIGHT:
          backgroundData.position -= backgroundData.speed;
          break;
      }

      if (backgroundData.position > 0) {
        backgroundData.position = 0;
      }

      if (backgroundData.position < MAX_BACKGROUND_POSITION) {
        backgroundData.position = MAX_BACKGROUND_POSITION;
      }

      backgroundInstance.move(backgroundData.position);
    }

    requestAnimationFrame(moveBackground);
  };

  const backgroundInstance = new BackgroundView({
    position: backgroundData.position,
    element: playgroundElement,
  });

  backgroundInstance.setImage(backgroundData.url);

  requestAnimationFrame(moveBackground);
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

  const getSpriteInstance = (newSprite, previousSprite, spriteInstance) => {
    if (!areObjectsEqual(newSprite, previousSprite)) {
      return new AnimationSprite({
        position: 0,
        ...newSprite,
      });
    }

    return spriteInstance;
  };

  const moveHyena = (data, index, instance, spriteInstance) => () => {
    if (!gameState.isStarted) return;

    const { initialPosition, speed, direction, sprite } = data;

    if (!gameState.isPaused) {
      const previousSprite = { ...sprite };

      switch (direction) {
        case Direction.LEFT:
          data.position.x -= speed;
          break;
        case Direction.RIGHT:
          data.position.x += speed;
          break;
      }

      if (shouldBackgroundMove()) {
        if (
          characterData.direction === Direction.LEFT &&
          direction === Direction.LEFT
        ) {
          data.position.x += characterData.speed;
        }

        if (
          characterData.direction === Direction.RIGHT &&
          direction === Direction.RIGHT
        ) {
          data.position.x -= characterData.speed;
        }

        if (
          characterData.direction === Direction.LEFT &&
          direction === Direction.RIGHT
        ) {
          data.position.x += characterData.speed - data.speed;
        }

        if (
          characterData.direction === Direction.RIGHT &&
          direction === Direction.LEFT
        ) {
          data.position.x -= characterData.speed - data.speed;
        }
      }

      if (data.position.x < initialPosition.x - HYENAS_POSITION_SPREAD) {
        data.direction = Direction.RIGHT;
      }

      if (data.position.x > initialPosition.x + HYENAS_POSITION_SPREAD) {
        data.direction = Direction.LEFT;
      }

      instance.move(
        data.position,
        getSpriteInstance(data.sprite.data, previousSprite.data, spriteInstance)
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

const renderTimer = () => {
  const updateTimer = () => {
    if (!gameState.isStarted) return;

    if (!gameState.isPaused) {
      const currentTime = (Date.now() - timerData.startTime) / 1000;
      const minutes = Math.floor(currentTime / 60);
      const seconds = Math.floor(currentTime % 60);
      const newValue = `${minutes > 9 ? minutes : `0${minutes}`}:${
        seconds > 9 ? seconds : `0${seconds}`
      }`;

      timerData.value = newValue;
      timerInstance.update(timerData.value);
    }

    requestAnimationFrame(updateTimer);
  };

  const timerInstance = new CounterView(timerData);
  timeCounterWrapper.append(timerInstance.render());

  requestAnimationFrame(updateTimer);
};

const renderScoreCounter = () => {
  const updateScoreCounter = () => {
    if (!gameState.isStarted) return;

    if (!gameState.isPaused) {
      scoreCounterInstance.update(scoreCounterData.value);
    }

    requestAnimationFrame(updateScoreCounter);
  };

  const scoreCounterInstance = new CounterView(scoreCounterData);
  scoreCounterWrapper.append(scoreCounterInstance.render());

  requestAnimationFrame(updateScoreCounter);
};

const renderHpCounter = () => {
  const updateHpCounter = () => {
    if (!gameState.isStarted) return;

    if (!gameState.isPaused) {
      hpCounterInstance.update(hpCounterData.value);
    }

    requestAnimationFrame(updateHpCounter);
  };

  const hpCounterInstance = new HpCounterView(hpCounterData);
  hpCounterWrapper.append(hpCounterInstance.render());

  requestAnimationFrame(updateHpCounter);
};

const renderAllObjects = () => {
  renderCharacter();
  renderBackground();
  renderTimer();
  renderCaterpillars();
  renderScoreCounter();
  renderHyenas();
  renderHpCounter();
};

// Main functions

const initGame = () => {
  gameState.isStarted = true;

  createAllObjectsData();
  renderAllObjects();

  document.addEventListener("keydown", handlePauseKeyDown);
};

// Event listeners

loginInput.addEventListener("input", handleLoginInput);
startGameButton.addEventListener("click", handleStartGameButtonClick);
