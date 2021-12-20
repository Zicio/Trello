export default class Dom {
  static renderAddCardMenu(e) {
    const column = e.target.closest('.column');
    const formBox = column.querySelector('.form__box');
    const formfield = formBox.querySelector('.form__field');
    formfield.value = '';
    formBox.classList.toggle('active');
  }

  static renderNewCard(e) {
    const column = e.target.closest('.column');
    const text = column.querySelector('.form__field').value;
    const list = column.querySelector('.column__list');
    const newCard = document.createElement('li');
    newCard.classList.add('column__card');
    newCard.textContent = text;
    newCard.setAttribute('tabindex', 1);
    const cross = document.createElement('button');
    cross.classList.add('button', 'card__delete');
    cross.textContent = '✖';
    list.appendChild(newCard);
    newCard.appendChild(cross);
    Dom.renderAddCardMenu(e);
  }

  static renderCross(e) {
    const cross = e.target.querySelector('.card__delete');
    cross.classList.toggle('active');
  }

  static deleteCard(e) {
    const card = e.target.parentNode;
    const columnList = e.target.closest('.column__list');
    columnList.removeChild(card);
  }
}
