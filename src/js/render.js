const calendar = document.querySelector('.js-calendar');

const createBlock = (data, selectedParticipant, isAdminParam) => {
  const { color, title, participants, reserved, date } = data;
  const block = document.createElement('div');
  const isParticipantsValid =
    participants && participants.includes(selectedParticipant);
  const defaultValidation = selectedParticipant === 'all' && reserved;

  if (isParticipantsValid || defaultValidation) {
    block.className = `calendar__item ${color} ${
      isAdminParam ? 'reserved' : ''
    }`;
    block.dataset.id = date;
    block.innerHTML = `<p class='calendar__item-text'>${title}</p>`;
  } else {
    block.className = 'calendar__item';
  }
  return block;
};

const renderCalendar = (calendarData, selectedParticipant, isAdminParam) => {
  const fragment = document.createDocumentFragment();
  calendar.innerHTML = '';
  Object.values(calendarData).forEach((time) => {
    Object.values(time).forEach((day) => {
      const data = day.data || {};
      const block = createBlock(data, selectedParticipant, isAdminParam);
      fragment.appendChild(block);
    });
  });
  calendar.appendChild(fragment);
};

export default renderCalendar;
