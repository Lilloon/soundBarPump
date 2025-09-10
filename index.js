let startHandleY = null;
let prevHandleY = 0;

let isDragging = false;

let soundScale = 0;

const handle = document.getElementById("handle");
const soundBar = document.getElementById("soundBar");
const soundCount = document.getElementById("soundCount");
const player = document.getElementById("player");
const lockScreen = document.getElementById("lockscreen");
const startButton = document.getElementById("startbutton");

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const track = audioContext.createMediaElementSource(player);

const gainNode = audioContext.createGain();
track.connect(gainNode).connect(audioContext.destination);

const MAX_HANDLE_CHANGE = handle.clientHeight - 10;

const isAvailableForDrug = (currentY) => {
  return currentY >= 0 && currentY < MAX_HANDLE_CHANGE;
};

const changeSoundBarScale = () => {
  soundBar.style.transform = `scaleY(${soundScale})`;
};

const updateHandlePosition = (handle, dragY) => {
  handle.style.transform = `translateY(${dragY}px)`;
};

const getPercentsForSoundBar = (nextY) => nextY / MAX_HANDLE_CHANGE / 80;

const updateSoundBarScaleByPressDown = (nextY) => {
  if (prevHandleY < nextY) {
    soundScale += getPercentsForSoundBar(nextY);
    changeSoundBarScale();
  }
};

const getSoundBarTextCount = () => Math.floor(soundScale * 100);

const updateSoundCount = () => {
  soundCount.innerText = getSoundBarTextCount();
};

const updateSoundBar = (nextY) => {
  if (soundScale < 1) {
    updateSoundBarScaleByPressDown(nextY);
    updateSoundCount();
  }
};

const onHandleDragHandler = (e) => {
  e.preventDefault();
  if (isDragging) {
    const nextY = e.clientY - startHandleY;
    if (e.clientY !== 0 && isAvailableForDrug(nextY)) {
      updateHandlePosition(handle, nextY);
      updateSoundBar(nextY);
      updatePlayerVolume();
      prevHandleY = nextY;
    }
  }
};

updatePlayerVolume = () => {
  player.volume = soundScale;
  gainNode.gain.value = soundScale / 2;
};

const blowDownSoundBar = () => {
  setTimeout(() => {
    blowDownSoundBar();
    if (soundScale > 0.01) {
      soundScale -= 0.01;
      updateSoundCount();
      changeSoundBarScale();
      updatePlayerVolume();
    }
  }, 250);
};

const onMouseDown = (e) => {
  e.preventDefault();
  handle.setPointerCapture(e.pointerId);
  isDragging = true;
  if (!startHandleY) {
    startHandleY = e.clientY;
  }
};

const initDragController = () => {
  handle.addEventListener("pointerdown", onMouseDown);
  window.addEventListener("pointermove", onHandleDragHandler);
  window.addEventListener("pointerup", () => (isDragging = false));
  startButton.addEventListener(
    "click",
    async () => {
      player.muted = false;
      await audioContext.resume();
      await player.play();
      gainNode.gain.value = 0;
      document.body.removeChild(lockScreen);
    },
    { once: true }
  );
};

const addListeners = () => {
  initDragController();
};

const init = () => {
  addListeners();
  blowDownSoundBar();
};

document.addEventListener("DOMContentLoaded", init);
