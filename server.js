const express = require('express');
const searchForText = require('./searchScript');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static('public'));

// Serve the HTML file for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,public, 'index.html'));
});

app.get('/search', async (req, res) => {
  const url = req.query.u;
  const searchText = req.query.s;

  if (!url || !searchText) {
    return res.status(400).json({ error: 'Please provide both URL and search text.' });
  }

  const outputPath = `output_${searchText}.json`;

  try {
    await searchForText(url, searchText, outputPath);
    const result = require(`./${outputPath}`);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
