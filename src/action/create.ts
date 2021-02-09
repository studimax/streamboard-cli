import path from "path";
import inquirer from "inquirer";
import {cyan} from "colors/safe";
import PluginCreate from "../lib/PluginCreate";
import fs from "fs-extra";

export default async function create(projectName: string, options: any) {
    const cwd = process.cwd()
    const inCurrent = projectName === '.'
    if (!projectName.match("^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*$")) {
        const {text} = await inquirer.prompt([{
            name: "text",
            type: "input",
            message: `Invalid name use an other name`,
            validate: ((input: string) => !!input.match("^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*$"))
        }]);
        projectName = text;
    }
    const name = inCurrent ? path.relative('../', cwd) : projectName;
    const targetDir = path.resolve(cwd, projectName || '.');
    if (fs.existsSync(targetDir)) {
        if (inCurrent) {
            const {ok} = await inquirer.prompt([
                {
                    name: 'ok',
                    type: 'confirm',
                    message: `Generate plugin in current directory?`
                }
            ]);
            if (!ok) return;
        } else {
            const {action} = await inquirer.prompt([
                {
                    name: 'action',
                    type: 'list',
                    message: `Target directory ${cyan(process.cwd())} already exists. Pick an action:`,
                    choices: [
                        {name: 'Overwrite', value: 'overwrite'},
                        {name: 'Merge', value: 'merge'},
                        {name: 'Cancel', value: false}
                    ]
                }
            ]);
            if (!action) {
                return
            } else if (action === 'overwrite') {
                console.log(`\nRemoving ${cyan(targetDir)}...`)
                await fs.remove(targetDir)
            }
        }
    }
    const creator = new PluginCreate(name, targetDir);
    return creator.run();
}
