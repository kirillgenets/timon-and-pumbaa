(() => {
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
    constructor({ value, template, previousDecrease }) {
      this.value = value;
      this.template = template;
      this.previousDecrease = previousDecrease;
    }
  }

  class CharacterDataModel {
    constructor({
      width,
      height,
      speed,
      directions,
      position,
      template,
      sprite,
      isMoving,
    }) {
      this.width = width;
      this.height = height;
      this.speed = speed;
      this.directions = directions;
      this.position = position;
      this.template = template;
      this.sprite = sprite;
      this.isMoving = isMoving;
    }
  }

  class HyenaDataModel {
    constructor({
      width,
      height,
      speed,
      direction,
      position,
      template,
      sprite,
      damage,
      damageTime,
      previousDamage,
    }) {
      this.width = width;
      this.height = height;
      this.speed = speed;
      this.direction = direction;
      this.position = position;
      this.initialPosition = { ...position };
      this.template = template;
      this.sprite = sprite;
      this.damage = damage;
      this.damageTime = damageTime;
      this.previousDamage = previousDamage;
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

  window.models = {
    GameStateDataModel,
    TimerDataModel,
    ScoreCounterDataModel,
    HpCounterDataModel,
    CharacterDataModel,
    HyenaDataModel,
    CaterpillarDataModel,
    BackgroundDataModel,
  };
})();
