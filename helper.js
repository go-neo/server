const { exec } = require('child_process');
const path = require('path');
const { stdin } = require('process');

const rpc = 'http://seed2t5.neo.org:20332'
// const rpc = 'http://localhost:20332'

async function compileContract(tempDir) {

  const codePath = path.join(tempDir, 'code.go')
  const configPath = path.join(tempDir, 'config.yml')
  const manifestPath = path.join(tempDir, 'code.manifest.json')

  // Replace 'your-cli-command' with the actual CLI command you want to run
  const command = `./neo/neo contract compile -i ${codePath} -c ${configPath} -m ${manifestPath}`;

  // Execute the CLI command
  return new Promise((resolve) => {
    return exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        resolve({ status: 500, message: error.message })
      }
      if (stderr) {
        console.error(`Error: ${stderr}`);
        resolve({ status: 500, message: stderr })
      }
      console.log(`Command output: ${stdout}`);
      resolve({ status: 200, stdout })
    });
  })
}

async function deployContract(tempDir) {

  const codeNefPath = path.join(tempDir, 'code.nef')
  const manifestPath = path.join(tempDir, 'code.manifest.json')
  
  // Replace 'your-cli-command' with the actual CLI command you want to run
  const command = `./neo/neo contract deploy -i ${codeNefPath} -manifest ${manifestPath} -r ${rpc} -w ./neo/test-wallet.json`;

  // Execute the CLI command
  return new Promise((resolve) => {
    return exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        resolve({ status: 500, message: error.message })
      }
      if (stderr) {
        console.error(`Error: ${stderr}`);
        resolve({ status: 500, message: stderr })
      }
      console.log(`Command output: ${stdout}`);

      stdin.write('qwerty', (e) => {
        console.log('e', e)
      })

      return new Promise((resolve) => {
        exec(`qwerty`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error: ${error.message}`);
            resolve({ status: 500, message: error.message })
          }
          if (stderr) {
            console.error(`Error: ${stderr}`);
            resolve({ status: 500, message: stderr })
          }

          console.log(`Command output: ${stdout}`);

          return new Promise((resolve) => {
            exec(`y`, (error, stdout, stderr) => {
              if (error) {
                console.error(`Error: ${error.message}`);
                resolve({ status: 500, message: error.message })
              }
              if (stderr) {
                console.error(`Error: ${stderr}`);
                resolve({ status: 500, message: stderr })
              }

              console.log(`Command output: ${stdout}`);
            })
          })
        })
      })
    });
  })
}

module.exports = { compileContract, deployContract }