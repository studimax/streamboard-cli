import downloadUrl from "download";
import {sync as rm} from "rimraf";

import {spawn} from "child_process";

function gitClone(repo: any, targetPath: string, opts: any) {
    opts = opts || {};

    const git = opts.git || "git";
    const args = ["clone"];

    if (opts.shallow) {
        args.push("--depth");
        args.push("1");
    }

    args.push("--");
    args.push(repo);
    args.push(targetPath);

    return new Promise((resolve, reject) => {
        const process = spawn(git, args);
        process.on("close", (status: unknown) => {
            if (status == 0) {
                if (opts.checkout) {
                    _checkout().then(resolve).catch(reject);
                } else {
                    resolve(status);
                }
            } else {
                reject(new Error("'git clone' failed with status " + status));
            }
        });
    });

    function _checkout() {
        return new Promise((resolve, reject) => {
            const args = ["checkout", opts.checkout];
            const process = spawn(git, args, {cwd: targetPath});
            process.on("close", (status: unknown) => {
                if (status == 0) {
                    resolve(status);
                } else {
                    reject(new Error("'git checkout' failed with status " + status));
                }
            });
        });
    }
}

export default function download(repository: string, dest: string, opts?: any): Promise<string> {
    opts = opts || {};
    const clone = opts.clone || false;
    delete opts.clone;

    const repo = normalize(repository);
    const url = repo.url || getUrl(repo, clone);

    if (clone) {
        const cloneOptions = {
            checkout: repo.checkout,
            shallow: repo.checkout === "master",
            ...opts
        };
        return gitClone(url, dest, cloneOptions).then(() => {
            rm(dest + "/.git");
            return dest;
        });
    } else {
        const downloadOptions = {
            extract: true,
            strip: 1,
            mode: "666",
            ...opts,
            headers: {
                accept: "application/zip",
                ...(opts.headers || {})
            }
        };
        return downloadUrl(url ?? "", dest, downloadOptions).then(() => dest);
    }
}

interface RepoInterface {
    owner?: string;
    origin?: string;
    name?: string;
    type: string;
    checkout?: string
    url?: string;
}

function normalize(repo: string): RepoInterface {
    let regex = /^(?:(direct):([^#]+)(?:#(.+))?)$/;
    const match: RegExpExecArray | null = regex.exec(repo);

    if (match) {
        const url = match[2];
        const directCheckout = match[3] ?? "main";

        return {
            type: "direct",
            url: url,
            checkout: directCheckout
        };
    } else {
        regex = /^(?:(github|gitlab|bitbucket):)?(?:(.+):)?([^/]+)\/([^#]+)(?:#(.+))?$/;
        const match = regex.exec(repo) ?? [];

        const type = match[1] ?? "github";
        let origin = match[2] ?? null;
        const owner = match[3];
        const name = match[4];
        const checkout = match[5] ?? "main";

        if (origin == null) {
            if (type === "github") {
                origin = "github.com";
            } else if (type === "gitlab") {
                origin = "gitlab.com";
            } else if (type === "bitbucket") {
                origin = "bitbucket.org";
            }
        }

        return {
            type: type,
            origin: origin,
            owner: owner,
            name: name,
            checkout: checkout
        };
    }
}

function addProtocol(origin: string, clone: boolean) {
    if (!/^(f|ht)tps?:\/\//i.test(origin)) {
        if (clone) {
            origin = "git@" + origin;
        } else {
            origin = "https://" + origin;
        }
    }

    return origin;
}

function getUrl(repo: RepoInterface, clone: boolean) {
    let url;

    // Get origin with protocol and add trailing slash or colon (for ssh)
    let origin = addProtocol(repo.origin ?? "", clone);
    if (/^git@/i.test(origin)) {
        origin = origin + ":";
    } else {
        origin = origin + "/";
    }

    // Build url
    if (clone) {
        url = origin + repo.owner + "/" + repo.name + ".git";
    } else {
        if (repo.type === "github") {
            url = origin + repo.owner + "/" + repo.name + "/archive/" + repo.checkout + ".zip";
        } else if (repo.type === "gitlab") {
            url = origin + repo.owner + "/" + repo.name + "/repository/archive.zip?ref=" + repo.checkout;
        } else if (repo.type === "bitbucket") {
            url = origin + repo.owner + "/" + repo.name + "/get/" + repo.checkout + ".zip";
        }
    }

    return url;
}
