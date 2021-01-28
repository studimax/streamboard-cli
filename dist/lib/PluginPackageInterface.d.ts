import { JSONSchemaType } from "ajv";
export interface PluginPackageInterface {
    readonly name: string;
    readonly version: string;
    readonly description: string;
    readonly icon: string;
    readonly identifier: string;
    readonly actions: {
        [name: string]: {
            name: string;
            icon: string;
        };
    };
    main: string;
}
export declare const PluginPackageSchema: JSONSchemaType<PluginPackageInterface>;
