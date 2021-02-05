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

const timeArr = [
    {value: 10, label: '10:00', selected: true},
    {value: 11, label: '11:00'},
    {value: 12, label: '12:00'},
    {value: 13, label: '13:00'},
    {value: 14, label: '14:00'},
    {value: 15, label: '15:00'},
    {value: 16, label: '16:00'},
    {value: 17, label: '17:00'},
    {value: 18, label: '18:00'}
]

const calendarData = {
    10: {
        "Monday": {},
        "Tuesday": {},
        "Wednesday": {},
        "Thursday": {},
        "Friday": {}
    },
    11: {
        "Monday": {
            participants: [1, 3],
            title: "Ciclum task",
            color: "yellow",
            reserved: true
        },
        "Tuesday": {},
        "Wednesday": {},
        "Thursday": {},
        "Friday": {}
    },
    12: {
        "Monday": {},
        "Tuesday": {},
        "Wednesday": {},
        "Thursday": {},
        "Friday": {
            participants: [1, 2, 5],
            title: "Insurance",
            color: "green",
            reserved: true
        }
    },
    13: {
        "Monday": {},
        "Tuesday": {},
        "Wednesday": {},
        "Thursday": {},
        "Friday": {}
    },
    14: {
        "Monday": {},
        "Tuesday": {},
        "Wednesday": {},
        "Thursday": {},
        "Friday": {}
    },
    15: {
        "Monday": {},
        "Tuesday": {},
        "Wednesday": {},
        "Thursday": {},
        "Friday": {}
    },
    16: {
        "Monday": {},
        "Tuesday": {},
        "Wednesday": {},
        "Thursday": {},
        "Friday": {}
    },
    17: {
        "Monday": {},
        "Tuesday": {},
        "Wednesday": {},
        "Thursday": {},
        "Friday": {}
    },
    18: {
        "Monday": {},
        "Tuesday": {},
        "Wednesday": {},
        "Thursday": {},
        "Friday": {}
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

openPopupButtons.forEach(button => {
    button.addEventListener("click", () => {
        togglePopup(popup);
    })
})

closePopupButtons.forEach(button => {
    button.addEventListener("click", () => {
        togglePopup(popup);
    })
})

overlay.addEventListener("click", () => {
    togglePopup(popup);
})


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

    choices2.setChoices([...timeArr]);

    const participantsChoice = document.querySelector('.js-participants');
    const choices3 = new Choices(participantsChoice, {
        searchEnabled: false,
        searchResultLimit: 5,
        itemSelectText: ""
    });

    choices3.setChoices([...usersArr]);
}

defaultSelect();


const forms = document.forms;
const form = forms[0];

const isRadio = type => ["radio"].includes(type);

const titleValidation = title => title.length > 3;
const timeValidation = (time, day) => !calendarData[time][day].reserved;
const participantsValidation = participants => participants.length;

const addNewMeet = values => {
    const {times, days, title, colors, participants} = values;

    calendarData[times][days] = {
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

form.addEventListener('submit', retrieveFormValue);

const membersSelect = document.querySelector(".js-members");

membersSelect.addEventListener("change", ({target}) => {
    console.log(target.value)
})

const calendar = document.querySelector(".js-calendar");

const createBlock = data => {
    const {reserved, color, title} = data;
    const block = document.createElement("div");
    if (reserved) {
        block.className = `calendar__item reserved ${color}`;
        block.innerHTML = `<p class="calendar__item-text">${title}</p>`;
    } else {
        block.className = "calendar__item";
        block.innerHTML = `<p class="calendar__item-text">Plan</p>`;
    }
    return block;
}

const renderCalendar = () => {
    const fragment = document.createDocumentFragment();
    calendar.innerHTML = "";
    Object.values(calendarData).forEach(time => {
        Object.values(time).forEach(day => {
            const block = createBlock(day);
            fragment.appendChild(block);
        })
    })
    calendar.appendChild(fragment);
}

renderCalendar(calendarData);
