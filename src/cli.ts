#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import open from 'open';
import { scanEnvironment } from './scanners/scannerEngine';
import { fetchEolData } from './core/endoflifeApi';
import { evaluateVersion, evaluateAIModel, Status, Category } from './core/evaluator';
import { scanDependencies, cleanVersion } from './scanners/dependencyScanner';
import { scanAIModels } from './scanners/aiModelScanner';
import { getAIModelEolData, PROVIDER_NAMES, refreshAIModelData, getProviderModels, getAllProviders } from './providers/aiModels';
import { mapPackageToProduct } from './core/productMapper';
import { generateHtmlReport } from './reporters/htmlReporter';

const program = new Command();

program
  .name('eol-check')
  .description('Check End of Life (EOL) status of your development environment and project dependencies')
  .version('1.5.2')
  .option('--json', 'Output results as JSON')
  .option('--html <filename>', 'Generate HTML report to specified file')
  .option('--no-browser', 'Do not open HTML report in browser')
  .option('--verbose', 'Show verbose output')
  .option('--refresh-cache', 'Force refresh cache from API')
  .option('--scan-ai', 'Scan for AI/ML model usage in code files')
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
  .alias('q')
  .description('Query EOL status for a specific product')
  .argument('<product>', 'Product name (e.g. nodejs, python, ubuntu)')
  .argument('[version]', 'Specific version to check')
  .option('-r, --refresh-cache', 'Force refresh cache from API')
  .action(async (product, version, options) => {
    const cmdOptions = options || {};
    try {
      // Check if it's an AI model query
      const aiEolData = getAIModelEolData(product, version || 'latest'); 
      // Note: The above usage is slightly wrong because getAIModelEolData takes (provider, model)
      // We need to handle "provider model" or just "model" if unique
      
      // Better approach: Check if product is a provider name
      const providerName = Object.keys(PROVIDER_NAMES).find(p => p === product.toLowerCase());
      
      if (providerName) {
        // User queried a provider (e.g. "anthropic")
        if (cmdOptions.refreshCache) {
          console.log(chalk.blue('Refreshing AI model data...'));
          await refreshAIModelData();
        }
        
        if (version) {
          // "eol-check query anthropic claude-3-opus"
          const modelData = getAIModelEolData(providerName, version);
          if (modelData) {
            console.log(chalk.bold(`EOL Data for ${PROVIDER_NAMES[providerName]} ${version}:`));
            console.table(modelData.map(m => ({
              Cycle: m.cycle,
              'Release Date': m.releaseDate,
              'EOL Date': m.eol,
              'LTS': m.lts,
              'Deprecated': m.deprecated ? 'Yes' : 'No'
            })));
            return;
          }
        } else {
          // List all models for provider
          const models = getProviderModels(providerName);
          console.log(chalk.bold(`Available models for ${PROVIDER_NAMES[providerName]}:`));
          console.log(models.join(', '));
          return;
        }
      }

      // Check if the first argument is a model name directly (e.g. "gpt-4")
      for (const provider of getAllProviders()) {
        const modelData = getAIModelEolData(provider, product);
        if (modelData) {
           if (cmdOptions.refreshCache) {
            console.log(chalk.blue('Refreshing AI model data...'));
            await refreshAIModelData();
          }
          
          if (version) {
             const result = evaluateAIModel(PROVIDER_NAMES[provider], product, version, modelData);
             let color = chalk.green;
             if (result.status === Status.WARN) color = chalk.yellow;
             if (result.status === Status.ERR) color = chalk.red;
             console.log(
              `${color(`[${result.status}]`)} ${chalk.bold(result.component)} ${result.version} - ${result.message}`,
             );
          } else {
            console.log(chalk.bold(`EOL Data for ${PROVIDER_NAMES[provider]} ${product}:`));
            console.table(modelData.map(m => ({
              Cycle: m.cycle,
              'Release Date': m.releaseDate,
              'EOL Date': m.eol,
              'LTS': m.lts,
              'Deprecated': m.deprecated ? 'Yes' : 'No'
            })));
          }
          return;
        }
      }

      // Fallback to standard EOL check
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
      
      // Check if this looks like an AI model query
      const aiModelPatterns = [
        /^(gpt|claude|gemini|llama|mistral|codestral|pixtral|command|mixtral|dall-e|o1|o3)/i,
        /^(openai|anthropic|google|meta|mistral|cohere)$/i,
      ];
      
      const looksLikeAIModel = aiModelPatterns.some(p => p.test(product));
      
      if (looksLikeAIModel) {
        console.error(chalk.red('\n✗ AI Model not found'));
        console.error(chalk.yellow(`Model: ${chalk.bold(product)}`));
        console.error(chalk.gray(`\nThe AI model "${product}" was not found in our database.`));
        
        // Suggest similar models
        const allModels: string[] = [];
        for (const provider of getAllProviders()) {
          const models = getProviderModels(provider);
          allModels.push(...models.map(m => `${provider}/${m}`));
        }
        
        // Find similar models
        const similar = allModels.filter(m => 
          m.toLowerCase().includes(product.toLowerCase().split('-')[0]) ||
          product.toLowerCase().includes(m.split('/')[1]?.split('-')[0] || '')
        ).slice(0, 5);
        
        if (similar.length > 0) {
          console.error(chalk.gray('\nDid you mean one of these?'));
          similar.forEach(m => console.error(chalk.cyan(`  - eol-check query ${m.replace('/', ' ')}`)));
        }
        
        console.error(chalk.gray('\nList all AI providers: ') + chalk.cyan('eol-check query openai | anthropic | google | meta | mistral | cohere'));
      } else {
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
    }
    process.exit(0);
  });

program.parse(process.argv);

async function main(options: any) {
  if (options.verbose) {
    console.log(chalk.blue('Scanning environment...'));
  }

  // Refresh AI model data if requested
  if (options.refreshCache) {
    if (options.verbose) console.log('Refreshing AI model data from providers...');
    await refreshAIModelData();
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

  // Check AI/ML Models (only if --scan-ai flag is provided)
  if (options.scanAi) {
    if (options.verbose) console.log('Scanning for AI/ML models...');
    const aiScanResult = scanAIModels(process.cwd());
    
    // Process detected SDKs
    for (const sdk of aiScanResult.sdks) {
      if (options.verbose) console.log(`Found AI SDK: ${sdk.sdk} (${sdk.provider})`);
      // We don't evaluate SDKs directly here as they are covered by dependency scanner
      // But we could add specific checks for SDK versions if needed
    }

    // Process detected Models
    for (const model of aiScanResult.models) {
      if (options.verbose) 
        console.log(`Checking AI Model: ${model.provider}/${model.model} (${model.version}) found in ${model.source}`);
      
      const eolData = getAIModelEolData(model.provider, model.model);
      if (eolData) {
        const result = evaluateAIModel(
          PROVIDER_NAMES[model.provider] || model.provider, 
          model.model, 
          model.version, 
          eolData,
          model.source
        );
        results.push(result);
      } else if (options.verbose) {
        console.warn(chalk.yellow(`Warning: No EOL data found for ${model.provider}/${model.model}`));
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
    const categories = [Category.RUNTIME, Category.OS, Category.SERVICE, Category.DEPENDENCY, Category.AI_MODEL];
    
    for (const category of categories) {
      const categoryResults = results.filter((r) => r.category === category);
      if (categoryResults.length === 0) continue;
      
      console.log(chalk.cyan(`\n── ${category} ──`));
      
      categoryResults
        .sort((a, b) => {
          const priority = { [Status.ERR]: 0, [Status.WARN]: 1, [Status.OK]: 2 };
          return priority[a.status] - priority[b.status];
        })
        .forEach((res) => {
        let color = chalk.green;
        if (res.status === Status.WARN) color = chalk.yellow;
        if (res.status === Status.ERR) {
          color = chalk.red;
          hasError = true;
        }

        const sourceInfo = res.source ? chalk.gray(` (in ${res.source})`) : '';
        console.log(
          `${color(`[${res.status}]`)} ${chalk.bold(res.component)} ${res.version} - ${res.message}${sourceInfo}`,
        );
      });
    }

    if (hasError) {
      process.exit(1);
    }
  }
}


