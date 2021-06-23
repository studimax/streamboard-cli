<p align="center" style="margin: 0">
  <a href="https://stream-board.app/" target="blank"><img src="https://stream-board.app/logo.svg" width="175" alt="StreamBoard Logo" /></a>
</p>
<h1 align="center" style="margin-top: 0">Stream Board CLI</h1>

![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/studimax/streamboard-cli/CodeQL)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ba0fe6b62c2748babe7b6347f6f02c53)](https://app.codacy.com/gh/studimax/streamboard-cli?utm_source=github.com&utm_medium=referral&utm_content=studimax/streamboard-cli&utm_campaign=Badge_Grade_Settings)
[![npm](https://img.shields.io/npm/v/streamboard-cli)](https://www.npmjs.com/package/streamboard-cli)
[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg?logo=google&logoColor=white)](https://github.com/google/gts)
[![Code: TypeScript](https://img.shields.io/badge/made%20with-typescript-blue.svg?logo=typescript&logoColor=white)](https://github.com/microsoft/TypeScript)
[![Made By: StudiMax](https://img.shields.io/badge/made%20by-studimax-red.svg)](https://github.com/studimax)


This project is the **official** plugin builder for the Stream Board project.

# Installation
```bash
    # with npm
    $ npm install streamboard-cli -g
    # with yarn
    $ yarn global add streamboard-cli
```
# How to use
### Create a new plugin
```bash
    $ streamboard-cli create <name> 
    $ cd <name>
```
### Build your new plugin
```bash
    $ streamboard-cli build
```
### Test your new plugin
```bash
    $ streamboard-cli serve
```
### You need a valid package.json with this configuration :
```json
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
        },
        "engines": {
            "node": ">=14.16.0"
        }
    }
```
Don't forget to put all your assets files in the assets folder.

#### Done

Et voilà - we created a simple plugin. Don't forget that this project is in development.
