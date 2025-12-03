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

    // NEW: Database mappings
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

    // NEW: Testing framework mappings
    describe('Testing framework products', () => {
      it('should map testing frameworks correctly', () => {
        expect(mapPackageToProduct('jest')).toBe('jest');
        expect(mapPackageToProduct('mocha')).toBe('mocha');
        expect(mapPackageToProduct('cypress')).toBe('cypress');
        expect(mapPackageToProduct('playwright')).toBe('playwright');
        expect(mapPackageToProduct('@playwright/test')).toBe('playwright');
        expect(mapPackageToProduct('jasmine')).toBe('jasmine');
        expect(mapPackageToProduct('jasmine-core')).toBe('jasmine');
        expect(mapPackageToProduct('karma')).toBe('karma');
        expect(mapPackageToProduct('ava')).toBe('ava');
        expect(mapPackageToProduct('vitest')).toBe('vitest');
      });
    });

    // NEW: Build tools mappings
    describe('Build tools and bundlers', () => {
      it('should map build tools correctly', () => {
        expect(mapPackageToProduct('webpack')).toBe('webpack');
        expect(mapPackageToProduct('vite')).toBe('vite');
        expect(mapPackageToProduct('rollup')).toBe('rollup');
        expect(mapPackageToProduct('parcel')).toBe('parcel');
        expect(mapPackageToProduct('parcel-bundler')).toBe('parcel');
        expect(mapPackageToProduct('esbuild')).toBe('esbuild');
      });

      it('should map dev tools correctly', () => {
        expect(mapPackageToProduct('eslint')).toBe('eslint');
        expect(mapPackageToProduct('prettier')).toBe('prettier');
        expect(mapPackageToProduct('typescript')).toBe('typescript');
      });

      it('should map Java build tools correctly', () => {
        expect(mapPackageToProduct('gradle')).toBe('gradle');
        expect(mapPackageToProduct('maven')).toBe('maven');
        expect(mapPackageToProduct('ant')).toBe('ant');
        expect(mapPackageToProduct('bazel')).toBe('bazel');
        expect(mapPackageToProduct('grunt')).toBe('grunt');
      });
    });

    // NEW: Node.js runtime mapping fix
    describe('Runtime mappings', () => {
      it('should map Node.js variations to nodejs', () => {
        expect(mapPackageToProduct('node')).toBe('nodejs');
        expect(mapPackageToProduct('nodejs')).toBe('nodejs');
      });

      it('should map package managers correctly', () => {
        expect(mapPackageToProduct('npm')).toBe('npm');
        expect(mapPackageToProduct('yarn')).toBe('yarn');
        expect(mapPackageToProduct('pnpm')).toBe('pnpm');
        expect(mapPackageToProduct('bun')).toBe('bun');
      });
    });

    // NEW: Container and DevOps
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
      expect(productCount).toBeGreaterThanOrEqual(90); // We should have 90+ mappings now
    });
  });
});
