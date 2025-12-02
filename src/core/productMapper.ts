export const PRODUCT_MAP: Record<string, string> = {
  // NPM - Frameworks & Libraries
  'react': 'react',
  'vue': 'vue',
  '@angular/core': 'angular',
  '@nestjs/core': 'nestjs',
  'next': 'nextjs',
  'nuxt': 'nuxt',
  'ember-source': 'ember',
  'svelte': 'svelte',
  'jquery': 'jquery',
  'bootstrap': 'bootstrap',
  'tailwindcss': 'tailwindcss',
  'electron': 'electron',
  'native-base': 'native-base', 
  'react-native': 'react-native',
  'expo': 'expo',
  'expo-cli': 'expo',
  'express': 'express',
  
  // NPM - Runtime & Package Managers
  'node': 'nodejs',
  'nodejs': 'nodejs',
  'npm': 'npm',
  'yarn': 'yarn',
  'pnpm': 'pnpm',
  'bun': 'bun',
  
  // NPM - Testing Frameworks
  'jest': 'jest',
  'mocha': 'mocha',
  'cypress': 'cypress',
  'playwright': 'playwright',
  '@playwright/test': 'playwright',
  'jasmine': 'jasmine',
  'jasmine-core': 'jasmine',
  'karma': 'karma',
  'protractor': 'protractor',
  'ava': 'ava',
  'vitest': 'vitest',
  
  // NPM - Build Tools & Bundlers
  'webpack': 'webpack',
  'vite': 'vite',
  'rollup': 'rollup',
  'parcel': 'parcel',
  'parcel-bundler': 'parcel',
  'esbuild': 'esbuild',
  '@turbo/gen': 'turborepo',
  'turbo': 'turborepo',
  'eslint': 'eslint',
  'prettier': 'prettier',
  'typescript': 'typescript',
  
  // Databases
  'postgresql': 'postgresql',
  'postgres': 'postgresql',
  'pg': 'postgresql',
  'mysql': 'mysql',
  'mysql2': 'mysql',
  'mongodb': 'mongodb',
  'mongoose': 'mongodb',
  'redis': 'redis',
  'ioredis': 'redis',
  'mariadb': 'mariadb',
  'elasticsearch': 'elasticsearch',
  '@elastic/elasticsearch': 'elasticsearch',
  'memcached': 'memcached',
  'cassandra-driver': 'cassandra',
  'neo4j-driver': 'neo4j',
  'sqlite3': 'sqlite',
  'better-sqlite3': 'sqlite',
  'couchdb': 'couchdb',
  'nano': 'couchdb',
  
  // Composer - PHP Frameworks
  'laravel/framework': 'laravel',
  'symfony/symfony': 'symfony',
  'drupal/core': 'drupal',
  'magento/product-community-edition': 'magento',
  'typo3/cms-core': 'typo3',
  'php': 'php',
  'composer': 'composer',
  
  // Python
  'django': 'django',
  'flask': 'flask',
  'python': 'python',
  'ansible': 'ansible',
  'kubernetes': 'kubernetes',
  
  // Python - Testing
  'pytest': 'pytest',

  // Go
  'go': 'go',
  'github.com/gofiber/fiber': 'fiber',
  'github.com/gin-gonic/gin': 'gin',

  // Ruby
  'ruby': 'ruby',
  'rails': 'rails',
  'jekyll': 'jekyll',
  'bundler': 'bundler',
  
  // Build Tools (Java, Gradle, Maven, etc.)
  'gradle': 'gradle',
  'maven': 'maven',
  'ant': 'ant',
  'bazel': 'bazel',
  'grunt': 'grunt',
  
  // Container & DevOps
  'docker': 'docker-engine',
  'containerd': 'containerd',
  'podman': 'podman',
  
  // Cloud SDKs
  'aws-sdk': 'amazon-eks',
  '@aws-sdk/client-s3': 'amazon-eks',
  '@azure/storage-blob': 'azuredevops',
  '@google-cloud/storage': 'google-kubernetes-engine',
};

export function mapPackageToProduct(packageName: string): string | null {
  return PRODUCT_MAP[packageName] || null;
}
