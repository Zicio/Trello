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
          newCard.textContent = el;
          const cross = document.createElement('button');
          cross.classList.add('button', 'card__delete');
          cross.textContent = '✖';
          list.appendChild(newCard);
          newCard.appendChild(cross);
        }
      }
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
    newCard.textContent = text;
    const cross = document.createElement('button');
    cross.classList.add('button', 'card__delete');
    cross.textContent = '✖';
    list.appendChild(newCard);
    newCard.appendChild(cross);
    Dom.renderAddCardMenu(e);
    Dom.saveData(column, newCard);
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
    const column = e.target.closest('.column');
    const columnList = e.target.closest('.column__list');
    Dom.deleteData(column, card);
    columnList.removeChild(card);
  }

  static saveData(column, newCard) {
    const columnName = column.classList[1];
    if (localStorage.getItem(columnName)) {
      const arr = JSON.parse(localStorage.getItem(columnName));
      arr.push(newCard.innerText);
      localStorage.setItem(`${columnName}`, JSON.stringify(arr));
      return;
    }
    const arr = [];
    arr.push(newCard.innerText);
    localStorage.setItem(`${columnName}`, JSON.stringify(arr));
  }

  static deleteData(column, card) {
    const columnName = column.classList[1];
    const arr = JSON.parse(localStorage.getItem(columnName));
    const indexDataCard = arr.indexOf(card.innerText);
    arr.splice(indexDataCard, 1);
    localStorage.setItem(`${columnName}`, JSON.stringify(arr));
  }
}
