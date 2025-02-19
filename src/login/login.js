document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
  
    // Get stored email and password
    const storedEmail = localStorage.getItem('userEmail');
    const storedPassword = localStorage.getItem('userPassword');
  
    // Check if the entered credentials match
    if (email === storedEmail && password === storedPassword) {
      alert('Login successful!');
      window.location.href = 'transport.html'; // Redirect to transport selection page
    } else {
      alert('Invalid credentials! Please try again.');
    }
  });
  