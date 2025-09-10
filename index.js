let startHandleY = null;
let prevHandleY = 0;

let soundScale = 0;

const handle = document.getElementById("handle");
const soundBar = document.getElementById("soundBar");
const soundCount = document.getElementById("soundCount");

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
  const nextY = e.clientY - startHandleY;
  if (e.clientY !== 0 && isAvailableForDrug(nextY)) {
    updateHandlePosition(handle, nextY);
    updateSoundBar(nextY);
    prevHandleY = nextY;
  }
};

const onDrugStartHandler = (e) => {
  if (!startHandleY) {
    startHandleY = e.clientY;
  }
};

const blowDownSoundBar = () => {
  setTimeout(() => {
    blowDownSoundBar();
    if (soundScale > 0.01) {
      soundScale -= 0.01;
      updateSoundCount();
      changeSoundBarScale();
    }
  }, 500);
};

const initDragController = () => {
  handle.addEventListener("drag", onHandleDragHandler);
  handle.addEventListener("dragstart", onDrugStartHandler);
};

const addListeners = () => {
  initDragController();
};

const init = () => {
  addListeners();
  blowDownSoundBar();
};

document.addEventListener("DOMContentLoaded", init);
