import PluginBuilder from '../src/lib/PluginBuilder';
import * as path from 'path';
import PluginCreate from '../src/lib/PluginCreate';
import fs from 'fs-extra';
import PluginServe from "../src/lib/PluginServe";
import {before} from "mocha";

describe('StreamBoard cli', () => {
  const pluginName = 'plugin';
  const targetDir = path.resolve(__dirname, pluginName);
  console.log(targetDir);
  before(()=>{
    if (fs.existsSync(targetDir)) fs.rmSync(targetDir,{recursive:true});
  })
  after(()=>{
    if (fs.existsSync(targetDir)) fs.rmSync(targetDir,{recursive:true});
  })
  it('plugin creation', done => {
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
  it('plugin serve', done => {
    const serve = new PluginServe(targetDir);
    const proc = serve.run();
    proc.kill();
    done();
  });
  it('plugin builder', done => {
    const builder = new PluginBuilder(targetDir, targetDir);
    builder
      .run()
      .then(() => {
        done();
      })
      .catch(reason => {
        console.log(reason);
        done(reason);
      });
  });
});
