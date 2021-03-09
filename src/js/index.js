import Server from './server';
import EventEmitter from './eventEmitter';
import User from './user';
import Admin from './admin';
import renderCalendar from './render';
import { isRadio, titleValidation, timeValidation, participantsValidation } from './validation';

const popup = document.querySelector('.js-popup');
const popupError = document.querySelector('.js-popup_error');
const popupButton = document.querySelector('.js-popup__btn');
const openPopupButton = document.querySelector('.js-open-popup');
const closePopupButtons = document.querySelectorAll('.js-close-popup');
const popupConfirmation = document.querySelector('.js-popup_confirmation');
const overlay = document.querySelector('.js-overlay');
const calendar = document.querySelector('.js-calendar');
const membersSelect = document.querySelector('.js-members');
const authForm = document.querySelector('.js-auth-select');
const popupLoginForm = document.querySelector('.js-popup_login');
const timesArr = [10, 11, 12, 13, 14, 15, 16, 17, 18];
const timesSelectArr = timesArr.map((el) => ({ value: el, label: `${el}:00` }));
export const createCalendarData = () => {
  const obj = {};
  timesArr.forEach((time) => {
    obj[time] = {
      Monday: {},
      Tuesday: {},
      Wednesday: {},
      Thursday: {},
      Friday: {}
    };
  });
  return obj;
};
let isAdmin = false;

const calendarData = createCalendarData();

const userNames = ['John', 'Sam', 'Ann', 'Thomas'];
const users = [
  ...userNames.map((name, index) => new User(index + 1, name)),
  new Admin(5, 'Eve')
];

const serverInstance = new Server(
  'http://158.101.166.74:8080/api/data/',
  'evgenii_khasanov',
  'events'
);

const ee = new EventEmitter();

const changeCalendarData = async (selectedUser = 'all') => {
  const { data } = await serverInstance.fetchEvents();
  if (data) {
    data.forEach((item) => {
      const parsedData = JSON.parse(item.data);
      const [time, day] = parsedData.date.split('-');
      calendarData[time][day] = {
        id: item.id,
        data: parsedData
      };
    });
  }
  renderCalendar(calendarData, selectedUser, isAdmin);
};

const openPopup = (popupProp) => {
  popupProp.classList.add('popup_active');
  overlay.classList.add('overlay_active');
};

const closePopup = (popupProp) => {
  popupProp.classList.remove('popup_active');
  overlay.classList.remove('overlay_active');
};

const showPopupError = () => popupError.classList.add('popup_active');
const hidePopupError = () => popupError.classList.remove('popup_active');

const formValidation = (values) => {
  const { times, days, title, color, participants } = values;
  const isValid =
    timeValidation(calendarData, times, days) &&
    titleValidation(title) &&
    participantsValidation(participants);

  if (isValid) {
    const event = {
      date: `${times}-${days}`,
      reserved: true,
      participants,
      title,
      color
    };
    const data = JSON.stringify({ data: JSON.stringify(event) });

    ee.emit('event:create-event', data);
  } else {
    showPopupError();
  }
};

const retrieveFormValue = (event) => {
  event.preventDefault();
  const values = {};

  [...popup.elements].forEach((field) => {
    const { name, type, value } = field;

    if (name === 'participants') {
      values.participants = [...field.options]
        .filter((x) => x.selected)
        .map((x) => x.value);
    } else if (isRadio(type)) {
      if (field.checked) {
        values[name] = value;
      }
    } else {
      values[name] = value;
    }
  });

  formValidation(values);
};

const selectEvent = (target) => {
  if (target.classList.contains('reserved')) {
    const [time, day] = target.dataset.id.split('-');
    const event = calendarData[time][day].data;
    popupConfirmation.querySelector(
      'p'
    ).innerText = `Are you sure you want to delete "${event.title}" event?`;
    popupButton.dataset.id = target.dataset.id;
    openPopup(popupConfirmation);
  }
};

const showAdminInputs = () => {
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
  popup.addEventListener('submit', retrieveFormValue);
  calendar.addEventListener('click', ({ target }) => selectEvent(target));
  popupButton.addEventListener('click', ({ target }) =>
    ee.emit('event:remove-event', target.dataset.id)
  );
  timesSelectArr[0].selected = true;

  ee.subscribe('event:remove-event', (data) => {
    const [time, day] = data.split('-');
    const { id } = calendarData[time][day];
    calendarData[time][day] = {};
    serverInstance.removeEvent(id).then(() => {
      closePopup(popupConfirmation);
      changeCalendarData(membersSelect.value);
    });
  });

  ee.subscribe('event:create-event', (data) => {
    serverInstance.createEvent(data).then(() => {
      popup.reset();
      hidePopupError();
      closePopup(popup);
      changeCalendarData(membersSelect.value);
    });
  });
};

const authorization = (event) => {
  event.preventDefault();
  isAdmin = users.find(({ id }) => id === +authForm.value).isAdmin;
  closePopup(popupLoginForm);

  if (isAdmin) showAdminInputs();
  renderCalendar(calendarData, 'all', isAdmin);
};

document.addEventListener('DOMContentLoaded', () => {
  ee.subscribe('event:fetch-events', () => changeCalendarData());

  popupLoginForm.addEventListener('submit', (event) => authorization(event));
  membersSelect.addEventListener('click', ({ target }) =>
    renderCalendar(calendarData, target.value, isAdmin)
  );
  ee.emit('event:fetch-events');
});
