document.addEventListener('DOMContentLoaded', () => {
  // DO NOT EDIT BELOW THIS LINE \\
  const form = document.querySelector('form');

  //This is the data we expect you to post to the server
  const validData = {
    is_human: 'true',
    user_name: 'Foo Bar',
    user_email: 'foo@bar.com',
    user_phone: '+31612345678',
    user_message: 'Hello world!',
  };

  // Log user input to the console
  form.addEventListener('input', (e) => {
    if (e.target.name && Object.keys(validData).includes(e.target.name)) {
      console.info(`[name="${e.target.name}"]:`, e.target.value);
    } else {
      console.warn(`[name="unknown"]:`, e.target.value);
    }
  });

  // Submit the form and verify the response
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // The component responsible for submission should be disabled
    e.submitter.disabled = true;

    const formData = new FormData(e.target);

    const { action, method } = e.target;
    const options = {
      method: method,
      body: formData,
    };
    fetch(action, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        let allValid = 0;

        if (Object.entries(data.form).length === 0) {
          form.querySelectorAll(`[name]`).forEach((field) => {
            field.error = '! Please enter a valid value';
          });
        } else {
          Object.entries(data.form).forEach(([key, value]) => {
            const field = form.querySelector(`[name="${key}"]`);
            console.log(value.toString() !== validData[key].toString());
            if (value.toString() !== validData[key].toString()) {
              if (field) {
                field.success = false;
                field.error = '! Please enter a valid value';
              }
            } else {
              allValid += 1;
              if (field) {
                field.error = false;
                field.success = true;
              }
            }
          });
        }

        if (allValid === Object.entries(validData).length) {
          alert('[SUCCESS]: Form submission completed, well done!');
        }
      })
      .catch((error) => {
        console.error('There was a problem with your fetch operation:', error);
      })
      .finally(() => {
        // Whatever the outcome, the component responsible for submission should be enabled again
        e.submitter.disabled = false;
      });
  });
});
