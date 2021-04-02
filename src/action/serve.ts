import electron from 'electron';
import proc from 'child_process';
import path from 'path';
import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import WebpackDevConfig from '../lib/webpack.dev.config';

export default async function serve() {
  const config = WebpackDevConfig(process.cwd());
  const compiler: webpack.Compiler = webpack(config);
  const options: webpackDevServer.Configuration = {
    hot: true,
    host: 'localhost',
    inline: true,
    quiet: true,
  };
  const server = new webpackDevServer(compiler as any, options);
  server.listen(5000, 'localhost', () => {
    console.log('dev server listening on port 5000');
  });
  const electron_path = electron.toString();
  const child = proc.spawn(electron_path, [
    path.resolve(__dirname, '../lib/ElectronMainProcess.js'),
    'http://localhost:5000',
  ]);
  child.stdout.pipe(process.stdout);
}
