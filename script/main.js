// Constants

const RIGHT_DIRECTION = "right";
const LEFT_DIRECTION = "left";

const SpriteData = {
  CHARACTER: {
    standing: {
      url: "media/img/sprites/pumba-standing.png",
      framesWidth: [
        124,
        126,
        126,
        123,
        123,
        123,
        124,
        123,
        121,
        139,
        157,
        160,
        156,
        156,
        152,
      ],
    },
    running: {
      url: "media/img/sprites/pumba-running.png",
      framesWidth: [
        110,
        111,
        113,
        124,
        122,
        118,
        118,
        120,
        116,
        120,
        122,
        125,
        129,
        120,
        124,
        127,
      ],
    },
    jumping: {
      url: "media/img/sprites/pumba-jumping.png",
      framesWidth: [
        86,
        88,
        90,
        81,
        117,
        117,
        119,
        117,
        110,
        93,
        88,
        95,
        93,
        89,
        92,
      ],
    },
    dying: {
      url: "media/img/sprites/pumba-dying.png",
      framesWidth: [
        103,
        103,
        114,
        119,
        106,
        112,
        113,
        109,
        103,
        104,
        114,
        120,
        105,
        112,
      ],
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
};

// Initial data

const initialGameState = {
  isStarted: false,
  stats: [],
};

const initialCharacterData = {
  width: 160,
  height: 100,
  sprite: SpriteData.CHARACTER,
  speed: 1.5,
  direction: RIGHT_DIRECTION,
  position: {
    x: 0,
    y: 100,
  },
  backgroundPosition: 0,
};

const initialSpritesData = {
  position: 0,
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

// Data models

class GameStateDataModel {
  constructor({ isStarted, stats }) {
    this.isStarted = isStarted;
    this.stats = stats;
  }
}

class CharacterDataModel {
  constructor({
    width,
    height,
    spriteData,
    speed,
    direction,
    position,
    template,
  }) {
    this.width = width;
    this.height = height;
    this.spriteData = spriteData;
    this.speed = speed;
    this.direction = direction;
    this.position = position;
    this.template = template;
  }
}

// Object views

class AnimationSprite {
  constructor({ url, framesWidth, position }) {
    this._url = url;
    this._framesWidth = framesWidth;
    this._position = position;

    this._pointer = 0;
  }

  _updatePosition() {
    if (Array.isArray(this._framesWidth)) {
      this._position += this._framesWidth[this._pointer];
      this._pointer++;

      return;
    }

    this._position += this._framesWidth;
  }

  animate(element) {
    this._updatePosition();

    element.style.backgroundImage = `url("${this._url}")`;
    element.style.backgroundPosition = `${this._position}px`;
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

    sprite.animate(this._element);
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

const renderCharacter = () => {};

const renderAllObjects = () => {
  renderCharacter();
};

// Main functions

const initGame = () => {
  gameState.isStarted = true;
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
};

const handleIntroVideoCloseKeyDown = (evt) => {
  if (evt.code !== Key.SPACE) return;
  hideIntroVideo();
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
