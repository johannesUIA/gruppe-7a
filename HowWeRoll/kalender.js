// Dette er javascripten til kalenderen
// Koden er inspirert av og hentet fra: https://github.com/portexe/VanillaCalendar/blob/master/script.js
let nav = 0;
let clicked = null;
let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [];

const calendar = document.getElementById("calendar");
const modalNewEvent = document.getElementById("modal-new-event");
const modalDeleteEvent = document.getElementById("modal-delete-event");
const backDrop = document.getElementById("modal-backdrop");
const inputEventTitle = document.getElementById("input-event-title");
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function openModal(date) {
  clicked = date;

  /* Gjør at det kommer opp en skriverute når man klikker på en dag i kalenderen. */
  const eventForDay = events.find((e) => e.date === clicked);

  if (eventForDay) {
    document.getElementById("text-event").innerText = eventForDay.title;
    modalDeleteEvent.style.display = "block";
  } else {
    modalNewEvent.style.display = "block";
  }

  backDrop.style.display = "block";
}

function load() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);

  document.getElementById("display-month").innerText = `${dt.toLocaleDateString(
    "no",
    {
      month: "long",
    }
  )} ${year}`;

  calendar.innerHTML = "";

  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement("div");
    daySquare.classList.add("day");

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;
      const eventForDay = events.find((e) => e.date === dayString);

      /* Gjør at ruten med dagens dato blir fremhevet. */
      if (i - paddingDays === day && nav === 0) {
        daySquare.id = "currentDay";
      }

      if (eventForDay) {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }

      daySquare.addEventListener("click", () => openModal(dayString));
    } else {
      daySquare.classList.add("padding");
    }

    calendar.appendChild(daySquare);
  }
}

function closeModal() {
  inputEventTitle.classList.remove("error");
  modalNewEvent.style.display = "none";
  modalDeleteEvent.style.display = "none";
  backDrop.style.display = "none";
  inputEventTitle.value = "";
  clicked = null;
  load();
}

function saveEvent() {
  if (inputEventTitle.value) {
    inputEventTitle.classList.remove("error");

    events.push({
      date: clicked,
      title: inputEventTitle.value,
    });

    localStorage.setItem("events", JSON.stringify(events));
    closeModal();
  } else {
    inputEventTitle.classList.add("error");
  }
}

function deleteEvent() {
  events = events.filter((e) => e.date !== clicked);
  localStorage.setItem("events", JSON.stringify(events));
  closeModal();
}

function initButtons() {
  document.getElementById("button-next").addEventListener("click", () => {
    nav++;
    load();
  });

  document.getElementById("button-previous").addEventListener("click", () => {
    nav--;
    load();
  });

  document.getElementById("button-save").addEventListener("click", saveEvent);
  document.getElementById("button-cancel").addEventListener("click", closeModal);
  document
    .getElementById("button-delete")
    .addEventListener("click", deleteEvent);
  document.getElementById("button-close").addEventListener("click", closeModal);
}

initButtons();
load();