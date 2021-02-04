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
        "Wednesday": {
            title: "OOP",
            color: "khaki",
            reserved: true
        },
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
        "Friday": {
            title: "Kottans homework",
            color: "red",
            reserved: true
        }
    }
}


const openPopupButtons = document.querySelectorAll(".js-open-popup");
const closePopupButtons = document.querySelectorAll(".js-close-popup");
const overlay = document.querySelector(".js-overlay");


const togglePopup = popup => {
    popup.classList.toggle("popup_active");
    overlay.classList.toggle("overlay_active");
}

openPopupButtons.forEach(button => {
    button.addEventListener("click", () => {
        const popup = document.querySelector(button.dataset.modalTarget);
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
    const popup = document.querySelector(".popup.popup_active");
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

const isCheckbox = type => ["checkbox"].includes(type);
const isRadio = type => ["radio"].includes(type);

const titleValidation = title => {
    return title.length > 3;
}

const timeValidation = (time, day) => {
    return !calendarData[time][day].reserved;
}

const addNewMeet = values => {
    const {times, days, title, colors} = values;

    calendarData[times][days] = {
        title,
        color: colors,
        reserved: true
    }

    renderCalendar();
}

const formValidation = values => {
    const {times, days, title} = values;
    console.log("time validation", timeValidation(times, days));
    console.log("title validation", titleValidation(title));
    addNewMeet(values);
}

const retrieveFormValue = event => {
    event.preventDefault();
    const values = {};

    for (let field of form) {
        const {name} = field;

        if (name) {
            const {type, checked, value} = field;

            if (isCheckbox(type)) {
                values[name] = checked;
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
    togglePopup();
}

form.addEventListener('submit', retrieveFormValue);

const membersSelect = document.querySelector(".js-members");
membersSelect.addEventListener("change", ({target}) => {
    console.log(target.value)
})

const calendar = document.querySelector(".js-calendar");

const renderCalendar = () => {
    let fragment = document.createDocumentFragment();
    calendar.innerHTML = "";

    Object.values(calendarData).forEach(time => {
        Object.values(time).forEach(day => {
            const block = document.createElement("div");

            if (day.reserved) {
                block.className = `calendar__item reserved ${day.color}`;
                block.innerHTML = `
                <p class="calendar__item-text">${day.title}</p>
                `;
            } else {
                block.className = "calendar__item";
                block.innerHTML = `
                <p class="calendar__item-text">Plan</p>
                `;
            }

            fragment.appendChild(block);
        })
    })

    calendar.appendChild(fragment);
}

renderCalendar(calendarData);
