/// Toggle Menu
const btnOpenMenu = document.querySelector(".btn-open-menu");
const btnCloseMenu = document.querySelector(".btn-close-menu");
const aside = document.querySelector("aside");
const header = document.querySelector("header");
const main = document.querySelector("main");
const body = document.querySelector("body");

btnOpenMenu.addEventListener("click", (event) => {
  event.stopPropagation();

  aside.classList.remove("closed");
  body.classList.add("pointer-events-none", "overflow-hidden");
  aside.classList.add("pointer-events-auto");
});

btnCloseMenu.addEventListener("click", (event) => {
  aside.classList.add("closed");
  body.classList.remove("pointer-events-none", "overflow-hidden");
});

aside.addEventListener("click", (event) => {
  event.stopPropagation();
});

document.addEventListener("click", (event) => {
  aside.classList.add("closed");
  body.classList.remove("pointer-events-none", "overflow-hidden");
});

/// Toggle theme (dark mode)
const themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
const themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");
const themeToggleBtn = document.getElementById("theme-toggle");

// Change the icons inside the button based on previous settings
if (
  localStorage.getItem("color-theme") === "dark" ||
  (!("color-theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  themeToggleLightIcon.classList.remove("hidden");
} else {
  themeToggleDarkIcon.classList.remove("hidden");
}

themeToggleBtn.addEventListener("click", function () {
  // toggle icons inside button
  themeToggleDarkIcon.classList.toggle("hidden");
  themeToggleLightIcon.classList.toggle("hidden");

  // if set via local storage previously
  if (localStorage.getItem("color-theme")) {
    if (localStorage.getItem("color-theme") === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    }

    // if NOT set via local storage previously
  } else {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    }
  }
});

/// new task Modal
const newTaskModal = document.querySelector("#newTask");
function modalHandler(val) {
  if (val) {
    fadeIn(newTaskModal);
  } else {
    fadeOut(newTaskModal);
  }
}
function fadeOut(el) {
  el.style.opacity = 1;
  (function fade() {
    if ((el.style.opacity -= 0.1) < 0) {
      el.style.display = "none";
    } else {
      requestAnimationFrame(fade);
    }
  })();
}
function fadeIn(el, display) {
  el.style.opacity = 0;
  el.style.display = display || "flex";
  (function fade() {
    let val = parseFloat(el.style.opacity);
    if (!((val += 0.2) > 1)) {
      el.style.opacity = val;
      requestAnimationFrame(fade);
    }
  })();
}

/// Add new task to html
const content = document.querySelector("#content");
const submitFormBtn = document.querySelector("#submitFormBtn");
const cancelFormBtn = document.querySelector("#cancelFormBtn");
const closeFormBtn = document.querySelector("#closeFormBtn");
const formTask = document.querySelector("#newTaskForm");
const addNewTask = document.querySelector("#addNewTask");
const taskContainer = document.querySelector("#taskContainer");
let formInputs = formTask.querySelectorAll("input, select, textarea");

const actionBtn = (name, color, d) => {
  return `<a
  href="#"
  class="flex flex-row items-center text-${color}-600 font-medium"
  >
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="w-5 h-5"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="${d}"
    />
  </svg>
  
  ${name}</a
  >`;
};
const editBtn = actionBtn(
  "Edit",
  "green",
  "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
);
const deleteBtn = actionBtn(
  "Delete",
  "red",
  "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
);

const clearFields = (inputs) => {
  inputs.forEach((input) => {
    input.value = "";
  });
};

const closeModal = () => {
  content.style.display = "block";
  modalHandler();
  setTimeout(clearFields(formInputs), 1000);
};

const priorityLevel = (level) => {
  if (level === "Low") return "green";
  if (level === "Meduim") return "orange";
  if (level === "High") return "red";
};

const createTask = () => {
  const taskObj = {};
  let valid = true;

  formInputs.forEach((input) => {
    if (input.value === "" || input.value.trim() === "") valid = false;
    taskObj[input.id] = input.value;
  });

  valid ? fadeOut(newTaskModal) : "";
  content.style.display = "none";
  setTimeout(clearFields(formInputs), 1000);

  // const {
  //   title: title,
  //   description: description,
  //   date: date,
  //   priority: priority,
  // } = taskObj;

  // taskContainer.insertAdjacentHTML(
  //   "afterbegin",
  //   displayTask(title, description, date, priority)
  // );

  return taskObj;
};

const displayTask = (title, description, date, priority) => {
  let priorityClr = priorityLevel(priority);

  // if (priority === "Low") priorityClr = "green";
  // if (priority === "Meduim") priorityClr = "orange";
  // if (priority === "High") priorityClr = "red";

  console.log(priorityClr);
  return `<div
  class="cursor-pointer w-full border-l-8 border-${priorityClr}-600 bg-white shadow overflow-hidden sm:rounded-md mx-auto"
>
  <div class="px-4 py-5 sm:px-6">
    <div class="flex items-center justify-between">
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        ${title}
      </h3>
      <p class="text-sm font-medium text-gray-500">
        Priority: <span class="text-${priorityClr}-600">${priority}</span>
      </p>
    </div>
    <div class="mt-2 flex items-end justify-between">
      <div>
        <span class="text-xs text-gray-500 text-semibold"
          >Schelued: ${date}</span
        >
        <p class="mt-1 max-w-2xl text-md text-gray-600">
          ${description}
        </p>
      </div>
      <div class="flex flex-row gap-3">
        ${editBtn}
        ${deleteBtn}
      </div>
    </div>
  </div>
</div>`;
};

submitFormBtn.addEventListener("click", (event) => {
  //const task = createTask();
  const {
    title: title,
    description: description,
    date: date,
    priority: priority,
  } = createTask();

  taskContainer.insertAdjacentHTML(
    "afterbegin",
    displayTask(title, description, date, priority)
  );
});

cancelFormBtn.addEventListener("click", closeModal);

closeFormBtn.addEventListener("click", closeModal);

addNewTask.addEventListener("click", () => {
  aside.classList.add("closed");
  modalHandler(true);
});
