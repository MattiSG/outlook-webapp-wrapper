const { app, BrowserWindow } = require('electron')

const USERNAME = 'schneiderm'


app.once('ready', () => {
    const token = new BrowserWindow({ width: 500, height: 200 })
    token.loadURL(`file://${__dirname}/token.html`)

    const webmail = new BrowserWindow({ show: false })
    webmail.loadURL('https://portalis.diplomatie.gouv.fr/')

    token.on('page-title-updated', (event, tokenValue) => {
        if (tokenValue == 'Token') return 'initial load';
        token.close()
        webmail.show()
        autofillOuterLogin(webmail, tokenValue)
    })

    webmail.on('page-title-updated', (event, title) => {
        if (title == 'F5 Dynamic Webtop')
            selectWebmailIcon(webmail)
    })
})


function autofillOuterLogin(view, password) {
    view.webContents.executeJavaScript(`document.querySelector("input[name=username]").value = "${USERNAME}"`)
    view.webContents.executeJavaScript(`document.querySelector("input[name=password]").value = "${password}"`)
    view.webContents.executeJavaScript('document.querySelector("input[type=submit]").click()')
}

function selectWebmailIcon(view) {
    view.webContents.executeJavaScript('document.querySelector("[class=image]").click()')
}
