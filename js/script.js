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
}

defaultSelect();
