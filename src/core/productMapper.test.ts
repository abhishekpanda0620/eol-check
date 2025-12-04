import { mapPackageToProduct, PRODUCT_MAP } from './productMapper';

describe('Product Mapper', () => {
  describe('mapPackageToProduct', () => {
    // Existing functionality
    it('should map known packages to product slugs', () => {
      expect(mapPackageToProduct('react')).toBe('react');
      expect(mapPackageToProduct('@angular/core')).toBe('angular');
      expect(mapPackageToProduct('vue')).toBe('vue');
    });

    it('should return null for unknown packages', () => {
      expect(mapPackageToProduct('unknown-package')).toBeNull();
      expect(mapPackageToProduct('random-lib-12345')).toBeNull();
    });

    // Database mappings
    describe('Database products', () => {
      it('should map PostgreSQL packages correctly', () => {
        expect(mapPackageToProduct('postgresql')).toBe('postgresql');
        expect(mapPackageToProduct('postgres')).toBe('postgresql');
        expect(mapPackageToProduct('pg')).toBe('postgresql');
      });

      it('should map MySQL packages correctly', () => {
        expect(mapPackageToProduct('mysql')).toBe('mysql');
        expect(mapPackageToProduct('mysql2')).toBe('mysql');
      });

      it('should map MongoDB packages correctly', () => {
        expect(mapPackageToProduct('mongodb')).toBe('mongodb');
        expect(mapPackageToProduct('mongoose')).toBe('mongodb');
      });

      it('should map Redis packages correctly', () => {
        expect(mapPackageToProduct('redis')).toBe('redis');
        expect(mapPackageToProduct('ioredis')).toBe('redis');
      });

      it('should map other database packages', () => {
        expect(mapPackageToProduct('mariadb')).toBe('mariadb');
        expect(mapPackageToProduct('elasticsearch')).toBe('elasticsearch');
        expect(mapPackageToProduct('@elastic/elasticsearch')).toBe('elasticsearch');
        expect(mapPackageToProduct('memcached')).toBe('memcached');
        expect(mapPackageToProduct('cassandra-driver')).toBe('cassandra');
        expect(mapPackageToProduct('neo4j-driver')).toBe('neo4j');
        expect(mapPackageToProduct('sqlite3')).toBe('sqlite');
        expect(mapPackageToProduct('better-sqlite3')).toBe('sqlite');
      });
    });

    // Build tools mappings
    describe('Build tools and linters', () => {
      it('should map build tools correctly', () => {
        expect(mapPackageToProduct('eslint')).toBe('eslint');
        expect(mapPackageToProduct('protractor')).toBe('protractor');
        expect(mapPackageToProduct('grunt')).toBe('grunt');
      });

      it('should map Java build tools correctly', () => {
        expect(mapPackageToProduct('gradle')).toBe('gradle');
        expect(mapPackageToProduct('maven')).toBe('maven');
        expect(mapPackageToProduct('ant')).toBe('ant');
        expect(mapPackageToProduct('bazel')).toBe('bazel');
      });
    });

    // Node.js runtime mapping
    describe('Runtime mappings', () => {
      it('should map Node.js variations to nodejs', () => {
        expect(mapPackageToProduct('node')).toBe('nodejs');
        expect(mapPackageToProduct('nodejs')).toBe('nodejs');
      });

      it('should map package managers correctly', () => {
        expect(mapPackageToProduct('yarn')).toBe('yarn');
        expect(mapPackageToProduct('pnpm')).toBe('pnpm');
        expect(mapPackageToProduct('bun')).toBe('bun');
      });
    });

    // Container and DevOps
    describe('Container and DevOps tools', () => {
      it('should map container tools correctly', () => {
        expect(mapPackageToProduct('docker')).toBe('docker-engine');
        expect(mapPackageToProduct('containerd')).toBe('containerd');
        expect(mapPackageToProduct('podman')).toBe('podman');
      });
    });

    // Comprehensive coverage check
    it('should have mappings for all documented products', () => {
      const productCount = Object.keys(PRODUCT_MAP).length;
      expect(productCount).toBeGreaterThanOrEqual(55); // We should have 55+ valid mappings
    });
  });
});
