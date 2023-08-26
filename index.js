const express = require('express')
const path = require('path');
const fs = require('fs');
const os = require('os');

const { compileContract, deployContract } = require('./helper')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Create a route to handle the POST request
app.post('/deploy', async (req, res) => {
  const { tempDir } = req.body;

  if (!fs.existsSync(tempDir)) {
    console.log('Directory does not exists.');
    res.status(400).send({ message: 'Cannot find the directory' })
    return;
  }

  const response = await deployContract(tempDir)

  res.status(200).json({ message: 'code compiled', tempDir, response });
});

// Create a route to handle the POST request
app.post('/compile', async (req, res) => {
  const { code, config } = req.body;

  console.log(code)

  // Generate random directory names
  const directoryName = getRandomDirectoryName();

  // Create temporary directories
  const tempDir = path.join(directoryName);

  fs.mkdirSync(tempDir);

  // Write the strings to separate files in the temporary directories
  fs.writeFileSync(path.join(tempDir, 'code.go'), code);
  fs.writeFileSync(path.join(tempDir, 'config.yml'), config);
  fs.writeFileSync(path.join(tempDir, 'go.mod'), `module code
    go 1.18
    require github.com/nspcc-dev/neo-go/pkg/interop v0.0.0-20230824142145-7d75526c2054
  `);
  fs.writeFileSync(path.join(tempDir, 'go.sum'), `
    github.com/nspcc-dev/neo-go/pkg/interop v0.0.0-20230824142145-7d75526c2054 h1:7hHeAhWYR2VlLU5FdiklXdvxEMU+36J+p0wM5N7xsmQ=
    github.com/nspcc-dev/neo-go/pkg/interop v0.0.0-20230824142145-7d75526c2054/go.mod h1:ZUuXOkdtHZgaC13za/zMgXfQFncZ0jLzfQTe+OsDOtg=
  `);

  const response = await compileContract(tempDir)

  res.status(200).json({ message: 'code compiled', tempDir, response });
});

// Helper function to generate random directory names
function getRandomDirectoryName() {
  const randomString = Math.random().toString(36).substring(7);
  return `temp-${randomString}`;
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})