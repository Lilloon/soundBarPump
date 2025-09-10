let startHandleY = null;
let prevHandleY = 0;

let isDragging = false;

let soundScale = 0;

const handle = document.getElementById("handle");
const soundBar = document.getElementById("soundBar");
const soundCount = document.getElementById("soundCount");
const player = document.getElementById("player");

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

const getPercentsForSoundBar = (nextY) => nextY / MAX_HANDLE_CHANGE / 100;

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
  console.log(isDragging, e);

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

const onDrugStartHandler = (e) => {
  if (!startHandleY) {
    startHandleY = e.clientY;
  }
};

updatePlayerVolume = () => {
  player.volume = soundScale;
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
  }, 500);
};

const onMouseDown = (e) => {
  isDragging = true;
  if (!startHandleY) {
    startHandleY = e.clientY;
  }
};

const initDragController = () => {
  handle.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mousemove", onHandleDragHandler);
  window.addEventListener("mouseup", () => (isDragging = false));
  document.body.addEventListener(
    "mousedown",
    () => {
      player.muted = false;
      player.volume = soundScale;
      player.play();
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
