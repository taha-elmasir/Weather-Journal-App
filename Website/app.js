"use strict";

/* Global Varibles */
const container = document.querySelector(".container");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const closeModal = document.querySelector(".close-modal");
const message = document.querySelector(".message");
const generate = document.querySelector("#generate");
const tooltip = document.querySelector(".tooltip");
const zipCodeValue = document.querySelector("#zip");
const countryCodeValue = document.querySelector("#country-code");
const feelingsElement = document.querySelector("#feelings");
const cityElement = document.querySelector("#city");
const date = document.querySelector("#date");
const tempElement = document.querySelector("#temp");
const content = document.querySelector("#content");

// API Key
const apiKey = "5d35d587afe376bb194b877d64642e50&units=imperial";

// Create a new date instance
let d = new Date();
let newDate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;

// Set the opacity of the container to 1
setTimeout(() => {
  container.style.opacity = 1;
}, 800);

// Show tooltip
tooltip.addEventListener("click", () => {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

// close tooltip
closeModal.addEventListener("click", function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
});

// Fetching API as soon as the generate button is clicked
generate.addEventListener("click", () => {
  // Local Varibles
  const zipCode = zipCodeValue.value;
  const countryCode = countryCodeValue.value;
  const feelings = feelingsElement.value;

  // Fetching API
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},${countryCode}&appid=${apiKey}`
  )
    .then((res) => {
      // Handling errors manually
      if (!res.ok) throw new Error("Country or city not found");
      else
        message.style.display = "block"
          ? (message.style.display = "none")
          : (message.style.display = "none");
      return res.json();
    })
    .then((res) => {
      // Show current data if it was hidden
      cityElement.style.display =
        date.style.display =
        tempElement.style.display =
        content.style.display =
          "block";
      // Store data
      const city = res.name;
      const temp = res.main.temp.toFixed();

      // Send data to the server
      fetch("/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: city,
          date: newDate,
          temp: temp,
          feelings: feelings,
        }),
      })
        // take it agin from the server
        .then(() => {
          fetch("/returnData")
            .then((res) => res.json())
            .then((res) => {
              // Attach data to html elements
              cityElement.textContent = "City: " + res.city;
              date.textContent = "Date: " + res.date;
              tempElement.textContent = "temp: " + res.temp;
              feelingsElement.value !== ""
                ? (content.textContent = "Feelings: " + feelingsElement.value)
                : (content.textContent =
                    "Feelings: You didn't enter any feelings");
            });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      message.style.display = "block";
      message.textContent = err.message;
      // Hide previous data if any
      cityElement.style.display =
        date.style.display =
        tempElement.style.display =
        content.style.display =
          "none";
    });
});
