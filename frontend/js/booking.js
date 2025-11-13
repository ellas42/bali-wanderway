// header
const header = document.querySelector('.navbar');
const scrollThreshold = 0;

function toggleHeaderOnScroll() {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  if (currentScroll <= 0) {
    header.classList.remove('visible');
  } else {
    header.classList.add('visible');
  }
}

window.addEventListener('scroll', toggleHeaderOnScroll);
window.addEventListener('load', toggleHeaderOnScroll);


const packageCards = document.querySelectorAll('.package-card');
const packageInput = document.getElementById('packageType');
const form = document.getElementById('bookingForm');
const alertBox = document.getElementById('alertBox');
const submitButton = document.getElementById('submitButton');
const dateInput = document.getElementById('date');


//set min date to today
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);


//package selection
function selectPackage(card) {
  packageCards.forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  if (packageInput) packageInput.value = card.dataset.package || '';
}

packageCards.forEach(card => {
  card.tabIndex = 0;
  card.addEventListener('click', () => selectPackage(card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectPackage(card);
    }
  });
});

if (packageInput && packageInput.value) {
  const pre = Array.from(packageCards).find(c => c.dataset.package === packageInput.value);
  if (pre) pre.classList.add('selected');
}

// alert function

function showAlert(message, type) {
  alertBox.textContent = message;
  alertBox.className = `alert ${type} show`;
  alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  setTimeout(() => {
    alertBox.classList.remove('show');
  }, 5000);
}

//form submission handling
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  //check required >> DO NOT DELETE REQUIRED FROM HTML
  if (!packageInput.value) {
    showAlert('Please select a package before submitting.', 'error');
    return;
  }

  const firstName = document.getElementById('firstName').value;
  const email = document.getElementById('email').value;
  const date = document.getElementById('date').value;

  const confirmMessage = `Please confirm your booking details:\n\nName: ${firstName}\nEmail: ${email}\nDate: ${date}\n\nIs this information correct?`;
  if (!confirm(confirmMessage)) return;

  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';

  const formData = new FormData(form);

  try {
    const response = await fetch('process_booking.php', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      showAlert('Your booking request has been submitted successfully! Please check your e-mail for your booking confirmation.', 'success');
      form.reset();
      packageCards.forEach(card => card.classList.remove('selected'));
    } else {
      showAlert(result.message || 'Something went wrong. Please try again.', 'error');
    }
  } catch (error) {
    showAlert('Unable to submit your request. Please try again or contact us directly.', 'error');
    console.error('Error:', error);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Submit Booking Request';
  }
});

//custom location
const locationSelect = document.getElementById('location');
const customLocation = document.getElementById('customLocation');
const customLocationTextArea = document.getElementById('custom-location');

locationSelect.addEventListener('change', (e)=> {
  const selectedValue = e.target.value;

  if (selectedValue == 'multiple' || 'custom') {
    customLocation.removeAttribute('hidden');
    customLocationTextArea.setAttribute('required', 'required');

    if (selectedValue == 'multiple') {
      customLocationTextArea.placeholder = 'Which areas in Bali will we be in?';
    } else {
      customLocationTextArea.placeholder = 'Please specify which area in Bali';
    }
  } else {
    customLocation.setAttribute('hidden', 'hidden');
    customLocationTextArea.removeAttribute('required');
    customLocationTextArea.value = '';
  }
})