export const PRODUCT_MAP: Record<string, string> = {
  // NPM
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
  'node': 'node',
  'npm': 'npm',
  'yarn': 'yarn',
  'pnpm': 'pnpm',
  'express': 'express',
  'bun': 'bun',
  
  // Composer
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
  'github.com/gofiber/fiber': 'fiber',

  // Ruby
  'ruby': 'ruby',
  'rails': 'rails',
  'jekyll': 'jekyll',
  'bundler': 'bundler',
  'gem': 'gem',
};

export function mapPackageToProduct(packageName: string): string | null {
  return PRODUCT_MAP[packageName] || null;
}
