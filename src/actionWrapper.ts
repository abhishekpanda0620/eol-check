import { scanEnvironment } from './scannerEngine';
import { fetchEolData } from './endoflifeApi';
import { evaluateVersion, Status } from './evaluator';
import { scanDependencies, cleanVersion } from './dependencyScanner';
import { mapPackageToProduct } from './productMapper';
import { generateHtmlReport } from './htmlReporter';
import * as fs from 'fs';

// GitHub Actions helper functions
function getInput(name: string): string {
  return process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
}

function setOutput(name: string, value: string): void {
  console.log(`::set-output name=${name}::${value}`);
}

function setFailed(message: string): void {
  console.log(`::error::${message}`);
  process.exit(1);
}

async function run(): Promise<void> {
  try {
    // Read inputs
    const failOnEol = getInput('fail-on-eol') === 'true';
    const generateHtml = getInput('generate-html') === 'true';
    const htmlFilename = getInput('html-filename') || 'eol-report.html';
    const verbose = getInput('verbose') === 'true';
    const workingDirectory = getInput('working-directory') || '.';

    // Change to working directory
    if (workingDirectory !== '.') {
      process.chdir(workingDirectory);
    }

    if (verbose) {
      console.log('🔍 Scanning environment...');
    }

    const scanResult = scanEnvironment();
    const results = [];

    // Check Node.js
    if (scanResult.nodeVersion) {
      if (verbose) console.log(`Checking Node.js ${scanResult.nodeVersion}...`);
      const nodeData = await fetchEolData('nodejs', false);
      results.push(
        evaluateVersion('Node.js', scanResult.nodeVersion, nodeData),
      );
    }

    // Check OS
    if (scanResult.os && scanResult.os !== 'Unknown') {
      const osLower = scanResult.os.toLowerCase();
      let product = '';
      if (osLower.includes('ubuntu')) product = 'ubuntu';
      else if (osLower.includes('alpine')) product = 'alpine';
      else if (osLower.includes('debian')) product = 'debian';

      if (product) {
        if (verbose)
          console.log(`Checking OS ${scanResult.os} (mapped to ${product})...`);
        const osData = await fetchEolData(product, false);
        const versionMatch = scanResult.os.match(/(\d+(\.\d+)?)/);
        if (versionMatch) {
          results.push(evaluateVersion(scanResult.os, versionMatch[0], osData));
        }
      }
    }

    // Check dependencies
    if (verbose) console.log('Scanning project dependencies...');
    const dependencies = scanDependencies(process.cwd());

    for (const dep of dependencies) {
      const productSlug = mapPackageToProduct(dep.name);
      if (productSlug) {
        if (verbose)
          console.log(`Checking dependency ${dep.name} (${dep.version})...`);

        const cleanVer = cleanVersion(dep.version);
        const eolData = await fetchEolData(productSlug, false);

        if (eolData && eolData.length > 0) {
          results.push(evaluateVersion(dep.name, cleanVer, eolData));
        }
      }
    }

    // Calculate summary statistics
    const stats = {
      total: results.length,
      ok: results.filter((r) => r.status === Status.OK).length,
      warn: results.filter((r) => r.status === Status.WARN).length,
      err: results.filter((r) => r.status === Status.ERR).length,
    };

    const hasEol = stats.err > 0;

    // Set outputs
    setOutput('results', JSON.stringify(results));
    setOutput('has-eol', String(hasEol));
    setOutput('summary', JSON.stringify(stats));

    // Generate HTML report if requested
    if (generateHtml) {
      try {
        generateHtmlReport(results, htmlFilename);
        console.log(`✓ HTML report generated: ${htmlFilename}`);

        // Add job summary
        if (fs.existsSync(htmlFilename)) {
          const summaryFile = process.env.GITHUB_STEP_SUMMARY;
          if (summaryFile) {
            fs.appendFileSync(summaryFile, `\n## EOL Check Results\n\n`);
            fs.appendFileSync(
              summaryFile,
              `- **Total Checks**: ${stats.total}\n`,
            );
            fs.appendFileSync(summaryFile, `- **Supported**: ${stats.ok}\n`);
            fs.appendFileSync(summaryFile, `- **Warnings**: ${stats.warn}\n`);
            fs.appendFileSync(
              summaryFile,
              `- **EOL/Errors**: ${stats.err}\n\n`,
            );
            fs.appendFileSync(
              summaryFile,
              `📄 [View Full HTML Report](${htmlFilename})\n`,
            );
          }
        }
      } catch (error) {
        console.error(`Failed to generate HTML report: ${error}`);
      }
    }

    // Print results
    console.log('\n📊 EOL Check Results:\n');
    results.forEach((res) => {
      const emoji = res.status === Status.OK ? '✅' : res.status === Status.WARN ? '⚠️' : '❌';
      console.log(`${emoji} [${res.status}] ${res.component} ${res.version} - ${res.message}`);
    });

    console.log('\n📈 Summary:');
    console.log(`   Total: ${stats.total} | OK: ${stats.ok} | WARN: ${stats.warn} | ERR: ${stats.err}`);

    // Fail if requested and EOL components found
    if (failOnEol && hasEol) {
      setFailed(`Found ${stats.err} EOL component(s)`);
    }
  } catch (error) {
    setFailed(`EOL Check failed: ${error}`);
  }
}

run();
