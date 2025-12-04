export const PRODUCT_MAP: Record<string, string> = {
  // NPM - Frameworks & Libraries
  'react': 'react',
  'vue': 'vue',
  '@angular/core': 'angular',
  'next': 'nextjs',
  'nuxt': 'nuxt',
  'ember-source': 'ember',
  'svelte': 'svelte',
  'jquery': 'jquery',
  'bootstrap': 'bootstrap',
  'tailwindcss': 'tailwindcss',
  'electron': 'electron',
  'react-native': 'react-native',
  'express': 'express',
  
  // NPM - Runtime & Package Managers
  'node': 'nodejs',
  'nodejs': 'nodejs',
  'yarn': 'yarn',
  'pnpm': 'pnpm',
  'bun': 'bun',
  
  // NPM - Build Tools & Linters
  'eslint': 'eslint',
  'protractor': 'protractor',
  'grunt': 'grunt',
  
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
  'python': 'python',
  'ansible': 'ansible',
  'kubernetes': 'kubernetes',
  
  // Go
  'go': 'go',

  // Ruby
  'ruby': 'ruby',
  'rails': 'rails',
  'jekyll': 'jekyll',
  
  // Build Tools (Java, Gradle, Maven, etc.)
  'gradle': 'gradle',
  'maven': 'maven',
  'ant': 'ant',
  'bazel': 'bazel',
  
  // Container & DevOps
  'docker': 'docker-engine',
  'containerd': 'containerd',
  'podman': 'podman',
  
  // Cloud SDKs
  'aws-sdk': 'amazon-eks',
  '@aws-sdk/client-s3': 'amazon-eks',
  '@google-cloud/storage': 'google-kubernetes-engine',
};

export function mapPackageToProduct(packageName: string): string | null {
  return PRODUCT_MAP[packageName] || null;
}
