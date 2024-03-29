const webroukCustomNumberTemplate = document.createElement("template");
webroukCustomNumberTemplate.innerHTML = `
  <style>
    :host * {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
  </style>

  <div class="webroukNumber" part="root">
    <input type="text" class="webroukNumber__number" part="input">
    <button class="webroukNumber__btn webroukNumber__btn--down" part="btn btn-down">-</button>
    <button class="webroukNumber__btn webroukNumber__btn--up" part="btn btn-up">+</button>

    <slot></slot>
  </div>
`;

class WebroukCustomNumber extends HTMLElement {

  _min;
  _max;
  _step;
  _value;
  _disabled;

  _number;
  _downBtn;
  _upBtn;
  _input;

  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(webroukCustomNumberTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    this._min       = +this.getAttribute("min") || 0;
    this._max       = +this.getAttribute("max") || null;
    this._step      = +this.getAttribute("step") || 1;
    this._value     = +this.getAttribute("value") || (this._min || 0);
    this._percent   = this.getAttribute("percent") || "false";
    this._disabled  = this.getAttribute("disabled") || "false";

    this._number    = this.shadowRoot.querySelector(".webroukNumber__number");
    this._upBtn     = this.shadowRoot.querySelector(".webroukNumber__btn--up");
    this._downBtn   = this.shadowRoot.querySelector(".webroukNumber__btn--down");
    this._input     = this.shadowRoot.querySelector("slot").assignedNodes().find(el => el.nodeName === "INPUT");

    this._numberVal(this._value);
    if (this._disabled === "true") {
      this._number.disabled = true;
      this._upBtn.disabled = true;
      this._downBtn.disabled = true;
    }

    this._number.addEventListener("keypress", this._onlyNumberKey.bind(this));
    this._number.addEventListener("paste", this._onlyNumberPaste.bind(this));
    this._number.addEventListener("input", this._onDeleteContent.bind(this));
    this._number.addEventListener("blur", this._onInputBlur.bind(this));
    this._downBtn.addEventListener("click", this.decrease.bind(this));
    this._upBtn.addEventListener("click", this.increase.bind(this));
  }

  disconnectedCallback() {
    this._number.removeEventListener("keypress", this._onlyNumberKey);
    this._number.removeEventListener("paste", this._onlyNumberPaste);
    this._number.removeEventListener("input", this._onDeleteContent);
    this._number.removeEventListener("blur", this._onInputBlur);
    this._upBtn.removeEventListener("click", this.increase);
    this._downBtn.removeEventListener("click", this.decrease);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === null || oldVal === newVal) { return; }

    if (name === "value") {
      this._numberVal(newVal);
    }
  }

  static get observedAttributes() {
    return ["value"]
  }

  decrease() {
    if (this._numberVal(null, true) > this._min) {
      const difference = this._numberVal(null, true) - this._min;
      this._numberVal(this._numberVal(null, true) - (difference < this._step ? difference : this._step));
      this._onChangeValue();
    }
  }

  increase() {
    let addedVal = this._step;

    if (this._max) {
      if (this._numberVal(null, true) >= this._max) { return; }

      const difference = this._max - this._numberVal(null, true);
      addedVal = difference < this._step ? difference : this._step;
    }

    this._numberVal(this._numberVal(null, true) + addedVal);
    this._onChangeValue();
  }

  _numberVal(newVal, getNumWithoutPercent = false) {
    if (newVal !== undefined && newVal !== null) {
      if (this._percent === "true") {
        this._number.value = `${newVal}%`;
      } else {
        this._number.value = +newVal;
      }
    } else {
      if (this._percent === "true") {
        if (getNumWithoutPercent) {
          return +this._number.value.replace("%", "");
        } else {
          return `${this._number.value}%`;
        }
      } else {
        return +this._number.value;
      }
    }
  }

  _onlyNumberKey(e) {
    // Only ASCII character in that range allowed
    const ASCIICode = e.which ? e.which : e.keyCode;

    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) {
      setTimeout(() => this._number.value = this._number.value.replace(/\D/g, ''));
      return;
    }

    setTimeout(() => this._onChangeValue());
  }

  _onlyNumberPaste() {
    setTimeout(() => {
      const characters = this._numberVal();

      setTimeout(() => {
        if (!(/^\d+$/.test(characters))) {
          this._numberVal(this._number.value.replace(/\D/g, ''));
        } else {
          this._onChangeValue();
        }
      });
    });
  }

  _onDeleteContent(e) {
    if (e.inputType.startsWith("delete")) {
      this._onChangeValue();
    }
  }

  _onInputBlur() {
    if (this._max && this._numberVal(null, true) > this._max) {
      this._numberVal(this._max);
    } else if (this._min && this._numberVal(null, true) < this._min) {
      this._numberVal(this._min);
    }
  }

  _onChangeValue() {
    this._input.value = this._numberVal(null, true);
    this._input.dispatchEvent(new Event("change"));
    this._input.dispatchEvent(new Event("input"));
    if (this.closest("form")) {
      this.closest("form").dispatchEvent(new Event("change"));
      this.closest("form").dispatchEvent(new Event("input"));
    }
  }
}

window.customElements.define("webrouk-custom-number", WebroukCustomNumber);
