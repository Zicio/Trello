import Dom from './Dom';

export default class Logic {
  constructor(element) {
    this.element = element;

    this.listenerOfClickButton();
    this.listenerOfTargetCard();
    this.listenerOfUntargetCard();
  }

  listenerOfClickButton() {
    this.element.addEventListener('click', (e) => Logic.renderElement(e));
  }

  static renderElement(e) {
    if (e.target.classList.contains('column__add-element') || e.target.classList.contains('form__remove')) {
      e.preventDefault();
      Dom.renderAddCardMenu(e);
      return;
    }
    if (e.target.classList.contains('form__submit')) {
      e.preventDefault();
      Dom.renderNewCard(e);
      return;
    }
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
    if (e.target.classList.contains('column__card')) {
      e.preventDefault();
      Dom.renderCross(e);
    }
  }
}
