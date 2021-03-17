import PluginBuilder from '../src/lib/PluginBuilder';
import * as path from 'path';
import PluginCreate from '../src/lib/PluginCreate';
import fs from 'fs-extra';

describe('StreamBoard cli', () => {
  const pluginName = 'plugin';
  const targetDir = path.resolve(__dirname, pluginName);
  console.log(targetDir);
  it('plugin creation', done => {
    if (fs.existsSync(targetDir)) fs.removeSync(targetDir);
    const creator = new PluginCreate(pluginName, targetDir);
    creator
      .run(true)
      .then(() => {
        done();
      })
      .catch(reason => {
        done(reason);
      });
  });
  it('plugin builder', done => {
    const builder = new PluginBuilder(targetDir, targetDir);
    builder
      .run()
      .then(() => {
        done();
      })
      .catch(reason => {
        done(reason);
      });
  });
});
