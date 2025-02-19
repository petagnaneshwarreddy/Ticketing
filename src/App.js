// DOM Elements
const loginNav = document.getElementById('loginNav');
const signupNav = document.getElementById('signupNav');
const historyNav = document.getElementById('historyNav');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const busSearchForm = document.getElementById('busSearchForm');
const busList = document.getElementById('busList');
const bookingForm = document.getElementById('bookingForm');
const ticketDisplay = document.getElementById('ticketDisplay');
const bookingHistory = document.getElementById('bookingHistory');


let currentUser = null;

// Navigation
loginNav.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.classList.remove('hidden');
  signupForm.classList.add('hidden');
  busSearchForm.classList.add('hidden');
  bookingHistory.classList.add('hidden');
  loginNav.classList.add('active');
  signupNav.classList.remove('active');
});

signupNav.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.classList.add('hidden');
  signupForm.classList.remove('hidden');
  busSearchForm.classList.add('hidden');
  bookingHistory.classList.add('hidden');
  loginNav.classList.remove('active');
  signupNav.classList.add('active');
});

historyNav.addEventListener('click', (e) => {
  e.preventDefault();
  showBookingHistory();
});

// Store users in localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

// Signup Form Handler
document.getElementById('signup').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  // Check if user already exists
  if (users.find(user => user.email === email)) {
    alert('User already exists!');
    return;
  }

  // Add new user
  users.push({ name, email, password });
  localStorage.setItem('users', JSON.stringify(users));
  alert('Signup successful! Please login.');
  
  // Reset form and show login
  e.target.reset();
  loginNav.click();
});

// Login Form Handler
document.getElementById('login').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  // Check credentials
  const user = users.find(user => user.email === email && user.password === password);
  
  if (user) {
    currentUser = user;
    // Hide login/signup forms and show bus search
    loginForm.classList.add('hidden');
    signupForm.classList.add('hidden');
    busSearchForm.classList.remove('hidden');
    loginNav.classList.add('hidden');
    signupNav.classList.add('hidden');
    historyNav.classList.remove('hidden');
  } else {
    alert('Invalid credentials!');
  }
});

// Sample bus data
const buses = [
  {
    id: 1,
    name: "Express Travels",
    type: "AC Sleeper",
    features: ["WiFi", "USB Charging", "Blanket", "Water Bottle"],
    departure: "21:00",
    arrival: "06:00",
    price: 1200,
    seats: 35
  },
  {
    id: 2,
    name: "Royal Coaches",
    type: "AC Seater",
    features: ["WiFi", "Entertainment System", "Snacks"],
    departure: "22:30",
    arrival: "07:30",
    price: 1000,
    seats: 40
  },
  {
    id: 3,
    name: "Luxury Lines",
    type: "AC Sleeper",
    features: ["WiFi", "USB Charging", "Blanket", "Pillow", "Snacks"],
    departure: "20:00",
    arrival: "05:00",
    price: 1500,
    seats: 30
  }
];

// Generate more buses by duplicating and modifying existing ones
const allBuses = [...buses];
for (let i = 0; i < 7; i++) {
  const baseBus = buses[i % 3];
  allBuses.push({
    ...baseBus,
    id: allBuses.length + 1,
    price: baseBus.price + Math.floor(Math.random() * 300),
    departure: `${18 + (i % 6)}:${(i * 10) % 60}`.padStart(5, '0'),
    seats: baseBus.seats + Math.floor(Math.random() * 10)
  });
}

let selectedBus = null;
let selectedJourney = null;

// Bus Search Form Handler
document.getElementById('busSearch').addEventListener('submit', (e) => {
  e.preventDefault();
  const fromCity = document.getElementById('fromCity').value;
  const toCity = document.getElementById('toCity').value;
  const date = document.getElementById('travelDate').value;
  
  selectedJourney = { fromCity, toCity, date };
  
  // Hide search form and show bus list
  busSearchForm.classList.add('hidden');
  busList.classList.remove('hidden');
  
  // Display buses
  const busListContainer = document.getElementById('busListContainer');
  busListContainer.innerHTML = allBuses.map(bus => `
    <div class="bus-card">
      <h3>${bus.name}</h3>
      <div class="bus-details">
        <div class="bus-feature">Type: ${bus.type}</div>
        <div class="bus-feature">Departure: ${bus.departure}</div>
        <div class="bus-feature">Arrival: ${bus.arrival}</div>
        <div class="bus-feature">Price: ₹${bus.price}</div>
        <div class="bus-feature">Available Seats: ${bus.seats}</div>
      </div>
      <div class="bus-feature">Features: ${bus.features.join(', ')}</div>
      <button onclick="selectBus(${bus.id})">Book Now</button>
    </div>
  `).join('');
});

// Make selectBus function globally available
window.selectBus = (busId) => {
  selectedBus = allBuses.find(bus => bus.id === busId);
  busList.classList.add('hidden');
  bookingForm.classList.remove('hidden');
};

// Booking Form Handler
document.getElementById('booking').addEventListener('submit', (e) => {
  e.preventDefault();
  const passengerName = document.getElementById('passengerName').value;
  const phoneNumber = document.getElementById('phoneNumber').value;
  const passengerEmail = document.getElementById('passengerEmail').value;
  const age = document.getElementById('age').value;
  console.log(age);

  const gender = document.getElementById('gender').value;

  // Generate PNR
  const pnr = 'PNR' + Date.now().toString().slice(-8);

  // Create booking object
  const booking = {
    pnr,
    passengerName,
    phoneNumber,
    passengerEmail,
    gender,
    age,
    journey: selectedJourney,
    bus: selectedBus,
    userEmail: currentUser.email,
    bookingDate: new Date().toISOString()
  };

  // Save booking
  bookings.push(booking);
  localStorage.setItem('bookings', JSON.stringify(bookings));

  // Hide booking form and show ticket
  bookingForm.classList.add('hidden');
  ticketDisplay.classList.remove('hidden');

  // Display ticket
  const ticketContent = document.getElementById('ticketContent');
  ticketContent.innerHTML = `
    <div class="ticket-field"><strong>PNR Number:</strong> ${pnr}</div>
    <div class="ticket-field"><strong>Passenger Name:</strong> ${passengerName}</div>
    <div class="ticket-field"><strong>From:</strong> ${selectedJourney.fromCity}</div>
    <div class="ticket-field"><strong>To:</strong> ${selectedJourney.toCity}</div>
    <div class="ticket-field"><strong>Date:</strong> ${selectedJourney.date}</div>
    <div class="ticket-field"><strong>Bus:</strong> ${selectedBus.name}</div>
    <div class="ticket-field"><strong>Type:</strong> ${selectedBus.type}</div>
    <div class="ticket-field"><strong>Departure:</strong> ${selectedBus.departure}</div>
    <div class="ticket-field"><strong>Phone:</strong> ${phoneNumber}</div>
    <div class="ticket-field"><strong>Email:</strong> ${passengerEmail}</div>
    <div class="ticket-field"><strong>Gender:</strong> ${gender}</div>
    <div class="ticket-field"><strong>age:</strong> ${age}</div>
    <div class="ticket-field"><strong>Amount Paid:</strong> ₹${selectedBus.price}</div>
  `;
});

// Download PDF Ticket
document.getElementById('downloadTicket').addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  const ticketContent = document.getElementById('ticketContent');
  const lines = ticketContent.innerText.split('\n');
  
  doc.setFontSize(20);
  doc.text('Bus Ticket', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  let y = 40;
  lines.forEach(line => {
    doc.text(line, 20, y);
    y += 10;
  });
  
  doc.save('bus-ticket.pdf');
});

// Back to Search
document.getElementById('backToSearch').addEventListener('click', () => {
  ticketDisplay.classList.add('hidden');
  busSearchForm.classList.remove('hidden');
  document.getElementById('busSearch').reset();
});

// Show Booking History
function showBookingHistory() {
  // Hide other containers
  busSearchForm.classList.add('hidden');
  busList.classList.add('hidden');
  bookingForm.classList.add('hidden');
  ticketDisplay.classList.add('hidden');
  bookingHistory.classList.remove('hidden');

  // Get user's bookings
  const userBookings = bookings.filter(booking => booking.userEmail === currentUser.email);

  // Display bookings
  const historyContainer = document.getElementById('historyContainer');
  if (userBookings.length === 0) {
    historyContainer.innerHTML = '<p class="no-bookings">No bookings found.</p>';
    return;
  }

  historyContainer.innerHTML = userBookings.map(booking => `
    <div class="bus-card">
      <div class="ticket-field"><strong>PNR Number:</strong> ${booking.pnr}</div>
      <div class="ticket-field"><strong>Passenger:</strong> ${booking.passengerName}</div>
      <div class="ticket-field"><strong>Journey:</strong> ${booking.journey.fromCity} to ${booking.journey.toCity}</div>
      <div class="ticket-field"><strong>Date:</strong> ${booking.journey.date}</div>
      <div class="ticket-field"><strong>Bus:</strong> ${booking.bus.name}</div>
      <div class="ticket-field"><strong>Amount:</strong> ₹${booking.bus.price}</div>
      <button onclick="downloadHistoryTicket('${booking.pnr}')" class="secondary-button">Download Ticket</button>
    </div>
  `).join('');
}

// Download ticket from history
window.downloadHistoryTicket = (pnr) => {
  const booking = bookings.find(b => b.pnr === pnr);
  if (!booking) return;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Bus Ticket', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  let y = 40;
  
  const lines = [
    `PNR Number: ${booking.pnr}`,
    `Passenger Name: ${booking.passengerName}`,
    `From: ${booking.journey.fromCity}`,
    `To: ${booking.journey.toCity}`,
    `Date: ${booking.journey.date}`,
    `Bus: ${booking.bus.name}`,
    `Type: ${booking.bus.type}`,
    `Departure: ${booking.bus.departure}`,
    `Phone: ${booking.phoneNumber}`,
    `Email: ${booking.passengerEmail}`,
    `Gender: ${booking.gender}`,
    `Amount Paid: ₹${booking.bus.price}`
  ];
  
  lines.forEach(line => {
    doc.text(line, 20, y);
    y += 10;
  });
  
  doc.save(`bus-ticket-${booking.pnr}.pdf`);
};

// Set minimum date for travel date input to today
const travelDateInput = document.getElementById('travelDate');
const today = new Date().toISOString().split('T')[0];
travelDateInput.min = today;