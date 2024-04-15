import toast from "../common/toast.js";
import { fadeIn, fadeOut } from "../common/fade.js";

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
        toast(`${field} is required.`, "red");
      }
    });

    secondaryBtn.addEventListener("click", () => {
      this.hide();
    });
  };
}

export default Modal;
