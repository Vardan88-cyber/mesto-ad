function onKeyUp(evt) {
  if (evt.key === "Escape") {
    const opened = document.querySelector(".popup_is-opened");
    if (opened) closeModalWindow(opened);
  }
}

export function openModalWindow(popup) {
  popup.classList.add("popup_is-opened");
  document.addEventListener("keyup", onKeyUp);
}

export function closeModalWindow(popup) {
  popup.classList.remove("popup_is-opened");
  document.removeEventListener("keyup", onKeyUp);
}

export function setCloseModalWindowEventListeners(popup) {
  popup.querySelector(".popup__close").addEventListener("click", () => closeModalWindow(popup));

  popup.addEventListener("mousedown", (evt) => {
    if (evt.target === popup) closeModalWindow(popup);
  });
}
