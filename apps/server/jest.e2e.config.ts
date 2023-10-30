import baseConfig from './jest.config';

export default {
  ...baseConfig,
  testMatch: ['**/*.e2e-spec.ts'],
  transformIgnorePatterns: [
    '/node_modules/(?!(@veramo|uint8arrays|multiformats|did-jwt-vc))',
  ],
};
