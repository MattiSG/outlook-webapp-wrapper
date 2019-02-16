const { app, BrowserWindow } = require('electron')


app.once('ready', () => {
    const browser = new BrowserWindow()
    browser.loadURL('https://portalis.diplomatie.gouv.fr/')

    require('fs').readFile('./autofill.js', 'utf8', (err, autofillScript) => {
        if (err) return console.error(err)

        browser.webContents.executeJavaScript(autofillScript)
    })
})

