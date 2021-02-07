const usersArr = [
    {value: 1, label: 'John'},
    {value: 2, label: 'Sam'},
    {value: 3, label: 'Ann'},
    {value: 4, label: 'Tommy'},
    {value: 5, label: 'Hanna'},
    {value: 6, label: 'Kenny'}
]
const daysOfWeekArr = [
    {value: 'Monday', label: 'Monday', selected: true},
    {value: 'Tuesday', label: 'Tuesday'},
    {value: 'Wednesday', label: 'Wednesday'},
    {value: 'Thursday', label: 'Thursday'},
    {value: 'Friday', label: 'Friday'}
]
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

const openPopupButtons = document.querySelectorAll(".js-open-popup");
const closePopupButtons = document.querySelectorAll(".js-close-popup");
const popup = document.querySelector(".js-popup");
const overlay = document.querySelector(".js-overlay");


const togglePopup = popup => {
    popup.classList.toggle("popup_active");
    overlay.classList.toggle("overlay_active");
}


const defaultSelect = () => {
    const element = document.querySelector('.js-members');
    const choices = new Choices(element, {
        searchEnabled: false,
        itemSelectText: ""
    });
    choices.setChoices(
        [{value: 0, label: 'All members', selected: true}, ...usersArr]
    );

    const daysChoice = document.querySelector('.js-days');
    const choices1 = new Choices(daysChoice, {
        searchEnabled: false,
        itemSelectText: ""
    });

    choices1.setChoices([...daysOfWeekArr]);

    const timesChoice = document.querySelector('.js-times');
    const choices2 = new Choices(timesChoice, {
        searchEnabled: false,
        searchResultLimit: 5,
        itemSelectText: ""
    });

    choices2.setChoices([...timesSelectArr]);

    const participantsChoice = document.querySelector('.js-participants');
    const choices3 = new Choices(participantsChoice, {
        searchEnabled: false,
        searchResultLimit: 5,
        itemSelectText: ""
    });

    choices3.setChoices([...usersArr]);
}


const forms = document.forms;
const form = forms[0];

const isRadio = type => ["radio"].includes(type);
const titleValidation = title => title.length > 3;
const timeValidation = (time, day) => !calendarData[time][day].reserved;
const participantsValidation = participants => participants.length;

const addNewMeet = values => {
    const {times, days, title, colors, participants} = values;

    calendarData[times][days] = {
        id: `${times}-${days}`,
        participants,
        title,
        color: colors,
        reserved: true
    }

    renderCalendar();
}

const popupError = document.querySelector(".js-popup_error");

const showPopupError = () => {
    popupError.classList.add("popup_active");
}

const hidePopupError = () => {
    popupError.classList.remove("popup_active");
}

const formValidation = values => {
    const {times, days, title, participants} = values;

    if (timeValidation(times, days) && titleValidation(title) && participantsValidation(participants)) {
        addNewMeet(values);
        togglePopup(popup);
        hidePopupError();
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
            } else {
                if (name === "participants") {
                    const select = document.querySelector(".js-participants");
                    values["participants"] = [...select.options].map(option => option.value);
                } else {
                    values[name] = value;
                }
            }
        }
    }
    formValidation(values);
}


const membersSelect = document.querySelector(".js-members");
const calendar = document.querySelector(".js-calendar");

const popupConfirmation = document.querySelector(".js-popup_confirmation");

const removeEvent = id => {
    const [time, day] = id.split("-");
    calendarData[time][day] = {};
    renderCalendar(0);
}

const selectEvent = target => {
    if (target.classList.contains('calendar__item')) {
        const [time, day] = target.dataset.id.split("-");
        const event = calendarData[time][day];
        popupConfirmation.querySelector("p").innerText = `Are you sure you want to delete "${event.title}" event?`;
        togglePopup(popupConfirmation);
    }
}

calendar.addEventListener("click", ({target}) => selectEvent(target));

const createBlock = (data, selectedParticipant) => {
    const {reserved, color, title, participants, id} = data;
    const block = document.createElement("div");

    if (+selectedParticipant && participants) {
        if (participants.includes(selectedParticipant)) {
            block.className = `calendar__item reserved ${color}`;
            block.dataset.id = id;
            block.innerHTML = `<p class="calendar__item-text">${title}</p>`;
        } else {
            block.className = "calendar__item";
            block.innerHTML = `<p class="calendar__item-text">Plan</p>`;
        }
        return block;
    }

    if (reserved) {
        block.className = `calendar__item reserved ${color}`;
        block.dataset.id = id;
        block.innerHTML = `<p class="calendar__item-text">${title}</p>`;
    } else {
        block.className = "calendar__item";
        block.innerHTML = `<p class="calendar__item-text">Plan</p>`;
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
    openPopupButtons.forEach(button => {
        button.addEventListener("click", () => {
            togglePopup(popup);
        })
    })

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

    membersSelect.addEventListener("change", ({target}) => renderCalendar(target.value));

    defaultSelect();
    renderCalendar("0");
})
