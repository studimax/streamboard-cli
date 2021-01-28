# Stream Board Plugin Builder

This project is the **official** plugin builder for the Stream Board project.

# Installation

    $ npm install streamboard-plugin-builder -g

And then you can build your Plugin
You need to be in the root path of your plugin project.
    
    $ streamboard-builder

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
