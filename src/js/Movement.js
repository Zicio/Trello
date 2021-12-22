import Dom from './Dom';

export default class Movement {
  constructor(element) {
    this.element = element;
    this.draggedItem = null;
    this.selectedItem = null;
    this.shiftX = null;
    this.shiftY = null;
    this.closestItem = null;
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
      const column = e.target.closest('.column');
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
      Dom.deleteData(column, this.selectedItem);
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

    if (this.closestItem) {
      this.closestItem.style.marginTop = '10px';
      this.closestItem = null;
    }

    const x = e.clientX;
    const y = e.clientY;

    this.draggedItem.style.display = 'none';
    const changingItem = document.elementFromPoint(x, y);
    this.draggedItem.style.display = 'block';
    this.closestItem = changingItem.closest('.column__add-element');
    if (!this.closestItem) {
      this.closestItem = changingItem.closest('.column__card');
    }
    if (!this.closestItem || this.closestItem === this.selectedItem) return;
    this.closestItem.style.marginTop = `${this.draggedItem.offsetHeight + 20}px`;
  }

  moveUp(e) {
    if (!this.selectedItem) {
      return;
    }
    this.closestItem.style.marginTop = '10px';
    const { top } = this.closestItem.getBoundingClientRect();
    const column = this.closestItem.closest('.column');
    const parent = column.querySelector('.column__list');
    if (!this.closestItem.classList.contains('column__card')) {
      parent.appendChild(this.selectedItem);
    } else if ((e.pageY > window.scrollY + top + this.closestItem.offsetHeight / 2)
       && (this.closestItem.nextElementSibling)
       && (this.closestItem.nextElementSibling !== this.selectedItem)) {
      parent.insertBefore(this.selectedItem, this.closestItem.nextElementSibling);
    } else {
      parent.insertBefore(this.selectedItem, this.closestItem);
    }

    this.selectedItem.classList.remove('column__card_selected');
    Dom.saveData(column, this.selectedItem);
    this.selectedItem = null;

    this.draggedItem.remove();
    this.draggedItem = null;
  }
}
