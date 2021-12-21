import Dom from './Dom';

export default class Logic {
  constructor(element) {
    this.element = element;

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
    let draggedItem = null;
    let selectedItem = null;
    let shiftX = null;
    let shiftY = null;
    this.element.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('column__card')) {
        e.preventDefault();
        const target = e.target.closest('.column__card');
        selectedItem = target;
        selectedItem.classList.add('column__card_selected');

        draggedItem = target.cloneNode(true);
        draggedItem.classList.add('column__card_dragged');

        const width = selectedItem.clientWidth;
        const height = selectedItem.clientHeight;

        shiftX = e.clientX - selectedItem.getBoundingClientRect().left;
        shiftY = e.clientY - selectedItem.getBoundingClientRect().top;

        draggedItem.style.width = `${width}px`;
        draggedItem.style.height = `${height}px`;
        draggedItem.style.top = `${e.pageY - shiftY}px`;
        draggedItem.style.left = `${e.pageX - shiftX}px`;
        draggedItem.style.listStyle = 'none';
        draggedItem.style.transform = 'rotate(5deg)';

        this.element.appendChild(draggedItem);
      }
    });

    this.element.addEventListener('mousemove', (e) => {
      if (!selectedItem) {
        return;
      }

      draggedItem.style.top = `${e.pageY - shiftY}px`;
      draggedItem.style.left = `${e.pageX - shiftX}px`;
    });

    this.element.addEventListener('mouseup', (e) => {
      if (!selectedItem) {
        return;
      }

      const x = e.clientX;
      const y = e.clientY;

      draggedItem.style.display = 'none';
      const changingItem = document.elementFromPoint(x, y);
      const { top } = changingItem.getBoundingClientRect();
      const parent = changingItem.closest('.column').querySelector('.column__list');
      if ((e.pageY > window.scrollY + top + changingItem.offsetHeight / 2)
      && (changingItem.nextElementSibling)) {
        parent.insertBefore(selectedItem, changingItem.nextElementSibling);
      } else {
        parent.insertBefore(selectedItem, changingItem);
      }

      selectedItem.classList.remove('column__card_selected');
      selectedItem = null;

      draggedItem.remove();
      draggedItem = null;
    });
  }
}
