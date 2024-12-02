class Button extends HTMLElement {
  static observedAttributes = ['disabled'];
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    this.button = document.createElement('input');
    this.button.setAttribute('type', 'button');
    this.button.value = this.getAttribute('label') ?? 'Submit';
    this.buttonWrapper = document.createElement('div');
    this.buttonWrapper.setAttribute('class', 'button-wrapper');
    this.buttonWrapper.appendChild(this.button);

    const style = document.createElement('style');
    style.textContent = `
      .button-wrapper {
        display: inline-block;
        border: 2px solid transparent;
        background-color: transparent;
        padding: 1px;
        border-radius: 4px;
      }

      .button-wrapper:focus-within {
        border-color: rgb(var(--color-brave));
      }

      input[type="button"] {
        display: inline-block;
        padding: var(--spacing-m) var(--spacing-l);
        background-color: rgb(var(--color-brave));
        border: none;
        border-radius: 4px;
        cursor: pointer;
        text-align: center;
        color: rgb(var(--color-light));
        transition: all 0.3s;
      }

      input[type="button"]:hover:not([disabled]) {
        background-color: rgb(var(--color-energized));
      }

      input[type="button"]:active:not([disabled]) {
        background-color: rgb(var(--color-balanced));
      }
      input[type="button"][disabled] {
        background-color: rgb(var(--color-stable));
        color: grey;
        cursor: not-allowed;
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(this.buttonWrapper);
  }

  connectedCallback() {
    this.addEventListener('click', this.handleClick);
  }

  handleClick() {
    const form = this.closest('form');
    if (form) {
      const submitEvent = new Event('submit', { cancelable: true });
      submitEvent.submitter = this.button;
      form.dispatchEvent(submitEvent);
    }
  }
}

customElements.define('rm-button', Button);
