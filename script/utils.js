(() => {
  const { OBJECTS_BOTTOM_POSITION } = window.constants;

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
    a.position.x + a.width >= b.position.x &&
    a.position.y === OBJECTS_BOTTOM_POSITION &&
    b.position.y === OBJECTS_BOTTOM_POSITION;

  window.utils = {
    showElement,
    hideElement,
    getElementFromTemplate,
    areObjectsEqual,
    isObjectInMiddleOfWrapper,
    areObjectsIntersected,
    ObjectPositionIterator,
  };
})();
