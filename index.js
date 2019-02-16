const { app, BrowserWindow } = require('deskgap');

app.once('ready', () => {
    const browser = new BrowserWindow();
    browser.loadURL('https://portalis.diplomatie.gouv.fr/');
});
