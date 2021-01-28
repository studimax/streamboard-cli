"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginPackageSchema = void 0;
exports.PluginPackageSchema = {
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
            description: "Version must be parseable by node-semver, which is bundled with npm as a dependency.",
        },
        description: {
            description: "This helps people discover your package, as it's listed in 'npm search'.",
            type: "string"
        },
        main: { type: "string" },
        icon: { type: "string" },
        identifier: { type: "string" },
        actions: {
            type: "object",
            patternProperties: {
                "^.*$": {
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
            required: []
        }
    },
    required: ["name", "version", "main", "icon", "identifier", "actions"],
    additionalProperties: false
};
//# sourceMappingURL=PluginPackageInterface.js.map