#!/usr/bin/env node
import {red, yellow} from 'colors/safe';
import {Command} from 'commander';
import pkg from '../../package.json';
import create from '../action/create';
import build from '../action/build';
import serve from '../action/serve';
import updateNotifier from 'update-notifier';

function displayError(...lines: string[]): void {
  console.error();
  lines.forEach(line => console.error(red(line)));
  console.error();
  process.exitCode = 1;
}

const program = new Command();

program.version(pkg.version, '--version', 'output the current version');

program
  .command('build')
  .option('-s, --silent', 'hide the output', false)
  .action(build);

program.command('create <name>').action(create);

program.command('serve').action(serve);

program.on('command:*', (commands: string[]) => {
  program.outputHelp();
  displayError(`Unknown command ${yellow(commands[0])}.`);
});

updateNotifier({pkg}).notify();
program.parse(process.argv);
