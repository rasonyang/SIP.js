const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: {
      background: './src/background.js',
      'offscreen-ua': './src/offscreen-ua.js',
      options: './src/options.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      clean: true
    },
    resolve: {
      alias: {
        '@sip': path.resolve(__dirname, '../src')
      },
      extensions: ['.ts', '.js'],
      extensionAlias: {
        '.js': ['.ts', '.js']
      }
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/manifest.json', to: 'manifest.json' },
          { from: 'src/offscreen.html', to: 'offscreen.html' },
          { from: 'src/options.html', to: 'options.html' },
          { from: 'src/assets', to: 'assets' }
        ]
      })
    ],
    devtool: isProduction ? 'source-map' : 'cheap-source-map',
    // Write files to disk for Chrome to load
    devServer: {
      devMiddleware: {
        writeToDisk: true
      }
    },
    optimization: {
      minimize: isProduction
    }
  };
};
