// Constants

const SpriteData = {
  CHARACTER: {
    standing: {
      url: "./media/img/sprites/pumba-standing.png",
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
      url: "./media/img/sprites/pumba-running.png",
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
      url: "./media/img/sprites/pumba-jumping.png",
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
      url: "./media/img/sprites/pumba-dying.png",
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
      url: "./media/img/sprites/hyena-running.png",
      framesWidth: 157,
    },
    biting: {
      url: "./media/img/sprites/hyena-biting.png",
      framesWidth: 144,
    },
  },
};

const Key = {
  SPACE: "Space",
};

// DOM-elements

const gameWrapperElement = document.querySelector(".game");

const startModalElement = gameWrapperElement.querySelector(".start-modal");
const loginInput = startModalElement.querySelector(".login-input");
const startGameButton = startModalElement.querySelector(".start-game-button");

const introVideoElement = gameWrapperElement.querySelector(".intro-video");

const playgroundElement = gameWrapperElement.querySelector(".playground");
const statePanelElement = gameWrapperElement.querySelector(".panel");

// Utils

const showElement = (element) => {
  element.classList.remove("hidden");
};

const hideElement = (element) => {
  element.classList.add("hidden");
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
  hideElement(introVideoElement);
  showElement(playgroundElement);
  showElement(statePanelElement);
};

const handleIntroVideoCloseKeyDown = (evt) => {
  if (evt.code !== Key.SPACE) return;

  introVideoElement.pause();
  introVideoElement.currentTime = 0;

  hideElement(introVideoElement);
  showElement(playgroundElement);
  showElement(statePanelElement);
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
