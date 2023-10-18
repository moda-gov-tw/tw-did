const nodeExternals = require('webpack-node-externals');
const path = require('path');
const { composePlugins, withNx } = require('@nx/webpack');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), (config) => {
  // Update the webpack config as needed here.
  // e.g. `config.plugins.push(new MyPlugin())`
  return {
    ...config,
    externals: nodeExternals({
      modulesDir: path.join(__dirname, '../..', 'node_modules'),
      allowlist: /^@veramo/,
    }),
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.js$/,
          include: /@veramo/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    modules: 'commonjs',
                  },
                ],
              ],
              plugins: [
                [
                  '@babel/plugin-syntax-import-attributes',
                  {
                    deprecatedAssertSyntax: true,
                  },
                ],
              ],
            },
          },
        },
      ],
    },
  };
});
