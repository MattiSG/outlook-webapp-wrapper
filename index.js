const { app, BrowserWindow } = require('electron')


app.once('ready', () => {
    const token = new BrowserWindow({ width: 500, height: 200 })
    token.loadURL(`file://${__dirname}/token.html`)

    const webmail = new BrowserWindow({ show: false })
    webmail.loadURL('https://portalis.diplomatie.gouv.fr/')

    let autofillScript = ''

    require('fs').readFile('./autofill.js', 'utf8', (err, contents) => {
        if (err) return console.error(err)
        autofillScript = contents
    })

    token.on('page-title-updated', (event, tokenValue) => {
        if (tokenValue == 'Token') return 'initial load';
        token.close()
        webmail.show()
        webmail.webContents.executeJavaScript(`tokenValue = ${tokenValue}`)
        webmail.webContents.executeJavaScript(autofillScript)
    })

    webmail.on('page-title-updated', (event, title) => {
        if (title == 'F5 Dynamic Webtop')
            selectWebmailIcon(webmail)
    })
})



function selectWebmailIcon(view) {
    view.webContents.executeJavaScript('document.querySelector("[class=image]").click()')
}
