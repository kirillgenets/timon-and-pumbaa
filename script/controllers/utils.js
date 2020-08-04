(() => {
  const { MAX_BACKGROUND_POSITION } = window.constants;
  const { isObjectInMiddleOfWrapper } = window.utils;

  const playgroundElement = document.querySelector(".playground");

  const shouldBackgroundMove = () =>
    window.data.characterData.isMoving &&
    isObjectInMiddleOfWrapper(playgroundElement, window.data.characterData) &&
    window.data.backgroundData.position <= 0 &&
    window.data.backgroundData.position > MAX_BACKGROUND_POSITION;

  window.controllers.utils = {
    shouldBackgroundMove,
  };
})();
