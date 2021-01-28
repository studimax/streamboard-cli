import { Configuration } from "webpack";
export interface CompilerConfig extends Configuration {
    output: {
        path: string;
        filename: string;
    };
}
declare const _default: CompilerConfig;
export default _default;
