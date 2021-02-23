const timesArr = [10, 11, 12, 13, 14, 15, 16, 17, 18];
const timesSelectArr = timesArr.map((el) => ({ value: el, label: `${el}:00` }));

const createCalendarData = () => {
  const obj = {};
  timesArr.forEach((time) => {
    obj[time] = {
      Monday: {},
      Tuesday: {},
      Wednesday: {},
      Thursday: {},
      Friday: {},
    };
  });
  return obj;
};

const calendarData = localStorage.calendarData
  ? JSON.parse(localStorage.calendarData) : createCalendarData();
const popup = document.querySelector('.js-popup');
const popupError = document.querySelector('.js-popup_error');
const popupButton = document.querySelector('.js-popup__btn');
const openPopupButton = document.querySelector('.js-open-popup');
const closePopupButtons = document.querySelectorAll('.js-close-popup');
const popupConfirmation = document.querySelector('.js-popup_confirmation');
const overlay = document.querySelector('.js-overlay');
const calendar = document.querySelector('.js-calendar');
const membersSelect = document.querySelector('.js-members');
const popupLoginForm = document.querySelector('.js-popup_login');
const { forms } = document;
const form = forms[0];
let user = {
  id: 0,
  name: '',
  isAdmin: false,
};

class User {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

class Admin extends User {
  constructor(id, name) {
    super(id, name);
    this.isAdmin = true;
  }
}

const user1 = new User('1', 'John');
const user2 = new User('2', 'Sam');
const user3 = new User('3', 'Ann');
const user4 = new Admin('4', 'Thomas');
const user5 = new User('5', 'Eve');

const users = [user1, user2, user3, user4, user5];

const createBlock = (data, selectedParticipant) => {
  const {
    color, title, participants, reserved, id,
  } = data;
  const block = document.createElement('div');

  if ((participants && participants.includes(selectedParticipant)) || (selectedParticipant === '0' && reserved)) {
    if (user.isAdmin) {
      block.className = `calendar__item reserved ${color}`;
    } else {
      block.className = `calendar__item ${color}`;
    }
    block.dataset.id = id;
    block.innerHTML = `<p class="calendar__item-text">${title}</p>`;
  } else {
    block.className = 'calendar__item';
  }
  return block;
};

const renderCalendar = (selectedParticipant) => {
  const fragment = document.createDocumentFragment();
  calendar.innerHTML = '';
  Object.values(calendarData).forEach((time) => {
    Object.values(time).forEach((day) => {
      const block = createBlock(day, selectedParticipant);
      fragment.appendChild(block);
    });
  });
  calendar.appendChild(fragment);
};

const openPopup = (popupProp) => {
  popupProp.classList.add('popup_active');
  overlay.classList.add('overlay_active');
};

const closePopup = (popupProp) => {
  popupProp.classList.remove('popup_active');
  overlay.classList.remove('overlay_active');
};

const isRadio = (type) => ['radio'].includes(type);
const titleValidation = (title) => title.length >= 3;
const timeValidation = (time, day) => !calendarData[time][day].reserved;
const participantsValidation = (participants) => participants.length;

const resetFilter = () => {
  membersSelect.options[0].selected = true;
  renderCalendar('0');
};

const addNewMeet = (values) => {
  const {
    times, days, title, colors: color, participants,
  } = values;

  calendarData[times][days] = {
    id: `${times}-${days}`,
    participants,
    title,
    color,
    reserved: true,
  };

  localStorage.calendarData = JSON.stringify(calendarData);
  resetFilter();
};

const showPopupError = () => popupError.classList.add('popup_active');
const hidePopupError = () => popupError.classList.remove('popup_active');

const formValidation = (values) => {
  const {
    times, days, title, participants,
  } = values;

  if (timeValidation(times, days) && titleValidation(title)
        && participantsValidation(participants)) {
    addNewMeet(values);
    closePopup(popup);
    hidePopupError();
    renderCalendar('0');
    form.reset();
  } else {
    showPopupError();
  }
};

const retrieveFormValue = (event) => {
  event.preventDefault();
  const values = {};

  for (const field of form) {
    const { name } = field;
    if (name) {
      const { type, value } = field;
      if (name === 'participants') {
        values.participants = [...field.options].filter((x) => x.selected).map((x) => x.value);
      } else if (isRadio(type)) {
        if (field.checked) {
          values[name] = value;
        }
      } else {
        values[name] = value;
      }
    }
  }
  formValidation(values);
};

const removeEvent = (id) => {
  const [time, day] = id.split('-');
  calendarData[time][day] = {};
  localStorage.calendarData = JSON.stringify(calendarData);
  renderCalendar(membersSelect.value);
  closePopup(popupConfirmation);
};

const selectEvent = (target) => {
  if (target.classList.contains('reserved')) {
    const [time, day] = target.dataset.id.split('-');
    const event = calendarData[time][day];
    popupConfirmation.querySelector('p').innerText = `Are you sure you want to delete "${event.title}" event?`;
    popupButton.dataset.id = target.dataset.id;
    openPopup(popupConfirmation);
  }
};

const showAdminInputs = () => {
  if (user.isAdmin) {
    openPopupButton.style.display = 'block';

    closePopupButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const popupActive = button.closest('.popup');
        hidePopupError();
        closePopup(popupActive);
      });
    });

    overlay.addEventListener('click', () => {
      const popupsActive = document.querySelectorAll('.popup_active');
      popupsActive.forEach((popupActive) => {
        closePopup(popupActive);
      });
    });

    openPopupButton.addEventListener('click', () => openPopup(popup));
    form.addEventListener('submit', retrieveFormValue);
    calendar.addEventListener('click', ({ target }) => selectEvent(target));
    popupButton.addEventListener('click', ({ target }) => removeEvent(target.dataset.id));
    timesSelectArr[0].selected = true;
  }
  renderCalendar('0');
};

const authorization = (event) => {
  event.preventDefault();
  const selectInput = event.target[0];
  const selectedValue = selectInput.options[selectInput.selectedIndex].value;

  user = users.find((user) => user.id === selectedValue);
  closePopup(popupLoginForm);

  showAdminInputs();
};

document.addEventListener('DOMContentLoaded', () => {
  popupLoginForm.addEventListener('submit', (event) => authorization(event));
  membersSelect.addEventListener('click', ({ target }) => renderCalendar(target.value));
  renderCalendar('6');
});
