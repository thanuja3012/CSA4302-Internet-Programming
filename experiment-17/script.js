document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('loginButton');
  const submitVote = document.getElementById('submitVote');

  loginButton.addEventListener('click', () => {
    loginButton.textContent = 'Authentication Complete';
    loginButton.classList.add('btn-secondary');
  });

  submitVote.addEventListener('click', () => {
    submitVote.textContent = 'Vote Submitted';
    submitVote.classList.add('btn-secondary');

    const selected = document.querySelector('input[name="candidate"]:checked');
    const target = selected ? selected.closest('.candidate-row') : null;

    if (target) {
      target.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(1.02)' },
          { transform: 'scale(1)' }
        ],
        { duration: 420, easing: 'ease-out' }
      );
    }
  });
});
