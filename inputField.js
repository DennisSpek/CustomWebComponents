class InputField extends HTMLElement {
  static formAssociated = true;
  static get observedAttributes() {
    return [
      'type',
      'disabled',
      'error',
      'label',
      'helper',
      'name',
      'value',
      'success',
    ];
  }

  constructor() {
    super();
    this._internals = this.attachInternals();
    const shadow = this.attachShadow({ mode: 'open' });

    // Creating wrapper for component
    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'wrapper');

    this.label = document.createElement('label');

    // Creating input wrapper to hold input and icon
    this.inputWrapper = document.createElement('div');
    this.inputWrapper.setAttribute('class', 'input-wrapper');
    this.inputWrapper.setAttribute('tabindex', '0');

    this.input = document.createElement('input');
    this.input.setAttribute('name', this.getAttribute('name') || '');
    this.input.setAttribute('value', this.getAttribute('value') || '');

    this.helper = document.createElement('span');
    this.helper.setAttribute('class', 'helper-text');
    this.errorElement = document.createElement('span');
    this.errorElement.setAttribute('class', 'error-message');

    // Creating slots for icons
    const leftIconSlot = document.createElement('slot');
    leftIconSlot.setAttribute('name', 'icon-left');
    leftIconSlot.classList.add('icon');

    const rightIconSlot = document.createElement('slot');
    rightIconSlot.setAttribute('name', 'icon-right');
    rightIconSlot.classList.add('icon');

    const style = document.createElement('style');
    style.textContent = `
      label {
        display: block;
        font-weight: bold;
      }

      .input-wrapper {
        display: flex;
        gap: var(--spacing-m);
        align-items: center;
        border: 3px solid rgb(var(--color-stable));
        border-radius: var(--radius-s);
        padding: var(--spacing-m) var(--spacing-l);
        transition: border-color 0.3s;
        margin: var(--spacing-s) 0;
      }

      .input-wrapper:focus-within:not(.disabled) {
        border-color: rgb(var(--color-royal));
        outline: none;

        .icon {
          color: rgb(var(--color-royal));
        }
      }
      
      .input-wrapper:hover:not(.disabled, .error):not(:focus-within) {
        border-color: rgb(var(--color-balanced));

        .icon {
          color: rgb(var(--color-balanced));
        }
      }

      .input-wrapper.disabled {
        background-color: rgb(var(--color-stable)  / 50%);
        cursor: not-allowed;
      }

      input {
        all: unset;
        flex: 1;
      }

      .helper-text {
        font-size: 12px;
        display: block;
      }

      .error-message {
        color: rgb(var(--color-assertive));
        font-size: 12px;
        display: none;
      }

      .input-wrapper.error {
        border-color: rgb(var(--color-assertive));

        .icon, input, input::placeholder {
          color: rgb(var(--color-assertive));
        }
      }

      .input-wrapper.success {
        border-color: rgb(var(--color-positive));

        .icon, input, input::placeholder {
          color: rgb(var(--color-positive));
        }
      }
      .helper-text.success {
        color: rgb(var(--color-positive));
      }

      .icon {
        pointer-events: none;
        color: rgb(var(--color-stable));
        transition: color 0.3s;
      }
    `;

    wrapper.appendChild(this.label);
    wrapper.appendChild(this.inputWrapper);
    this.inputWrapper.appendChild(leftIconSlot);
    this.inputWrapper.appendChild(this.input);
    this.inputWrapper.appendChild(rightIconSlot);
    wrapper.appendChild(this.helper);
    wrapper.appendChild(this.errorElement);
    shadow.appendChild(style);
    shadow.appendChild(wrapper);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'type':
        this.updateType(newValue);
        break;
      case 'disabled':
        this.input.disabled = newValue !== null;
        this.inputWrapper.classList.toggle('disabled', newValue !== null);
        break;
      case 'error':
        if (newValue !== 'false') {
          this.setError(newValue);
        }
        break;
      case 'label':
        this.label.textContent = newValue;
        break;
      case 'helper':
        this.helper.textContent = newValue;
        break;
      case 'name':
        this.input.setAttribute('name', newValue);
        break;
      case 'value':
        this.input.value = newValue;
        this._internals.setFormValue(newValue);
        break;
      case 'success':
        this.setSuccess(newValue);
        break;
    }
  }

  connectedCallback() {
    this._internals.setFormValue(this.value);
    // Click on label puts focus on input
    this.label.addEventListener('click', () => this.input.focus());
    // Clear error
    this.input.addEventListener('focus', () => this.clearError());
    // puts focus on input when clicking on the wrapper
    this.inputWrapper.addEventListener('focus', () => this.input.focus());

    this.input.addEventListener('input', () => {
      this.value = this.input.value;
    });
  }

  updateType(type) {
    switch (type) {
      case 'hidden':
        this.input.type = 'hidden';
        this.inputWrapper.setAttribute('style', 'display: none;');
        break;
      case 'name':
        this.input.type = 'text';
        this.input.placeholder = 'Placeholder';
        this.label.textContent = 'Placeholder';
        this.helper.textContent = 'Placeholder';
        break;
      case 'email':
        this.input.type = 'email';
        this.input.placeholder = 'Enter your email';
        this.label.textContent = 'Name';
        break;
      default:
        this.input.type = 'text';
    }
  }

  setSuccess(success) {
    if (success === 'true') {
      this.inputWrapper.classList.add('success');
      this.helper.classList.add('success');
    } else {
      this.inputWrapper.classList.remove('success');
      this.helper.classList.remove('success');
    }
  }

  setError(message) {
    if (message) {
      this.errorElement.textContent = message;
      this.errorElement.style.display = 'block';
      this.helper.style.display = 'none';
      this.inputWrapper.classList.add('error');
    } else {
      this.errorElement.textContent = '';
      this.errorElement.style.display = 'none';
      this.helper.style.display = 'block';
      this.inputWrapper.classList.remove('error');
    }
  }

  clearError() {
    this.setError('');
  }

  get error() {
    return this.getAttribute('error');
  }

  set error(val) {
    this.setAttribute('error', val);
  }

  get success() {
    return this.getAttribute('success');
  }

  set success(val) {
    this.setAttribute('success', val);
  }

  get name() {
    return this.getAttribute('name');
  }

  set name(val) {
    this.setAttribute('name', val);
  }

  get value() {
    return this.input.value;
  }

  set value(val) {
    this.setAttribute('value', val);
    this._internals.setFormValue(val); // Sync value with form submission
  }
}

customElements.define('rm-input-field', InputField);
