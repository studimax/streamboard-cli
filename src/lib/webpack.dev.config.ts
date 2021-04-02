import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import {Configuration} from 'webpack';

export default function WebpackDevConfig(src: string): Configuration {
  return {
    context: path.resolve(__dirname),
    entry: path.resolve(src, './src/index.ts'),
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    target: 'electron-renderer',
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            context: path.resolve(src),
            from: 'assets/',
            to: 'assets/',
            globOptions: {
              gitignore: true,
            },
          },
        ],
      }),
      new HtmlWebpackPlugin({title: 'StreamBoard Plugin'}),
    ],
  };
}
