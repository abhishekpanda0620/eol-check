#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { scanEnvironment } from './scanners/scannerEngine';
import { fetchEolData } from './core/endoflifeApi';
import { evaluateVersion, Status } from './core/evaluator';
import { scanDependencies, cleanVersion } from './scanners/dependencyScanner';
import { mapPackageToProduct } from './core/productMapper';
import { generateHtmlReport } from './reporters/htmlReporter';

const program = new Command();

program
  .name('eol-check')
  .description('Check End of Life (EOL) status of your development environment and project dependencies')
  .version('1.3.2')
  .option('--json', 'Output results as JSON')
  .option('--html <filename>', 'Generate HTML report to specified file')
  .option('--verbose', 'Show verbose output')
  .option('--refresh-cache', 'Force refresh cache from API')
  .option('--version', 'Show version number')
  .option('--help', 'Show help information');

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
      
      try {
        const osData = await fetchEolData(product, options.refreshCache);
        // Extract version from string like "Ubuntu 22.04.5 LTS" -> "22.04"
        const versionMatch = scanResult.os.match(/(\d+(\.\d+)?)/);
        if (versionMatch) {
          results.push(evaluateVersion(scanResult.os, versionMatch[0], osData));
        }
      } catch (error) {
        if (options.verbose) {
          console.warn(
            chalk.yellow(
              `Warning: Could not fetch EOL data for OS ${scanResult.os}: ${error}`,
            ),
          );
        }
      }
    }
  }

  // Check System Services
  if (scanResult.services.length > 0) {
    if (options.verbose) console.log('Checking system services...');
    for (const service of scanResult.services) {
      if (options.verbose)
        console.log(
          `Checking service ${service.name} (${service.version})...`,
        );
      
      try {
        const eolData = await fetchEolData(service.product, options.refreshCache);
        if (eolData && eolData.length > 0) {
          results.push(evaluateVersion(service.name, service.version, eolData));
        }
      } catch (error) {
        if (options.verbose) {
          console.warn(
            chalk.yellow(
              `Warning: Could not fetch EOL data for ${service.name} (${service.product}): ${error}`,
            ),
          );
        }
      }
    }
  }

  // Check Project Dependencies
  if (options.verbose) console.log('Scanning project dependencies...');
  const dependencies = scanDependencies(process.cwd());
  for (const dep of dependencies) {
    const product = mapPackageToProduct(dep.name);
    if (product) {
      if (options.verbose)
        console.log(`Checking dependency ${dep.name} (mapped to ${product})...`);
      
      try {
        const eolData = await fetchEolData(product, options.refreshCache);
        if (eolData && eolData.length > 0) {
          const version = cleanVersion(dep.version);
          results.push(evaluateVersion(dep.name, version, eolData));
        }
      } catch (error) {
        if (options.verbose) {
          console.warn(
            chalk.yellow(
              `Warning: Could not fetch EOL data for ${dep.name}: ${error}`,
            ),
          );
        } else {
             console.warn(
            chalk.yellow(
              `Warning: Could not fetch EOL data for ${dep.name} (mapped to ${product}). Skipping...`,
            ),
          );
        }
      }
    }
  }

  // Generate HTML report if requested
  if (options.html) {
    try {
      generateHtmlReport(results, options.html);
      console.log(chalk.green(`\n✓ HTML report generated: ${options.html}`));
    } catch (error) {
      console.error(chalk.red(`Failed to generate HTML report: ${error}`));
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
