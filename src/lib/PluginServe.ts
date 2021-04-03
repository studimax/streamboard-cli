import WebpackDevConfig from './webpack.dev.config';
import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import electron from 'electron';
import proc from 'child_process';
import path from 'path';

export default class PluginServe {
  constructor(private readonly srcPath: string) {}

  public run(): proc.ChildProcess {
    const config = WebpackDevConfig(this.srcPath);
    const compiler: webpack.Compiler = webpack(config);
    const options = {
      hot: true,
      port: 5000,
      host: 'localhost',
      inline: true,
      quiet: true,
    };
    const server = new webpackDevServer(compiler as any, options);
    server.listen(options.port, options.host, () => {
      console.log(`dev server listening on port ${options.port}`);
    });
    const electron_path = electron.toString();
    const child = proc.spawn(electron_path, [
      path.resolve(__dirname, './ElectronMainProcess.js'),
      `http://${options.host}:${options.port}`,
    ]);
    child.stdout.pipe(process.stdout);
    child.on('exit', () => server.close());
    return child;
  }
}
