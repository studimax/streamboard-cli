import path from 'path';
import fs from 'fs-extra';
import Ajv from 'ajv';
import {
  PluginPackageInterface,
  PluginPackageSchema,
} from './PluginPackageInterface';
import {cyan, green, yellow} from 'colors/safe';
import webpack from 'webpack';
import Config, {CompilerConfig} from './webpack.config';
import cliProgress from 'cli-progress';
import archiver from 'archiver';
import PackageManager from './PackageManager';
import rebuild from 'electron-rebuild';

export default class PluginBuilder {
  private static readonly packageFolder = 'package';
  public verbose = true;
  private pkgManager = new PackageManager();

  constructor(
    private readonly srcPath: string,
    private readonly distPath: string
  ) {}

  public async run(pack = true): Promise<string> {
    const pkg = await this.verifyPlugin();
    const c = new Config(
      this.srcPath,
      path.resolve(this.distPath, PluginBuilder.packageFolder, pkg.identifier)
    );
    this.log(cyan(`Let's make ${yellow(pkg.name)} a perfect packed plugin !`));
    await this.compile(pkg, c);
    await this.makePackage(pkg, c);
    if (pack) {
      await this.install(pkg, c);
      await this.pack(pkg, c);
    }
    return c.output.path;
  }

  private log(...data: any[]) {
    if (this.verbose) console.log(...data);
  }

  private async makePackage(pkg: PluginPackageInterface, config: Config) {
    this.log(green('start creating plugin package.json...'));
    return await fs.writeJSON(
      path.resolve(config.output.path, 'package.json'),
      {
        ...pkg,
        main: config.output.filename,
      },
      {spaces: '\t'}
    );
  }

  private async install(pkg: PluginPackageInterface, config: Config) {
    this.log(green('start installing module...'));
    await this.pkgManager.install(config.output.path, true);
    await rebuild({
      buildPath: config.output.path,
      electronVersion: '12.0.0',
      force: true,
      mode: 'parallel',
      debug: false,
      arch: 'all',
    });
  }

  private compile(
    pkg: PluginPackageInterface,
    config: Config
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      this.log(green('start compiling...'));
      const bar = new cliProgress.SingleBar(
        {
          format: 'Compile |' + cyan('{bar}') + '| {percentage}% || {state}',
          clearOnComplete: true,
        },
        cliProgress.Presets.shades_classic
      );
      if (this.verbose) {
        bar.start(100, 0, {
          state: 'starting',
        });
      }
      config.entry = path.resolve(this.srcPath, pkg.main);
      config.onprogress = (percentage, msg) => {
        bar.update(Math.floor(percentage * 100), {
          state: msg,
        });
      };
      const wb = webpack(config.toWebpackConfig());
      wb.run((err?: Error, stats?) => {
        bar.stop();
        this.log(green('finish compiling...'));
        if (err) {
          return reject(err);
        }
        if (stats?.hasErrors()) {
          return reject(stats?.compilation.errors);
        }
        if (stats?.hasWarnings()) {
          this.log(yellow(stats?.compilation.warnings.toString()));
        }
        return resolve(stats);
      });
    });
  }

  private async pack(
    pkg: PluginPackageInterface,
    config: CompilerConfig
  ): Promise<void> {
    this.log(green('start packing...'));
    const output = fs.createWriteStream(
      path.resolve(
        config.output.path,
        `../${pkg.identifier}@${pkg.version}.sbplugin`
      )
    );
    const archive = archiver('zip', {
      zlib: {level: 9},
    });
    archive.directory(config.output.path, false);
    archive.pipe(output);
    await archive.finalize();
    this.log(green(`plugin size: ${archive.pointer()} bytes`));
  }

  private async verifyPlugin(): Promise<PluginPackageInterface> {
    const pkgPath = path.resolve(this.srcPath, 'package.json');
    const pkgData: PluginPackageInterface = await fs.readJSON(pkgPath);
    const ajv = new Ajv({removeAdditional: true});
    const validate = await ajv.compile<PluginPackageInterface>(
      PluginPackageSchema
    );
    const valid = validate(pkgData);
    if (!valid) throw new Error(ajv.errorsText(validate.errors));
    return pkgData;
  }
}
