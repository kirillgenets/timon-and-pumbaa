(() => {
  const BACKGROUND_AUDIO_PATH = "./media/sounds/background.mp3";

  const backgroundAudio = new Audio(BACKGROUND_AUDIO_PATH);
  backgroundAudio.loop = true;

  window.audio = { backgroundAudio };
})();
