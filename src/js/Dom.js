export default class Dom {
  static renderSavedCards() {
    const lists = document.getElementsByClassName('column__list');
    for (const list of [...lists]) {
      const columnName = list.closest('.column').classList[1];
      const savedData = JSON.parse(localStorage.getItem(columnName));
      if (savedData) {
        for (const el of savedData) {
          const newCard = document.createElement('li');
          newCard.classList.add('column__card');
          const textOfCard = document.createElement('span');
          textOfCard.textContent = el;
          const cross = document.createElement('button');
          cross.classList.add('button', 'card__delete');
          cross.textContent = '✖';
          list.appendChild(newCard);
          newCard.appendChild(textOfCard);
          newCard.appendChild(cross);
        }
      }
    }
  }

  static saver() {
    localStorage.clear();
    const lists = document.getElementsByClassName('column__list');
    for (const list of [...lists]) {
      const columnName = list.closest('.column').classList[1];
      const cards = list.getElementsByClassName('column__card');
      const savedData = [];
      for (const card of cards) {
        const data = card.firstChild.textContent;
        savedData.push(data);
      }
      localStorage.setItem(`${columnName}`, JSON.stringify(savedData));
    }
  }

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
    const textOfCard = document.createElement('span');
    textOfCard.textContent = text;
    const cross = document.createElement('button');
    cross.classList.add('button', 'card__delete');
    cross.textContent = '✖';
    list.appendChild(newCard);
    newCard.appendChild(textOfCard);
    newCard.appendChild(cross);
    Dom.renderAddCardMenu(e);
    Dom.saver();
  }

  static renderCross(e) {
    let cross = e.target.querySelector('.card__delete');
    if (cross === null) {
      cross = e.target;
    }
    cross.classList.toggle('active');
  }

  static deleteCard(e) {
    const card = e.target.parentNode;
    const columnList = e.target.closest('.column__list');
    columnList.removeChild(card);
    Dom.saver();
  }
}
