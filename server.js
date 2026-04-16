const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Allow your website to talk to the server
app.use(cors());
app.use(express.json());

const io = new Server(server, {
cors: {
origin: "*", // In production, replace * with your frontend URL
methods: ["GET", "POST"]
}
});

// --- ROUTES ---

app.get('/', (req, res) => {
res.send('Taxi Dispatch Server is Running...');
});

// Simple endpoint to "Book" a taxi
app.post('/api/book', (req, res) => {
const rideRequest = req.body;
console.log("New Ride Requested:", rideRequest);

// Notify all connected Admins immediately
io.emit('new_ride_requested', rideRequest);

res.status(201).json({ message: "Request received!", data: rideRequest });
});

// --- SOCKET.IO REAL-TIME LOGIC ---

io.on('connection', (socket) => {
console.log('A user connected:', socket.id);

// When an admin dispatches a driver
socket.on('dispatch_driver', (data) => {
console.log("Dispatching Driver:", data);
// This sends a message to the specific driver
io.emit('ride_assigned', data);
});

socket.on('disconnect', () => {
console.log('User disconnected');
});
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
console.log(`Server is speeding on port ${PORT}`);
});
