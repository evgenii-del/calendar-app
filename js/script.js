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


const meetings = document.querySelectorAll(".planed");


meetings.forEach(o => {
    o.addEventListener("click", () => {
        console.log(this);
    })
})


const defaultSelect = () => {
    const element = document.querySelector('.js-members');
    const choices = new Choices(element, {
        searchEnabled: false,
        itemSelectText: ""
    });
    choices.setChoices(
        [
            {value: 0, label: 'All members', selected: true},
            {value: 1, label: 'John'},
            {value: 2, label: 'Sam'}
        ]
    );

    const daysChoice = document.querySelector('.js-days');
    const choices1 = new Choices(daysChoice, {
        searchEnabled: false,
        itemSelectText: ""
    });

    choices1.setChoices(
        [
            {value: 0, label: 'Monday', selected: true},
            {value: 1, label: 'Tuesday'},
            {value: 2, label: 'Wednesday'},
            {value: 3, label: 'Thursday'},
            {value: 4, label: 'Friday'}
        ]
    );

    const timesChoice = document.querySelector('.js-times');
    const choices2 = new Choices(timesChoice, {
        searchEnabled: false,
        searchResultLimit: 5,
        itemSelectText: ""
    });

    choices2.setChoices(
        [
            {value: 0, label: '10:00', selected: true},
            {value: 1, label: '11:00'},
            {value: 2, label: '12:00'},
            {value: 3, label: '13:00'},
            {value: 4, label: '14:00'},
            {value: 5, label: '15:00'},
            {value: 6, label: '16:00'},
            {value: 7, label: '17:00'},
            {value: 8, label: '18:00'}
        ]
    );

    const participantsChoice = document.querySelector('.js-participants');
    const choices3 = new Choices(participantsChoice, {
        searchEnabled: false,
        searchResultLimit: 5,
        itemSelectText: "",
        placeholderValue: "asd"
    });

    choices3.setChoices(
        [
            {value: 0, label: 'John'},
            {value: 1, label: 'Sam'},
            {value: 2, label: 'Ann'},
            {value: 3, label: 'Tommy'},
            {value: 4, label: 'Hanna'},
            {value: 5, label: 'Kenny'}
        ]
    );
}

defaultSelect();
