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

// Returns a message notification
const messageUI = (txt, color) => {
  return `<div class="relative z-50 messageBox transition-opacity bg-${color}-100 border-t-4 border-${color}-600 rounded-b text-${color}-900 ml-3 mb-3 px-4 py-3 shadow-md" role="alert">
    <div class="flex">
      <div class="py-1"><svg class="fill-current h-6 w-6 text-${color}-600 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
      <div>
        <p class="font-bold">${txt}</p>
      </div>
    </div>
  </div>`;
};

// 1. Displays the notif message in HTML
// 2. Get the last message and remove all of them after 3 seconds
const displayMessage = (txt, color) => {
  const messageHTML = messageUI(txt, color);
  messagesContainer.insertAdjacentHTML("beforeend", messageHTML);

  setTimeout(function () {
    const messageBoxes = document.querySelectorAll(".messageBox");
    const lastMessageBox = messageBoxes[0];
    if (lastMessageBox) {
      lastMessageBox.remove();
    }
  }, 3000);
};

class Modal {
  constructor(dom) {
    this.dom = dom;
  }
  show = (callback) => {
    fadeIn(this.dom);
    this.onSuccess = callback;
  };
  hide = () => {
    fadeOut(this.dom);
  };
  init = () => {
    const primaryBtn = this.dom.querySelector(".primaryBtn");
    const secondaryBtn = this.dom.querySelector(".secondaryBtn");

    primaryBtn.addEventListener("click", (event) => {
      event.preventDefault();
      try {
        this.onSuccess();
        this.hide();
      } catch (field) {
        displayMessage(`${field} is required.`, "red");
      }
    });

    secondaryBtn.addEventListener("click", () => {
      this.hide();
    });
  };
}

export default Modal;
