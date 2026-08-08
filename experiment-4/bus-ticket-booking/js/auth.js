/* Authentication and registration logic using localStorage/sessionStorage */
const authForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

function findUserByEmailOrName(identifier) {
  const users = getData(STORAGE_KEYS.users);
  return users.find(user => user.email.toLowerCase() === identifier.toLowerCase() || user.fullName.toLowerCase() === identifier.toLowerCase());
}

function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const rememberMe = document.getElementById('rememberMe').checked;
  const messageContainer = document.getElementById('loginMessage');
  if (!email || !password) {
    showAlert(messageContainer, 'Please enter both email/username and password.', 'danger');
    return;
  }
  const users = getData(STORAGE_KEYS.users);
  const user = users.find(u => (u.email.toLowerCase() === email.toLowerCase() || u.fullName.toLowerCase() === email.toLowerCase()) && u.password === password);
  if (!user) {
    showAlert(messageContainer, 'Invalid credentials. Please try again or register.', 'danger');
    return;
  }
  setCurrentUser({ id: user.id, fullName: user.fullName, email: user.email }, rememberMe);
  showAlert(messageContainer, 'Login successful! Redirecting to search buses...', 'success');
  setTimeout(() => window.location.href = 'buses.html', 1400);
}

function registerUser(event) {
  event.preventDefault();
  const messageContainer = document.getElementById('registerMessage');
  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const mobile = document.getElementById('mobile').value.trim();
  const dob = document.getElementById('dob').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const address = document.getElementById('address').value.trim();

  if (!fullName || !email || !mobile || !dob || !password || !confirmPassword || !address) {
    showAlert(messageContainer, 'Please fill out all fields before submitting.', 'danger');
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showAlert(messageContainer, 'Please enter a valid email address.', 'danger');
    return;
  }
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobileRegex.test(mobile)) {
    showAlert(messageContainer, 'Please enter a valid 10-digit mobile number.', 'danger');
    return;
  }
  if (password.length < 6) {
    showAlert(messageContainer, 'Password must be at least 6 characters long.', 'danger');
    return;
  }
  if (password !== confirmPassword) {
    showAlert(messageContainer, 'Passwords do not match. Please confirm again.', 'danger');
    return;
  }
  const users = getData(STORAGE_KEYS.users);
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    showAlert(messageContainer, 'An account with this email already exists. Try login.', 'danger');
    return;
  }
  const newUser = {
    id: `user${Date.now()}`,
    fullName,
    email,
    mobile,
    dob,
    password,
    address,
    registrationDate: new Date().toISOString(),
    status: 'Active'
  };
  users.push(newUser);
  setData(STORAGE_KEYS.users, users);
  showAlert(messageContainer, 'Registration complete! Redirecting to login page...', 'success');
  setTimeout(() => window.location.href = 'login.html', 1400);
}

if (authForm) {
  authForm.addEventListener('submit', loginUser);
}
if (registerForm) {
  registerForm.addEventListener('submit', registerUser);
}
