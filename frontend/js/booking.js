// header
const header = document.querySelector('.navbar');
const scrollThreshold = 0; // show header after any scroll (set to >0 to require more scroll)

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

//packahe sleection
const packageCards = document.querySelectorAll('.package-card');
const packageInput = document.getElementById('packageType');

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

//booking confirmation
const form = document.getElementById('bookingForm');
const alertBox = document.getElementById('alertBox');
const submitButton = document.getElementById('submitButton');
//do i put the package selection under this or not ??? red bc overridden :(
const packageInput = document.getElementById('packageType');
const packageCards = document.querySelectorAll('.package-card');

//minimum date to today
const dateInput = document.getElementById('date');
const today = new Date().toISOString().split('T')[0];
dateInput.setAttribute('min', today);

packageCards.forEach(card => {
    card.addEventListener('click', function() {
        packageCards.forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        packageInput.value = this.getAttribute('data-package');
    });
} );

function showAlert(message, type) {
    alertBox.textContent = message;
    alertBox.className = `alert ${type} show`;
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 5000);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    //do i actually need this when i already use required ???? >> yes bc of the hidden type.
    //so do i remove the required on html?? pls answer thx QUICK
    if (!packageInput.value) {
        showAlert('Please select a package before submitting.', 'error');
        return;
    }

    const firstName = document.getElementById('firstName').value;
    const email = document.getElementById('email').value;
    const date = document.getElementById('date').value;
    
    const confirmMessage = `Please confirm your booking details:\n\nName: ${firstName}\nEmail: ${email}\nDate: ${date}\n\nIs this information correct?`;
    
    if (!confirm(confirmMessage)) {
        return; 
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

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
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Booking Request';
    }
});