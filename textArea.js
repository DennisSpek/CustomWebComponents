class TextArea extends InputField {
  constructor() {
    super();

    const textarea = document.createElement('textarea');
    textarea.setAttribute('placeholder', 'Some dummy text');
    textarea.setAttribute('maxlength', '200');

    this.inputWrapper.replaceChild(textarea, this.input);
    this.input = textarea;

    const charCount = document.createElement('span');
    charCount.textContent = `0 / 200`;

    // Append the span to the rightIconSlot
    const rightIconSlot = this.inputWrapper.querySelector(
      'slot[name="icon-right"]'
    );
    rightIconSlot.appendChild(charCount);

    const style = document.createElement('style');

    style.textContent = `
      .input-wrapper textarea {
        all: unset;
        width: 100%;
      }
      .input-wrapper slot[name="icon-right"] {
        display: flex;
        align-self: end;
      }
      .input-wrapper slot[name="icon-right"] span {
        font-size: 12px;
        color: rgb(var(--color-stable));
        width: 50px;
      }
    `;

    this.shadowRoot.appendChild(style);
  }

  connectedCallback() {
    //Assigning value to form
    this._internals.setFormValue(this.value);
    this.input.addEventListener('input', () => {
      const charCount = this.inputWrapper.querySelector(
        'slot[name="icon-right"] span'
      );
      charCount.textContent = `${this.input.value.length} / 200`;

      //updating custom component value
      this.value = this.input.value;
    });

    this.input.addEventListener('focus', () => this.clearError());
  }
}

customElements.define('rm-text-area', TextArea);
