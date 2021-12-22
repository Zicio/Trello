import Dom from './Dom';
import Movement from './Movement';

export default class Logic {
  constructor(element) {
    this.element = element;
    this.moveControlClass = new Movement(this.element);

    Logic.start();
    this.listenerOfClickButton();
    this.listenerOfTargetCard();
    this.listenerOfUntargetCard();
    this.moveControlClass.moveDownListener();
  }

  static start() {
    if (localStorage.length) {
      Dom.renderSavedCards();
    }
  }

  listenerOfClickButton() {
    this.element.addEventListener('click', (e) => Logic.renderElement(e));
  }

  static renderElement(e) {
    // Меню добавления карточки
    if (e.target.classList.contains('column__add-element') || e.target.classList.contains('form__remove')) {
      e.preventDefault();
      Dom.renderAddCardMenu(e);
      return;
    }
    // Добавление карточки
    if (e.target.classList.contains('form__submit')) {
      e.preventDefault();
      Dom.renderNewCard(e);
      return;
    }
    // Удаление карточки
    if (e.target.classList.contains('card__delete')) {
      e.preventDefault();
      Dom.deleteCard(e);
    }
  }

  listenerOfTargetCard() {
    this.element.addEventListener('mouseover', (e) => Logic.renderCross(e));
  }

  listenerOfUntargetCard() {
    this.element.addEventListener('mouseout', (e) => Logic.renderCross(e));
  }

  static renderCross(e) {
    if (e.target.closest('.column__card')) {
      e.preventDefault();
      Dom.renderCross(e);
    }
  }
}
