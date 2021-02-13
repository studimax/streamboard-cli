![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/studimax/streamboard-cli/CodeQL)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ba0fe6b62c2748babe7b6347f6f02c53)](https://app.codacy.com/gh/studimax/streamboard-cli?utm_source=github.com&utm_medium=referral&utm_content=studimax/streamboard-cli&utm_campaign=Badge_Grade_Settings)
[![npm](https://img.shields.io/npm/v/streamboard-cli)](https://www.npmjs.com/package/streamboard-cli)
# Stream Board CLI

This project is the **official** plugin builder for the Stream Board project.

# Installation

    $ npm install streamboard-cli -g
Create a new plugin

    $ streamboard-cli create <name> 
    $ cd <name>
    $ streamboard-cli build

You need a valid package.json with this configuration :

    {
        "name": "plugin-name",
        "version": "1.0.0",
        "main": "index.js",
        "icon": "assets/img/icon.png",
        "identifier": "ch.studimax.simple-plugin",
        "actions": {
            "test": {
                "name": "Test",
                "icon": "assets/img/actions/test.png"
            }
        }
    }

Dont forget to put all your assets files in the assets folder.

#### Done

Et voilà - we created a simple plugin. Don't forget that this project is in development.
