export const isRadio = (type) => ['radio'].includes(type);
export const titleValidation = (title) => title.length >= 3;
export const timeValidation = (calendar, time, day) =>
  !calendar[time][day].data;
export const participantsValidation = (participants) => participants.length;
