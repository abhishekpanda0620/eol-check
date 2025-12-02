import { Command } from 'commander';
import chalk from 'chalk';
import { scanEnvironment } from './scannerEngine';
import { fetchEolData } from './endoflifeApi';
import { evaluateVersion, Status } from './evaluator';
import { scanDependencies, cleanVersion } from './dependencyScanner';
import { mapPackageToProduct } from './productMapper';

const program = new Command();

program
  .name('eol-check')
  .description('Check EOL status of your environment')
  .version('1.1.1')
  .option('--json', 'Output results as JSON')
  .option('--verbose', 'Show verbose output')
  .option('--refresh-cache', 'Force refresh cache from API');

program.parse(process.argv);
const options = program.opts();

async function main() {
  if (options.verbose) {
    console.log(chalk.blue('Scanning environment...'));
  }

  const scanResult = scanEnvironment();
  const results = [];

  // Check Node.js
  if (scanResult.nodeVersion) {
    if (options.verbose)
      console.log(`Checking Node.js ${scanResult.nodeVersion}...`);
    const nodeData = await fetchEolData('nodejs', options.refreshCache);
    results.push(evaluateVersion('Node.js', scanResult.nodeVersion, nodeData));
  }

  // Check OS (if detected)
  if (scanResult.os && scanResult.os !== 'Unknown') {
    // Note: OS matching is tricky with endoflife.date as they have specific slugs like 'ubuntu', 'alpine'.
    // For now, we'll try to map common ones or skip if unsure.
    // This is a simplified implementation for the prototype.
    const osLower = scanResult.os.toLowerCase();
    let product = '';
    if (osLower.includes('ubuntu')) product = 'ubuntu';
    else if (osLower.includes('alpine')) product = 'alpine';
    else if (osLower.includes('debian')) product = 'debian';

    if (product) {
      if (options.verbose)
        console.log(`Checking OS ${scanResult.os} (mapped to ${product})...`);
      const osData = await fetchEolData(product, options.refreshCache);
      // Extract version from string like "Ubuntu 22.04.5 LTS" -> "22.04"
      const versionMatch = scanResult.os.match(/(\d+(\.\d+)?)/);
      if (versionMatch) {
        results.push(evaluateVersion(scanResult.os, versionMatch[0], osData));
      }
    }
  }

  // Check Project Dependencies
  if (options.verbose) console.log('Scanning project dependencies...');
  const dependencies = scanDependencies(process.cwd());

  for (const dep of dependencies) {
    const productSlug = mapPackageToProduct(dep.name);
    if (productSlug) {
      if (options.verbose)
        console.log(`Checking dependency ${dep.name} (${dep.version})...`);

      const cleanVer = cleanVersion(dep.version);
      const eolData = await fetchEolData(productSlug, options.refreshCache);

      if (eolData && eolData.length > 0) {
        results.push(evaluateVersion(dep.name, cleanVer, eolData));
      }
    }
  }

  if (options.json) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log(chalk.bold('\nEOL Check Results:'));
    let hasError = false;

    results.forEach((res) => {
      let color = chalk.green;
      if (res.status === Status.WARN) color = chalk.yellow;
      if (res.status === Status.ERR) {
        color = chalk.red;
        hasError = true;
      }

      console.log(
        `${color(`[${res.status}]`)} ${chalk.bold(res.component)} ${res.version} - ${res.message}`,
      );
    });

    if (hasError) {
      process.exit(1);
    }
  }
}

main().catch((err) => {
  console.error(chalk.red('Error running eol-check:'), err);
  process.exit(1);
});
