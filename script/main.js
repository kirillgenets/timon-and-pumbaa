// Constants

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
      framesWidth: 157,
    },
    biting: {
      url: "media/img/sprites/hyena-biting.png",
      framesWidth: 144,
    },
  },
};

const Key = {
  SPACE: "Space",
  ARROW_UP: "ArrowUp",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
};

// Initial data

const initialGameState = {
  isStarted: false,
  stats: [],
};

const initialCharacterData = {
  width: 160,
  height: 100,
  speed: 1.5,
  direction: Direction.NONE,
  position: {
    x: 0,
    y: 100,
  },
  template: document.querySelector("#character"),
  sprite: { data: SpriteData.CHARACTER.standing, position: 0 },
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

// Data models

class GameStateDataModel {
  constructor({ isStarted, stats }) {
    this.isStarted = isStarted;
    this.stats = stats;
  }
}

class CharacterDataModel {
  constructor({ width, height, speed, direction, position, template, sprite }) {
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.direction = direction;
    this.position = position;
    this.template = template;
    this.sprite = sprite;
  }
}

// Object views

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

class GameObjectView {
  constructor({ position, template }) {
    this._position = position;
    this._template = template;

    this._element = null;
  }

  render() {
    const { x, y } = this._position;

    this._element = getElementFromTemplate(this._template);
    this._element.style.left = `${x}px`;
    this._element.style.bottom = `${y}px`;

    return this._element;
  }

  destroy() {
    if (!this._element) return;

    this._element.remove();
    this._element = null;
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

// DOM-elements

const gameWrapperElement = document.querySelector(".game");

const startModalElement = gameWrapperElement.querySelector(".start-modal");
const loginInput = startModalElement.querySelector(".login-input");
const startGameButton = startModalElement.querySelector(".start-game-button");

const introVideoElement = gameWrapperElement.querySelector(".intro-video");

const playgroundElement = gameWrapperElement.querySelector(".playground");
const statePanelElement = gameWrapperElement.querySelector(".panel");

// Data initialization

const gameState = new GameStateDataModel(initialGameState);

let characterData = {};

// Game functions

const hideIntroVideo = () => {
  introVideoElement.pause();
  introVideoElement.currentTime = 0;

  hideElement(introVideoElement);
  showElement(playgroundElement);
  showElement(statePanelElement);
};

// Data creation

const createCharacterData = () => {
  characterData = new CharacterDataModel(initialCharacterData);
};

const createAllObjectsData = () => {
  createCharacterData();
};

// Objects rendering

const renderCharacter = () => {
  const handleCharacterKeyDown = (evt) => {
    switch (evt.code) {
      case Key.ARROW_RIGHT:
        characterData.direction = Direction.RIGHT;
        break;
      case Key.ARROW_LEFT:
        characterData.direction = Direction.LEFT;
        break;
    }
  };

  const handleCharacterKeyUp = (evt) => {
    if (evt.code === Key.ARROW_LEFT || evt.code === Key.ARROW_RIGHT) {
      characterData.direction = Direction.NONE;
    }
  };

  const moveCharacter = () => {
    if (!gameState.isStarted) return;
    const previousSprite = characterData.sprite.data;

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

    if (!areObjectsEqual(characterData.sprite.data, previousSprite)) {
      console.log("huy");
      spriteInstance = new AnimationSprite({
        position: 0,
        ...characterData.sprite.data,
      });
    }

    characterInstance.move(characterData.position, spriteInstance);

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

const renderAllObjects = () => {
  renderCharacter();
};

// Main functions

const initGame = () => {
  gameState.isStarted = true;

  createAllObjectsData();
  renderAllObjects();
};

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
  if (evt.code !== Key.SPACE) return;

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

// Event listeners

loginInput.addEventListener("input", handleLoginInput);
startGameButton.addEventListener("click", handleStartGameButtonClick);
