const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(express.static(__dirname));
app.use(bodyParser.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse form data

// Define Booking Schema
const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  eventType: String,
  date: String,
  time: String,
  guests: Number,
  requirements: String,
  payment: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create Booking model
const Booking = mongoose.model("Booking", bookingSchema);

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/bookNowDB")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'book.html'));
});

app.get('/book', (req, res) => {
  res.sendFile(path.join(__dirname, 'book.html'));
});

// View a specific booking by ID
app.get('/view-booking/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).send("Booking not found");
    }

    const eventPackages = {
      wedding: "Basic Package - $50,000",
      birthday: "Premium Package - $150,000",
      corporate: "Luxury Package - $200,000"
    };

    const paymentMethods = {
      credit_card: "Credit Card",
      gpay: "Gpay",
      bank_transfer: "Bank Transfer"
    };

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Booking Details</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <script>
          async function updateBooking() {
            const updatedData = {
              name: prompt("Enter new name:", "${booking.name}"),
              email: prompt("Enter new email:", "${booking.email}"),
              phone: prompt("Enter new phone:", "${booking.phone}"),
              address: prompt("Enter new address:", "${booking.address}"),
              eventType: prompt("Enter new event type:", "${booking.eventType}"),
              date: prompt("Enter new date:", "${booking.date}"),
              time: prompt("Enter new time:", "${booking.time}"),
              guests: prompt("Enter new guests count:", "${booking.guests}"),
              requirements: prompt("Enter new requirements:", "${booking.requirements}"),
              payment: prompt("Enter new payment method:", "${booking.payment}")
            };
            const response = await fetch('/update/${booking._id}', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedData)
            });
            if (response.ok) {
              alert("Booking updated successfully!");
              location.reload();
            } else {
              alert("Failed to update booking.");
            }
          }

          async function deleteBooking() {
            if (confirm("Are you sure you want to delete this booking?")) {
              const response = await fetch('/delete/${booking._id}', { method: 'DELETE' });
              if (response.ok) {
                alert("Booking deleted successfully!");
                window.location.href = '/book';
              } else {
                alert("Failed to delete booking.");
              }
            }
          }
        </script>
      </head>
      <body>
        <div class="container mt-5">
          <h2 class="text-center mb-4">Booking Details</h2>
          <div class="card">
            <div class="card-body">
              <p><strong>Name:</strong> ${booking.name}</p>
              <p><strong>Email:</strong> ${booking.email}</p>
              <p><strong>Phone:</strong> ${booking.phone}</p>
              <p><strong>Address:</strong> ${booking.address}</p>
              <p><strong>Event Package:</strong> ${eventPackages[booking.eventType]}</p>
              <p><strong>Date:</strong> ${booking.date}</p>
              <p><strong>Time:</strong> ${booking.time}</p>
              <p><strong>Guests:</strong> ${booking.guests}</p>
              <p><strong>Special Requirements:</strong> ${booking.requirements}</p>
              <p><strong>Payment Method:</strong> ${paymentMethods[booking.payment]}</p>
            </div>
          </div>
          <div class="mt-4 text-center">
            <a href="/book" class="btn btn-primary">Return to Booking Page</a>
            <button class="btn btn-warning ms-2" onclick="updateBooking()">Update Booking</button>
            <button class="btn btn-danger ms-2" onclick="deleteBooking()">Delete Booking</button>
          </div>
        </div>
      </body>
      </html>
    `;
    res.send(html);
  } catch (err) {
    console.error("Error viewing booking:", err);
    res.status(500).send("Error viewing booking");
  }
});

// Confirm booking
app.get('/confirm', async (req, res) => {
  const booking = new Booking(req.query);
  try {
    const savedBooking = await booking.save();
    res.redirect(`/view-booking/${savedBooking._id}`);
  } catch (err) {
    console.error("Error saving booking:", err);
    res.status(500).send("Error saving booking");
  }
});

// Update booking
app.put('/update/:id', async (req, res) => {
  try {
    console.log("Update request received for ID:", req.params.id);
    console.log("Update data:", req.body);

    // Ensure guests is a number if provided as a string
    if (req.body.guests && typeof req.body.guests === 'string') {
      req.body.guests = parseInt(req.body.guests, 10);
    }

    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedBooking) {
      return res.status(404).send("Booking not found");
    }

    console.log("Booking updated successfully:", updatedBooking);
    res.status(200).send(updatedBooking);
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).send("Error updating booking");
  }
});

// Delete booking
app.delete('/delete/:id', async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) {
      return res.status(404).send("Booking not found");
    }
    res.status(200).send("Booking deleted successfully");
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).send("Error deleting booking");
  }
});

// Utility function
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;")
            .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});