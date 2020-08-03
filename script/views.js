(() => {
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

  window.views = {
    BackgroundView,
    AnimationSprite,
    GameObjectView,
    AnimatedGameObjectView,
    CounterView,
    HpCounterView,
  };
})();
