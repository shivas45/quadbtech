const express = require('express');
const axios = require('axios');
const { Pool } = require('pg');


const app = express();
const PORT = 3000;


const pool = new Pool({
  user: 'shivam', 
  host: 'localhost',
  database: 'hodlinfo',
  password: 'shivam45', 
  port: 5432,
});


pool.query(`
  CREATE TABLE IF NOT EXISTS tickers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    last VARCHAR(50),
    buy VARCHAR(50),
    sell VARCHAR(50),
    volume VARCHAR(50),
    base_unit VARCHAR(50)
  );
`, (err, res) => {
  if (err) console.error(err);
  else console.log("Table created or already exists.");
});


app.get('/fetch-tickers', async (req, res) => {
  try {
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const tickers = Object.values(response.data).slice(0, 10); 

    const queryText = `INSERT INTO tickers (name, last, buy, sell, volume, base_unit) VALUES ($1, $2, $3, $4, $5, $6)`;

    for (let ticker of tickers) {
      await pool.query(queryText, [ticker.name, ticker.last, ticker.buy, ticker.sell, ticker.volume, ticker.base_unit]);
    }

    res.send('Tickers stored in the database!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching and storing tickers.');
  }
});


app.get('/get-tickers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tickers');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching tickers from the database.');
  }
});


app.use(express.static('public'));


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
