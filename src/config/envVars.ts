import path from 'path';
const dotenv = require('dotenv');

function loadEnvVars(): void {
  dotenv.config({ path: path.join(__dirname + '/../../.env') });
}

export { loadEnvVars };
