function getCardTemplate() {
  const template = document.getElementById("card-template");
  return template.content.querySelector(".card").cloneNode(true);
}

export function deleteCard(cardElement) {
  cardElement.remove();
}

export function isCardLiked(likeBtn) {
  return likeBtn.classList.contains("card__like-button_is-active");
}

export function likeCard(likeBtn, likes) {
  likeBtn.classList.toggle("card__like-button_is-active");
  const counter = likeBtn.closest(".card").querySelector(".card__like-count");
  if (counter) counter.textContent = likes.length;
}

export function createCardElement(data, userId, handlers) {
  const { onPreviewPicture, onLikeIcon, onDeleteCard, onInfoClick } = handlers;
  const card = getCardTemplate();

  const likeBtn = card.querySelector(".card__like-button");
  const deleteBtn = card.querySelector(".card__control-button_type_delete");
  const infoBtn = card.querySelector(".card__control-button_type_info");
  const img = card.querySelector(".card__image");
  const likeCounter = card.querySelector(".card__like-count");

  img.src = data.link;
  img.alt = data.name;
  card.querySelector(".card__title").textContent = data.name;

  const likesCount = data.likes ? data.likes.length : 0;
  if (likeCounter) likeCounter.textContent = likesCount;

  const alreadyLiked = data.likes && data.likes.some((u) => u._id === userId);
  if (alreadyLiked) likeBtn.classList.add("card__like-button_is-active");

  const isOwner = data.owner._id === userId;
  if (!isOwner) deleteBtn.remove();

  likeBtn.addEventListener("click", () => onLikeIcon && onLikeIcon(likeBtn, data._id));

  if (isOwner && onDeleteCard) {
    deleteBtn.addEventListener("click", () => onDeleteCard(card, data._id));
  }

  if (onPreviewPicture) {
    img.addEventListener("click", () => onPreviewPicture({ name: data.name, link: data.link }));
  }

  if (infoBtn && onInfoClick) {
    infoBtn.addEventListener("click", () => onInfoClick(data._id));
  }

  return card;
}
