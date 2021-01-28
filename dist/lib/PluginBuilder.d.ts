export default class PluginBuilder {
    private readonly srcPath;
    private readonly distPath;
    private readonly config;
    private readonly pkg;
    private readonly packageFolder;
    constructor(srcPath: string, distPath: string);
    compile(): void;
    private pack;
    private verifyPlugin;
}
