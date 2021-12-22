import Dom from './Dom';

export default class Logic {
  constructor(element) {
    this.element = element;
    this.draggedItem = null;
    this.selectedItem = null;
    this.shiftX = null;
    this.shiftY = null;

    Logic.start();
    this.listenerOfClickButton();
    this.listenerOfTargetCard();
    this.listenerOfUntargetCard();
    this.movingCard();
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
      // Logic.saveData(e);
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

  movingCard() {
    this.element.addEventListener('mousedown', this.moveDown.bind(this));

    this.element.addEventListener('mousemove', this.move.bind(this));

    this.element.addEventListener('mouseup', this.moveUp.bind(this));
  }

  moveDown(e) {
    if (e.target.classList.contains('column__card')) {
      e.preventDefault();
      const target = e.target.closest('.column__card');
      this.selectedItem = target;
      this.selectedItem.classList.add('column__card_selected');

      this.draggedItem = target.cloneNode(true);
      this.draggedItem.classList.add('column__card_dragged');

      const width = this.selectedItem.clientWidth;
      const height = this.selectedItem.clientHeight;

      this.shiftX = e.clientX - this.selectedItem.getBoundingClientRect().left;
      this.shiftY = e.clientY - this.selectedItem.getBoundingClientRect().top;

      this.draggedItem.style.width = `${width}px`;
      this.draggedItem.style.height = `${height}px`;
      this.positionOfDraggedItem(e);
      this.draggedItem.style.listStyle = 'none';
      this.draggedItem.style.transform = 'rotate(5deg)';

      this.element.appendChild(this.draggedItem);
    }
  }

  positionOfDraggedItem(e) {
    this.draggedItem.style.top = `${e.pageY - this.shiftY}px`;
    this.draggedItem.style.left = `${e.pageX - this.shiftX}px`;
  }

  move(e) {
    if (!this.selectedItem) {
      return;
    }
    this.positionOfDraggedItem(e);
  }

  moveUp(e) {
    if (!this.selectedItem) {
      return;
    }

    const x = e.clientX;
    const y = e.clientY;

    this.draggedItem.style.display = 'none';
    const changingItem = document.elementFromPoint(x, y);
    const { top } = changingItem.getBoundingClientRect();
    const parent = changingItem.closest('.column').querySelector('.column__list');
    if ((e.pageY > window.scrollY + top + changingItem.offsetHeight / 2)
    && (changingItem.nextElementSibling)) {
      parent.insertBefore(this.selectedItem, changingItem.nextElementSibling);
    } else {
      parent.insertBefore(this.selectedItem, changingItem);
    }

    this.selectedItem.classList.remove('column__card_selected');
    this.selectedItem = null;

    this.draggedItem.remove();
    this.draggedItem = null;
  }
}
