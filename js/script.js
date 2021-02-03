const selected = document.querySelector(".selected");
const optionsContainer = document.querySelector(".options-container");
const optionsList = document.querySelectorAll(".option");


selected.addEventListener("click", () => {
    optionsContainer.classList.toggle("active");
})

optionsList.forEach(o => {
    o.addEventListener("click", () => {
        selected.innerHTML = o.querySelector("label").innerHTML;
        optionsContainer.classList.remove("active");
    })
})

const openPopupButton = document.querySelector(".js-open-popup");
const closePopupButton = document.querySelector(".js-close-popup");
const popup = document.querySelector(".js-popup");
const overlay = document.querySelector(".js-overlay");


const togglePopup = () => {
    popup.classList.toggle("popup_active");
    overlay.classList.toggle("overlay_active");
}

openPopupButton.addEventListener("click", () => {
    togglePopup();
});

closePopupButton.addEventListener("click", () => {
    togglePopup();
});

overlay.addEventListener("click", () => {
    togglePopup();
})
