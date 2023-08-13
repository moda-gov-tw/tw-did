import { nxCypressCucumberPreset } from '@tw-did/cypress-cucumber-preset';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: nxCypressCucumberPreset(__dirname),
});
