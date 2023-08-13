import { workspaceRoot } from '@nx/devkit';
import { dirname, join, relative } from 'path';
import { lstatSync } from 'fs';
import * as webpack from '@cypress/webpack-preprocessor';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';

// the snippet is copied from
// https://github.com/badeball/cypress-cucumber-preprocessor/blob/ef9502d985738f109e15f81486860f117f82c1a0/examples/webpack-ts/cypress.config.ts
async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
): Promise<Cypress.PluginConfigOptions> {
  await addCucumberPreprocessorPlugin(on, config);

  on(
    'file:preprocessor',
    webpack({
      webpackOptions: {
        resolve: {
          extensions: ['.ts', '.js'],
        },
        module: {
          rules: [
            {
              test: /\.ts$/,
              exclude: [/node_modules/],
              use: [
                {
                  loader: 'ts-loader',
                },
              ],
            },
            {
              test: /\.feature$/,
              use: [
                {
                  loader: '@badeball/cypress-cucumber-preprocessor/webpack',
                  options: config,
                },
              ],
            },
          ],
        },
      },
    })
  );

  return config;
}

// the snippet copied from
// https://github.com/nrwl/nx/blob/f3f74068ead814c5848df373bdde3092a0d487ba/packages/cypress/plugins/cypress-preset.ts

interface BaseCypressPreset {
  videosFolder: string;
  screenshotsFolder: string;
  video: boolean;
  chromeWebSecurity: boolean;
}

function nxBaseCypressPreset(pathToConfig: string): BaseCypressPreset {
  process.env['NX_CYPRESS_COMPONENT_TEST'] = 'false';
  const normalizedPath = lstatSync(pathToConfig).isDirectory()
    ? pathToConfig
    : dirname(pathToConfig);
  const projectPath = relative(workspaceRoot, normalizedPath);
  const offset = relative(normalizedPath, workspaceRoot);
  const videosFolder = join(offset, 'dist', 'cypress', projectPath, 'videos');
  const screenshotsFolder = join(
    offset,
    'dist',
    'cypress',
    projectPath,
    'screenshots'
  );

  return {
    videosFolder,
    screenshotsFolder,
    video: true,
    chromeWebSecurity: false,
  };
}

export function nxCypressCucumberPreset(pathToConfig: string) {
  const basePath = 'src';
  const baseConfig = {
    ...nxBaseCypressPreset(pathToConfig),
    fileServerFolder: '.',
    supportFile: `${basePath}/support/e2e.ts`,
    specPattern: `${basePath}/**/*.feature`,
    fixturesFolder: `${basePath}/fixtures`,
    setupNodeEvents,
  };

  return baseConfig;
}
