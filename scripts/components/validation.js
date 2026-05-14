function getErrorMessage(input) {
  return input.validity.patternMismatch
    ? input.dataset.errorMessage || input.validationMessage
    : input.validationMessage;
}

export function showInputError(form, input, settings) {
  const errorEl = form.querySelector(`.${input.id}-error`);
  input.classList.add(settings.inputErrorClass);
  if (errorEl) {
    errorEl.textContent = getErrorMessage(input);
    errorEl.classList.add(settings.errorClass);
  }
}

export function hideInputError(form, input, settings) {
  const errorEl = form.querySelector(`.${input.id}-error`);
  input.classList.remove(settings.inputErrorClass);
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.classList.remove(settings.errorClass);
  }
}

export function checkInputValidity(form, input, settings) {
  if (!input.validity.valid) {
    showInputError(form, input, settings);
  } else {
    hideInputError(form, input, settings);
  }
}

export function hasInvalidInput(inputs) {
  return inputs.some((input) => !input.validity.valid);
}

export function disableSubmitButton(btn, settings) {
  btn.classList.add(settings.inactiveButtonClass);
  btn.disabled = true;
}

export function enableSubmitButton(btn, settings) {
  btn.classList.remove(settings.inactiveButtonClass);
  btn.disabled = false;
}

export function toggleButtonState(inputs, btn, settings) {
  if (hasInvalidInput(inputs)) {
    disableSubmitButton(btn, settings);
  } else {
    enableSubmitButton(btn, settings);
  }
}

function attachInputListeners(form, settings) {
  const inputs = Array.from(form.querySelectorAll(settings.inputSelector));
  const btn = form.querySelector(settings.submitButtonSelector);

  toggleButtonState(inputs, btn, settings);

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      checkInputValidity(form, input, settings);
      toggleButtonState(inputs, btn, settings);
    });
  });
}

export function enableValidation(settings) {
  const forms = Array.from(document.querySelectorAll(settings.formSelector));
  forms.forEach((form) => attachInputListeners(form, settings));
}

export function clearValidation(form, settings) {
  const inputs = Array.from(form.querySelectorAll(settings.inputSelector));
  const btn = form.querySelector(settings.submitButtonSelector);
  inputs.forEach((input) => hideInputError(form, input, settings));
  disableSubmitButton(btn, settings);
}
