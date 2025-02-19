document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
  
    // Save the email and password in localStorage (for demo purposes)
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userPassword', password);
  
    alert('Account created successfully!');
    window.location.href = 'login.html'; // Redirect to login page
  });
  