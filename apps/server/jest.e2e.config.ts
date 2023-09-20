import baseConfig from './jest.config';

export default {
  ...baseConfig,
  testMatch: ['**/*.e2e-spec.ts'],
};
