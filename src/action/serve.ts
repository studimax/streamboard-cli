import PluginServe from '../lib/PluginServe';

export default async function serve() {
  const serve = new PluginServe(process.cwd());
  serve.run();
}
