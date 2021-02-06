#!/usr/bin/env node
import {red, yellow} from 'colors/safe';
import program from "commander";
import pkg from "../../package.json";
import create from "../action/create";
import build from "../action/build";

function displayError(...lines: string[]): void {
    console.error();
    lines.forEach(line => console.error(red(line)));
    console.error();
    process.exitCode = 1;
}

program
    .version(pkg.version, '-v, --version');

program
    .command('build')
    .action((options: any) => build(options))

program
    .command("create <name>")
    .action(async (name: string, options: any) => create(name, options))

program
    .on('command:*', (commands: string[]) => {
        program.outputHelp();
        displayError(`Unknown command ${yellow(commands[0])}.`);
    });

program.parse(process.argv);
