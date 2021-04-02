import {app, BrowserWindow, ipcMain} from 'electron';

(async () => {
  const identifier = 'ch.studimax.plugin';
  const pluginPath = process.argv[2];
  await app.whenReady();
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      enableRemoteModule: true,
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: true,
    },
  });
  win.webContents.openDevTools({mode: 'detach'});
  ipcMain.on(identifier, (e, data) => {
    console.log(data);
  });
  await win.loadURL(`${pluginPath}?identifier=${identifier}`);
})();
