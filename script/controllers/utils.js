(() => {
  const { characterData, backgroundData } = window.data;
  const { MAX_BACKGROUND_POSITION } = window.constants;
  const { isObjectInMiddleOfWrapper } = window.utils;

  const playgroundElement = document.querySelector(".playground");

  const shouldBackgroundMove = () =>
    characterData.isMoving &&
    isObjectInMiddleOfWrapper(playgroundElement, characterData) &&
    backgroundData.position <= 0 &&
    backgroundData.position > MAX_BACKGROUND_POSITION;

  window.controllers.utils = {
    shouldBackgroundMove,
  };
})();
