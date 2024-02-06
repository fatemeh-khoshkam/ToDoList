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

    primaryBtn.addEventListener("click", () => {
      this.onSuccess();
      this.hide();
    });

    secondaryBtn.addEventListener("click", () => {
      this.hide();
    });
  };
}

export default Modal;
