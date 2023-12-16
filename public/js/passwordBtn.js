const passwordBtn = document.getElementById('passwordBtn');

passwordBtn.addEventListener('click', () => {
  const passwordInput = document.querySelector('.passwordInput');
  const type = passwordInput.getAttribute('type');
  if (type == 'password') {
    passwordInput.setAttribute('type', 'text');
    passwordBtn.innerText = 'Hide Password';
    setTimeout(() => {
      passwordInput.setAttribute('type', 'password');
      passwordBtn.innerText = 'Show Password';
    }, 3000);
  }
});