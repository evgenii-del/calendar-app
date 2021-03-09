import axios from 'axios';

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
let isAdmin = false;

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

export default class Server {
  constructor(url, system, entity) {
    if (typeof Server.instance === 'object') {
      return Server.instance;
    }
    this.calendarData = createCalendarData();
    this.fullUrl = `${url}${system}/${entity}`;
    Server.instance = this;
    return this;
  }

  async changeCalendarData(selectedUser = 'all') {
    const { data } = await this.fetchEvents();
    if (data) {
      data.forEach((item) => {
        const parsedData = JSON.parse(item.data);
        const [time, day] = parsedData.date.split('-');
        this.calendarData[time][day] = {
          id: item.id,
          data: parsedData,
        };
      });
    }
    renderCalendar(selectedUser, isAdmin);
  }

  async fetchEvents() {
    return await axios.get(this.fullUrl);
  }

  async createEvent(body) {
    return await axios.post(this.fullUrl, body);
  }

  async removeEvent(date) {
    const [time, day] = date.split('-');
    const { id } = this.calendarData[time][day];
    this.calendarData[time][day] = {};

    return await axios.delete(`${this.fullUrl}/${id}`);
  }
}

const serverInstance = new Server('http://158.101.166.74:8080/api/data/', 'evgenii_khasanov', 'events');

class EventEmitter {
  constructor() {
    this.events = {};
  }

  subscribe(eventName, fn) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(fn);
  }

  emit(eventName, data) {
    const event = this.events[eventName];
    if (event) {
      event.forEach((fn) => {
        fn.call(null, data);
      });
    }
  }
}

const ee = new EventEmitter();

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

const userNames = ['John', 'Sam', 'Ann', 'Thomas'];
const users = [...userNames.map((name, index) => new User(index + 1, name)), new Admin(5, 'Eve')];

const createBlock = (data, selectedParticipant, isAdminParam) => {
  const {
    color, title, participants, reserved, date,
  } = data;
  const block = document.createElement('div');
  const participantsValidation = participants && participants.includes(selectedParticipant);
  const defaultValidation = selectedParticipant === 'all' && reserved;

  if (participantsValidation || defaultValidation) {
    block.className = `calendar__item ${color} ${isAdminParam ? 'reserved' : ''}`;
    block.dataset.id = date;
    block.innerHTML = `<p class="calendar__item-text">${title}</p>`;
  } else {
    block.className = 'calendar__item';
  }
  return block;
};

const renderCalendar = (selectedParticipant, isAdminParam) => {
  const fragment = document.createDocumentFragment();
  calendar.innerHTML = '';
  Object.values(serverInstance.calendarData).forEach((time) => {
    Object.values(time).forEach((day) => {
      const data = day.data || {};
      const block = createBlock(data, selectedParticipant, isAdminParam);
      fragment.appendChild(block);
    });
  });
  calendar.appendChild(fragment);
};

const isRadio = (type) => ['radio'].includes(type);
const titleValidation = (title) => title.length >= 3;
const timeValidation = (time, day) => !serverInstance.calendarData[time][day].data;
const participantsValidation = (participants) => participants.length;

const formValidation = (values) => {
  const {
    times, days, title, color, participants,
  } = values;
  const isValid = timeValidation(times, days) && titleValidation(title)
        && participantsValidation(participants);

  if (isValid) {
    const event = {
      date: `${times}-${days}`,
      reserved: true,
      participants,
      title,
      color,
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
      values.participants = [...field.options].filter((x) => x.selected).map((x) => x.value);
    } else if (isRadio(type)) {
      if (field.checked) {
        values[name] = value;
      }
    } else {
      values[name] = value;
    }
  });

  return values;
};

const selectEvent = (target) => {
  if (target.classList.contains('reserved')) {
    const [time, day] = target.dataset.id.split('-');
    const event = serverInstance.calendarData[time][day].data;
    popupConfirmation.querySelector('p').innerText = `Are you sure you want to delete "${event.title}" event?`;
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
  popup.addEventListener('submit', (event) => {
    const values = retrieveFormValue(event);
    formValidation(values);
  });
  calendar.addEventListener('click', ({ target }) => selectEvent(target));
  popupButton.addEventListener('click', ({ target }) => ee.emit('event:remove-event', target.dataset.id));
  timesSelectArr[0].selected = true;

  ee.subscribe('event:remove-event', (data) => {
    serverInstance.removeEvent(data);
    closePopup(popupConfirmation);
    serverInstance.changeCalendarData(membersSelect.value);
  });

  ee.subscribe('event:create-event', (data) => {
    serverInstance.createEvent(data);
    popup.reset();
    hidePopupError();
    closePopup(popup);
    serverInstance.changeCalendarData(membersSelect.value);
  });
};

const authorization = (event) => {
  event.preventDefault();
  isAdmin = users.find(({ id }) => id === +authForm.value).isAdmin;
  closePopup(popupLoginForm);

  if (isAdmin) showAdminInputs();
  renderCalendar('all', isAdmin);
};

document.addEventListener('DOMContentLoaded', () => {
  ee.subscribe('event:fetch-events', () => serverInstance.changeCalendarData());

  popupLoginForm.addEventListener('submit', (event) => authorization(event));
  membersSelect.addEventListener('click', ({ target }) => renderCalendar(target.value, isAdmin));
  ee.emit('event:fetch-events');
});
