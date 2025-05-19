const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/vitalverse')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

const vitalSchema = new mongoose.Schema({
  heartRate: Number,
  spO2: Number,
  temperature: Number,
  hydration: Number,
  timestamp: { type: Date, default: Date.now }
});

const Vital = mongoose.model('Vital', vitalSchema);

app.get('/vitals', async (req, res) => {
  const vitals = await Vital.find().sort({ timestamp: -1 }).limit(30);
  res.json(vitals);
});

io.on('connection', (socket) => {
  console.log('🟢 Client connected');
});

function processVitals(data) {
  const vital = new Vital(data);
  vital.save();

  io.emit('newVitals', data);

  if (data.heartRate < 50 || data.heartRate > 120 || data.spO2 < 92 || data.temperature > 39) {
    io.emit('alert', '⚠️ Emergency! Abnormal vital signs detected.');
  }
}

if (require.main === module) {
  server.listen(5001, () => console.log('🚀 Server running on http://localhost:5001'));
}

module.exports = { processVitals };
