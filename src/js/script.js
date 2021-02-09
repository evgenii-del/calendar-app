// const usersArr = [
//     {value: 1, label: 'John'},
//     {value: 2, label: 'Sam'},
//     {value: 3, label: 'Ann'},
//     {value: 4, label: 'Tommy'},
//     {value: 5, label: 'Hanna'},
//     {value: 6, label: 'Kenny'}
// ]
// const daysOfWeekArr = [
//     {value: 'Monday', label: 'Monday', selected: true},
//     {value: 'Tuesday', label: 'Tuesday'},
//     {value: 'Wednesday', label: 'Wednesday'},
//     {value: 'Thursday', label: 'Thursday'},
//     {value: 'Friday', label: 'Friday'}
// ]
const timesArr = [10, 11, 12, 13, 14, 15, 16, 17, 18];
const timesSelectArr = timesArr.map(el => new Object({value: el, label: `${el}:00`}));
timesSelectArr[0]["selected"] = true;
const createCalendarData = () => {
    const obj = {};
    timesArr.forEach(time => {
        obj[time] = {
            "Monday": {},
            "Tuesday": {},
            "Wednesday": {},
            "Thursday": {},
            "Friday": {}
        }
    })
    return obj;
}
const calendarData = createCalendarData();
// Remove
calendarData["12"] = {
    "Monday": {
        id: "12-Monday",
        participants: ["1", "3"],
        title: "Ciclum task",
        color: "yellow",
        reserved: true
    },
    "Tuesday": {},
    "Wednesday": {},
    "Thursday": {},
    "Friday": {}
}
calendarData["14"] = {
    "Monday": {},
    "Tuesday": {},
    "Wednesday": {},
    "Thursday": {},
    "Friday": {
        id: "14-Friday",
        participants: ["1", "2", "5"],
        title: "Insurance",
        color: "green",
        reserved: true
    }
}
// Remove
const openPopupButton = document.querySelector(".js-open-popup");
const closePopupButtons = document.querySelectorAll(".js-close-popup");
const popup = document.querySelector(".js-popup");
const overlay = document.querySelector(".js-overlay");
// const membersChoice = document.querySelector('.js-members');
// const daysChoice = document.querySelector('.js-days');
// const timesChoice = document.querySelector('.js-times');
// const participantsChoice = document.querySelector('.js-participants');
// const membersSelect = document.querySelector(".js-members");
const popupError = document.querySelector(".js-popup_error");
const calendar = document.querySelector(".js-calendar");
const popupConfirmation = document.querySelector(".js-popup_confirmation");
const popupButton = document.querySelector(".js-popup__btn");
const forms = document.forms;
const form = forms[0];

const togglePopup = popup => {
    popup.classList.toggle("popup_active");
    overlay.classList.toggle("overlay_active");
}

const isRadio = type => ["radio"].includes(type);
const titleValidation = title => title.length > 3;
const timeValidation = (time, day) => !calendarData[time][day].reserved;
const participantsValidation = participants => participants.length;

const addNewMeet = values => {
    const {times, days, title, colors: color, participants} = values;

    calendarData[times][days] = {
        id: `${times}-${days}`,
        participants,
        title,
        color,
        reserved: true
    }

    renderCalendar();
}

const showPopupError = () => popupError.classList.add("popup_active")
const hidePopupError = () => popupError.classList.remove("popup_active")

const formValidation = values => {
    const {times, days, title, participants} = values;

    if (timeValidation(times, days) && titleValidation(title) && participantsValidation(participants)) {
        addNewMeet(values);
        togglePopup(popup);
        hidePopupError();
        form.reset();
    } else {
        showPopupError();
    }
}

const retrieveFormValue = event => {
    event.preventDefault();
    const values = {};

    for (let field of form) {
        const {name} = field;

        if (name) {
            const {type, value} = field;

            if (isRadio(type)) {
                if (field.checked) {
                    values[name] = value;
                }
            } else if (name === "participants") {
                const select = document.querySelector(".js-participants");
                values["participants"] = [...select.options].map(option => option.value);
            } else {
                values[name] = value;
            }
        }
    }
    formValidation(values);
}

const removeEvent = id => {
    const [time, day] = id.split("-");
    calendarData[time][day] = {};
    renderCalendar("0");
    togglePopup(popupConfirmation);
}

const selectEvent = target => {
    if (target.classList.contains('reserved')) {
        const [time, day] = target.dataset.id.split("-");
        const event = calendarData[time][day];
        popupConfirmation.querySelector("p").innerText = `Are you sure you want to delete "${event.title}" event?`;
        popupButton.dataset.id = target.dataset.id;
        togglePopup(popupConfirmation);
    }
}

const createBlock = (data, selectedParticipant) => {
    const {color, title, participants, reserved, id} = data;
    const block = document.createElement("div");

    if (participants && participants.includes(selectedParticipant) || selectedParticipant === "0" && reserved) {
        block.className = `calendar__item reserved ${color}`;
        block.dataset.id = id;
        block.innerHTML = `<p class="calendar__item-text">${title}</p>`;
    } else {
        block.className = "calendar__item";
    }

    return block;
}

const renderCalendar = selectedParticipant => {
    const fragment = document.createDocumentFragment();
    calendar.innerHTML = "";
    Object.values(calendarData).forEach(time => {
        Object.values(time).forEach(day => {
            const block = createBlock(day, selectedParticipant);
            fragment.appendChild(block);
        })
    })
    calendar.appendChild(fragment);
}

document.addEventListener('DOMContentLoaded', () => {
    closePopupButtons.forEach(button => {
        button.addEventListener("click", () => {
            const popup = button.closest(".popup");
            togglePopup(popup);
        })
    })

    overlay.addEventListener("click", () => {
        const popup = document.querySelector(".popup_active");
        togglePopup(popup);
    });

    form.addEventListener('submit', retrieveFormValue);
    openPopupButton.addEventListener("click", () => togglePopup(popup));
    calendar.addEventListener("click", ({target}) => selectEvent(target));
    popupButton.addEventListener("click", ({target}) => removeEvent(target.dataset.id));

    renderCalendar("0");
})

for (const option of document.querySelectorAll(".custom-option")) {
    option.addEventListener('click', function ({target}) {
        if (!this.classList.contains('selected')) {
            if (this.classList.contains('option-member')) {
                renderCalendar(target.dataset.value);
            }
            this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
            this.classList.add('selected');
            this.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = this.textContent;
        }
    })
}

document.querySelectorAll('.custom-select-wrapper').forEach(select => select.addEventListener('click', function () {
    this.querySelector('.custom-select').classList.toggle('open');
}))

window.addEventListener('click', ({target}) => {
    const select = document.querySelector('.custom-select')
    if (!select.contains(target)) select.classList.remove('open');
});
