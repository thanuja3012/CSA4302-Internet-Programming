const openModal = document.getElementById('loginToggle');
const modal = document.getElementById('loginModal');
const closeModal = document.getElementById('closeModal');

openModal.addEventListener('click', () => {
  modal.classList.add('open');
  document.body.classList.add('no-scroll');
});

closeModal.addEventListener('click', () => {
  modal.classList.remove('open');
  document.body.classList.remove('no-scroll');
});

const searchButton = document.getElementById('searchButton');
const saveCriteriaButton = document.getElementById('saveCriteria');
const savedList = document.getElementById('savedList');

const formatSavedSearch = () => {
  const location = document.getElementById('city').value;
  const type = document.getElementById('propertyType').value;
  const budget = document.getElementById('budget').value;

  return `${location} • ${type} • ${budget}`;
};

searchButton.addEventListener('click', () => {
  const location = document.getElementById('city').value;
  const type = document.getElementById('propertyType').value;

  const resultsCard = document.createElement('div');
  resultsCard.className = 'saved-row';
  resultsCard.innerHTML = `<span>${location} • ${type} homes returned</span><span class="tag">Live Results</span>`;

  const existing = savedList.querySelector('.saved-row:first-child');
  if (existing) {
    existing.replaceWith(resultsCard);
  } else {
    savedList.prepend(resultsCard);
  }
});

saveCriteriaButton.addEventListener('click', () => {
  const criteria = formatSavedSearch();

  const row = document.createElement('div');
  row.className = 'saved-row';
  row.innerHTML = `<span>${criteria}</span><span class="tag muted">Saved</span>`;

  const matching = Array.from(savedList.children).find((item) => {
    return item.querySelector('span')?.textContent === criteria;
  });

  if (!matching) {
    savedList.appendChild(row);
  }
});

const mortgageCalculator = () => {
  const homeValue = Number(document.getElementById('homeValue').value) || 450000;
  const downPayment = Number(document.getElementById('downPayment').value) || 90000;
  const rate = Number(document.getElementById('rate').value) || 6.28;
  const term = Number(document.getElementById('term').value) || 30;

  const loanAmount = Math.max(homeValue - downPayment, 0);
  const monthlyRate = (rate / 100) / 12;
  const months = term * 12;

  const monthly = monthlyRate === 0
    ? loanAmount / months
    : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

  const dollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  const monthlyOutput = document.getElementById('monthlyOutput');
  monthlyOutput.textContent = dollar.format(monthly);
};

const mortgageButton = document.getElementById('calculateMortgage');
mortgageButton.addEventListener('click', mortgageCalculator);

const agentSearchButton = document.getElementById('agentSearchButton');
const agentSearchInput = document.getElementById('agentSearch');
const agentResults = document.getElementById('agentResults');

agentSearchButton.addEventListener('click', () => {
  const query = agentSearchInput.value.trim().toLowerCase();
  const agentRows = Array.from(document.querySelectorAll('#agentResults .agent-result-row'));

  agentRows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.style.display = query && !text.includes(query) ? 'none' : 'flex';
  });
});

const loginButton = document.getElementById('loginButton');

loginButton.addEventListener('click', () => {
  const username = document.getElementById('username').value.trim();
  if (!username) {
    alert('Please enter your username to continue');
    return;
  }

  const profile = {
    username,
    criteria: formatSavedSearch(),
    visitedAt: new Date().toLocaleString()
  };

  const visits = JSON.parse(localStorage.getItem('homeFinderVisits') || '[]');
  visits.push(profile);
  localStorage.setItem('homeFinderVisits', JSON.stringify(visits));

  alert(`Welcome ${username}. Your saved search criteria are ready.`);
  modal.classList.remove('open');
  document.body.classList.remove('no-scroll');
});

const registerButton = document.getElementById('registerButton');

registerButton.addEventListener('click', () => {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    alert('Please enter a username and password');
    return;
  }

  const account = {
    username,
    password,
    createdAt: new Date().toISOString()
  };

  const accounts = JSON.parse(localStorage.getItem('homeFinderAccounts') || '[]');
  accounts.push(account);
  localStorage.setItem('homeFinderAccounts', JSON.stringify(accounts));

  alert('Registration complete. You can now log in.');
});

const existing = JSON.parse(localStorage.getItem('homeFinderVisits') || '[]');
if (existing.length) {
  const visitorCount = document.createElement('div');
  visitorCount.className = 'saved-row';
  visitorCount.innerHTML = `<span>Website visitors: ${existing.length}</span><span class="tag">Tracked</span>`;

  const saved = document.getElementById('savedList');
  saved.appendChild(visitorCount);
}
