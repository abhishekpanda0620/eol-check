import { fetchEolData } from './endoflifeApi';
import { scanEnvironment } from './scannerEngine';
import { evaluateVersion } from './evaluator';

console.log('Scanning environment...');
const result = scanEnvironment();
console.log('Scan Result:', result);

console.log('Fetching Node.js EOL data...');
fetchEolData('nodejs').then((data) => {
  const evaluation = evaluateVersion('Node.js', result.nodeVersion, data);
  console.log('Evaluation Result:', evaluation);
});

