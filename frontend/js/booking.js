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

// add click & keyboard support and ensure cards are focusable
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