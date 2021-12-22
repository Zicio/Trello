import Dom from './Dom';

export default class Movement {
  constructor(element) {
    this.element = element;
    this.draggedItem = null;
    this.selectedItem = null;
    this.shiftX = null;
    this.shiftY = null;
    this.changingItem = null;
  }

  moveDownListener() {
    this.element.addEventListener('mousedown', this.moveDown.bind(this));
  }

  moveListener() {
    this.element.addEventListener('mousemove', this.move.bind(this));
  }

  moveUpListener() {
    this.element.addEventListener('mouseup', this.moveUp.bind(this));
  }

  moveDown(e) {
    if (e.target.classList.contains('column__card')) {
      e.preventDefault();
      const target = e.target.closest('.column__card');
      this.selectedItem = target;

      this.draggedItem = target.cloneNode(true);
      this.selectedItem.classList.add('column__card_selected');
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
      Dom.saver();

      this.moveListener();
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

    // Убирание зоны для вставки при следующем движении
    if (this.changingItem && (this.changingItem.classList.contains('column__add-element') || this.changingItem.classList.contains('column__card'))) {
      this.changingItem.style.marginTop = '10px';
      this.changingItem = null;
    }

    const x = e.clientX;
    const y = e.clientY;

    // Поиск элемента под курсором
    this.draggedItem.style.display = 'none';
    this.changingItem = document.elementFromPoint(x, y);
    this.draggedItem.style.display = 'block';

    // Исключение самого выбранного элемента под курсором
    if (!this.changingItem || this.changingItem === this.selectedItem) return;

    // Добавление зоны для вставки
    if (this.changingItem.classList.contains('column__add-element') || this.changingItem.classList.contains('column__card')) {
      this.changingItem.style.marginTop = `${this.draggedItem.offsetHeight + 20}px`;
    }
    this.moveUpListener();
  }

  moveUp(e) {
    if (!this.selectedItem) {
      return;
    }

    // Условие при непопадании курсора с переносимой карточкой на другую карточку
    // или кнопку Добавить
    if (!this.changingItem.classList.contains('column__card') && !this.changingItem.classList.contains('column__add-element')) {
      this.selectedItem.classList.remove('column__card_selected');
      this.draggedItem.remove();
      Dom.saver();
      return;
    }

    // Убирание зоны для вставки при отжатии кнопки мыши
    this.changingItem.style.marginTop = '10px';
    const { top } = this.changingItem.getBoundingClientRect();
    const column = this.changingItem.closest('.column');
    const parent = column.querySelector('.column__list');

    // Условие при попадании курсора с переносимой карточкой на колонку без карточек
    if (!this.changingItem.classList.contains('column__card')) {
      parent.appendChild(this.selectedItem);

    // Условие присутствия следующего элемента ниже
    } else if ((e.pageY > window.scrollY + top + this.changingItem.offsetHeight / 2)
       && (this.changingItem.nextElementSibling)
       && (this.changingItem.nextElementSibling !== this.selectedItem)) {
      parent.insertBefore(this.selectedItem, this.changingItem.nextElementSibling);
    } else {
      parent.insertBefore(this.selectedItem, this.changingItem);
    }

    this.selectedItem.classList.remove('column__card_selected');
    Dom.saver();
    this.selectedItem = null;

    this.draggedItem.remove();
    this.draggedItem = null;
  }
}
