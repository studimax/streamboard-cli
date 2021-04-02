import {Configuration, ProgressPlugin, WebpackPluginInstance} from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';
import path from 'path';
// @ts-ignore
import nodeExternals from 'webpack-node-externals';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export interface CompilerConfig extends Configuration {
  entry: string;
  output: {
    path: string;
    filename: string;
  };
}

export default class Config implements CompilerConfig {
  public readonly context = path.resolve(__dirname);
  public readonly mode = 'production';
  public readonly stats = true;
  public entry: string;
  public output: {path: string; filename: string};
  public readonly module = {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  };
  public readonly resolve = {
    extensions: ['.tsx', '.ts', '.js'],
  };
  public readonly optimization = {
    minimize: true,
  };
  public readonly target = 'electron-renderer';
  public onprogress?: (
    percentage: number,
    msg: string,
    ...args: string[]
  ) => void;
  public readonly plugins: WebpackPluginInstance[] = [];

  constructor(src: string, out: string) {
    this.entry = path.resolve(src, './src/index.ts');
    this.output = {
      path: out,
      filename: 'index.js',
    };
    this.plugins.push(
      new ProgressPlugin((percentage: number, msg: string, ...args: string[]) =>
        this.onprogress?.(percentage, msg, ...args)
      ),
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
      new HtmlWebpackPlugin({title: 'StreamBoard Plugin'})
    );
  }

  public toWebpackConfig(): CompilerConfig {
    return {
      context: this.context,
      mode: this.mode,
      stats: this.stats,
      entry: this.entry,
      output: this.output,
      module: this.module,
      optimization: this.optimization,
      target: this.target,
      plugins: this.plugins,
      resolve: this.resolve,
      externals: nodeExternals(),
    };
  }
}
