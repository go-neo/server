const express = require('express')
const path = require('path');
const fs = require('fs');
const os = require('os');
const app = express()
const port = process.env.PORT || 3000

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Create a route to handle the POST request
app.post('/upload', (req, res) => {
  const { code, config } = req.body;

  // Generate random directory names
  const directoryName = getRandomDirectoryName();

  // Create temporary directories
  const tempDir = path.join(os.tmpdir(), directoryName);
  
  fs.mkdirSync(tempDir);

  // Write the strings to separate files in the temporary directories
  fs.writeFileSync(path.join(tempDir, 'code.go'), code);
  fs.writeFileSync(path.join(tempDir, 'config.yml'), config);

  res.status(200).json({ message: 'Strings saved to temporary directories.' });
});

// Helper function to generate random directory names
function getRandomDirectoryName() {
  const randomString = Math.random().toString(36).substring(7);
  return `temp-${randomString}`;
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})