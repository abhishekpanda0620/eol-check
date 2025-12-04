#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import open from 'open';
import { scanEnvironment } from './scanners/scannerEngine';
import { fetchEolData } from './core/endoflifeApi';
import { evaluateVersion, Status, Category } from './core/evaluator';
import { scanDependencies, cleanVersion } from './scanners/dependencyScanner';
import { mapPackageToProduct } from './core/productMapper';
import { generateHtmlReport } from './reporters/htmlReporter';

const program = new Command();

program
  .name('eol-check')
  .description('Check End of Life (EOL) status of your development environment and project dependencies')
  .version('1.4.3')
  .option('--json', 'Output results as JSON')
  .option('--html <filename>', 'Generate HTML report to specified file')
  .option('--no-browser', 'Do not open HTML report in browser')
  .option('--verbose', 'Show verbose output')
  .option('--refresh-cache', 'Force refresh cache from API')
  .action(async (cmdOptions) => {
    try {
      await main(cmdOptions);
    } catch (err) {
      console.error(chalk.red('Error running eol-check:'), err);
      process.exit(1);
    }
  });

program
  .command('query')
  .description('Query EOL status for a specific product')
  .argument('<product>', 'Product name (e.g. nodejs, python, ubuntu)')
  .argument('[version]', 'Specific version to check')
  .option('--refresh-cache', 'Force refresh cache from API')
  .action(async (product, version, cmdOptions) => {
    try {
      const data = await fetchEolData(product, cmdOptions.refreshCache);
      if (version) {
        const result = evaluateVersion(product, version, data);
        let color = chalk.green;
        if (result.status === Status.WARN) color = chalk.yellow;
        if (result.status === Status.ERR) color = chalk.red;
        console.log(
          `${color(`[${result.status}]`)} ${chalk.bold(result.component)} ${result.version} - ${result.message}`,
        );
      } else {
        console.log(chalk.bold(`EOL Data for ${product}:`));
        console.table(
          data.map((release) => ({
            Cycle: release.cycle,
            'Release Date': release.releaseDate,
            'EOL Date': release.eol,
            'LTS': release.lts,
          })),
        );
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(chalk.red('\n✗ Failed to fetch EOL data'));
      console.error(chalk.yellow(`Product: ${chalk.bold(product)}`));
      
      if (errorMsg.includes('404') || errorMsg.includes('Not Found')) {
        console.error(chalk.gray(`\nThe product "${product}" was not found on endoflife.date.`));
        console.error(chalk.gray('Please check the product name and try again.'));
        console.error(chalk.gray(`\nSearch for available products at: ${chalk.cyan('https://endoflife.date/api/all.json')}`));
      } else {
        console.error(chalk.gray(`\nError: ${errorMsg}`));
      }
    }
    process.exit(0);
  });

program.parse(process.argv);

async function main(options: any) {
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
    const result = evaluateVersion('Node.js', scanResult.nodeVersion, nodeData);
    result.category = Category.RUNTIME;
    results.push(result);
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
          const result = evaluateVersion(scanResult.os, versionMatch[0], osData);
          result.category = Category.OS;
          results.push(result);
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
          const result = evaluateVersion(service.name, service.version, eolData);
          result.category = Category.SERVICE;
          results.push(result);
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
          const result = evaluateVersion(dep.name, version, eolData);
          result.category = Category.DEPENDENCY;
          results.push(result);
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

      if (options.browser !== false) {
        await open(options.html);
        if (options.verbose) console.log('Opening report in default browser...');
      }
    } catch (error) {
      console.error(chalk.red(`Failed to generate HTML report: ${error}`));
    }
  }

  if (options.json) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log(chalk.bold('\nEOL Check Results:'));
    let hasError = false;

    // Group results by category
    const categories = [Category.RUNTIME, Category.OS, Category.SERVICE, Category.DEPENDENCY];
    
    for (const category of categories) {
      const categoryResults = results.filter((r) => r.category === category);
      if (categoryResults.length === 0) continue;
      
      console.log(chalk.cyan(`\n── ${category} ──`));
      
      categoryResults.forEach((res) => {
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
    }

    if (hasError) {
      process.exit(1);
    }
  }
}


