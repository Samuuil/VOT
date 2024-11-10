const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/expenses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM expenses');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/expenses', async (req, res) => {
  const { amount, category, date, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO expenses (amount, category, date, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [amount, category, date, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/expenses/:id', async (req, res) => {
  const { id } = req.params;
  const { amount, category, date, description } = req.body;
  try {
    const result = await pool.query(
      'UPDATE expenses SET amount = $1, category = $2, date = $3, description = $4 WHERE id = $5 RETURNING *',
      [amount, category, date, description, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/expenses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM expenses WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
