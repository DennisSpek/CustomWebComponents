class PhoneField extends InputField {
  constructor() {
    super();
    this.input.setAttribute('type', 'tel');
    this.input.setAttribute('placeholder', 'Enter phone number');
    this.label.textContent = 'Phone number';
    this.helper.textContent = 'Please enter your number';
  }

  connectedCallback() {
    // Assigning value to form
    this._internals.setFormValue(this.value);
    this.input.addEventListener('focus', () => {
      if (this.input.value === '') {
        this.input.value = '+31 6 ';
      }
    });
    this.input.addEventListener('input', () => this.formatPhoneNumber());
    this.input.addEventListener('focus', () => this.clearError());
  }

  formatPhoneNumber() {
    const prefix = '+31 6 ';
    let value = this.input.value;

    this.value = value.replace(/\s+/g, '');

    const rest = value.substring(prefix.length).replace(/\D/g, '');

    // Limit to 8 additional digits
    value = prefix + rest.substring(0, 8);

    // Format the phone number
    if (value.length > 8) {
      value = value.substring(0, 8) + ' ' + value.substring(8);
    }
    if (value.length > 11) {
      value = value.substring(0, 11) + ' ' + value.substring(11);
    }
    if (value.length > 14) {
      value = value.substring(0, 14) + ' ' + value.substring(14);
    }
    if (value.length > 17) {
      value = value.substring(0, 17) + ' ' + value.substring(17);
    }

    this.input.value = value;
  }
}

customElements.define('rm-phone-field', PhoneField);
