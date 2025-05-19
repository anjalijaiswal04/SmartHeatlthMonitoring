const { processVitals } = require('./server');

setInterval(() => {
  const fakeVitals = {
    heartRate: Math.floor(Math.random() * 60) + 60,
    spO2: Math.floor(Math.random() * 10) + 90,
    temperature: parseFloat((36 + Math.random() * 3).toFixed(1)),
    hydration: Math.floor(Math.random() * 41) + 60,
  };

  processVitals(fakeVitals);
}, 3000);
