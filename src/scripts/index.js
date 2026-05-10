import { createCardElement } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";
import { getUserInfo, getInitialCards, updateUserInfo, updateAvatar, addNewCard, deleteCardFromServer, likeCardOnServer, unlikeCardOnServer } from "./components/api.js";
import { enableValidation, clearValidation } from "./components/validation.js";

const VALIDATION_CONFIG = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

const cardsList = document.querySelector(".places__list");

const editPopup = document.querySelector(".popup_type_edit");
const editForm = editPopup.querySelector(".popup__form");
const nameInput = editForm.querySelector(".popup__input_type_name");
const aboutInput = editForm.querySelector(".popup__input_type_description");

const newCardPopup = document.querySelector(".popup_type_new-card");
const newCardForm = newCardPopup.querySelector(".popup__form");
const cardNameInput = newCardForm.querySelector(".popup__input_type_card-name");
const cardUrlInput = newCardForm.querySelector(".popup__input_type_url");

const imagePopup = document.querySelector(".popup_type_image");
const popupImage = imagePopup.querySelector(".popup__image");
const popupCaption = imagePopup.querySelector(".popup__caption");

const editBtn = document.querySelector(".profile__edit-button");
const addCardBtn = document.querySelector(".profile__add-button");

const profileName = document.querySelector(".profile__title");
const profileAbout = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarPopup = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarPopup.querySelector(".popup__form");
const avatarUrlInput = avatarForm.querySelector(".popup__input");

const cardInfoPopup = document.querySelector(".popup_type_info");
const cardInfoTitle = cardInfoPopup.querySelector(".popup__title");
const cardInfoList = cardInfoPopup.querySelector(".popup__info");
const cardInfoUsers = cardInfoPopup.querySelector(".popup__list");
const cardInfoText = cardInfoPopup.querySelector(".popup__text");

let myUserId = null;

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function makeInfoItem(term, value) {
  const tpl = document.getElementById("popup-info-definition-template");
  const item = tpl.content.cloneNode(true);
  item.querySelector(".popup__info-term").textContent = term;
  item.querySelector(".popup__info-description").textContent = value;
  return item;
}

function makeUserBadge(user) {
  const tpl = document.getElementById("popup-info-user-preview-template");
  const item = tpl.content.cloneNode(true);
  item.querySelector(".popup__list-item_type_badge").textContent = user.name;
  return item;
}

function handleInfoClick(cardId) {
  getInitialCards()
    .then((cards) => {
      const card = cards.find((c) => c._id === cardId);

      cardInfoList.innerHTML = "";
      cardInfoUsers.innerHTML = "";
      cardInfoTitle.textContent = "Информация о карточке";

      cardInfoList.append(makeInfoItem("Описание:", card.name));
      cardInfoList.append(makeInfoItem("Дата создания:", formatDate(card.createdAt)));
      cardInfoList.append(makeInfoItem("Владелец:", card.owner.name));
      cardInfoList.append(makeInfoItem("Количество лайков:", card.likes.length));

      if (card.likes.length > 0) {
        cardInfoText.textContent = "Лайкнули:";
        card.likes.forEach((user) => cardInfoUsers.append(makeUserBadge(user)));
      } else {
        cardInfoText.textContent = "Никто ещё не лайкнул.";
      }

      openModalWindow(cardInfoPopup);
    })
    .catch(console.error);
}

function handlePreviewPicture({ name, link }) {
  popupImage.src = link;
  popupImage.alt = name;
  popupCaption.textContent = name;
  openModalWindow(imagePopup);
}

function setButtonLoading(btn, isLoading, defaultText) {
  btn.textContent = isLoading ? "Сохранение..." : defaultText;
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const btn = editForm.querySelector(".popup__button");
  setButtonLoading(btn, true);

  updateUserInfo(nameInput.value, aboutInput.value)
    .then((data) => {
      profileName.textContent = data.name;
      profileAbout.textContent = data.about;
      closeModalWindow(editPopup);
    })
    .catch(console.error)
    .finally(() => setButtonLoading(btn, false, "Сохранить"));
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const btn = avatarForm.querySelector(".popup__button");
  setButtonLoading(btn, true);

  updateAvatar(avatarUrlInput.value)
    .then((data) => {
      profileAvatar.style.backgroundImage = `url(${data.avatar})`;
      closeModalWindow(avatarPopup);
    })
    .catch(console.error)
    .finally(() => setButtonLoading(btn, false, "Сохранить"));
}

function handleNewCardFormSubmit(evt) {
  evt.preventDefault();
  const btn = newCardForm.querySelector(".popup__button");
  btn.textContent = "Создание...";

  addNewCard(cardNameInput.value, cardUrlInput.value)
    .then((data) => {
      cardsList.prepend(
        createCardElement(data, myUserId, {
          onPreviewPicture: handlePreviewPicture,
          onLikeIcon: handleLikeCard,
          onDeleteCard: handleDeleteCard,
          onInfoClick: handleInfoClick,
        })
      );
      closeModalWindow(newCardPopup);
      newCardForm.reset();
    })
    .catch(console.error)
    .finally(() => { btn.textContent = "Создать"; });
}

function handleDeleteCard(cardEl, cardId) {
  deleteCardFromServer(cardId)
    .then(() => cardEl.remove())
    .catch(console.error);
}

function handleLikeCard(likeBtn, cardId) {
  const liked = likeBtn.classList.contains("card__like-button_is-active");
  const action = liked ? unlikeCardOnServer(cardId) : likeCardOnServer(cardId);

  action
    .then((data) => {
      likeBtn.classList.toggle("card__like-button_is-active");
      const counter = likeBtn.closest(".card").querySelector(".card__like-count");
      if (counter) counter.textContent = data.likes.length;
    })
    .catch(console.error);
}

function makeCardElement(data) {
  return createCardElement(data, myUserId, {
    onPreviewPicture: handlePreviewPicture,
    onLikeIcon: handleLikeCard,
    onDeleteCard: handleDeleteCard,
    onInfoClick: handleInfoClick,
  });
}

editForm.addEventListener("submit", handleEditFormSubmit);
newCardForm.addEventListener("submit", handleNewCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFormSubmit);

editBtn.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  aboutInput.value = profileAbout.textContent;
  clearValidation(editForm, VALIDATION_CONFIG);
  openModalWindow(editPopup);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, VALIDATION_CONFIG);
  openModalWindow(avatarPopup);
});

addCardBtn.addEventListener("click", () => {
  newCardForm.reset();
  clearValidation(newCardForm, VALIDATION_CONFIG);
  openModalWindow(newCardPopup);
});

document.querySelectorAll(".popup").forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});

enableValidation(VALIDATION_CONFIG);

Promise.all([getUserInfo(), getInitialCards()])
  .then(([user, cards]) => {
    myUserId = user._id;
    profileName.textContent = user.name;
    profileAbout.textContent = user.about;
    profileAvatar.style.backgroundImage = `url(${user.avatar})`;
    cards.forEach((card) => cardsList.append(makeCardElement(card)));
  })
  .catch(console.error);
