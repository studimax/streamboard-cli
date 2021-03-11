import {exec, execSync} from "child_process";

export default class PackageManager {
    private _hasYarn = false;
    private _hasNpn = false;
    private _hasPnpn = false;

    public install(cwd: string, production = false): Promise<unknown> {
        return new Promise((resolve, reject) => {
            exec(production ? this.getInstallProductionCommand() : this.getInstallCommand(), {cwd}, error => {
                if (error) return reject(error);
                resolve(null);
            });
        });
    }

    private hasYarn(): boolean {
        if (this._hasYarn) return true;
        try {
            execSync("yarn --version", {stdio: "ignore"});
            return (this._hasYarn = true);
        } catch (e) {
            return (this._hasYarn = false);
        }
    }

    private hasNpm(): boolean {
        if (this._hasNpn) return true;
        try {
            execSync("npm --version", {stdio: "ignore"});
            return (this._hasNpn = true);
        } catch (e) {
            return (this._hasNpn = false);
        }
    }

    private hasPnpm(): boolean {
        if (this._hasPnpn) return true;
        try {
            execSync("pnpm --version", {stdio: "ignore"});
            return (this._hasPnpn = true);
        } catch (e) {
            return (this._hasPnpn = false);
        }
    }

    private getInstallCommand(): string {
        if (this.hasYarn()) {
            return "yarn install";
        } else if (this.hasPnpm()) {
            return "pnpm install";
        } else if (this.hasNpm()) {
            return "npm install";
        }
        throw new Error("need a package manager like yarn, npm or pnpm");
    }

    private getInstallProductionCommand(): string {
        if (this.hasYarn()) {
            return "yarn install --production";
        } else if (this.hasPnpm()) {
            return "pnpm install --production";
        } else if (this.hasNpm()) {
            return "npm install production";
        }
        throw new Error("need a package manager like yarn, npm or pnpm");
    }
}
