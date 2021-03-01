import {JSONSchemaType} from "ajv";

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

export const PluginPackageSchema: JSONSchemaType<PluginPackageInterface> = {
    type: "object",
    properties: {
        name: {
            type: "string",
            description: "The name of the package.",
            maxLength: 214,
            minLength: 1,
            pattern: "^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*$"
        },
        version: {
            type: "string",
            default: "1.0.0",
            description: "Version must be parseable by node-semver, which is bundled with npm as a dependency."
        },
        description: {
            description: "This helps people discover your package, as it's listed in 'npm search'.",
            type: "string"
        },
        main: {
            type: "string",
            default: "index.js"
        },
        icon: {type: "string"},
        identifier: {
            type: "string",
            description: "The identifier of the plugin.",
            pattern: "^[a-z]{2,}\\.[a-z]{2,}\\.[a-z-]{2,}$"
        },
        actions: {
            type: "object",
            patternProperties: {
                "^[a-z-]{2,}$": {
                    type: "object",
                    properties: {
                        name: {
                            type: "string"
                        },
                        icon: {
                            type: "string"
                        }
                    },
                    required: ["name", "icon"]
                }
            },
            additionalProperties: false,
            required: []
        }
    },
    required: ["name", "version", "main", "icon", "identifier", "actions"],
    additionalProperties: false
};
