const fs = require('fs');

const data = JSON.parse(fs.readFileSync('Alphabet.json', 'utf-8'));
const timeSeries = data['Time Series (Daily)'];
const filtered = {};

for (const [date, values] of Object.entries(timeSeries)) {
  const year = parseInt(date.split('-')[0]);
  if (year >= 2020) {
    filtered[date] = values;
  }
}

data['Time Series (Daily)'] = filtered;
fs.writeFileSync('Alphabet.json', JSON.stringify(data, null, 4));
console.log('Filtered! Removed entries before 2020');
